/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { AppBar, Button, IconButton, InputBase, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import {ArrowDropDownOutlined, Search} from "@mui/icons-material";
import React, { useEffect, useRef, useState } from 'react';
import FlexBetween from "./FlexBetween.jsx";
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { setDocDetails, setLogout } from "../state/index.js";
import { useNavigate } from 'react-router-dom';
import {v4 as uuidV4} from "uuid";

const Navbar = () => {

    const { user, token, currentUrl, collaboratorMode, doc} = useSelector(store => store);
    const { docId, title } = doc;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [showModal, setShowModal] = useState(false);
    const titleRef = useRef(null);
    const collabUserId = useRef(null);

    const [anchorEl, setAnchorEl] = useState(null);
    const isOpen = Boolean(anchorEl);

    const setTitle = () => {

        const setDocTitle = async() => {
            const response = await fetch(
                "http://localhost:3001/doc/setTitle",
                {
                  method: "PATCH",
                  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", },
                  body: JSON.stringify({
                    userId: user._id,
                    docTitle: titleRef.current.value,
                    docId: docId,
                  }),
                }
            );
            const data = await response.json();

            if(data.success){
                dispatch(setDocDetails({docId, docTitle: data.docTitle}));
            }

        }

        setDocTitle();
    }
    
    const handleSignOut = () => {
        dispatch(setLogout());
        navigate('/');
    }

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleNew = () => {
        navigate(`/editor/${uuidV4()}`);
        handleClose();
    }

    const handlePrevious = () => {
        navigate(`${currentUrl}`);
        handleClose();
    }

    const handleCollabUser = () => {

        const addCollaborator = async() => {
            const response = await fetch(
                "http://localhost:3001/doc/add-collaborator",
                {
                  method: "POST",
                  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", },
                  body: JSON.stringify({
                    userId: user._id,
                    collabUserId: collabUserId.current.value,
                    docId: currentUrl.substr(8),

                  }),
                }
            );
            const data = await response.json();
        }

        addCollaborator();

        setShowModal(false);
    }
    
    return (
        <AppBar sx={{
            position: "static",
            background: "none",
            boxShadow: "none",
            backgroundColor: "#191F45"
        }}>
            <Toolbar sx={{justifyContent: "space-between"}}>
                <FlexBetween>
                    <FlexBetween 
                        backgroundColor={"#191F45"}
                        borderRadius={"9px"}
                        gap={"3rem"}
                        p={"0.1rem 1.5rem"}
                    >
                            {pathname.includes('/editor') ? (
                                <>
                                    <FlexBetween 
                                        borderRadius={"9px"}
                                        gap={"1rem"}
                                        p={"0.1rem 1.5rem"}
                                    >
                                        <input placeholder={title === "" ? "Set Title" : title} className='text-[#ffedc2] text-2xl font-bold bg-[#191F45] border-none' ref={titleRef} />

                                        <Button sx={{
                                            color: "#ffedc2",
                                            p: "1px",
                                            border: "1px solid #ffedc2",
                                            "&:hover": {
                                                color: "#191F45",
                                                bgcolor: "#ffedc2"
                                            }
                                        }} onClick={setTitle}>
                                            Set
                                        </Button>
                                    </FlexBetween>
                                </>
                            ) : (
                                <>
                                    <Typography fontWeight={"bold"} fontSize={"1.5rem"} sx={{
                                        color: "#ffedc2"
                                    }}>
                                        <Link to={currentUrl} style={{color: "#ffedc2", textDecoration: "none"}}>
                                            TextEditor
                                        </Link>
                                    </Typography>
                                </>
                            )}
                    </FlexBetween>
                </FlexBetween>

                <FlexBetween gap={"1.5rem"}>
                    {token && 
                        <>  
                            <FlexBetween>
                                <Button onClick={handleClick} sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    textTransform: "none",
                                    gap: "1rem"
                                }}> 
                                    <Typography fontWeight={"500"} fontSize={"1rem"} sx={{
                                        color: "#ffedc2",
                                        borderBottom: pathname.includes('/editor') ? "2px solid #ffedc2" : "none"
                                    }}>
                                        Editor
                                    </Typography>
                                    <ArrowDropDownOutlined  sx={{
                                        color: "#ffedc2",
                                        fontSize: "25px"
                                    }}/>
                                </Button>
                                    <Menu anchorEl={anchorEl} open={isOpen} onClose={handleClose} anchorOrigin={{vertical: "bottom", horizontal: "center"}} >
                                        <MenuItem onClick={handlePrevious}> Previous </MenuItem>
                                        <MenuItem onClick={handleNew}> New Document </MenuItem>
                                    </Menu>
                            </FlexBetween>
                            <Typography fontWeight={"500"} fontSize={"1rem"}>
                                <Link to={'/mydocs'} style={{color: "#ffedc2", textDecoration: "none", borderBottom: pathname==='/mydocs' ? "2px solid #ffedc2" : "none" }}>My Docs</Link>
                            </Typography> 
                            <Typography fontWeight={"500"} fontSize={"1rem"} >
                                { !collaboratorMode && pathname.includes('/editor') && (<button onClick={() => setShowModal(true)} className='text-[#ffedc2] border p-2 rounded-md hover:text-[#191F45] hover:bg-[#ffedc2] cursor-pointer'>
                                        Add Collab
                                    </button>)
                                }
                                {showModal ? (
                                    <>
                                    <div
                                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-black"
                                    >
                                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                        {/*content*/}
                                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[#F3F3F3] outline-none focus:outline-none">
                                            {/*header*/}
                                            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                                <h3 className="text-3xl font-semibold ">
                                                    Add a new user for Collab
                                                </h3>
                                            </div>
                                            {/*body*/}
                                            <div className="relative p-6 flex-auto">
                                            <p className="my-4 text-blueGray-500 text-lg leading-relaxed ">
                                                User ID:
                                                <input className='ml-2 p-2 text-xl bg-slate-200 border border-black rounded-md' type="text" ref={collabUserId} />
                                            </p>
                                            </div>
                                            {/*footer*/}
                                            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                            <button
                                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Close
                                            </button>
                                            <button
                                                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={handleCollabUser}
                                            >
                                                Add User
                                            </button>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                                    </>
                                ) : null}
                            </Typography>
                        </>
                    }
                    {
                        token !== null && (
                            <>
                                <Button onClick={handleSignOut} sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        textTransform: "none",
                                        gap: "1rem",
                                        backgroundColor: "#ffedc2",
                                        color: "#191F45"
                                }}>
                                    <Typography fontWeight={"500"} fontSize={"1rem"} sx={{
                                        color: "#191F45",
                                        "&:hover": {
                                            color: '#ffedc2',
                                        }
                                    }}>
                                        Sign Out     
                                    </Typography>   
                                </Button>
                            </>
                        )
                    }
                    
                </FlexBetween>
            </Toolbar>

        </AppBar>
    )
}

export default Navbar