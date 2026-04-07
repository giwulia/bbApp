import type { CreateGameBody, GamesListResponse, GameResponse, ListGamesQuery } from "./types";
import { mockGetGames, mockCreateGame, mockGetGameById } from "./mock";

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
