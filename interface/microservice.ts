import { Permission } from "./permission"
import { ApiResponse } from "./api"

export interface Microservice {
  Id: number;
  Name: string;
  Description: string,
  Endpoint: string,
  Permissions: Permission[],
}

export type MicroserviceListAPI = ApiResponse<Microservice[]>