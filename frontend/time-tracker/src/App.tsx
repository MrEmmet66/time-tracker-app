import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Layout} from "antd";
import Index from "./routes";

function App() {

  return (
      <BrowserRouter>
          <Layout>
              Layout
              <Routes>
                  <Route path='/' element={<Index/>}/>
              </Routes>
          </Layout>
      </BrowserRouter>
  )
}

export default App
