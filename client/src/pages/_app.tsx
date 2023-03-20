import AuthProvider from '@/components/AuthProvider'
import '@/pages/styles/globals.css'
import { store } from '@/redux/store'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'

export default function App({ Component, pageProps }: AppProps) {
    return ( 
        <Provider store={store}>
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
        </Provider>
    )
}
