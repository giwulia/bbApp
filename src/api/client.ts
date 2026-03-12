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

