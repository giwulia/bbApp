import type { CreateGameBody, GamesListResponse, GameResponse, ListGamesQuery, User } from "./types";
import { mockGetGames, mockCreateGame, mockGetGameById, mockGetUserbyId, mockGetUserGames, mockUpdateUser, mockChangePassword } from "./mock";

export function listGames(query?: ListGamesQuery):Promise<GamesListResponse> {
    return mockGetGames(query)
}

export function createGames(body: CreateGameBody) : Promise<GameResponse> {
    return mockCreateGame(body)
}

export function getGame(id:string) :Promise<GameResponse |null> {
    return mockGetGameById(id)
}

export async function joinGame(gameId: string, position?: string, bypass_payment = false) {
    await new Promise(r=> setTimeout(r, 500)) // Simulate network delay;
    return {
        message: "Checkout session created",
        signup_id: "uuid",
        checkourt_url: "https://checkout.stripe.com/c/pay/cs_test_..."
    }
}

export function getUser( userId: string): Promise<User | null> {
    return mockGetUserbyId(userId)
}

export function getUserGames(status: 'upcoming' | 'past'): Promise<GameResponse[]> {
    return mockGetUserGames(status)
}

export function updateUser(fields: Partial<Omit<User, 'id'>>): Promise<User> {
    return mockUpdateUser(fields)
}

export function changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return mockChangePassword(currentPassword, newPassword)
}
