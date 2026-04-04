import axios from "@/utils/axios.customize";

export const getMaterials = (params: {
    pageIndex: number;
    pageSize: number;
}) =>
    axios.get<IPaginated<IMaterial>>("/material-and-packaging/material", { params });

// ADD
export const addMaterial = (data: IMaterialRequest) =>
    axios.put<IMaterial>("/material-and-packaging/material", data);

// UPDATE
export const updateMaterial = (id: number, data: IMaterialRequest) =>
    axios.post<IMaterial>(`/material-and-packaging/material/${id}`, data);

// DELETE
export const deleteMaterial = (id: number) =>
    axios.delete(`/material-and-packaging/material/${id}`);

// GET AVAILABLE QUANTITY
export const getMaterialQuantity = (id: number) =>
    axios.get<number>(`/material-and-packaging/material/${id}/quantity`);