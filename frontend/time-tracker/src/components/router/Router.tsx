import {BrowserRouter, Route, Routes} from "react-router-dom";

import Index from "../../views/home";
import LoginPage from "../../views/auth/LoginPage";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Index/>}
                />
                <Route
                    path="/login"
                    element={<LoginPage/>}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
