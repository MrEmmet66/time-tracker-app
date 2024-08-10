import { BrowserRouter, Route, Routes } from "react-router-dom";

import Index from "../../views/home";
import LoginPage from "../../views/auth/LoginPage";
import UsersPage from "../../routes/users/UsersPage.tsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
