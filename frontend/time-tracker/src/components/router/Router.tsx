import {BrowserRouter, Route, Routes} from "react-router-dom";

import Index from "../../views/home";
import LoginPage from "../../views/auth/";
import UsersPage from "../../views/users/";
import UserVacationsPage from "../../views/vacations";
import AllVacationsPage from "../../views/vacations/all";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/users" element={<UsersPage/>}/>
                <Route path="/vacations" element={ <UserVacationsPage/> } />
                <Route path="/vacations/all" element={ <AllVacationsPage/> } />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
