import { Layout, Menu } from "antd";
import {
    UserOutlined,
    DashboardOutlined
} from "@ant-design/icons";
import { Outlet, Link } from "react-router-dom";

const { Header, Footer, Sider, Content } = Layout;

export default function AdminLayout() {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider>
                <div style={{ color: "white", padding: 16 }}>Admin</div>

                <Menu theme="dark" mode="inline">
                    <Menu.Item key="1" icon={<DashboardOutlined />}>
                        <Link to="/">Dashboard</Link>
                    </Menu.Item>

                    <Menu.Item key="2" icon={<UserOutlined />}>
                        <Link to="/users">Users</Link>
                    </Menu.Item>
                </Menu>
            </Sider>

            <Layout>
                <Header style={{ color: "#fff" }}>Hello Admin UwU</Header>

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