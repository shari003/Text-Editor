/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../state";

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [isLogin, setIsLogin] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    const email = useRef(null);
    const name = useRef(null);
    const password = useRef(null);

    const handleForms = () => {
        setIsLogin(!isLogin);
    }

    const handleLogin = async(ev) => {
        ev.preventDefault();

        const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email.current.value,
                password: password.current.value
            }),
        });

        const loggedIn = await loggedInResponse.json();

        if (loggedIn) {
            dispatch(
              setLogin({
                user: loggedIn.user,
                token: loggedIn.token,
              })
            );
            navigate("/");
          }
        
    }

    const handleRegister = async(ev) => {
        ev.preventDefault();

        const savedUserResponse = await fetch("http://localhost:3001/auth/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name.current.value, 
                email: email.current.value,
                password: password.current.value
            })
        });

        const savedUser = await savedUserResponse.json();
        
        if(savedUser) {
            name.current.value = ""; 
            email.current.value = "";
            password.current.value = "";
            setIsLogin(true);
        }

    }

    return isLogin ? (
        <>
            <form onSubmit={handleLogin} className="md:w-full p-12 bg-black text-white bg-opacity-80 h-[91vh]">
                <div className="md:w-3/12 block mx-auto ">

                    <h1 className="font-bold text-3xl py-4">
                        Sign In
                    </h1>
                    
                    <input type="email" placeholder="Email Address" className="p-4 my-4 w-full bg-gray-800 rounded-md" ref={email} />

                    <input type="password" placeholder="Password" className="p-4 my-4 w-full bg-gray-800 rounded-md" ref={password}/>

                    {errorMsg !== null &&  <p className="text-[#ffedc2] font-bold text-lg py-2">{errorMsg}</p>}

                    <button className="p-3 my-6 bg-[#ffedc2] text-[#191F45] w-full rounded-lg">
                        Sign In
                    </button>

                    
                    <p className="py-4">Don't have an account? <br /><span className="cursor-pointer hover:underline"><span onClick={handleForms}>Sign Up</span></span> Now!</p>
                    
                </div>
            </form>
        </>
    ) : (
        <>
            <form onSubmit={handleRegister} className="md:w-full p-12 bg-black text-white bg-opacity-80 h-[91vh]">
                <div className="md:w-3/12 block mx-auto ">

                    <h1 className="font-bold text-3xl py-4">
                        Register
                    </h1>

                    <input type="text" placeholder="Name" className="p-4 my-4 w-full bg-gray-800 rounded-md" ref={name} />
                    
                    <input type="email" placeholder="Email Address" className="p-4 my-4 w-full bg-gray-800 rounded-md" ref={email} />


                    <input type="password" placeholder="Password" className="p-4 my-4 w-full bg-gray-800 rounded-md" ref={password} />

                    {errorMsg !== null &&  <p className="text-[#ffedc2] font-bold text-lg py-2">{errorMsg}</p>}

                    <button className="p-3 my-6 bg-[#ffedc2] text-[#191F45] w-full rounded-lg">
                        Sign Up
                    </button>

                    
                    <p className="py-4">Already an User? <br /><span className="cursor-pointer hover:underline"><span onClick={handleForms}>Sign In</span></span> Now!</p>
                    
                </div>
            </form>
        </>
    )
}

export default Login