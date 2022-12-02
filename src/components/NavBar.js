import React, {useState} from 'react';
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {logout} from "../service/UserService";

const NavBar = () => {
    const getFullName = () => {
        const fullName = localStorage.getItem("fullName");
        if (fullName) {
            return fullName.trim();
        } else return "Anonymous";
    }

    const [fullName] = useState(getFullName());
    const navigate = useNavigate();

    const isAuth = () => {
        return localStorage.getItem("token") ? true : false;
    }

    const logoutHandler = (e) => {
        logout(navigate);
    }

    const editProfileHandler = (e) => {
        navigate("/profile/edit");
    }

    const changePasswordHandler = (e) => {
        navigate("/profile/change-password")
    }

    return (
        <Navbar bg="white" className="shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/fields">
                    <img src="/logo.png"
                         alt="logo"
                         height={40}
                    />
                </Navbar.Brand>
                <Nav>
                    {isAuth() ? <>
                            <Nav.Link as={Link} to={"/fields"} className="px-3">
                                <strong>Fields</strong>
                            </Nav.Link>
                            <Nav.Link as={Link} to={"/responses"} className="px-3">
                                <strong>
                                    Responses
                                </strong>
                            </Nav.Link>
                            <NavDropdown
                                title={fullName}
                                className="px-3"
                            >
                                <NavDropdown.Item onClick={editProfileHandler}>Edit Profile</NavDropdown.Item>
                                <NavDropdown.Item onClick={changePasswordHandler}>Change Password</NavDropdown.Item>
                                <NavDropdown.Item onClick={logoutHandler}>Log Out</NavDropdown.Item>
                            </NavDropdown>
                        </> :
                        <Nav.Link as={Link} to={"/login"} className="px-3">
                            <strong>
                                Log In
                            </strong>
                        </Nav.Link>
                    }
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavBar;