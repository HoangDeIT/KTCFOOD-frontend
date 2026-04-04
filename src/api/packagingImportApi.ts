import axios from "@/utils/axios.customize";


// GET LIST
export const getPackagingImports = (params: {
    pageIndex: number;
    pageSize: number;
}) =>
    axios.get<IPaginated<IPackagingImport>>(
        "/material-and-packaging/packaging/import",
        { params }
    );

export const addPackagingImports = (
    data: IPackagingImportRequest[],
    reason: number,
    originId?: number
) =>
    axios.put<IPackagingImport[]>(
        "/material-and-packaging/packaging/import",
        data,
        {
            params: { importReason: reason, originId }
        }
    );

export const getPackagingsDropdown = () =>
    axios.get<IPaginated<IPackaging>>(
        "/material-and-packaging/packaging",
        { params: { pageIndex: 1, pageSize: 1000 } }
    );