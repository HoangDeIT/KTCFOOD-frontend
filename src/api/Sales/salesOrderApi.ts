// src/api/Sales/salesOrderApi.ts

import axios from "@/utils/axios.customize";

export const getSalesOrders = (params: {
    pageIndex?: number;
    pageSize?: number;
}) =>
    axios.get<IPaginated<ISalesOrder>>(
        "/sales/order",
        { params }
    );

export const createSalesOrder = (data: ISalesOrderRequest) =>
    axios.put<ISalesOrder>("/sales/order", data);

export const updateSalesOrder = (id: number, data: ISalesOrderRequest) =>
    axios.post<ISalesOrder>(`/sales/order/${id}`, data);

export const deleteSalesOrder = (id: number) =>
    axios.delete(`/sales/order/${id}`);