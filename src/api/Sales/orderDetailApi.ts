// src/api/Sales/orderDetailApi.ts

import axios from "@/utils/axios.customize";

export const getOrderDetails = (orderId: number, params?: {
    pageIndex?: number;
    pageSize?: number;
}) =>
    axios.get<IPaginated<IOrderDetail>>(
        `/sales/details/order/${orderId}`,
        { params }
    );

export const updateOrderDetails = (orderId: number, data: IOrderDetailRequest[]) =>
    axios.put<IOrderDetail[]>(
        `/sales/details/${orderId}`,
        data
    );