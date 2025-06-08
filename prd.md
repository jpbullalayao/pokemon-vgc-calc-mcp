## Product Requirements Document: Pokémon Damage Calculator MCP Server

**Version:** 1.0
**Date:** October 26, 2023
**Author:** AI Assistant
**Status:** Proposed

---

### 1. Overview & Introduction

This document outlines the requirements for the **"PokéCalc MCP Server,"** a serverless API built using the Model-Context Protocol (MCP). The primary function of this server is to provide a standardized, programmatic interface for performing Pokémon damage calculations.

The server will be built in TypeScript using the official `@modelcontextprotocol/ts-sdk-template`, ensuring a modern, type-safe codebase. It will leverage the powerful and community-vetted `smogon/damage-calc` package for all its core calculation logic. The entire project will be architected for immediate and seamless deployment to the Vercel platform.

### 2. Problem Statement

Developers creating Pokémon-related applications (such as Discord bots, teambuilding websites, or strategic analysis tools) need a reliable and easy-to-use way to calculate battle damage. Implementing this logic from scratch is complex, error-prone, and requires deep domain knowledge of Pokémon mechanics. While web-based calculators exist, they lack a standardized, API-first interface for programmatic integration.

This MCP server solves the problem by wrapping the de facto standard Smogon damage calculation engine in a simple, discoverable, and machine-readable API, following the Model-Context Protocol.

### 3. Goals & Objectives

*   **Primary Goal:** To provide a stable, accurate, and easy-to-integrate API endpoint for Pokémon damage calculations.
*   **Key Results (KR):**
    *   **KR1:** Successfully implement a single MCP tool, `calculateDamage`, that accepts attacker, defender, and field data.
    *   **KR2:** The `calculateDamage` tool correctly computes and returns damage results consistent with the Smogon Damage Calculator for a variety of scenarios, including those with items, abilities, status conditions, and field effects.
    *   **KR3:** The MCP server is successfully deployed to a public Vercel URL and is fully functional.
    *   **KR4:** The server's MCP manifest (`/mcp/manifest.json`) is valid and correctly describes the `calculateDamage` tool and its schemas.

### 4. Target Audience / User Personas

*   **Alex, the Bot Developer:** Alex is building a Pokémon-themed Discord bot. They want to add a `/calc` command where users can input two Pokémon and see the damage output. Alex needs a simple API endpoint to call, rather than hosting and maintaining the calculation logic themselves.
*   **Priya, the Web Developer:** Priya is creating a "Teambuilder" React application. She wants to show users potential damage matchups for their team in real-time. She needs a serverless backend that can handle these calculations on demand.
*   **Sam, the MCP Enthusiast:** Sam is exploring the MCP ecosystem and wants to integrate various tools into a larger agent or application. A Pokémon calculator is a fun and practical tool to add to their collection.

### 5. Functional Requirements

| ID | Requirement | Details |
| :--- | :--- | :--- |
| **FR1** | **Core Tool: `calculateDamage`** | The MCP server shall expose one primary tool with the `tool_id`: `calculateDamage`. |
| **FR2** | **Input Handling** | The `calculateDamage` tool must accept a structured JSON object containing all necessary parameters for a calculation. This includes: <br> - **Attacker:** Species, level, stats (EVs, IVs, Nature), ability, item, status (e.g., Burned), and the move being used. <br> - **Defender:** Species, level, stats, ability, item, types, etc. <br> - **Field:** Active weather, terrain, and global modifiers (e.g., Beads of Ruin, Aurora Veil). |
| **FR3** | **Calculation Logic** | All damage calculation logic **must** be performed by the `smogon/damage-calc` npm package. The server will act as a wrapper, translating MCP input into the format required by the package and formatting its output. |
| **FR4** | **Output Generation** | Upon successful calculation, the tool shall return a structured JSON object containing: <br> - A human-readable description string (e.g., "252+ SpA Choice Specs Chi-Yu Beads of Ruin Overheat vs. 252 HP / 4 SpD Blissey in Sun: 298-352 (83.4 - 98.6%) -- guaranteed 2HKO"). <br> - The raw damage as a `[min, max]` tuple. <br> - The damage percentage as a `[min, max]` tuple. <br> - The chance to KO. |
| **FR5** | **Error Handling** | If the input is invalid (e.g., non-existent Pokémon, invalid move), the server should return a structured MCP error message with a clear description of the problem, not a 500 server error. |

### 6. Technical Requirements

| ID | Requirement | Specification |
| :--- | :--- | :--- |
| **TR1** | **Language** | TypeScript. |
| **TR2** | **Framework** | MCP Server, initialized from the official `@modelcontextprotocol/ts-sdk-template`. |
| **TR3** | **Core Dependency** | `smogon/damage-calc` (latest Generation 9 version). |
| **TR4** | **Deployment** | The project must be configured for "zero-config" deployment on Vercel. This includes a `vercel.json` file if necessary to handle routing. |
| **TR5** | **Package Management** | `npm` or `yarn`. |
| **TR6** | **Code Repository** | The project will be maintained in a Git repository. |

### 7. MCP API Specification (Tool Definition)

This section defines the schemas for the `calculateDamage` tool.

**Tool:** `calculateDamage`
**Description:** "Calculates the battle damage between an attacking and a defending Pokémon, considering their stats, abilities, items, and field conditions."

#### 7.1 Input Schema (`$input`)

The input will be a JSON object with three main properties: `attacker`, `defender`, and `field`.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "attacker": { "$ref": "#/definitions/Pokemon" },
    "defender": { "$ref": "#/definitions/Pokemon" },
    "field": { "$ref": "#/definitions/Field" },
    "move": { "$ref": "#/definitions/Move" }
  },
  "required": ["attacker", "defender", "field", "move"],
  "definitions": {
    "Pokemon": {
      "type": "object",
      "properties": {
        "species": { "type": "string", "description": "Name of the Pokémon species (e.g., 'Pikachu')." },
        "level": { "type": "number", "default": 50 },
        "ability": { "type": "string", "description": "The Pokémon's ability (e.g., 'Lightning Rod')." },
        "item": { "type": "string", "description": "The Pokémon's held item (e.g., 'Light Ball')." },
        "nature": { "type": "string", "description": "The Pokémon's nature (e.g., 'Timid')." },
        "status": { "type": "string", "enum": ["", "psn", "brn", "frz", "par", "slp"], "description": "e.g., 'brn' for Burned." },
        "evs": { "type": "object", "properties": { "hp": {}, "atk": {}, "def": {}, "spa": {}, "spd": {}, "spe": {} } },
        "ivs": { "type": "object", "properties": { "hp": {}, "atk": {}, "def": {}, "spa": {}, "spd": {}, "spe": {} } },
        "boosts": { "type": "object", "properties": { "atk": {}, "def": {}, "spa": {}, "spd": {}, "spe": {} } }
      },
      "required": ["species"]
    },
    "Move": {
        "type": "object",
        "properties": {
            "name": { "type": "string", "description": "Name of the move being used (e.g., 'Thunderbolt')." },
            "isCrit": { "type": "boolean", "default": false, "description": "Whether the move is a guaranteed critical hit." }
        },
        "required": ["name"]
    },
    "Field": {
      "type": "object",
      "properties": {
        "gameType": { "type": "string", "enum": ["Singles", "Doubles"], "default": "Singles" },
        "weather": { "type": "string", "enum": ["", "Sun", "Rain", "Sand", "Snow"] },
        "terrain": { "type": "string", "enum": ["", "Electric", "Grassy", "Misty", "Psychic"] },
        "isBeadsOfRuin": { "type": "boolean", "default": false },
        "isTabletsOfRuin": { "type": "boolean", "default": false },
        "isSwordOfRuin": { "type": "boolean", "default": false },
        "isVesselOfRuin": { "type": "boolean", "default": false },
        "attackerSide": { "$ref": "#/definitions/Side" },
        "defenderSide": { "$ref": "#/definitions/Side" }
      }
    },
    "Side": {
        "type": "object",
        "properties": {
            "isSR": { "type": "boolean", "default": false, "description": "Stealth Rock is active." },
            "spikes": { "type": "number", "enum": [0, 1, 2, 3], "default": 0 },
            "isLightScreen": { "type": "boolean", "default": false },
            "isReflect": { "type": "boolean", "default": false }
        }
    }
  }
}
```

#### 7.2 Output Schema (`$output`)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "description": {
      "type": "string",
      "description": "A full, human-readable description of the calculation and result."
    },
    "damage": {
      "type": "array",
      "items": { "type": "number" },
      "description": "The [min, max] damage roll as raw numbers."
    },
    "koChance": {
        "type": "string",
        "description": "A string describing the chance for the move to knock out the defender."
    },
    "fullResult": {
        "type": "object",
        "description": "The raw, unprocessed result object from the smogon/damage-calc library."
    }
  },
  "required": ["description", "damage", "koChance"]
}
```

### 8. Out of Scope

*   **User Interface (UI):** This project is for an API server only. No web frontend will be built.
*   **Persistent Storage:** The server will be stateless. It will not save Pokémon sets, user data, or calculation history.
*   **Complex Turn Logic:** The tool will only calculate the result of a single move. It will not handle turn order, multi-turn moves, or secondary effect probabilities (e.g., the 30% chance to burn from Flamethrower).
*   **Multi-Battle Simulation:** The scope is limited to one-off calculations, not simulating entire battles.

### 9. Success Metrics

*   **API Uptime:** > 99.9% on the Vercel platform.
*   **Average Latency:** < 500ms per request for standard calculations.
*   **Adoption:** Number of unique IP addresses or applications making requests to the server (if logging is implemented).
*   **Accuracy:** 0 calculation discrepancies when compared with the official Smogon Web Calculator for identical inputs.

### 10. Future Work & Potential Enhancements

*   **`findBestMove` Tool:** A new tool that takes an attacker and defender and calculates the damage for all of the attacker's viable moves to find the most damaging one.
*   **`coverage` Tool:** A tool that analyzes a Pokémon's moveset against common metagame threats.
*   **Support for Pokémon Sets:** Integrate with a database or a simple JSON store to allow users to use shorthand for common Smogon sets (e.g., `"Lando-T-Scarf"`).
*   **Caching:** Implement a simple in-memory or Vercel Edge cache to return instant results for frequently repeated calculations.