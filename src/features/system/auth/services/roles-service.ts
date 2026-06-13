import api from "@/shared/configs/axios-config";

export interface RoleItem {
    id: number;
    name: string;
}

export class RolesService {
    async getRoles(): Promise<RoleItem[]> {
        return api.gateway.get("/api/roles");
    }
}
