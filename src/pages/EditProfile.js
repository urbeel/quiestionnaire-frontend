import React, {useState} from 'react';
import {Alert, Button, Card, Container, Form, FormGroup} from "react-bootstrap";
import NavBar from "../components/NavBar";
import "./css/EditProfile.css"
import {useForm} from "react-hook-form";
import api from "../http";
import {useNavigate} from "react-router-dom";
import {logout} from "../service/UserService";

const EditProfile = () => {
    const {register, handleSubmit, reset, formState: {errors, isValid}} = useForm({
        mode:"onBlur"
    });
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);

    const refactorUserInfo = (userInfo) => {
        for (let field in userInfo) {
            if (!userInfo[field] || userInfo[field].trim() === "") {
                userInfo[field] = null;
            }
        }
    }

    const handleEditProfile = (userinfo) => {
        refactorUserInfo(userinfo);
        api.put(`/users/${localStorage.getItem("userId")}`, userinfo)
            .then((response) => {
                if (response.status===200){
                    reset();
                    logout(navigate);
                }
            }).catch((reason) => {
            console.error(reason);
            const validationErrors = reason.response.data.validationErrors;
            if (validationErrors) {
                let message = "";
                for (const [key, value] of Object.entries(validationErrors)) {
                    message = message + value + "\n";
                }
                setAlertMessage(message);
                setShowAlert(true);
            } else {
                setAlertMessage(reason.response.data.message);
                setShowAlert(true);
            }
        });
    }

    return (
        <div style={{height: "100%"}}>
            <NavBar/>
            <Container className={"align-items-center justify-content-center d-flex"} style={{height: "89%"}}>
                <Card className="login-form p-0">
                    <Card.Header className={"pt-3 bg-white"}>
                        <Card.Title>
                            Edit Profile
                        </Card.Title>
                    </Card.Header>
                    <Card.Body className={"edit-profile-form"}>
                        <Form onSubmit={handleSubmit(handleEditProfile)}>
                            <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                                {alertMessage}
                            </Alert>
                            <FormGroup>
                                <Form.Label className={"text-secondary"}>First Name</Form.Label>
                                <Form.Control
                                    {...register("firstname", {
                                        maxLength: {
                                            value: 50,
                                            message: "Max length of first name is 50!"
                                        }
                                    })}
                                />
                                {errors.firstname && <Form.Text className="text-danger">{errors.firstname.message}</Form.Text>}
                            </FormGroup>
                            <FormGroup>
                                <Form.Label className={"text-secondary"}>Last Name</Form.Label>
                                <Form.Control
                                    {...register("lastname", {
                                        maxLength: {
                                            value: 50,
                                            message: "Max length of last name is 50!"
                                        }
                                    })}
                                />
                                {errors.lastname && <Form.Text className="text-danger">{errors.lastname.message}</Form.Text>}
                            </FormGroup>
                            <FormGroup>
                                <Form.Label className={"text-secondary"}>Email <span
                                    className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    {...register("email", {
                                        required: "Email is required!",
                                        maxLength: {
                                            value: 256,
                                            message: "Max length of email is 256!"
                                        },
                                        minLength: {
                                            value: 3,
                                            message: "Min length of email is 3!"
                                        }
                                    })}
                                />
                                {errors.email && <Form.Text className="text-danger">{errors.email.message}</Form.Text>}
                            </FormGroup>
                            <FormGroup>
                                <Form.Label className={"text-secondary"}>Phone Number</Form.Label>
                                <Form.Control
                                    {...register("phone", {
                                        maxLength: {
                                            value: 16,
                                            message: "Max length of phone number is 16!"
                                        }
                                    })}
                                />
                                {errors.phone && <Form.Text className="text-danger">{errors.phone.message}</Form.Text>}
                            </FormGroup>
                            <Button
                                type="submit"
                                disabled={!isValid}
                                className={"mt-3"}
                                style={{width: 100}}
                            >
                                Save
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default EditProfile;