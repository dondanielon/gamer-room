import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { IAuthInitialState } from '@/types/reducers'
import { IAPIResponse } from '@/types/services'

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
    isUserLoggedIn: null
}

export const signIn = createAsyncThunk('/sing-in', async (response: IAPIResponse, _thunkAPI) => {
    
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsUserLoggeIn: (state, action: PayloadAction<boolean>) => {
            state.isUserLoggedIn = action.payload
        }
    },

   
    extraReducers: (builder) => {
        //SIGN IN CASES
        builder.addCase(signIn.pending, (state, action) => {
            state.signIn.status = 'loading'
            state.signIn.message = null
        })

        builder.addCase(signIn.rejected, (state, action) => {
            
        }) 

        builder.addCase(signIn.fulfilled, (state, action) => {           
            
        })
    }
})

export const { setIsUserLoggeIn } = authSlice.actions
export default authSlice.reducer