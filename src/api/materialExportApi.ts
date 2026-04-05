import axios from "@/utils/axios.customize";

// GET list
export const getMaterialExports = (params: {
    pageIndex: number;
    pageSize: number;
}) =>
    axios.get("/material-and-packaging/material/export", { params });

// CREATE EXPORT (auto từ BOM)
export const createMaterialExports = (batchId: number, productId: number) =>
    axios.put(
        `/material-and-packaging/material/export/create?batchId=${batchId}&productId=${productId}`
    );

// PRODUCT DROPDOWN
export const getProductsDropdown = () =>
    axios.get("/inventory/product", {
        params: { pageIndex: 1, pageSize: 100 }
    });