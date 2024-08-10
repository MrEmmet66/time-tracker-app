import {BrowserRouter, Route, Routes} from "react-router-dom";

import Index from "../../views/home";
import LoginPage from "../../views/auth/";
import UsersPage from "../../views/users/";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/users" element={<UsersPage/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
