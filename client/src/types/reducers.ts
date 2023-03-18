export interface IAuthInitialState {
    signIn: {
        status: "idle" | "loading" | "succeeded" | "failed"
        message: null | string
    }
    signOut: {
        status: "idle" | "loading" | "succeeded" | "failed"
        message: null | string
    }
    signUp: {
        status: "idle" | "loading" | "succeeded" | "failed"
        message: null | string
    }
    isUserLoggedIn: null | boolean
}