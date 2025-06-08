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

This MCP server supports both **local stdio** and **remote SSE/HTTP** access using the `@vercel/mcp-adapter`.

### Local MCP Server (stdio)

Run locally for development or direct MCP client integration:

```bash
npm install
npm run build
npm start
```

### Remote MCP Server (SSE Transport)

After deploying to Vercel, configure your MCP client to connect via SSE:

```json
{
  "mcpServers": {
    "pokemon-calc": {
      "url": "https://your-deployment.vercel.app/api/mcp"
    }
  }
}
```

### MCP Client Configuration

Configure your MCP client (Claude Desktop, etc.) to use the remote server:

**Local development:**
```json
{
  "mcpServers": {
    "pokemon-calc": {
      "command": "npx",
      "args": ["pokemon-vgc-calc-mcp"]
    }
  }
}
```

**Remote Vercel deployment:**
```json
{
  "mcpServers": {
    "pokemon-calc": {
      "url": "https://your-deployment.vercel.app/api/mcp"
    }
  }
}
```

### Tools Available

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