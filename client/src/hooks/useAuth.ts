import {
    setRedirectAfterSignIn,
    setIsUserLoggeIn,
    setAccessToken,
} from "@/redux/reducers/auth";
import { RootState } from "@/redux/store";
import { IUserCredentials } from "@/types/services";
import { useSelector, useDispatch } from "react-redux";
import { signInThunk, refreshTokenThunk } from "@/redux/reducers/auth";

export default function useAuth() {
    const dispatch = useDispatch<any>();
    const {
        signInState,
        signOutState,
        signUpState,
        isUserLoggedIn,
        redirectAfterSignIn,
        accessToken,
        credentials,
    } = useSelector(({ auth }: RootState) => auth);

    const setAuthStatus = (status: boolean) => {
        return dispatch(setIsUserLoggeIn(status));
    };

    const setToken = (token: string) => {
        return dispatch(setAccessToken(token));
    };

    const setRedirectPath = (path: string) => {
        return dispatch(setRedirectAfterSignIn(path));
    };

    const signIn = (credentials: IUserCredentials) => {
        return dispatch(signInThunk(credentials));
    };

    const refreshToken = () => {
        return dispatch(refreshTokenThunk());
    };

    return {
        signInState,
        signOutState,
        signUpState,
        isUserLoggedIn,
        redirectAfterSignIn,
        accessToken,
        setAuthStatus,
        setToken,
        setRedirectPath,
        signIn,
        refreshToken,
        credentials,
    };
}
