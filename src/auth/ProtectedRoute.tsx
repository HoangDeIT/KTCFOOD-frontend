import { Navigate } from "react-router-dom";
import { useCurrentApp } from "../context/AppProvider";

interface IProps {
    children: React.ReactNode;
    roles?: string[]; // 👈 thêm roles cho phép
}

export default function ProtectedRoute({ children, roles }: IProps) {

    const { appState, loading } = useCurrentApp();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!appState) {
        return <Navigate to="/login" replace />;
    }

    if (Date.now() > appState.expired) {
        localStorage.removeItem("access_token");
        return <Navigate to="/login" replace />;
    }
    // 🌸 check role
    if (roles && !roles.includes(appState.role)) {
        return <Navigate to="/403" replace />; // hoặc redirect về home
    }

    return <>{children}</>;
}