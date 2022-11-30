import React from 'react';
import {useNavigate} from "react-router-dom";
import {logout} from "../service/UserService";
import Login from "../pages/Login";

const RequireAuth = (props) => {
    const navigate = useNavigate();
    if (localStorage.getItem("token")) {
        return props.children;
    } else {
        logout(navigate);
        return <Login/>
    }
};

export default RequireAuth;