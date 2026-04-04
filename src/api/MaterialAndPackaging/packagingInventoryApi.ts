// packagingApi.ts (thêm vào file bạn đang có)

import axios from "@/utils/axios.customize";

// GET LIST
export const getPackagings = (params: {
    pageIndex: number;
    pageSize: number;
}) =>
    axios.get<IPaginated<IPackaging>>(
        "/material-and-packaging/packaging",
        { params }
    );

// GET AVAILABLE
export const getPackagingQuantity = (id: number) =>
    axios.get<number>(
        `/material-and-packaging/packaging/${id}/quantity`
    );