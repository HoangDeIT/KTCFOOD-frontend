import { Button, Input } from "antd";
import { useState } from "react";

import { useCurrentApp } from "../context/AppProvider";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/authApi";
import { jwtDecode } from "jwt-decode";

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

            // 🌸 tạo object chuẩn
            const userData = {
                token: res,
                expired: decoded.exp * 1000, // ⚠️ convert sang ms
                role: role,
                username: decoded.name,
            };

            // 🌸 lưu đúng format
            localStorage.setItem("access_token", JSON.stringify(userData));

            setAppState(userData);
            if (role === "admin") {
                navigate("/admin");
            } else {
                navigate("/403");
            }

        } catch (err) {
            alert(err);
        }
    };

    return (
        <div style={{ padding: 100 }}>
            <Input
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
            />

            <Input.Password
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginTop: 10 }}
            />

            <Button
                type="primary"
                style={{ marginTop: 20 }}
                onClick={handleLogin}
            >
                Login
            </Button>
        </div>
    );
}