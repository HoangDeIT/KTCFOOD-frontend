import axios from "@/utils/axios.customize";

export const getMaterialImports = (params: any) =>
    axios.get<IPaginated<IMaterialImport>>(
        "/material-and-packaging/material/import",
        { params }
    );

export const addMaterialImports = (
    data: IMaterialImportRequest[],
    importReason: number,
    originId?: number
) =>
    axios.put<IMaterialImport[]>(
        `/material-and-packaging/material/import?importReason=${importReason}&originId=${originId ?? ""}`,
        data
    );


export const getMaterialsDropdown = () =>
    axios.get("/material-and-packaging/material", {
        params: { pageIndex: 1, pageSize: 100 }
    });

export const getSuppliersDropdown = () =>
    axios.get("/sales/suppliers", {
        params: { pageIndex: 1, pageSize: 100 }
    });

export const getBatchesDropdown = () =>
    axios.get("/production/batch", {
        params: { pageIndex: 1, pageSize: 100 }
    });