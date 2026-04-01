import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../auth/ProtectedRoute";
import UsersPage from "@/pages/Admin/UsersPage";
import AdminLayout from "@/components/layouts/Layout";
import ProductsPage from "@/pages/Inventory/ProductsPage";
import InventoryPage from "@/pages/Inventory/InventoryPage";



export default function AppRouter() {
    return (

        <Routes>

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

            </Route>
        </Routes>

    );
}