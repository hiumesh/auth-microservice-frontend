import { Permission } from "./permission"
import { ApiResponse } from "./api"

export interface Role {
  Id: number,
  Name: string,
  Description: string,
  Permissions: Permission[],
}

export type RoleListAPI = ApiResponse<Role[]>