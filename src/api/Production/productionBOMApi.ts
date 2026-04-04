import axios from "@/utils/axios.customize";

export const getBOMs = (params: {
    pageIndex?: number;
    pageSize?: number;
    productId?: number;
}) =>
    axios.get<IPaginated<IBOM>>("/production/bom", { params });

export const updateBOMs = (productId: number, data: IBOMRequest[]) =>
    axios.put(`/production/bom/${productId}`, data);