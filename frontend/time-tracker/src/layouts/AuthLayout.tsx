import React from "react";
import {Layout} from "antd";
import {useSelector} from "react-redux";

import {RootState} from "../redux/store";
import {useNavigate} from "react-router-dom";
import {PAGES} from "../constants/pages.constants";

interface IProps {
    children: React.ReactNode;
}

const {Content} = Layout;

const AuthLayout = ({children}: IProps) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const navigate = useNavigate();

    if (user) {
        navigate(PAGES.HOME);
    }

    return (
        <Layout>
            <Content className="my-20 mx-12">{children}</Content>
        </Layout>
    );
};

export default AuthLayout;
