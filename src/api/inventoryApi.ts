import axios from "@/utils/axios.customize";

// GET list
export const getProducts = (params: {
    pageIndex: number;
    pageSize: number;
}) =>
    axios.get<IPaginated<IProduct>>("/inventory/product", { params });

// ADD
export const addProduct = (data: IProductRequest) =>
    axios.put<IProduct>("/inventory/product", data);

// UPDATE
export const updateProduct = (id: number, data: IProductRequest) =>
    axios.post<IProduct>(`/inventory/product/${id}`, data);

// DELETE
export const deleteProduct = (id: number) =>
    axios.delete(`/inventory/product/${id}`);


export const getInventories = (params: {
    pageIndex: number;
    pageSize: number;
}) =>
    axios.get<IPaginated<IInventory>>("/inventory", { params });

// UPDATE (chỉ update preservationEndDate)
export const updateInventory = (id: number, preservationEndDate: string) =>
    axios.post(`/inventory/${id}?preservationEndDate=${preservationEndDate}`);

// DELETE
export const deleteInventory = (id: number) =>
    axios.delete(`/inventory/${id}`);

export const getProductInventoryCount = (productId: number) =>
    axios.get<number>(`/inventory/product/${productId}/count`);