import { Microservice } from "./microservice";
import { Role } from "./role";
import { ApiResponse } from "./api";

export interface Permission {
  Id: number,
  Name: string,
  Description: string,
  Roles: Role[],
  Microservices: Microservice[],
}

export interface PermissionList {
  count: number,
  rows: Permission[],
}

export type PermissionListAPI = ApiResponse<PermissionList>