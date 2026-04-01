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

interface IProduct {
    id: number;
    productName: string;
    productCode: string;
    unit: string;
    standardPrice: number;
}

interface IProductRequest {
    productName: string;
    productCode: string;
    unit: string;
    standardPrice: number;
}

interface IInventory {
    id: number;
    productId: number;
    quantity: number;
    productionDate: string;
    preservationEndDate: string;
}