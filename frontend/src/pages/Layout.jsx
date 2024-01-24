/* eslint-disable react-hooks/exhaustive-deps */
import { Box, useMediaQuery } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentURL } from "../state/index.js";

const Layout = () => {
    const isNonMobileScreens = useMediaQuery("(min-width: 600px)");
    const dispatch = useDispatch();
    const {pathname} = useLocation();
    useEffect(() => {
        if(pathname.includes('/editor')){
            document.title = "TextEditor - Editor";
        } else if(pathname === '/mydocs') {
            document.title = "TextEditor - Created Documents";
        } else if(pathname === '/') {
            document.title = "TextEditor - Quill";
        }
        if(pathname.includes('/editor')){
            dispatch(setCurrentURL({path: pathname}));
        }
    }, [pathname]);
    return (
        
        <Box display={isNonMobileScreens ? "flex" : "block"} width={"100%"} height={"100%"}>
             <Box flexGrow={1}>
                <Navbar />
                <Outlet />
             </Box>
        </Box>
    )
}

export default Layout