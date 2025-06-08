import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const manifest = {
    schemaVersion: "2024-11-05",
    vendor: "pokemon-vgc-calc-mcp",
    name: "Pokémon VGC Damage Calculator",
    version: "1.0.0",
    description: "A serverless API for calculating Pokémon battle damage using the Smogon damage calculator",
    author: "AI Assistant",
    homepage: "https://github.com/your-username/pokemon-vgc-calc-mcp",
    license: "MIT",
    tools: [
      {
        name: "calculateDamage",
        description: "Calculates the battle damage between an attacking and a defending Pokémon, considering their stats, abilities, items, and field conditions.",
        inputSchema: {
          type: "object",
          properties: {
            attacker: {
              type: "object",
              properties: {
                species: { type: "string", description: "Name of the Pokémon species (e.g., 'Pikachu')." },
                level: { type: "number", default: 50 },
                ability: { type: "string", description: "The Pokémon's ability (e.g., 'Lightning Rod')." },
                item: { type: "string", description: "The Pokémon's held item (e.g., 'Light Ball')." },
                nature: { type: "string", description: "The Pokémon's nature (e.g., 'Timid')." },
                status: { 
                  type: "string", 
                  enum: ["", "psn", "brn", "frz", "par", "slp"], 
                  description: "e.g., 'brn' for Burned." 
                },
                evs: {
                  type: "object",
                  properties: {
                    hp: { type: "number" },
                    atk: { type: "number" },
                    def: { type: "number" },
                    spa: { type: "number" },
                    spd: { type: "number" },
                    spe: { type: "number" }
                  }
                },
                ivs: {
                  type: "object",
                  properties: {
                    hp: { type: "number" },
                    atk: { type: "number" },
                    def: { type: "number" },
                    spa: { type: "number" },
                    spd: { type: "number" },
                    spe: { type: "number" }
                  }
                },
                boosts: {
                  type: "object",
                  properties: {
                    atk: { type: "number" },
                    def: { type: "number" },
                    spa: { type: "number" },
                    spd: { type: "number" },
                    spe: { type: "number" }
                  }
                }
              },
              required: ["species"]
            },
            defender: {
              type: "object",
              properties: {
                species: { type: "string", description: "Name of the Pokémon species (e.g., 'Pikachu')." },
                level: { type: "number", default: 50 },
                ability: { type: "string", description: "The Pokémon's ability (e.g., 'Lightning Rod')." },
                item: { type: "string", description: "The Pokémon's held item (e.g., 'Light Ball')." },
                nature: { type: "string", description: "The Pokémon's nature (e.g., 'Timid')." },
                status: { 
                  type: "string", 
                  enum: ["", "psn", "brn", "frz", "par", "slp"], 
                  description: "e.g., 'brn' for Burned." 
                },
                evs: {
                  type: "object",
                  properties: {
                    hp: { type: "number" },
                    atk: { type: "number" },
                    def: { type: "number" },
                    spa: { type: "number" },
                    spd: { type: "number" },
                    spe: { type: "number" }
                  }
                },
                ivs: {
                  type: "object",
                  properties: {
                    hp: { type: "number" },
                    atk: { type: "number" },
                    def: { type: "number" },
                    spa: { type: "number" },
                    spd: { type: "number" },
                    spe: { type: "number" }
                  }
                },
                boosts: {
                  type: "object",
                  properties: {
                    atk: { type: "number" },
                    def: { type: "number" },
                    spa: { type: "number" },
                    spd: { type: "number" },
                    spe: { type: "number" }
                  }
                }
              },
              required: ["species"]
            },
            move: {
              type: "object",
              properties: {
                name: { type: "string", description: "Name of the move being used (e.g., 'Thunderbolt')." },
                isCrit: { type: "boolean", default: false, description: "Whether the move is a guaranteed critical hit." }
              },
              required: ["name"]
            },
            field: {
              type: "object",
              properties: {
                gameType: { type: "string", enum: ["Singles", "Doubles"], default: "Singles" },
                weather: { type: "string", enum: ["", "Sun", "Rain", "Sand", "Snow"] },
                terrain: { type: "string", enum: ["", "Electric", "Grassy", "Misty", "Psychic"] },
                isBeadsOfRuin: { type: "boolean", default: false },
                isTabletsOfRuin: { type: "boolean", default: false },
                isSwordOfRuin: { type: "boolean", default: false },
                isVesselOfRuin: { type: "boolean", default: false },
                attackerSide: {
                  type: "object",
                  properties: {
                    isSR: { type: "boolean", default: false, description: "Stealth Rock is active." },
                    spikes: { type: "number", enum: [0, 1, 2, 3], default: 0 },
                    isLightScreen: { type: "boolean", default: false },
                    isReflect: { type: "boolean", default: false }
                  }
                },
                defenderSide: {
                  type: "object",
                  properties: {
                    isSR: { type: "boolean", default: false, description: "Stealth Rock is active." },
                    spikes: { type: "number", enum: [0, 1, 2, 3], default: 0 },
                    isLightScreen: { type: "boolean", default: false },
                    isReflect: { type: "boolean", default: false }
                  }
                }
              }
            }
          },
          required: ["attacker", "defender", "field", "move"]
        }
      }
    ]
  };

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(manifest);
}