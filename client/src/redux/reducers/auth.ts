import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { IAuthInitialState } from "@/types/reducers"
import { IUserCredentials } from "@/types/services"
import { refreshTokenService, signInService } from "@/services/authentication"

const initialState: IAuthInitialState = {
    signInState: {
        status: "idle",
        message: null,
    },
    signUpState: {
        status: "idle",
        message: null,
    },
    signOutState: {
        status: "idle",
        message: null,
    },
    refreshTokenState: {
        status: "idle",
        message: null,
    },
    credentials: null,
    isUserLoggedIn: null,
    accessToken: null,
    redirectAfterSignIn: null,
    isSocketConnected: false
}

export const signInThunk = createAsyncThunk(
    "/sing-in",
    async (credentials: IUserCredentials) => {
        const response = await signInService(credentials)
        return response
    }
)

export const refreshTokenThunk = createAsyncThunk("/refresh", async () => {
    const response = await refreshTokenService()
    return response
})

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setIsUserLoggeIn: (state, action: PayloadAction<boolean>) => {
            state.isUserLoggedIn = action.payload
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload
        },
        setRedirectAfterSignIn: (state, action: PayloadAction<string>) => {
            state.redirectAfterSignIn = action.payload
        },
        setIsSocketConnected: (state, action: PayloadAction<boolean>) => {
            state.isSocketConnected = action.payload
        }
    },

    extraReducers: (builder) => {
        //SIGN IN CASES
        builder.addCase(signInThunk.pending, (state, action) => {
            state.signInState.status = "loading"
            state.signInState.message = null
        })

        builder.addCase(signInThunk.rejected, (state, action) => {
            state.signInState.status = "failed"
            state.signInState.message = action.error.message!
        })

        builder.addCase(signInThunk.fulfilled, (state, action) => {
            state.signInState.status = "succeeded"
            state.signInState.message = null
            state.credentials = action.payload.credentials
            state.isUserLoggedIn = true
            state.accessToken = action.payload.accessToken
        })
        //REFRESH TOKEN CASES
        builder.addCase(refreshTokenThunk.pending, (state, action) => {
            state.refreshTokenState.status = "loading"
            state.refreshTokenState.message = null
        })

        builder.addCase(refreshTokenThunk.rejected, (state, action) => {
            state.refreshTokenState.status = "failed"
            state.refreshTokenState.message = action.error.message!
            state.isUserLoggedIn = false
            state.accessToken = null
            state.credentials = null
        })

        builder.addCase(refreshTokenThunk.fulfilled, (state, action) => {
            state.refreshTokenState.status = "succeeded"
            state.refreshTokenState.message = null
            state.isUserLoggedIn = true
            state.accessToken = action.payload.accessToken
            state.credentials = action.payload.credentials
        })
    },
})

export const { setIsUserLoggeIn, setRedirectAfterSignIn, setAccessToken, setIsSocketConnected } = authSlice.actions
export default authSlice.reducer