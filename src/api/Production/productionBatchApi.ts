import axios from "@/utils/axios.customize";

export const getProductionBatches = (params: {
    pageIndex?: number;
    pageSize?: number;
}) =>
    axios.get<IPaginated<IProductionBatch>>(
        "/production/batch",
        { params }
    );

export const createBatch = (planId: number, plannedQuantity: number) =>
    axios.put<IProductionBatch>(
        `/production/batch/${planId}`,
        {},
        { params: { plannedQuantity } }
    );

export const startBatch = (batchId: number) =>
    axios.post(`/production/batch/${batchId}/start`);

export const cancelBatch = (batchId: number, reason?: string) =>
    axios.post(`/production/batch/${batchId}/cancel`, null, {
        params: { cancelReason: reason }
    });

export const completeBatch = (batchId: number, actualQuantity?: number) =>
    axios.post(`/production/batch/${batchId}/complete`, null, {
        params: { actualQuantity }
    });

export const getBatchById = (id: number) =>
    axios.get<IProductionBatch>(`/production/batch/${id}`);

