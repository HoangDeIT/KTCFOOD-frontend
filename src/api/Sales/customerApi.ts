import axios from "@/utils/axios.customize";

export const getCustomers = (params: {
    pageIndex?: number;
    pageSize?: number;
    name?: string;
}) =>
    axios.get<IPaginated<ICustomer>>("/sales/customers", { params });

export const createCustomer = (data: ICustomerRequest) =>
    axios.put<ICustomer>("/sales/customers", data);

export const updateCustomer = (id: number, data: ICustomerRequest) =>
    axios.post<ICustomer>(`/sales/customers/${id}`, data);

export const deleteCustomer = (id: number) =>
    axios.delete(`/sales/customers/${id}`);