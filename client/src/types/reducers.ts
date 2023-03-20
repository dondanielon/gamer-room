export interface RequestState  {
    status: "idle" | "loading" | "succeeded" | "failed"
    message: null | string
}

export interface IUserCredentials {
    _id: string
    username: string
    firstName: string
    lastName: string
    email: string
    iat?: number
    exp?: number
}

export interface IAuthInitialState {
    signInState: RequestState
    signOutState: RequestState
    signUpState: RequestState
    refreshTokenState: RequestState
    credentials: IUserCredentials | null
    isUserLoggedIn: null | boolean
    accessToken: null | string
    redirectAfterSignIn: string | null
}