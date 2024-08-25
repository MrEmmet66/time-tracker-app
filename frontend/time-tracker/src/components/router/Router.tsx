import {BrowserRouter, Route, Routes} from "react-router-dom";

import {PAGES} from "../../constants/pages.constants";
import Index from "../../views/home";
import LoginPage from "../../views/auth/";
import ProfilePage from "../../views/profile";
import UsersPage from "../../views/users/";
import UserVacationsPage from "../../views/vacations";
import AllVacationsPage from "../../views/vacations/all";
import TeamsPage from "../../views/teams";
import CalendarPage from "../../views/calendar";
import {PAGES} from "../../constants/pages.constants.ts";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={PAGES.ALL_VACATIONS} element={ <AllVacationsPage/> } />
                <Route path={PAGES.VACATIONS} element={<UserVacationsPage/>}/>
                <Route path={PAGES.HOME} element={<Index/>}/>
                <Route path={PAGES.LOGIN} element={<LoginPage/>}/>
                <Route path={PAGES.PROFILE} element={<ProfilePage/>}/>
                <Route path={PAGES.USERS} element={<UsersPage/>}/>
                <Route path={PAGES.TEAMS} element={<TeamsPage/>}/>
                <Route path={PAGES.CALENDAR} element={<CalendarPage/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
