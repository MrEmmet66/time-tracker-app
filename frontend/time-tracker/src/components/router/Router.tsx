import {BrowserRouter, Route, Routes} from "react-router-dom";

import {PAGES} from "../../constants/pages.constants";
import Index from "../../views/home";
import LoginPage from "../../views/auth/";
import ProfilePage from "../../views/profile";
import UsersPage from "../../views/users/";
import UserVacationsPage from "../../views/vacations";
import TeamsPage from "../../views/teams";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/users" element={<UsersPage/>}/>
                <Route path="/vacations" element={<UserVacationsPage/>}/>
                <Route path={PAGES.HOME} element={<Index/>}/>
                <Route path={PAGES.LOGIN} element={<LoginPage/>}/>
                <Route path={PAGES.PROFILE} element={<ProfilePage/>}/>
                <Route path={PAGES.USERS} element={<UsersPage/>}/>
                <Route path={PAGES.TEAMS} element={<TeamsPage/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
