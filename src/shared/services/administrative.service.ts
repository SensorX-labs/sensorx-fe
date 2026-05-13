import api from "@/shared/configs/axios-config";

export interface Province {
    id: string;
    name: string;
    code: number;
}

export interface Ward {
    id: string;
    name: string;
    code: number;
}

const AdministrativeService = {
    //get list province
    getListProvince: () =>
        api.data.get<any, Province[]>('/vietnam-administrative/getListProvince'),
    //get list ward for province
    getListWardForProvince: (provinceId: string) =>
        api.data.get<any, Ward[]>(`/vietnam-administrative/getListWardForProvince/${provinceId}`)
};

export default AdministrativeService;