import React, {useState} from 'react';
import NavBar from "../components/NavBar";
import {Alert, Button, Card, Col, Container, Form, FormGroup, Row} from "react-bootstrap";
import {useForm} from "react-hook-form";
import api from "../http";
import {useNavigate} from "react-router-dom";

const ChangePassword = () => {
    const {register, handleSubmit,reset, formState: {errors, isValid}} = useForm({
        mode: "onBlur"
    });
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertVariant, setAlertVariant] = useState("danger");

    const changePasswordHandler = (passwords) => {
        passwords.userId = localStorage.getItem("userId");
        api.patch("/auth/password", passwords)
            .then(res => {
                setAlertVariant("success");
                setAlertMessage("Password was successfully changed.")
                setShowAlert(true);
                reset();
                setTimeout(() => navigate("/fields"), 2000);
            })
            .catch((reason => {
                console.error(reason);
                const fieldErrors = reason.response.data.validationErrors;
                if (!fieldErrors) {
                    setAlertMessage(reason.response.data.message);
                } else {
                    setAlertMessage(fieldErrors.toString())
                }
                setAlertVariant("danger");
                setShowAlert(true);
            }));
    }

    return (
        <div>
            <NavBar/>
            <Container>
                <Row className="justify-content-center d-flex mt-4">
                    <Col md={5}>
                        <Alert variant={alertVariant} show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                            {alertMessage}
                        </Alert>
                    </Col>
                </Row>
                <Row className="align-items-center justify-content-center d-flex">
                    <Card className="p-2 mt-5" style={{width: 400}}>
                        <Card.Header className={"pt-3 bg-white"}>
                            <Card.Title>
                                Change Password
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit(changePasswordHandler)}>
                                <FormGroup>
                                    <Form.Label className={"text-secondary"}>Current Password
                                        <span className="text-danger"> *</span></Form.Label>
                                    <Form.Control
                                        {...register("oldPassword", {
                                            required: "Old password is required!",
                                            minLength: {
                                                value: 6,
                                                message: "Min length of old password is 6!"
                                            },
                                            maxLength: {
                                                value: 16,
                                                message: "Max length of old password is 66!"
                                            }
                                        })}
                                    />
                                    {errors.oldPassword &&
                                        <Form.Text className="text-danger">{errors.oldPassword.message}</Form.Text>}
                                </FormGroup>
                                <FormGroup>
                                    <Form.Label className={"text-secondary"}>New Password
                                        <span className="text-danger"> *</span></Form.Label>
                                    <Form.Control
                                        {...register("password", {
                                            required: "New password is required!",
                                            minLength: {
                                                value: 6,
                                                message: "Min length of new password is 6!"
                                            },
                                            maxLength: {
                                                value: 16,
                                                message: "Max length of new password is 16!"
                                            }
                                        })}
                                    />
                                    {errors.password &&
                                        <Form.Text className="text-danger">{errors.password.message}</Form.Text>}
                                </FormGroup>
                                <FormGroup>
                                    <Form.Label className={"text-secondary"}>Confirm New Password
                                        <span className="text-danger"> *</span></Form.Label>
                                    <Form.Control
                                        {...register("confirmPassword", {
                                            required: "Confirm new password!",
                                            minLength: {
                                                value: 6,
                                                message: "Min length of password is 6!"
                                            },
                                            maxLength: {
                                                value: 16,
                                                message: "Max length of password is 16!"
                                            }
                                        })}
                                    />
                                    {errors.confirmPassword &&
                                        <Form.Text className="text-danger">{errors.confirmPassword.message}</Form.Text>}
                                </FormGroup>
                                <Button
                                    type="submit"
                                    disabled={!isValid}
                                    className={"mt-3"}
                                    style={{width: 100}}
                                >
                                    Change
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Row>
            </Container>
        </div>
    );
};

export default ChangePassword;