import axios from "@/utils/axios.customize";

// LIST
export const getPackagings = (params: {
    pageIndex: number;
    pageSize: number;
}) =>
    axios.get("/material-and-packaging/packaging", { params });

// CRUD
export const addPackaging = (data: IPackagingRequest) =>
    axios.put("/material-and-packaging/packaging", data);

export const updatePackaging = (id: number, data: IPackagingRequest) =>
    axios.post(`/material-and-packaging/packaging/${id}`, data);

export const deletePackaging = (id: number) =>
    axios.delete(`/material-and-packaging/packaging/${id}`);

// IMPORT
export const getPackagingImports = (params: any) =>
    axios.get("/material-and-packaging/packaging/import", { params });

export const createPackagingImports = (data: any, reason: number, originId?: number) =>
    axios.put(
        `/material-and-packaging/packaging/import/create?importReason=${reason}&originId=${originId ?? ""}`,
        data
    );

// EXPORT
export const getPackagingExports = (params: any) =>
    axios.get("/material-and-packaging/packaging/export", { params });

export const createPackagingExports = (batchId: number, productId: number) =>
    axios.get(
        `/material-and-packaging/packaging/export/create?batchId=${batchId}&productId=${productId}`
    );