import style from "@/components/styles/DashboardLayout.module.scss";
import { LayoutProps } from "@/types/components";
import DashboardMenu from "./DashboardMenu";

export default function DashboardLayout(props: LayoutProps) {
    return (
        <main
            className={style.main}
            style={{
                justifyContent: props.horizontalCenter ? "center" : "normal",
                alignItems: props.verticalCenter ? "center" : "normal",
            }}
        >
            <DashboardMenu />
            <section>{props.children}</section>
        </main>
    );
}
