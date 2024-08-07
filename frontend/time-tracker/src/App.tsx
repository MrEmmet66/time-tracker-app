import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Layout} from "antd";
import Index from "./routes";
import LoginPage from "./routes/LoginPage.tsx";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {setAuthStateFromToken} from "./redux/features/authSlice.ts";
import UsersPage from "./routes/users/UsersPage.tsx";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        console.log(token)
        if (token) {
            dispatch(setAuthStateFromToken(token));
        }
    }, []);

  return (
      <BrowserRouter>
          <Layout>
              Layout
              <Routes>
                  <Route path='/' element={<Index/>}/>
                  <Route path='/login' element={<LoginPage/>}/>
                  <Route path='/users' element={<UsersPage/>}/>
              </Routes>
          </Layout>
      </BrowserRouter>
  )
}

export default App
