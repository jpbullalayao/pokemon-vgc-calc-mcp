#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from '@modelcontextprotocol/sdk/types.js';
import { calculateDamage } from './calculator.js';
const server = new Server({
    name: 'pokemon-vgc-calc-mcp',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// Tool schema definition based on PRD specifications
const CALCULATE_DAMAGE_SCHEMA = {
    type: 'object',
    properties: {
        attacker: {
            type: 'object',
            properties: {
                species: { type: 'string', description: 'Name of the Pokémon species (e.g., \'Pikachu\').' },
                level: { type: 'number', default: 50 },
                ability: { type: 'string', description: 'The Pokémon\'s ability (e.g., \'Lightning Rod\').' },
                item: { type: 'string', description: 'The Pokémon\'s held item (e.g., \'Light Ball\').' },
                nature: { type: 'string', description: 'The Pokémon\'s nature (e.g., \'Timid\').' },
                status: {
                    type: 'string',
                    enum: ['', 'psn', 'brn', 'frz', 'par', 'slp'],
                    description: 'e.g., \'brn\' for Burned.'
                },
                evs: {
                    type: 'object',
                    properties: {
                        hp: { type: 'number' },
                        atk: { type: 'number' },
                        def: { type: 'number' },
                        spa: { type: 'number' },
                        spd: { type: 'number' },
                        spe: { type: 'number' }
                    }
                },
                ivs: {
                    type: 'object',
                    properties: {
                        hp: { type: 'number' },
                        atk: { type: 'number' },
                        def: { type: 'number' },
                        spa: { type: 'number' },
                        spd: { type: 'number' },
                        spe: { type: 'number' }
                    }
                },
                boosts: {
                    type: 'object',
                    properties: {
                        atk: { type: 'number' },
                        def: { type: 'number' },
                        spa: { type: 'number' },
                        spd: { type: 'number' },
                        spe: { type: 'number' }
                    }
                }
            },
            required: ['species']
        },
        defender: {
            type: 'object',
            properties: {
                species: { type: 'string', description: 'Name of the Pokémon species (e.g., \'Pikachu\').' },
                level: { type: 'number', default: 50 },
                ability: { type: 'string', description: 'The Pokémon\'s ability (e.g., \'Lightning Rod\').' },
                item: { type: 'string', description: 'The Pokémon\'s held item (e.g., \'Light Ball\').' },
                nature: { type: 'string', description: 'The Pokémon\'s nature (e.g., \'Timid\').' },
                status: {
                    type: 'string',
                    enum: ['', 'psn', 'brn', 'frz', 'par', 'slp'],
                    description: 'e.g., \'brn\' for Burned.'
                },
                evs: {
                    type: 'object',
                    properties: {
                        hp: { type: 'number' },
                        atk: { type: 'number' },
                        def: { type: 'number' },
                        spa: { type: 'number' },
                        spd: { type: 'number' },
                        spe: { type: 'number' }
                    }
                },
                ivs: {
                    type: 'object',
                    properties: {
                        hp: { type: 'number' },
                        atk: { type: 'number' },
                        def: { type: 'number' },
                        spa: { type: 'number' },
                        spd: { type: 'number' },
                        spe: { type: 'number' }
                    }
                },
                boosts: {
                    type: 'object',
                    properties: {
                        atk: { type: 'number' },
                        def: { type: 'number' },
                        spa: { type: 'number' },
                        spd: { type: 'number' },
                        spe: { type: 'number' }
                    }
                }
            },
            required: ['species']
        },
        move: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Name of the move being used (e.g., \'Thunderbolt\').' },
                isCrit: { type: 'boolean', default: false, description: 'Whether the move is a guaranteed critical hit.' }
            },
            required: ['name']
        },
        field: {
            type: 'object',
            properties: {
                gameType: { type: 'string', enum: ['Singles', 'Doubles'], default: 'Singles' },
                weather: { type: 'string', enum: ['', 'Sun', 'Rain', 'Sand', 'Snow'] },
                terrain: { type: 'string', enum: ['', 'Electric', 'Grassy', 'Misty', 'Psychic'] },
                isBeadsOfRuin: { type: 'boolean', default: false },
                isTabletsOfRuin: { type: 'boolean', default: false },
                isSwordOfRuin: { type: 'boolean', default: false },
                isVesselOfRuin: { type: 'boolean', default: false },
                attackerSide: {
                    type: 'object',
                    properties: {
                        isSR: { type: 'boolean', default: false, description: 'Stealth Rock is active.' },
                        spikes: { type: 'number', enum: [0, 1, 2, 3], default: 0 },
                        isLightScreen: { type: 'boolean', default: false },
                        isReflect: { type: 'boolean', default: false }
                    }
                },
                defenderSide: {
                    type: 'object',
                    properties: {
                        isSR: { type: 'boolean', default: false, description: 'Stealth Rock is active.' },
                        spikes: { type: 'number', enum: [0, 1, 2, 3], default: 0 },
                        isLightScreen: { type: 'boolean', default: false },
                        isReflect: { type: 'boolean', default: false }
                    }
                }
            }
        }
    },
    required: ['attacker', 'defender', 'field', 'move']
};
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'calculateDamage',
                description: 'Calculates the battle damage between an attacking and a defending Pokémon, considering their stats, abilities, items, and field conditions.',
                inputSchema: CALCULATE_DAMAGE_SCHEMA,
            },
        ],
    };
});
// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (name === 'calculateDamage') {
        try {
            const result = calculateDamage(args);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            throw new McpError(ErrorCode.InternalError, `Failed to calculate damage: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    else {
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Pokémon VGC Calc MCP server running on stdio');
}
main().catch((error) => {
    console.error('Server failed to start:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map