import type {
    GameResponse,
    GamesListResponse,
    Organizer,
    ListGamesQuery,
    CreateGameBody,
    User
} from "./types";


// helpers
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const isoNow = () => new Date().toISOString()
function makeId() {
    return "G" + Math.floor(1000 + Math.random() * 9000).toString();
}

let user: User ={
    id: 'giwu',
    name: 'Giulia Wu',
    username:'giwulia',
    main_role: 'outside',
    off_role: null,
    skill_level: 'intermediate',
    gender: 'female',
    image:null
}

//in-memory fake database tabled
const organizer1 : Organizer = {
    id: 'o1',
    name: 'Giulia Wu',
    games_organized: 3
}
const organizer2 : Organizer = {
    id: 'o2',
    name: 'Kenan T',
    games_organized: 2
}

const organizer3 : Organizer = {
    id: 'o3',
    name: 'Gigione J',
    games_organized: 1
}

const organizer4 : Organizer = {
    id: 'o4',
    name: 'Marco B',
    games_organized: 5
}

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
        position_slots: { setter: 2, outside: 4, middle: 2, opposite: 2, libero: 2 },
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
        description: "Focused drill session on float serves, jump serves, and platform passing. Suitable for intermediate players looking to sharpen fundamentals. Expect repetitive reps, video feedback, and small group rotations.",
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
        position_slots: { setter: 2, outside: 4, middle: 2, opposite: 2, libero: 2 },
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
        img: "https://thumbs.dreamstime.com/b/volleyball-rests-polished-wood-court-floor-empty-stadium-arena-blue-seats-fill-background-basketball-hoop-visible-beyond-418853182.jpg",
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
        position_slots: { setter: 3, outside: 6, middle: 3, opposite: 3, libero: 3 },
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
        img: "https://thumbs.dreamstime.com/b/modern-volleyball-logo-design-sports-branding-marketing-volleyball-logo-design-modern-high-quality-logo-volleyball-355748079.jpg",
        type: "game",
        level_required: "advanced",
        gender: "mixed",
        date: "2026-10-14",
        start_time: "19:00:00",
        end_time: "21:00:00",
        location: "National Volleyball Centre",
        location_url: "https://www.google.com/maps?q=National+Volleyball+Centre+Manchester",
        location_details: "Court 2",
        city: "Manchester",
        total_spots: 12,
        reserved_spots: 8,
        price_per_spot: 12,
        position_slots: { setter: 2, outside: 4, middle: 2, opposite: 2, libero: 2 },
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
    query: ListGamesQuery = {}
    ): Promise<GamesListResponse> {
        await sleep(250);
        const page = query.page?? 1;
        const limit = query.limit ?? 20;
        const today = new Date().toISOString().split('T')[0];
        const filtered = (games ?? []).filter(g =>
            g != null &&
            g.date >= today &&
            (!query.city || g.city === query.city))
        const total = filtered.length
        const start = (page - 1) * limit;
        const list = filtered.slice(start, start + limit)

    return {
        games: list,
        total,
        page,
        limit
    };
}
// Session detail
export async function mockGetGameById(
    id:string): Promise<GameResponse | null > {
        await sleep(250)
        return (games ?? []).find((g) => g?.id === id) ?? null;
}
//Create session
export async function mockCreateGame(
    gameBody:CreateGameBody
) : Promise<GameResponse> {
    await sleep(400)

    const sanitized = sanitizeCreateBody(gameBody)
    const organizer = organizer1
    const now = isoNow()

    const game: GameResponse = {
        id: makeId(),
        organizer_id: organizer.id,
        organizer,
        ...sanitized,
        img:
        sanitized.img ?? "https://images.pexels.com/photos/6203581/pexels-photo-6203581.jpeg",
        status: "open",
        spots_taken: 0,
          players: [],
        reserved_spots: 0,
        location_url: sanitized.location_url ?? "",
        created_at : now,
        updated_at : now
    }

    games = [game,...games]
    return game
}

// Get user's games (upcoming = future dates, past = past dates)
export async function mockGetUserGames(status: 'upcoming' | 'past'): Promise<GameResponse[]> {
    await sleep(250);
    const today = new Date().toISOString().split('T')[0];
    return games.filter(g => {
        const isPlaying = (g.players ?? []).some(p => p.user_id === user.id);
        const matchesStatus = status === 'upcoming' ? g.date >= today : g.date < today;
        return isPlaying && matchesStatus;
    });
}

//Get User info
export async function mockGetUserbyId(
    id: string): Promise<User | null> {
        await sleep(250);
        return user.id === id ? user : null;
    }

// Update user profile
export async function mockUpdateUser(fields: Partial<Omit<User, 'id'>>): Promise<User> {
    await sleep(300);
    user = { ...user, ...fields };
    return user;
}

// Change password (mock — just validates current password isn't empty)
export async function mockChangePassword(currentPassword: string, _newPassword: string): Promise<void> {
    await sleep(300);
    if (!currentPassword) throw new Error('Current password is incorrect');
}
