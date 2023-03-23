import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useAuth from "./useAuth";

export default function useProtect() {
    const { isUserLoggedIn, accessToken, setRedirectPath, credentials } = useAuth();
    const [isPageLoading, setIsPageLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoggedIn || !accessToken || !credentials) {
            setRedirectPath(router.pathname);
            router.push("/login");
        }

        if (isUserLoggedIn && accessToken && credentials)
            setIsPageLoading(() => false);
    }, [isUserLoggedIn, accessToken]);

    return { isPageLoading };
}
