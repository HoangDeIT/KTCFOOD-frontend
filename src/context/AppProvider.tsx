import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface IUserLogin {
    token: string;
    expired: number;
    role: string;
    username: string;
}

type AppContextType = {
    appState: IUserLogin | null;
    setAppState: (v: IUserLogin | null) => void;
    loading: boolean;

};

const ThemeContext = createContext<AppContextType | null>(null);

interface IProps {
    children: ReactNode;
}

const AppProvider = (props: IProps) => {

    const [appState, setAppState] = useState<IUserLogin | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = localStorage.getItem("access_token");

        if (data) {
            const parsed: IUserLogin = JSON.parse(data);

            // 🌸 check expire
            if (Date.now() < parsed.expired) {
                setAppState(parsed);
            } else {
                localStorage.removeItem("access_token");
            }
        }

        setLoading(false);
    }, []);
    // load localStorage khi mở web


    return (
        <ThemeContext.Provider value={{ appState, setAppState, loading }}>
            {props.children}
        </ThemeContext.Provider>
    );
};

export default AppProvider;

// hook
export const useCurrentApp = () => {
    const currentTheme = useContext(ThemeContext);

    if (!currentTheme) {
        throw new Error(
            "useCurrentApp has to be used within <AppContext.Provider>"
        );
    }

    return currentTheme;
};