import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { useCurrentApp, type IUserLogin } from "./context/AppProvider";

function App() {
    const { setAppState } = useCurrentApp();

    return <AppRouter />;
}

export default App;