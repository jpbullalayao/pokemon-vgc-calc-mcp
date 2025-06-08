export interface Pokemon {
    species: string;
    level?: number;
    ability?: string;
    item?: string;
    nature?: string;
    status?: '' | 'psn' | 'brn' | 'frz' | 'par' | 'slp';
    evs?: {
        hp?: number;
        atk?: number;
        def?: number;
        spa?: number;
        spd?: number;
        spe?: number;
    };
    ivs?: {
        hp?: number;
        atk?: number;
        def?: number;
        spa?: number;
        spd?: number;
        spe?: number;
    };
    boosts?: {
        atk?: number;
        def?: number;
        spa?: number;
        spd?: number;
        spe?: number;
    };
}
export interface Move {
    name: string;
    isCrit?: boolean;
}
export interface Side {
    isSR?: boolean;
    spikes?: 0 | 1 | 2 | 3;
    isLightScreen?: boolean;
    isReflect?: boolean;
}
export interface Field {
    gameType?: 'Singles' | 'Doubles';
    weather?: '' | 'Sun' | 'Rain' | 'Sand' | 'Snow';
    terrain?: '' | 'Electric' | 'Grassy' | 'Misty' | 'Psychic';
    isBeadsOfRuin?: boolean;
    isTabletsOfRuin?: boolean;
    isSwordOfRuin?: boolean;
    isVesselOfRuin?: boolean;
    attackerSide?: Side;
    defenderSide?: Side;
}
export interface CalculateDamageRequest {
    attacker: Pokemon;
    defender: Pokemon;
    field: Field;
    move: Move;
}
export interface CalculateDamageResponse {
    description: string;
    damage: [number, number];
    koChance: string;
    fullResult?: any;
}
//# sourceMappingURL=types.d.ts.map