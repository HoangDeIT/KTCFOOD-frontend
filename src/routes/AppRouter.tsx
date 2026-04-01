import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../auth/ProtectedRoute";
import UsersPage from "@/pages/Admin/UsersPage";
import AdminLayout from "@/components/layouts/Layout";



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
            </Route>
        </Routes>

    );
}