import axios from "@/utils/axios.customize";

export const loginApi = async (username: string, password: string) => {

    const res = await axios.post("/auth/login", {
        username,
        password
    });

    return res;
};

