import {createContext, useState, useEffect, useContext} from "react"
import { useNavigate } from "react-router-dom";

const AuthContext=createContext();

const AuthProvider=(props)=>{
    const navigate=useNavigate()

    const [authToken, setAuthToken]=useState(()=>{
        return localStorage.getItem("token")
    })

    useEffect(()=>{
        if(authToken){
            localStorage.setItem("token", authToken)
        }
        else{
            localStorage.removeItem("token")
        }
    },[authToken])

    const logout=()=>{
        setAuthToken(null)
        localStorage.removeItem("token")
        navigate("/login")
    }
    return (
        <AuthContext.Provider value={{authToken, setAuthToken, logout}}>
            {props.children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=>{
    const context=useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context;
}

export default AuthProvider