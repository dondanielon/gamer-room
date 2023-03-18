import style from '@/components/styles/Layout.module.scss'
import { LayoutProps } from '@/types/components'

export default function Layout(props: LayoutProps) {
    return (
        <main 
            className={style.main}
            style={
                {
                    justifyContent: props.horizontalCenter ? 'center' : 'normal',
                    alignItems: props.verticalCenter ? 'center' : 'normal'
                }
            }
        >
            <section>
                
            </section>
        </main>
    )
}