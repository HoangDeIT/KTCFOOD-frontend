import { Layout, Menu, Button } from "antd";
import {
    UserOutlined,
    DashboardOutlined,
    LogoutOutlined
} from "@ant-design/icons";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useCurrentApp } from "@/context/AppProvider";

const { Header, Footer, Sider, Content } = Layout;

export default function AdminLayout() {
    const { appState, setAppState } = useCurrentApp();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        setAppState(null);
        navigate("/login");
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider>
                <div style={{ color: "white", padding: 16 }}>
                    {appState?.role} Panel
                </div>

                <Menu theme="dark" mode="inline">

                    {/* 👑 ADMIN */}
                    {appState?.role === "Admin" && (
                        <Menu.Item key="1" icon={<UserOutlined />}>
                            <Link to="/admin/users">Users</Link>
                        </Menu.Item>
                    )}

                    {/* 📦 INVENTORY */}
                    {appState?.role === "Inventory" && (
                        <>
                            <Menu.Item key="2" icon={<DashboardOutlined />}>
                                <Link to="/inventory/products">Products</Link>
                            </Menu.Item>
                            <Menu.Item key="3" icon={<DashboardOutlined />}>
                                <Link to="/inventory/inventories">Inventories</Link>
                            </Menu.Item>
                        </>
                    )}

                </Menu>
            </Sider>

            <Layout>
                <Header
                    style={{
                        color: "#fff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <div>Hello {appState?.username} UwU ✨</div>

                    <Button
                        danger
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Header>

                <Content style={{ margin: "16px" }}>
                    <Outlet />
                </Content>

                <Footer style={{ textAlign: "center" }}>
                    Admin Panel ©2026
                </Footer>
            </Layout>
        </Layout>
    );
}