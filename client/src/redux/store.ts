import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/redux/reducers/auth'

export const store = configureStore({
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
    reducer: {
        auth: authReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch