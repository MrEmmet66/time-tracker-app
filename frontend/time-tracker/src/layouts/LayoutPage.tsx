import React from "react";
import {Layout} from "antd";

import Header from "../components/headers/Header";

interface IProps {
    children: React.ReactNode;
}

const {Content} = Layout;

const LayoutPage = ({children}: IProps) => {
    return (
        <Layout>
            <Header/>
            <Content className="my-20 mx-12">{children}</Content>
        </Layout>
    );
};

export default LayoutPage;
