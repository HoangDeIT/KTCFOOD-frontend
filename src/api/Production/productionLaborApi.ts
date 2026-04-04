import axios from "@/utils/axios.customize";

export const getLabors = (batchId: number) =>
    axios.get<IPaginated<IProductionLabor>>(
        `/production/labor/${batchId}`,
        {
            params: { pageIndex: 1, pageSize: 100 }
        }
    );

export const updateLabors = (
    batchId: number,
    data: ILaborRequest[]
) =>
    axios.post(`/production/labor/${batchId}`, data);