import { setRedirectAfterSignIn, setIsUserLoggeIn } from "@/redux/reducers/auth"
import { RootState } from "@/redux/store"
import { IUserCredentials } from "@/types/services"
import {  useSelector, useDispatch } from "react-redux"
import { signInThunk } from "@/redux/reducers/auth"

export default function useAuth() {
    const dispatch = useDispatch<any>()
    const signInState = useSelector(({ auth }: RootState) => auth.signIn )
    const signOutState = useSelector(({ auth }: RootState) => auth.signOut )
    const signUpState = useSelector(({ auth }: RootState) => auth.signUp )
    const isUserLoggedIn = useSelector(({ auth }: RootState) => auth.isUserLoggedIn )
    const redirectAfterSignIn = useSelector(({ auth }: RootState) => auth.redirectAfterSignIn )
    const accessToken = useSelector(({ auth }: RootState) => auth.accessToken )

    const setAuthStatus = (status: boolean) => {
        return dispatch(setIsUserLoggeIn(status))
    }

    const setRedirectPath = (path: string) => {
        return dispatch(setRedirectAfterSignIn(path))
    }

    const signIn = (credentials: IUserCredentials) => {
        return dispatch(signInThunk(credentials))
    }

    return { 
        signInState,
        signOutState,
        signUpState,
        isUserLoggedIn,
        redirectAfterSignIn,
        setAuthStatus,
        setRedirectPath,
        signIn
     }
}