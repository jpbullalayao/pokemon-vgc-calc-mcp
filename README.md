# Pokémon VGC Damage Calculator MCP Server

A server built using Model-Context Protocol (MCP) that provides AI agents a standardized interface for performing Pokémon damage calculations using the `@smogon/calc` package.

## Features

- **MCP-compliant server** with TypeScript and the official MCP SDK
- **Accurate damage calculations** powered by the community-vetted `@smogon/calc` library
- **Comprehensive input handling** for Pokémon stats, abilities, items, moves, and field conditions
- **Error handling** for invalid Pokémon names, moves, and input validation
- **Vercel deployment ready** with zero-config deployment support

## Prerequisites

- Node.js 18+ 
- npm

## Installation

```bash
npm install -g pokemon-vgc-calc-mcp
```

## Development

```bash
npm run build  # Build TypeScript
npm run test   # Run test calculation
```

### MCP Client Configuration

Configure your MCP client (Claude Desktop, Cursor, etc.):

**Using remote npm package:**
```json
{
  "mcpServers": {
    "pokemon-calc": {
      "command": "npx",
      "args": ["pokemon-vgc-calc-mcp"],
      "env": {}
    }
  }
}
```

**Local development:**

Clone repo locally, build the project and then configure MCP client:

```
$ git clone git@github.com:jpbullalayao/pokemon-vgc-calc-mcp.git
$ npm install
$ npm run build
```

```json
{
  "mcpServers": {
    "pokemon-calc": {
      "command": "node",
      "args": ["path/to/pokemon-vgc-calc-mcp/dist/index.js"],
      "env": {}
    }
  }
}
```

### Tools Available

The server exposes one primary tool: `calculateDamage`

#### Tool: calculateDamage

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

### Example Usage

When called by an MCP client, the tool accepts parameters like:

```json
{
  "attacker": {
    "species": "Pikachu",
    "level": 50,
    "ability": "Static", 
    "item": "Light Ball",
    "nature": "Timid",
    "evs": { "spa": 252, "spe": 252, "hp": 4 }
  },
  "defender": {
    "species": "Charizard",
    "level": 50,
    "ability": "Blaze"
  },
  "move": {
    "name": "Thunderbolt"
  },
  "field": {
    "gameType": "Singles"
  }
}
```

**Output:**
```
**252 SpA Light Ball Pikachu Thunderbolt vs. 0 HP / 0 SpD Charizard: 198-234 (107 - 126.4%) -- guaranteed OHKO**

Damage: 198-234
KO Chance: guaranteed OHKO
```

## Testing

### Local MCP Server Testing

You can test the local MCP server using the MCP Inspector:

```bash
npm run build
npx @modelcontextprotocol/inspector node path/to/pokemon-vgc-calc-mcp/dist/index.js
```

#### Test Input Example

Use the following input to test the `calculateDamage` tool:

```json
{
  "attacker": {
    "species": "Chien-Pao",
    "nature": "Jolly",
    "evs": {
      "atk": 252,
      "spe": 252,
      "hp": 4
    },
    "level": 50
  },
  "defender": {
    "species": "Flutter Mane",
    "nature": "Modest",
    "evs": {
      "hp": 164,
      "def": 100
    },
    "level": 50
  },
  "move": {
    "name": "Icicle Crash"
  },
  "field": {}
}
```

#### Expected Output

```
**252 Atk Sword of Ruin Chien-Pao Icicle Crash vs. 164 HP / 100 Def Flutter Mane: 126-148 (83.4 - 98%) -- guaranteed 2HKO**

Damage: 126-148
KO Chance: guaranteed 2HKO
```

## Project Structure

```
src/
├── index.ts       # Main MCP server implementation
├── calculator.ts  # Damage calculation wrapper
└── types.ts       # TypeScript type definitions
```

## Author's Note

Interested in the progress of this project? Feel free to follow the repo for live updates!

If you need to get a hold of me regarding this project, feel free to either:

- email me at professor.ragna@gmail.com
- tweet me [@professorragna](https://twitter.com/professorragna)

If you're interested in helping to fund this project, you can support me [here](https://www.buymeacoffee.com/professorragna). Any and all support is greatly appreciated!

## License

MIT
