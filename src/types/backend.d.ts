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
interface IMaterialImport {
    id: number;
    materialId: number;
    importReason: number;
    supplierId?: number;
    productionBatchId?: number;
    quantity: number;
    importCost: number;
    importDate: string;
    status: string;
}

interface IMaterialImportRequest {
    materialId: number;
    quantity: number;
    importCost: number;
    importDate: string;
    status: string;
}
interface IMaterial {
    id: number;
    name: string;
    unit: string;
    type: string;
    note: string;
    avgPrice: number;
}

interface IMaterialRequest {
    name: string;
    unit: string;
    type: string;
    note: string;
    avgPrice: number;
}


interface ISupplier {
    id: number;
    name: string;
}

interface IProductionBatch {
    id: number;
}
interface IMaterialExport {
    id: number;
    materialId: number;
    productionBatchId: number;
    quantity: number;
    exportDate: string;
}

interface IPackaging {
    id: number;
    packageName: string;
    unit: string;
}

interface IPackagingRequest {
    packageName: string;
    unit: string;
}
interface IPackagingImport {
    id: number;
    packagingMaterialId: number;
    importReason: number;
    supplierId?: number;
    productionBatchId?: number;
    quantity: number;
    importDate: string;
}

interface IPackagingImportRequest {
    packagingMaterialId: number;
    quantity: number;
    importDate: string;
}
interface IPackagingExport {
    id: number;
    packagingMaterialId: number;
    productionBatchId: number;
    quantity: number;
    exportDate: string;
}

interface IProductionPlan {
    id: number;
    productId: number;
    plannedQuantity: number;
    shift: string;
    startDate: string;
    endDate: string;
    status: string;
}

interface IProductionPlanRequest {
    productId: number;
    plannedQuantity: number;
    shift: string;
    startDate: string;
    endDate: string;
}

interface IPaginated<T> {
    items: T[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
}


interface IProductionBatch {
    id: number;
    productId: number;
    productionPlanId: number;
    productionDate: string;
    shift: string;
    plannedQuantity: number;
    actualQuantity: number;
    status: string;
}

interface IBOM {
    id: number;
    productId: number;
    isMaterial: boolean;
    materialId?: number;
    packagingMaterialId?: number;
    quantityPerUnit: number;
}

interface IBOMRequest {
    isMaterial: boolean;
    originId: number; // materialId hoặc packagingId
    quantityPerUnit: number;
}

interface IProductionLabor {
    id: number;
    productionBatchId: number;
    workerCount: number;
    workDate: string;
    note?: string;
}

interface ILaborRequest {
    workerCount: number;
    workDate: string;
    note?: string;
}