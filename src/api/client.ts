import {
    mockChangePassword,
    mockChangePosition,
    mockCreateGame,
    mockGetGameById,
    mockGetGames,
    mockGetUserbyId,
    mockGetUserGames,
    mockInitSession,
    mockJoinGame,
    mockLeaveGame,
    mockLogin,
    mockSignUp,
    mockUpdateUser,
    mockDeleteGame,
    mockEditGame,
    mockSearchUsers,
    mockAddPlayer,
} from "./mock";
import type {
    CreateGameBody,
    GameResponse,
    GamesListResponse,
    JoinGameResponse,
    ListGamesQuery,
    SignUpBody,
    User,
} from "./types";

export function listGames(query?: ListGamesQuery): Promise<GamesListResponse> {
  return mockGetGames(query);
}

export function createGames(body: CreateGameBody): Promise<GameResponse> {
  return mockCreateGame(body);
}

export function getGame(id: string): Promise<GameResponse | null> {
  return mockGetGameById(id);
}

export function getUser(userId: string): Promise<User | null> {
  return mockGetUserbyId(userId);
}

export function getUserGames(
  status: "upcoming" | "past" | "myGames",
  userId: string,
): Promise<GameResponse[]> {
  return mockGetUserGames(status, userId);
}

export function updateUser(fields: Partial<Omit<User, "id">>): Promise<User> {
  return mockUpdateUser(fields);
}

export function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  return mockChangePassword(currentPassword, newPassword);
}

export function login(username: string, password: string): Promise<User> {
  return mockLogin(username, password);
}

export function signup(body: SignUpBody): Promise<User> {
  return mockSignUp(body);
}

export function initSession(userId: string): void {
  mockInitSession(userId);
}

export function joinGame(
  gameId: string,
  position: string,
  bypass_payment = false,
): Promise<JoinGameResponse> {
  return mockJoinGame(gameId, position, bypass_payment);
}

export function leaveGame(gameId: string) {
  return mockLeaveGame(gameId);
}

export function changePosition(gameId: string, newPosition: string) {
  return mockChangePosition(gameId, newPosition);
}

export function deleteGame(gameId:string){
    return mockDeleteGame(gameId);
}

export function editGame(gameId:string, gameBody: CreateGameBody){
    return mockEditGame(gameId, gameBody);
}

export function searchUsers(query: string, limit = 10): Promise<User[]> {
    return mockSearchUsers(query, limit);
}

export function addPlayer(gameId: string, username: string, position: string): Promise<void> {
    return mockAddPlayer(gameId, username, position);
}