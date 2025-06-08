# Pokémon VGC Damage Calculator MCP Server

A serverless API built using the Model-Context Protocol (MCP) that provides a standardized interface for performing Pokémon damage calculations using the `@smogon/calc` package.

## Features

- **MCP-compliant server** with TypeScript and the official MCP SDK
- **Accurate damage calculations** powered by the community-vetted `@smogon/calc` library
- **Comprehensive input handling** for Pokémon stats, abilities, items, moves, and field conditions
- **Error handling** for invalid Pokémon names, moves, and input validation
- **Vercel deployment ready** with zero-config deployment support

## Installation

```bash
npm install
npm run build
```

## Usage

### As an MCP Server

The server exposes one primary tool: `calculateDamage`

### Tool: calculateDamage

Calculates battle damage between an attacking and defending Pokémon.

**Input Parameters:**
- `attacker`: Pokémon object with species, level, stats, ability, item, etc.
- `defender`: Pokémon object with species, level, stats, ability, item, etc.
- `move`: Move object with name and optional critical hit flag
- `field`: Field conditions including weather, terrain, and side effects

**Output:**
- `description`: Human-readable calculation result
- `damage`: [min, max] damage range
- `koChance`: Knock-out probability description
- `fullResult`: Complete result object from smogon/calc

### Example Request

```json
{
  "attacker": {
    "species": "Pikachu",
    "level": 50,
    "ability": "Static",
    "item": "Light Ball",
    "nature": "Timid",
    "evs": { "spa": 252, "spe": 252, "hp": 4 },
    "ivs": { "hp": 31, "atk": 0, "def": 31, "spa": 31, "spd": 31, "spe": 31 }
  },
  "defender": {
    "species": "Charizard",
    "level": 50,
    "ability": "Blaze",
    "nature": "Modest",
    "evs": { "hp": 252, "spa": 252, "spd": 4 }
  },
  "move": {
    "name": "Thunderbolt",
    "isCrit": false
  },
  "field": {
    "gameType": "Singles",
    "weather": "",
    "terrain": ""
  }
}
```

## Deployment

### Vercel

The project is configured for zero-config deployment on Vercel:

```bash
npm run vercel-build
```

The MCP manifest is available at `/mcp/manifest.json`

## API Endpoints

- `/mcp/manifest.json` - MCP manifest describing available tools
- Main MCP server endpoint for tool calls

## Development

```bash
npm run dev    # Watch mode for development
npm run build  # Build TypeScript
npm run lint   # Lint code
npm test       # Run test calculation
```

## Project Structure

```
src/
├── index.ts       # Main MCP server implementation
├── calculator.ts  # Damage calculation wrapper
└── types.ts       # TypeScript type definitions

api/
└── manifest.ts    # Vercel API route for MCP manifest

vercel.json        # Vercel deployment configuration
```

## Requirements Met

This implementation fulfills all requirements from the PRD:

- ✅ **FR1**: Exposes `calculateDamage` tool via MCP
- ✅ **FR2**: Accepts structured JSON with attacker, defender, move, and field data  
- ✅ **FR3**: Uses `@smogon/calc` for all damage calculations
- ✅ **FR4**: Returns description, damage range, and KO chance
- ✅ **FR5**: Proper error handling for invalid inputs
- ✅ **TR1-6**: TypeScript, MCP SDK, Vercel deployment, npm package management

## License

MIT