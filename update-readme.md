Please update the README to include the following:

Testing local MCP server via modelcontextprotocol inspector
- 
- User can run the following command after running npm run build: `npx @modelcontextprotocol/inspector node path/to/pokemon-vgc-calc-mcp/dist/index.js 
- User can use the following input to test the MCP server:

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

The output of the MCP server should be:

```
**252 Atk Sword of Ruin Chien-Pao Icicle Crash vs. 164 HP / 100 Def Flutter Mane: 126-148 (83.4 - 98%) -- guaranteed 2HKO**

Damage: 126-148
KO Chance: guaranteed 2HKO
```

