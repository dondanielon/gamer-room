import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { IAuthInitialState } from '@/types/reducers'
import { IUserCredentials } from '@/types/services'
import { signInService } from '@/services/authentication'

const initialState: IAuthInitialState = {
    signIn: {
        status: 'idle', 
        message: null
    },
    signUp: {
        status: 'idle', 
        message: null
    },
    signOut: {
        status: 'idle',
        message: null
    },
    isUserLoggedIn: null,
    accessToken: null,
    redirectAfterSignIn: null
}

export const signInThunk = createAsyncThunk('/sing-in', async (credentials: IUserCredentials, _thunkAPI) => {
    const response = await signInService(credentials)
    return response
})

export const authSlice = createSlice({
    name: 'auth',
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
        }
    },

   
    extraReducers: (builder) => {
        //SIGN IN CASES
        builder.addCase(signInThunk.pending, (state, action) => {
            state.signIn.status = 'loading'
            state.signIn.message = null
        })

        builder.addCase(signInThunk.rejected, (state, action) => {
            state.signIn.status = "failed"
            state.signIn.message = action.error.message!
        }) 

        builder.addCase(signInThunk.fulfilled, (state, action) => {           
            state.signIn.status = "succeeded"
            state.signIn.message = action.payload.message
            state.isUserLoggedIn = true
            state.accessToken = action.payload.data
        })
    }
})

export const { setIsUserLoggeIn, setRedirectAfterSignIn } = authSlice.actions
export default authSlice.reducer