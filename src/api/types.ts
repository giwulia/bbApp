export type PlayerPositions = "setter" | "outside" | "middle" | "opposite" | "libero"
export type SkillLevel = "beginner" | "intermediate" | "advanced" | "competitive"
export type PlayerGender = "male" | "female"
export type GameGender = "male" | "female" | "mixed"
export type GameType = "game" | "drill"
export type GameStatus = "open" | "full" | "in_progress" | "completed" | "cancelled"
export type TransactionType = "deposit" | "withdrawal" | "game_fee" | "refund" | "no_show_penalty" | "organizer_payout"

export type PositionSlots = Partial<Record<PlayerPositions, number>> | null;

export type Organizer = {
    id:string;
    name:string;
    games_organized: number
}

export type GameResponse = {
    id: string;
    organizer_id: string;
    organizer: Organizer;

    title: string;
    description: string;
    img: string;
    type: GameType;
    level_required: SkillLevel;

    date: string;
    start_time: string;
    end_time: string;

    location: string;
    location_url: string;
    location_details?: string;
    city?: string;
    gender: GameGender;

    total_spots: number;
    reserved_spots: number;
    price_per_spot: number;

    position_slots: PositionSlots;

    status: GameStatus;
    spots_taken: number;

    players:Player[];

    created_at: string;
    updated_at: string;
};


export type Player = {
    user_id: string;
    username:string;
    name: string;
    position:string;
    team_assignment: string | null
    status: string
};

export type ListGamesQuery = Partial<{
    game_type: GameType;
    level: SkillLevel;
    date_from: string; // YYYY-MM-DD
    date_to: string;   // YYYY-MM-DD
    status: GameStatus;
    city: string;
    gender: GameGender;
    page: number;
    limit: number;
    }>;

export type GamesListResponse = {
    games: GameResponse[];
    total: number;
    page: number;
    limit: number
}

export type CreateGameBody = {
    title: string,
    description: string,
    type: GameType,
    level_required: SkillLevel,
    date: string,
    start_time: string;  // HH:mm:ss
    end_time: string;    // HH:mm:ss
    img?:string;

    location: string;
    location_url: string;
    location_details?: string;
    city?: string;

    gender: GameGender,

    total_spots: number;
    reserved_spots: number;
    price_per_spot: number;

    position_slots: PositionSlots,
    template_id: null,
    teams: null
    };
