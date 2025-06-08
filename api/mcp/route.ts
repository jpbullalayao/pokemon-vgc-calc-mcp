import { createMcpHandler } from '@vercel/mcp-adapter';
import { calculate, Pokemon as SmogonPokemon, Move as SmogonMove, Field as SmogonField, Side as SmogonSide, Generations } from '@smogon/calc';
import { z } from 'zod';

const gen = Generations.get(9);

// Zod schemas for input validation
const PokemonSchema = z.object({
  species: z.string(),
  level: z.number().int().min(1).max(100).default(50),
  ability: z.string().optional(),
  item: z.string().optional(),
  nature: z.string().optional(),
  status: z.enum(['', 'psn', 'brn', 'frz', 'par', 'slp']).default(''),
  evs: z.object({
    hp: z.number().int().min(0).max(252).default(0),
    atk: z.number().int().min(0).max(252).default(0),
    def: z.number().int().min(0).max(252).default(0),
    spa: z.number().int().min(0).max(252).default(0),
    spd: z.number().int().min(0).max(252).default(0),
    spe: z.number().int().min(0).max(252).default(0),
  }).default({}),
  ivs: z.object({
    hp: z.number().int().min(0).max(31).default(31),
    atk: z.number().int().min(0).max(31).default(31),
    def: z.number().int().min(0).max(31).default(31),
    spa: z.number().int().min(0).max(31).default(31),
    spd: z.number().int().min(0).max(31).default(31),
    spe: z.number().int().min(0).max(31).default(31),
  }).default({}),
  boosts: z.object({
    atk: z.number().int().min(-6).max(6).default(0),
    def: z.number().int().min(-6).max(6).default(0),
    spa: z.number().int().min(-6).max(6).default(0),
    spd: z.number().int().min(-6).max(6).default(0),
    spe: z.number().int().min(-6).max(6).default(0),
  }).default({})
});

const MoveSchema = z.object({
  name: z.string(),
  isCrit: z.boolean().default(false)
});

const SideSchema = z.object({
  isSR: z.boolean().default(false),
  spikes: z.number().int().min(0).max(3).default(0),
  isLightScreen: z.boolean().default(false),
  isReflect: z.boolean().default(false)
}).default({});

const FieldSchema = z.object({
  gameType: z.enum(['Singles', 'Doubles']).default('Singles'),
  weather: z.enum(['', 'Sun', 'Rain', 'Sand', 'Snow']).default(''),
  terrain: z.enum(['', 'Electric', 'Grassy', 'Misty', 'Psychic']).default(''),
  isBeadsOfRuin: z.boolean().default(false),
  isTabletsOfRuin: z.boolean().default(false),
  isSwordOfRuin: z.boolean().default(false),
  isVesselOfRuin: z.boolean().default(false),
  attackerSide: SideSchema,
  defenderSide: SideSchema
}).default({});

const CalculateDamageSchema = z.object({
  attacker: PokemonSchema,
  defender: PokemonSchema,
  move: MoveSchema,
  field: FieldSchema
});

function createSmogonPokemon(pokemon: z.infer<typeof PokemonSchema>): SmogonPokemon {
  const options: any = {
    species: pokemon.species,
    level: pokemon.level,
  };

  if (pokemon.ability) options.ability = pokemon.ability;
  if (pokemon.item) options.item = pokemon.item;
  if (pokemon.nature) options.nature = pokemon.nature;
  if (pokemon.status) options.status = pokemon.status;

  options.evs = pokemon.evs;
  options.ivs = pokemon.ivs;
  options.boosts = pokemon.boosts;

  try {
    return new SmogonPokemon(gen, pokemon.species, options);
  } catch (error) {
    throw new Error(`Invalid Pokémon: ${pokemon.species}. ${error instanceof Error ? error.message : String(error)}`);
  }
}

function createSmogonMove(move: z.infer<typeof MoveSchema>): SmogonMove {
  const options: any = {};
  if (move.isCrit) options.isCrit = true;
  
  try {
    return new SmogonMove(gen, move.name, options);
  } catch (error) {
    throw new Error(`Invalid move: ${move.name}. ${error instanceof Error ? error.message : String(error)}`);
  }
}

function createSmogonSide(side: z.infer<typeof SideSchema>): SmogonSide {
  const options: any = {};
  
  if (side.isSR) options.isSR = true;
  if (side.spikes && side.spikes > 0) options.spikes = side.spikes;
  if (side.isLightScreen) options.isLightScreen = true;
  if (side.isReflect) options.isReflect = true;
  
  return new SmogonSide(options);
}

function createSmogonField(field: z.infer<typeof FieldSchema>): SmogonField {
  const options: any = {};
  
  if (field.gameType) options.gameType = field.gameType;
  if (field.weather) options.weather = field.weather;
  if (field.terrain) options.terrain = field.terrain;
  if (field.isBeadsOfRuin) options.isBeadsOfRuin = true;
  if (field.isTabletsOfRuin) options.isTabletsOfRuin = true;
  if (field.isSwordOfRuin) options.isSwordOfRuin = true;
  if (field.isVesselOfRuin) options.isVesselOfRuin = true;
  
  options.attackerSide = createSmogonSide(field.attackerSide);
  options.defenderSide = createSmogonSide(field.defenderSide);
  
  return new SmogonField(options);
}

// Create MCP handler using Vercel adapter
const handler = createMcpHandler((server) => {
  server.tool(
    'calculateDamage',
    'Calculates the battle damage between an attacking and a defending Pokémon, considering their stats, abilities, items, and field conditions.',
    CalculateDamageSchema.shape,
    async (params) => {
      try {
        const attacker = createSmogonPokemon(params.attacker);
        const defender = createSmogonPokemon(params.defender);
        const move = createSmogonMove(params.move);
        const field = createSmogonField(params.field);

        const result = calculate(gen, attacker, defender, move, field);
        
        let damageRange: [number, number];
        if (result.damage) {
          if (Array.isArray(result.damage)) {
            const damageArray = result.damage as number[];
            damageRange = [damageArray[0], damageArray[damageArray.length - 1]];
          } else {
            const singleDamage = result.damage as number;
            damageRange = [singleDamage, singleDamage];
          }
        } else {
          damageRange = [0, 0];
        }

        const calculationResult = {
          description: result.fullDesc(),
          damage: damageRange,
          koChance: result.kochance().text,
          percentage: result.range(),
        };

        return {
          content: [
            {
              type: 'text',
              text: `**${calculationResult.description}**\n\nDamage: ${calculationResult.damage[0]}-${calculationResult.damage[1]}\nKO Chance: ${calculationResult.koChance}`
            }
          ]
        };
      } catch (error) {
        throw new Error(`Calculation failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  );
});

export default handler;