import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../auth/ProtectedRoute";
import UsersPage from "@/pages/Admin/UsersPage";
import AdminLayout from "@/components/layouts/Layout";
import ProductsPage from "@/pages/Inventory/ProductsPage";
import InventoryPage from "@/pages/Inventory/InventoryPage";
import MaterialPage from "@/pages/MaterialAndPacking/MaterialPage";
import MaterialImportPage from "@/pages/MaterialAndPacking/MaterialImportPage";
import MaterialExportPage from "@/pages/MaterialAndPacking/MaterialExportPage";
import PackagingPage from "@/pages/MaterialAndPacking/PackagingPage";
import MaterialInventoryPage from "@/pages/MaterialAndPacking/MaterialInventoryPage";
import PackagingImportPage from "@/pages/MaterialAndPacking/PackagingImportPage";
import PackagingExportPage from "@/pages/MaterialAndPacking/PackagingExportPage";
import PackagingInventoryPage from "@/pages/MaterialAndPacking/PackagingInventoryPage";
import DashboardPage from "@/pages/MaterialAndPacking/DashboardPage";
import ProductionPlanPage from "@/pages/Production/ProductionPlanPage";
import ProductionPlanDetailPage from "@/pages/Production/ProductionPlanDetailPage";
import ProductionBatchPage from "@/pages/Production/ProductionBatchPage";
import ProductionBOMPage from "@/pages/Production/ProductionBOMPage";
import ProductionBatchDetailPage from "@/pages/Production/ProductionBatchDetailPage";
import ProductionLaborPage from "@/pages/Production/ProductionLaborPage";
import SalesOrderPage from "@/pages/Sales/SalesOrderPage";
import SalesOrderDetailPage from "@/pages/Sales/SalesOrderDetailPage";
import FinishedGoodsExportPage from "@/pages/Sales/FinishedGoodsExportPage";
import CustomerPage from "@/pages/Sales/CustomerPage";
import SupplierPage from "@/pages/Sales/SupplierPage";


export default function AppRouter() {
    return (

        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<AdminLayout />}>
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute roles={["Admin"]}>
                            <UsersPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/inventory/products"
                    element={
                        <ProtectedRoute roles={["Inventory"]}>
                            <ProductsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/inventory/inventories"
                    element={
                        <ProtectedRoute roles={["Inventory"]}>
                            <InventoryPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/material-and-packaging/materials"
                    element={
                        <ProtectedRoute roles={["MaterialAndPackaging"]}>
                            <MaterialPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/material-and-packaging/material-import"
                    element={
                        <ProtectedRoute roles={["MaterialAndPackaging"]}>
                            <MaterialImportPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/material-and-packaging/material-export"
                    element={
                        <ProtectedRoute roles={["MaterialAndPackaging"]}>
                            <MaterialExportPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/material-and-packaging/packagings"
                    element={
                        <ProtectedRoute roles={["MaterialAndPackaging"]}>
                            <PackagingPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/material-and-packaging/material-inventory"
                    element={
                        <ProtectedRoute roles={["MaterialAndPackaging"]}>
                            <MaterialInventoryPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/material-and-packaging/packaging-import"
                    element={
                        <ProtectedRoute roles={["MaterialAndPackaging"]}>
                            <PackagingImportPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/material-and-packaging/packaging-export"
                    element={
                        <ProtectedRoute roles={["MaterialAndPackaging"]}>
                            <PackagingExportPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/material-and-packaging/packaging-inventory"
                    element={
                        <ProtectedRoute roles={["MaterialAndPackaging"]}>
                            <PackagingInventoryPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/material-and-packaging/dashboard"
                    element={
                        <ProtectedRoute roles={["MaterialAndPackaging"]}>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/production/production-plans"
                    element={
                        <ProtectedRoute roles={["Production"]}>
                            <ProductionPlanPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/production/plans/:id"
                    element={
                        <ProtectedRoute roles={["Production"]}>
                            <ProductionPlanDetailPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/production/batches"
                    element={
                        <ProtectedRoute roles={["Production"]}>
                            <ProductionBatchPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/production/boms"
                    element={
                        <ProtectedRoute roles={["Production"]}>
                            <ProductionBOMPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/production/batches/:id"
                    element={
                        <ProtectedRoute roles={["Production"]}>
                            <ProductionBatchDetailPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/production/batches/:id/labor"
                    element={
                        <ProtectedRoute roles={["Production"]}>
                            <ProductionLaborPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/sales/orders"
                    element={
                        <ProtectedRoute roles={["Sales"]}>
                            <SalesOrderPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/sales/orders/:id"
                    element={
                        <ProtectedRoute roles={["Sales"]}>
                            <SalesOrderDetailPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/sales/exports"
                    element={
                        <ProtectedRoute roles={["Sales"]}>
                            <FinishedGoodsExportPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/sales/customers"
                    element={
                        <ProtectedRoute roles={["Sales"]}>
                            <CustomerPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/sales/suppliers"
                    element={
                        <ProtectedRoute roles={["Sales"]}>
                            <SupplierPage />
                        </ProtectedRoute>
                    }
                />
            </Route>

        </Routes>

    );
}