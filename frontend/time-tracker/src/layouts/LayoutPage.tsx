import React from "react";
import {Layout} from "antd";
import {useSelector} from "react-redux";

import Header from "../components/headers/Header";
import {RootState} from "../redux/store";
import Sidebar from "../components/sidebar/Sidebar";

interface IProps {
    children: React.ReactNode;
}

const {Content} = Layout;

const LayoutPage = ({children}: IProps) => {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <Layout>
            <Sidebar/>
            <Layout className="bg-gray-50">
                <Header user={user}/>
                <Content className="my-20 mx-12">{children}</Content>
            </Layout>
        </Layout>
    );
};

export default LayoutPage;
