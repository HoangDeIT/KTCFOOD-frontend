import axios from "@/utils/axios.customize";

export const getSuppliers = (params: {
    pageIndex?: number;
    pageSize?: number;
    name?: string;
}) =>
    axios.get<IPaginated<ISupplier>>("/sales/suppliers", { params });

export const createSupplier = (data: ISupplierRequest) =>
    axios.put<ISupplier>("/sales/suppliers", data);

export const updateSupplier = (id: number, data: ISupplierRequest) =>
    axios.post<ISupplier>(`/sales/suppliers/${id}`, data);

export const deleteSupplier = (id: number) =>
    axios.delete(`/sales/suppliers/${id}`);