import { refreshTokenService } from "@/services/authentication";
import useAuth from "./useAuth";

export default function useRefreshToken() {
    const { setToken, accessToken } = useAuth()

    const refresh = async () => {
        const response = await refreshTokenService()
        setToken(response.data)   
    }

    return refresh
}