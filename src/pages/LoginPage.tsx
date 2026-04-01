import { Button, Input, Card, Typography } from "antd";
import { useState } from "react";

import { useCurrentApp } from "../context/AppProvider";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/authApi";
import { jwtDecode } from "jwt-decode";

const { Title } = Typography;

export default function LoginPage() {
    const { setAppState } = useCurrentApp();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res: any = await loginApi(username, password);

            if (res.includes("Invalid")) {
                throw new Error("Invalid username or password");
            }

            const decoded: any = jwtDecode(res);

            const role =
                decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            const userData = {
                token: res,
                expired: decoded.exp * 1000,
                role: role,
                username: decoded.name,
            };

            localStorage.setItem("access_token", JSON.stringify(userData));

            setAppState(userData);

            if (role === "Admin") {
                navigate("/admin/users");
            } else if (role === "Inventory") {
                navigate("/inventory/products");
            }
        } catch (err) {
            alert(err);
        }
    };

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
            }}
        >
            <Card
                style={{
                    width: 350,
                    borderRadius: 16,
                    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                }}
            >
                <Title level={3} style={{ textAlign: "center" }}>
                    🔐 Login
                </Title>

                <Input
                    placeholder="Username"
                    size="large"
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ marginTop: 20 }}
                />

                <Input.Password
                    placeholder="Password"
                    size="large"
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ marginTop: 15 }}
                />

                <Button
                    type="primary"
                    size="large"
                    block
                    style={{
                        marginTop: 20,
                        borderRadius: 8,
                        height: 45,
                        fontWeight: "bold",
                    }}
                    onClick={handleLogin}
                >
                    ✨ Login ✨
                </Button>
            </Card>
        </div>
    );
}