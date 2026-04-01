import axios from "@/utils/axios.customize";


export const getUsers = (params: {
    pageIndex: number;
    pageSize: number;
}) =>
    axios.get<IPaginated<IUser>>(`/admin/users`, { params });
export const addUser = (data: IAdminUserRequest) =>
    axios.put<IUser>(`/admin/users`, data);

export const deleteUser = (id: string) =>
    axios.delete<boolean>(`/admin/users/${id}`);

export const updateUser = (id: string, data: IAdminUserRequest) =>
    axios.post<IUser>(`/admin/users/${id}/modify`, data);
