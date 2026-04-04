import axios from "@/utils/axios.customize";
// ================= PLAN =================

// GET LIST
export const getProductionPlans = (params: {
    pageIndex?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
    productId?: number;
    shift?: string;
}) =>
    axios.get<IPaginated<IProductionPlan>>(
        "/production/plan",
        { params }
    );

// GET BY ID
export const getProductionPlanById = (id: number) =>
    axios.get<IProductionPlan>(`/production/plan/${id}`);

// CREATE
export const createProductionPlan = (data: IProductionPlanRequest) =>
    axios.put<IProductionPlan>("/production/plan", data);

// UPDATE
export const updateProductionPlan = (id: number, data: IProductionPlanRequest) =>
    axios.post<IProductionPlan>(`/production/plan/${id}`, data);

// DELETE
export const deleteProductionPlan = (id: number) =>
    axios.delete(`/production/plan/${id}`);

// ================= EXTRA =================

// Remaining quantity
export const getPlanRemaining = (planId: number) =>
    axios.get<number>(`/production/plan/${planId}/remaining`);

// Check finished
export const checkPlanFinished = (planId: number) =>
    axios.get<boolean>(`/production/plan/${planId}/check-finished`);

export const getProductsDropdown = () =>
    axios.get<IPaginated<IProduct>>(
        "/inventory/product",
        { params: { pageIndex: 1, pageSize: 1000 } }
    );

export const checkBOMSatisfied = (planId: number) =>
    axios.get<boolean>(`/production/bom/check-satisfied/${planId}`);

