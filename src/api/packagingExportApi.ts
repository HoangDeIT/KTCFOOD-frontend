// packagingExportApi.ts
import axios from "@/utils/axios.customize";

export const getPackagingExports = (params: {
    pageIndex: number;
    pageSize: number;
}) =>
    axios.get<IPaginated<IPackagingExport>>(
        "/material-and-packaging/packaging/export",
        { params }
    );

export const createPackagingExports = (
    batchId: number,
    productId: number
) =>
    axios.put<IPackagingExport[]>(
        "/material-and-packaging/packaging/export",
        null,
        {
            params: { batchId, productId }
        }
    );