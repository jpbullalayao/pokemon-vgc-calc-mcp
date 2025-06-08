import { calculate, Pokemon as SmogonPokemon, Move as SmogonMove, Field as SmogonField, Side as SmogonSide, Generations } from '@smogon/calc';
const gen = Generations.get(9);
function createSmogonPokemon(pokemon) {
    const options = {
        species: pokemon.species,
        level: pokemon.level ?? 50,
    };
    if (pokemon.ability)
        options.ability = pokemon.ability;
    if (pokemon.item)
        options.item = pokemon.item;
    if (pokemon.nature)
        options.nature = pokemon.nature;
    if (pokemon.status)
        options.status = pokemon.status;
    if (pokemon.evs) {
        options.evs = {
            hp: pokemon.evs.hp ?? 0,
            atk: pokemon.evs.atk ?? 0,
            def: pokemon.evs.def ?? 0,
            spa: pokemon.evs.spa ?? 0,
            spd: pokemon.evs.spd ?? 0,
            spe: pokemon.evs.spe ?? 0,
        };
    }
    if (pokemon.ivs) {
        options.ivs = {
            hp: pokemon.ivs.hp ?? 31,
            atk: pokemon.ivs.atk ?? 31,
            def: pokemon.ivs.def ?? 31,
            spa: pokemon.ivs.spa ?? 31,
            spd: pokemon.ivs.spd ?? 31,
            spe: pokemon.ivs.spe ?? 31,
        };
    }
    if (pokemon.boosts) {
        options.boosts = {
            atk: pokemon.boosts.atk ?? 0,
            def: pokemon.boosts.def ?? 0,
            spa: pokemon.boosts.spa ?? 0,
            spd: pokemon.boosts.spd ?? 0,
            spe: pokemon.boosts.spe ?? 0,
        };
    }
    try {
        return new SmogonPokemon(gen, pokemon.species, options);
    }
    catch (error) {
        throw new Error(`Invalid Pokémon: ${pokemon.species}. ${error instanceof Error ? error.message : String(error)}`);
    }
}
function createSmogonMove(move) {
    const options = {};
    if (move.isCrit)
        options.isCrit = true;
    try {
        return new SmogonMove(gen, move.name, options);
    }
    catch (error) {
        throw new Error(`Invalid move: ${move.name}. ${error instanceof Error ? error.message : String(error)}`);
    }
}
function createSmogonSide(side) {
    const options = {};
    if (side) {
        if (side.isSR)
            options.isSR = true;
        if (side.spikes && side.spikes > 0)
            options.spikes = side.spikes;
        if (side.isLightScreen)
            options.isLightScreen = true;
        if (side.isReflect)
            options.isReflect = true;
    }
    return new SmogonSide(options);
}
function createSmogonField(field) {
    const options = {};
    if (field.gameType)
        options.gameType = field.gameType;
    if (field.weather)
        options.weather = field.weather;
    if (field.terrain)
        options.terrain = field.terrain;
    if (field.isBeadsOfRuin)
        options.isBeadsOfRuin = true;
    if (field.isTabletsOfRuin)
        options.isTabletsOfRuin = true;
    if (field.isSwordOfRuin)
        options.isSwordOfRuin = true;
    if (field.isVesselOfRuin)
        options.isVesselOfRuin = true;
    options.attackerSide = createSmogonSide(field.attackerSide);
    options.defenderSide = createSmogonSide(field.defenderSide);
    return new SmogonField(options);
}
export function calculateDamage(request) {
    try {
        // Validate required fields
        if (!request.attacker?.species) {
            throw new Error("Attacker species is required");
        }
        if (!request.defender?.species) {
            throw new Error("Defender species is required");
        }
        if (!request.move?.name) {
            throw new Error("Move name is required");
        }
        const attacker = createSmogonPokemon(request.attacker);
        const defender = createSmogonPokemon(request.defender);
        const move = createSmogonMove(request.move);
        const field = createSmogonField(request.field);
        const result = calculate(gen, attacker, defender, move, field);
        let damageRange;
        if (result.damage) {
            if (Array.isArray(result.damage)) {
                const damageArray = result.damage;
                damageRange = [damageArray[0], damageArray[damageArray.length - 1]];
            }
            else {
                const singleDamage = result.damage;
                damageRange = [singleDamage, singleDamage];
            }
        }
        else {
            damageRange = [0, 0];
        }
        return {
            description: result.fullDesc(),
            damage: damageRange,
            koChance: result.kochance().text,
            fullResult: result
        };
    }
    catch (error) {
        throw new Error(`Calculation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=calculator.js.map