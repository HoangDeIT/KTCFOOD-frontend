import { Button } from "antd";
import { useAuth0 } from "@auth0/auth0-react";

export default function DashboardPage() {

    const { user, logout } = useAuth0();

    return (
        <div style={{ padding: 40 }}>

            <h2>Dashboard</h2>

            <p>Welcome {user?.name}</p>

            <Button
                onClick={() =>
                    logout({ logoutParams: { returnTo: window.location.origin } })
                }
            >
                Logout
            </Button>

        </div>
    );
}