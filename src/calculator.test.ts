import { describe, it, expect } from 'vitest';
import { calculateDamage } from './calculator.js';
import type { CalculateDamageRequest } from './types.js';

describe('calculateDamage', () => {
  it('should calculate damage for a basic scenario', () => {
    const request: CalculateDamageRequest = {
      attacker: {
        species: "Pikachu",
        level: 50,
        ability: "Static",
        item: "Light Ball",
        nature: "Timid",
        evs: { spa: 252, spe: 252, hp: 4 },
        ivs: { hp: 31, atk: 0, def: 31, spa: 31, spd: 31, spe: 31 }
      },
      defender: {
        species: "Charizard",
        level: 50,
        ability: "Blaze",
        nature: "Modest",
        evs: { hp: 252, spa: 252, spd: 4 },
        ivs: { hp: 31, atk: 0, def: 31, spa: 31, spd: 31, spe: 31 }
      },
      move: {
        name: "Thunderbolt",
        isCrit: false
      },
      field: {
        gameType: "Singles",
        weather: "",
        terrain: ""
      }
    };

    const result = calculateDamage(request);
    
    expect(result.description).toContain("Pikachu");
    expect(result.description).toContain("Thunderbolt");
    expect(result.description).toContain("Charizard");
    expect(result.damage).toHaveLength(2);
    expect(result.damage[0]).toBeGreaterThan(0);
    expect(result.damage[1]).toBeGreaterThanOrEqual(result.damage[0]);
    expect(result.koChance).toBeDefined();
    expect(typeof result.koChance).toBe('string');
  });

  it('should handle critical hits', () => {
    const request: CalculateDamageRequest = {
      attacker: { species: "Pikachu" },
      defender: { species: "Charizard" },
      move: { name: "Thunderbolt", isCrit: true },
      field: { gameType: "Singles" }
    };

    const result = calculateDamage(request);
    expect(result.description).toContain("critical hit");
  });

  it('should throw error for missing attacker species', () => {
    const request = {
      attacker: {},
      defender: { species: "Charizard" },
      move: { name: "Thunderbolt" },
      field: { gameType: "Singles" }
    } as CalculateDamageRequest;

    expect(() => calculateDamage(request)).toThrow("Attacker species is required");
  });

  it('should throw error for missing defender species', () => {
    const request = {
      attacker: { species: "Pikachu" },
      defender: {},
      move: { name: "Thunderbolt" },
      field: { gameType: "Singles" }
    } as CalculateDamageRequest;

    expect(() => calculateDamage(request)).toThrow("Defender species is required");
  });

  it('should throw error for missing move name', () => {
    const request = {
      attacker: { species: "Pikachu" },
      defender: { species: "Charizard" },
      move: {},
      field: { gameType: "Singles" }
    } as CalculateDamageRequest;

    expect(() => calculateDamage(request)).toThrow("Move name is required");
  });

  it('should throw error for invalid Pokemon species', () => {
    const request: CalculateDamageRequest = {
      attacker: { species: "InvalidPokemon" },
      defender: { species: "Charizard" },
      move: { name: "Thunderbolt" },
      field: { gameType: "Singles" }
    };

    expect(() => calculateDamage(request)).toThrow("Invalid Pokémon: InvalidPokemon");
  });

  it('should throw error for invalid move name', () => {
    const request: CalculateDamageRequest = {
      attacker: { species: "Pikachu" },
      defender: { species: "Charizard" },
      move: { name: "InvalidMove" },
      field: { gameType: "Singles" }
    };

    expect(() => calculateDamage(request)).toThrow("Calculation failed");
  });

  it('should handle weather conditions', () => {
    const request: CalculateDamageRequest = {
      attacker: { species: "Charizard" },
      defender: { species: "Venusaur" },
      move: { name: "Flamethrower" },
      field: { gameType: "Singles", weather: "Sun" }
    };

    const result = calculateDamage(request);
    expect(result.description).toContain("in Sun");
  });

  it('should handle different game types', () => {
    const request: CalculateDamageRequest = {
      attacker: { species: "Pikachu" },
      defender: { species: "Charizard" },
      move: { name: "Thunderbolt" },
      field: { gameType: "Doubles" }
    };

    const result = calculateDamage(request);
    expect(result.damage).toHaveLength(2);
    expect(result.damage[0]).toBeGreaterThan(0);
  });
});