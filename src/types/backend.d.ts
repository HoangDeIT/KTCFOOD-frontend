interface IUser {
    userId: string;
    username: string;
    role: string;
}

interface IPaginated<T> {
    items: T[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
}

interface IAdminUserRequest {
    username: string;
    password: string;
    role: string;
}