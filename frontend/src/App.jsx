/* eslint-disable no-unused-vars */
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {CssBaseline} from "@mui/material";
import TextEditor from "./pages/TextEditor";
import Layout from "./pages/Layout";
import MyDocs from "./pages/MyDocs";
import LoginPage from "./pages/LoginPage";
import { useSelector } from "react-redux";
import {v4 as uuidV4} from "uuid";

const App = () => {
    const isAuth = Boolean(useSelector((store) => store.token));

    return (
      <BrowserRouter>
        <CssBaseline />
        <Routes>
          <Route element={<Layout />} >
            <Route exact
              path="/editor/:id"
              element={isAuth ? <TextEditor /> : <Navigate to="/" />}
            />
            <Route path="/" element={isAuth ? <Navigate to={`/editor/${uuidV4()}`} /> : <LoginPage />} />
            
            <Route
              path="/mydocs"
              element={isAuth ? <MyDocs /> : <Navigate to="/" />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    )
}

export default App