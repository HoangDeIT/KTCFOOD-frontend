// src/api/Sales/exportApi.ts

import axios from "@/utils/axios.customize";

export const getExports = (params: {
    pageIndex?: number;
    pageSize?: number;
}) =>
    axios.get<IPaginated<IExport>>(
        "/sales/exports",
        { params }
    );

export const createExport = (data: IExportRequest) =>
    axios.put<IExport>("/sales/exports", data);

export const deleteExport = (id: number) =>
    axios.delete(`/sales/exports/${id}`);