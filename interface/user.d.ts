import { ApiResponse } from "@/interface/api";
import { Role } from "./role";

export interface UserSession {
  Id: number,
  Email: string,
  UserName: string,
  Roles: string[],
  Permissions: string[],
}

export interface User {
  Id: number,
  Email: string,
  UserName: string,
  Status: string,
  Roles: Role[],
}

export interface UserList {
  count: number,
  rows: User[],
}

export type UserListAPI = ApiResponse<UserList>

export interface LoginData {
  email: string
  password: string
}

export interface SignUpData {
  email: string
  username: string
  password: string
}

export type LoginApiResponse = ApiResponse<{
  accessToken: string
  refreshToken: string
  userSession: UserSession
  expiryDate: string
}>

export type RefreshApiResponse = ApiResponse<{
  token: string
  expiryDate: string
}>

export type UserSessionWithToken = {
  userSession: UserSession
  accessToken: string,
  expiryDate: string
}

export type UserSessionApiResponse = ApiResponse<UserSessionWithToken>