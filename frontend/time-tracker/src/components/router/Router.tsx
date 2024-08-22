import {BrowserRouter, Route, Routes} from "react-router-dom";

import Index from "../../views/home";
import LoginPage from "../../views/auth/";
import UsersPage from "../../views/users/";
import UserVacationsPage from "../../views/vacations";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/users" element={<UsersPage/>}/>
                <Route path="/vacations" element={<UserVacationsPage/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
