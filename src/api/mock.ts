import type {
    CreateGameBody,
    GameResponse,
    GamesListResponse,
    JoinGameResponse,
    ListGamesQuery,
    Organizer,
    SignUpBody,
    User,
} from "./types";

// helpers
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const isoNow = () => new Date().toISOString();
function makeId() {
  return "G" + Math.floor(1000 + Math.random() * 9000).toString();
}

let users: User[] = [
    {
        id: "giwu",
        name: "Giulia Wu",
        username: "giwulia",
        main_role: "outside",
        off_role: null,
        skill_level: "intermediate",
        gender: "female",
        image: null,
    },
];

// password store keyed by userId — never sent to a real server
const credentials: Record<string, { password: string; email: string }> = {
    giwu: { password: "password123", email: "giulia@example.com" },
};

let loggedInUserId: string | null = null;

function currentUser(): User {
    const u = users.find((u) => u.id === loggedInUserId);
    if (!u) throw new Error("No user logged in");
    return u;
}

//in-memory fake database tabled
const organizer1: Organizer = {
    id: "giwu",
    name: "Giulia Wu",
    games_organized: 3,
};
const organizer2: Organizer = {
    id: "o2",
    name: "Kenan T",
    games_organized: 2,
};

const organizer3: Organizer = {
    id: "o3",
    name: "Gigione J",
    games_organized: 1,
};

const organizer4: Organizer = {
    id: "o4",
    name: "Marco B",
    games_organized: 5,
};

let games: GameResponse[] = [
{
    id: "G005",
    organizer_id: organizer1.id,
    organizer: organizer1,
    title: "Friday Night VB — April",
    description: "A fun Friday night session from last month.",
    img: "https://volleyuri.ch/images/uploads/news/bilder-allgemein/erste-heimrunde/_header/DSCF5119.jpg",
    type: "game",
    level_required: "intermediate",
    gender: "mixed",
    date: "2026-04-18",
    start_time: "19:00:00",
    end_time: "21:00:00",
    location: "UEL SportsDock",
    location_url: "https://www.google.com/maps?q=UEL+SportsDock+London",
    location_details: "Court 1",
    city: "London",
    total_spots: 12,
    reserved_spots: 12,
    price_per_spot: 12,
    position_slots: {
        setter: 2,
        outside: 4,
        middle: 2,
        opposite: 2,
        libero: 2,
        },
    status: "open",
    spots_taken: 12,
    players: [
        {
            user_id: "giwu",
            username: "giwulia",
            name: "Giulia Wu",
            image: null,
            position: "outside",
            team_assignment: "A",
            status: "confirmed",
        },
        {
            user_id: "u1",
            username: "spike_master",
            name: "Alex Turner",
            image: null,
            position: "outside",
            team_assignment: "B",
            status: "confirmed",
        },
    ],
    created_at: "2026-04-01T10:00:00Z",
    updated_at: "2026-04-01T10:00:00Z",
    },
    {
    id: "G004",
    organizer_id: organizer4.id,
    organizer: organizer4,
    title: "Serving & Passing Clinic",
    description:
        "Focused drill session on float serves, jump serves, and platform passing. Suitable for intermediate players looking to sharpen fundamentals. Expect repetitive reps, video feedback, and small group rotations.",
    img: "https://www.uri.edu/news/wp-content/uploads/news/sites/16/2025/09/New-Court-01-1024x677.jpeg",
    type: "drill",
    level_required: "intermediate",
    gender: "mixed",
    date: "2026-08-05",
    start_time: "10:00:00",
    end_time: "12:00:00",
    location: "Ethos Sports Centre",
    location_url: "https://www.google.com/maps?q=Ethos+Sports+Centre+London",
    location_details: "Studio 2",
    city: "London",
    total_spots: 12,
    reserved_spots: 3,
    price_per_spot: 18,
    position_slots: null,
    status: "open",
    spots_taken: 3,
    players: [
        {
            user_id: "u13",
            username: "float_serve",
            name: "Priya Nair",
            image: null,
            position: "",
            team_assignment: null,
            status: "confirmed",
        },
        {
            user_id: "u14",
            username: "pass_king",
            name: "Tom Ellis",
            image: null,
            position: "",
            team_assignment: null,
            status: "confirmed",
        },
    ],
    created_at: isoNow(),
    updated_at: isoNow(),
    },
    {
        id: "G001",
        organizer_id: organizer1.id,
        organizer: organizer1,
        title: "Tuesday Night Volleyball",
        description:
        "Only sign up if you are Mid to Upper Intermediate/ Advanced Level Player and Knowlegeable of 5:1 Rotations. Our goal is to have a good time, enjoy the company of friendly people and play some competitive games. Remember 'Every Serve is a Point'",
        img: "https://volleyuri.ch/images/uploads/news/bilder-allgemein/erste-heimrunde/_header/DSCF5119.jpg",
        type: "game",
        level_required: "intermediate",
        gender: "mixed",
        date: "2026-08-18",
        start_time: "19:00:00",
        end_time: "21:00:00",
        location: "UEL SportsDock",
        location_url: "https://www.google.com/maps?q=UEL+SportsDock+London",
        location_details: "Court 3",
        city: "London",
        total_spots: 12,
        reserved_spots: 5,
        price_per_spot: 12.5,
        position_slots: {
        setter: 2,
        outside: 4,
        middle: 2,
        opposite: 2,
        libero: 2,
        },
        status: "open",
        spots_taken: 3,
        players: [
        {
            user_id: "giwu",
            username: "giwulia",
            name: "Giulia Wu",
            image: null,
            position: "outside",
            team_assignment: "A",
            status: "confirmed",
        },
        {
            user_id: "u1",
            username: "spike_master",
            name: "Alex Turner",
            image: null,
            position: "outside",
            team_assignment: "A",
            status: "confirmed",
        },
        {
            user_id: "u2",
            username: "set_god",
            name: "Chris Wong",
            image: null,
            position: "setter",
            team_assignment: "B",
            status: "confirmed",
        },
        {
            user_id: "u3",
            username: "libero_queen",
            name: "Sophie Khan",
            image: null,
            position: "libero",
            team_assignment: null,
            status: "pending",
        },
        ],
        created_at: "2026-02-01T12:00:00Z",
        updated_at: "2026-02-01T12:00:00Z",
    },
    {
        id: "G002",
        organizer_id: organizer2.id,
        organizer: organizer2,
        title: "Saturday Social VB",
        description:
        "Come and play in a Saturday afternoon Lower-Intermediate volleyball session in Whitechapel 🔥\n\n" +
        "❗️This session is not for beginners. Please be considerate & only sign up to this game if you’re a Lower-INTERMEDIATE player or above. If you’re a beginner please sign up to a mixed ability session❗️\n\n" +
        "💦 Water fountain, showers & changing rooms on site",
        img: "https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg",
        type: "game",
        level_required: "beginner",
        gender: "mixed",
        date: "2026-09-06",
        start_time: "14:00:00",
        end_time: "16:00:00",
        location: "Score Centre",
        location_url: "https://www.google.com/maps?q=Score+Centre+Leyton+London",
        location_details: "Court 1",
        city: "London",
        total_spots: 18,
        reserved_spots: 12,
        price_per_spot: 15,
        position_slots: {
        setter: 3,
        outside: 6,
        middle: 3,
        opposite: 3,
        libero: 3,
        },
        status: "open",
        spots_taken: 5,
        players: [
        {
            user_id: "u4",
            username: "jumpserve99",
            name: "Daniel Smith",
            image: null,
            position: "outside",
            team_assignment: "A",
            status: "confirmed",
        },
        {
            user_id: "u5",
            username: "quick_middle",
            name: "Emma Brown",
            image: null,
            position: "middle",
            team_assignment: "B",
            status: "confirmed",
        },
        {
            user_id: "utest",
            username: "jojo",
            name: "Jolyene J",
            image: null,
            position: "outside",
            team_assignment: "B",
            status: "confirmed",
        },
        {
            user_id: "u6",
            username: "setter_life",
            name: "Luca Rossi",
            image: null,
            position: "setter",
            team_assignment: null,
            status: "pending",
        },
        {
            user_id: "u7",
            username: "dig_machine",
            name: "Maya Patel",
            image: null,
            position: "libero",
            team_assignment: "A",
            status: "confirmed",
        },
        {
            user_id: "u8",
            username: "right_side",
            name: "Noah Wilson",
            image: null,
            position: "opposite",
            team_assignment: null,
            status: "pending",
        },
        ],
        created_at: isoNow(),
        updated_at: isoNow(),
    },
    {
        id: "G003",
        organizer_id: organizer3.id,
        organizer: organizer3,
        title: "Wednesday Evening Competitive VB",
        description:
        "High-energy midweek volleyball session for experienced players in central Manchester ⚡️\n\n" +
        "❗️This session is for INTERMEDIATE to ADVANCED players only. Please ensure you are comfortable with rotations, transitions, and consistent serves before signing up❗️\n\n" +
        "🏐 Full-size court, scoreboard in use & balls provided\n" +
        "🚿 Showers and changing rooms available on site",
        img: "https://images.pexels.com/photos/6203580/pexels-photo-6203580.jpeg",
        type: "game",
        level_required: "advanced",
        gender: "mixed",
        date: "2026-10-14",
        start_time: "19:00:00",
        end_time: "21:00:00",
        location: "National Volleyball Centre",
        location_url:
        "https://www.google.com/maps?q=National+Volleyball+Centre+Manchester",
        location_details: "Court 2",
        city: "Manchester",
        total_spots: 12,
        reserved_spots: 8,
        price_per_spot: 12,
        position_slots: {
            setter: 2,
            outside: 4,
            middle: 2,
            opposite: 2,
            libero: 2,
        },
        status: "open",
        spots_taken: 4,
        players: [
        {
            user_id: "u9",
            username: "power_spiker",
            name: "James Taylor",
            image: null,
            position: "outside",
            team_assignment: "A",
            status: "confirmed",
        },
        {
            user_id: "u10",
            username: "block_master",
            name: "Olivia Green",
            image: null,
            position: "middle",
            team_assignment: "B",
            status: "confirmed",
        },
        {
            user_id: "u11",
            username: "elite_setter",
            name: "Ethan Clark",
            image: null,
            position: "setter",
            team_assignment: "A",
            status: "confirmed",
        },
        {
            user_id: "u12",
            username: "defense_pro",
            name: "Ava Johnson",
            image: null,
            position: "libero",
            team_assignment: null,
            status: "pending",
        },
        ],
        created_at: isoNow(),
        updated_at: isoNow(),
    },
    ];

function sanitizeCreateBody(body: CreateGameBody): CreateGameBody {
  // For drills, position_slots should be null (matches API.md behaviour).
    if (body.type === "drill") {
    return { ...body, position_slots: null };
    }
  // For games, allow null OR partial mapping — but usually you want an object.
    return body;
}

// Session list screen
export async function mockGetGames(
    query: ListGamesQuery = {},
    ): Promise<GamesListResponse> {
    await sleep(250);
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const today = new Date().toISOString().split("T")[0];
    const filtered = (games ?? []).filter(
        (g) =>
        g != null && g.date >= today && (!query.city || g.city === query.city),
    );
    const total = filtered.length;
    const start = (page - 1) * limit;
    const list = filtered.slice(start, start + limit);

    return {
        games: list,
        total,
        page,
        limit,
    };
}
// Session detail
export async function mockGetGameById(
    id: string,
): Promise<GameResponse | null> {
    await sleep(250);
    return (games ?? []).find((g) => g?.id === id) ?? null;
}
//Create session
export async function mockCreateGame(
    gameBody: CreateGameBody,
): Promise<GameResponse> {
    await sleep(400);

    const sanitized = sanitizeCreateBody(gameBody);
    const u = currentUser();
    const organizer: Organizer = { id: u.id, name: u.name, games_organized: 0 };
    const now = isoNow();

    const game: GameResponse = {
        id: makeId(),
        organizer_id: organizer.id,
        organizer,
        ...sanitized,
        img:
        sanitized.img ??
        "https://images.pexels.com/photos/6203581/pexels-photo-6203581.jpeg",
        status: "open",
        spots_taken: 0,
        players: [],
        reserved_spots: 0,
        location_url: sanitized.location_url ?? "",
        created_at: now,
        updated_at: now,
    };

    games = [game, ...games];
    return game;
}

// Get user's games (upcoming = future dates, past = past dates)
export async function mockGetUserGames(
    status: "upcoming" | "past" | "myGames",
    userId: string,
    ): Promise<GameResponse[]> {
    await sleep(250);
    const today = new Date().toISOString().split("T")[0];
    return games.filter((g) => {
        const isPlaying = (g.players ?? []).some((p) => p.user_id === userId);
        if (status === "myGames") return g.organizer_id === userId;
        const matchesStatus = status === "upcoming" ? g.date >= today : g.date < today;
        return isPlaying && matchesStatus;
    });
}

//Get User info
export async function mockGetUserbyId(id: string): Promise<User | null> {
    await sleep(250);
    return users.find((u) => u.id === id) ?? null;
}

// Update user profile
export async function mockUpdateUser(
    fields: Partial<Omit<User, "id">>,
    ): Promise<User> {
    await sleep(300);
    const idx = users.findIndex((u) => u.id === loggedInUserId);
    if (idx === -1) throw new Error("Not logged in");
    users[idx] = { ...users[idx], ...fields };
    return users[idx];
}

// Change password (mock — just validates current password isn't empty)
export async function mockChangePassword(
    currentPassword: string,
    _newPassword: string,
    ): Promise<void> {
    await sleep(300);
    const creds = loggedInUserId ? credentials[loggedInUserId] : null;
    if (!creds || creds.password !== currentPassword)
        throw new Error("Current password is incorrect");
}

// Auth
export async function mockLogin(
    username: string,
    password: string,
    ): Promise<User> {
    await sleep(400);
    const found = users.find((u) => u.username === username);
    if (!found || credentials[found.id]?.password !== password) {
        throw new Error("Invalid username or password");
    }
    loggedInUserId = found.id;
    return found;
}

export async function mockSignUp(body: SignUpBody): Promise<User> {
    await sleep(500);
    if (users.some((u) => u.username === body.username)) {
        throw new Error("Username already taken");
    }
    const newUser: User = {
        id: "u_" + body.username,
        name: body.name,
        username: body.username,
        main_role: null,
        off_role: null,
        skill_level: body.skill_level,
        gender: body.gender,
        image: null,
    };
    users.push(newUser);
    credentials[newUser.id] = { password: body.password, email: body.email };
    loggedInUserId = newUser.id;
    return newUser;
}

// Restore session after app restart (called from AuthContext with stored user ID)
export function mockInitSession(userId: string): void {
    loggedInUserId = userId;
}

// Expose current user for internal use (e.g. createGame organizer)
export { currentUser };

export async function mockJoinGame(
    gameId: string,
    position: string,
    bypass_payment = false,
    userId = loggedInUserId,
    ): Promise<JoinGameResponse> {
    await sleep(300);
    if (!userId) throw new Error("Login to join games!");
    const game = games.find((g) => g.id === gameId);
    if (!game) throw new Error("Game not found");
    const user = users.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    if (game.players.some((p) => p.user_id === userId))
        throw new Error("Already joined this game");
    if (game.spots_taken >= game.total_spots) throw new Error("Game is full");

    const signup_id = "su_" + gameId + "_" + userId;
    const playerStatus = bypass_payment ? "confirmed" : "pending";

    game.players.push({
        user_id: user.id,
        username: user.username,
        name: user.name,
        image: user.image,
        position,
        team_assignment: null,
        status: playerStatus,
        });
        game.spots_taken += 1;
        game.reserved_spots += 1;
        if (game.spots_taken >= game.total_spots) game.status = "full";

        if (bypass_payment) {
            return { message: "Signup confirmed", signup_id, checkout_url: null };
        }
        return {
            message: "Successfully joined!",
            signup_id,
            checkout_url: "https://checkout.stripe.com/c/pay/cs_test_mock",
        };
}

export async function mockLeaveGame(
    gameId: string,
    userId = loggedInUserId,
    ): Promise<{ message: string }> {
    await sleep(300);
    if (!userId) throw new Error("Not logged in");
    const game = games.find((g) => g.id === gameId);
    if (!game) throw new Error("Game not found");
    if (!game.players.some((p) => p.user_id === userId))
        throw new Error("Not joined in this game");

    game.players = game.players.filter((p) => p.user_id !== userId);
    game.spots_taken -= 1;
    game.reserved_spots -= 1;
    if (game.status === "full") game.status = "open";
    return {
        message: "Successfully left the game",
    };
}

export async function mockChangePosition(
    gameId: string,
    newPosition: string,
    userId = loggedInUserId,
    ): Promise<{ message: string }> {
    await sleep(300);
    if (!userId) throw new Error("Not logged in");
    const game = games.find((g) => g.id === gameId);
    if (!game) throw new Error("Game not found");
    const player = game.players.find((p) => p.user_id === userId);
    if (!player) throw new Error("Not joined in this game");
    player.position = newPosition;
    return {
        message: "Position updated successfully",
    };
}

export function mockEditGame(id:string, updatedFields: Partial<CreateGameBody>): GameResponse {
    const game = games.find(g=>g.id===id);
    if (!game) throw new Error("Game not found");
    Object.assign(game, updatedFields, {updated_at: isoNow()});
    return game;
}

export function mockDeleteGame(id:string){
    const game = games.find(g=>g.id===id)
    if (!game) throw new Error("Game not found");
    game.status='cancelled';
}

export function mockSearchUsers(query: string, limit: number = 10): Promise<User[]> {
    const q = query.toLowerCase();
    return Promise.resolve(
        users
            .filter((u) => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q))
            .slice(0, limit),
    );
}

export async function mockAddPlayer(gameId: string, username: string, position: string): Promise<void> {
    await sleep(300);
    const caller = currentUser();
    const game = games.find((g) => g.id === gameId);
    if (!game) throw new Error("Game not found");
    if (game.organizer_id !== caller.id) throw new Error("Only the organizer can add players");
    const user = users.find((u) => u.username === username);
    if (!user) throw new Error("User not found");
    if (game.players.some((p) => p.user_id === user.id)) throw new Error("Player already in game");
    if (game.spots_taken >= game.total_spots) throw new Error("Game is full");
    game.players.push({
        user_id: user.id,
        username: user.username,
        name: user.name,
        image: user.image,
        position,
        team_assignment: null,
        status: "confirmed",
    });
    game.spots_taken += 1;
}