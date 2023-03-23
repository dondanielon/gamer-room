import Layout from "./Layout";
import { ColorRing } from "react-loader-spinner";

export default function Loading() {
    return (
        <Layout verticalCenter={true} horizontalCenter={true}>
            <ColorRing
                visible={true}
                height="80"
                width="80"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={["#a9a9c3", "#a9a9c3", "#a9a9c3", "#a9a9c3", "#a9a9c3"]}
            />
        </Layout>
    );
}
