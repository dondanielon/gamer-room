import { axiosConfig } from "@/helpers/config";
import { IUserCredentials } from "@/types/services";

const axios = axiosConfig.instance;

export async function signInService(credentials: IUserCredentials) {
    try {
        const { data } = await axios.post(
            "/authentication/sign-in",
            JSON.stringify(credentials)
        );

        return data;
    } catch (error: any) {
        if (!error.response) {
            throw new Error("no server response");
        } else if (error.response?.status === 401) {
            throw new Error(error.response?.data?.message);
        } else if (error.response?.status === 400) {
            throw new Error("bad request");
        } else {
            throw new Error("something went wrong");
        }
    }
}

export async function refreshTokenService() {
    try {
        const { data } = await axios.get("/authentication/refresh");
        return data;
    } catch (error: any) {
        if (!error.response) {
            throw new Error("no server response");
        } else if (error.response?.status === 403) {
            throw new Error("token failed");
        } else {
            throw new Error("something went wrong");
        }
    }
}
