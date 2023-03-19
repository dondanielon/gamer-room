import { setRedirectAfterSignIn } from "@/redux/reducers/auth"
import { RootState } from "@/redux/store"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function useProtect() {
    const isUserLoggedIn = useSelector(({ auth }: RootState) => auth.isUserLoggedIn )
    const accessToken = useSelector(({ auth }: RootState) => auth.accessToken )
    const [isPageLoading, setIsPageLoading] = useState(true)
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!isUserLoggedIn || !accessToken) {
            dispatch(setRedirectAfterSignIn(router.pathname))
            router.push('/login')
        }

        if (isUserLoggedIn && accessToken) setIsPageLoading(() => false)

    }, [isUserLoggedIn, accessToken])

    return { isPageLoading }
}