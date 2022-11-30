import React, {useState} from 'react';
import "./css/Login.css"
import {Alert, Button, Card, Col, Container, Form, FormCheck, Row} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import api from "../http";
import {login} from "../service/UserService";

const Login = () => {
    const {register, handleSubmit, formState: {errors, isValid}} = useForm({
        mode: "onBlur"
    });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const navigate = useNavigate();

    const onSubmit = data => {
        api.post("/auth/login", data)
            .then(response => {
                login(response.data.jwtToken,
                    response.data.questionnaireId,
                    response.data.userId,
                    response.data.fullName);
                navigate("/fields");
            }).catch((reason) => {
            console.error(reason);
            const fieldErrors = reason.response.data.validationErrors;
            if (!fieldErrors) {
                setAlertMessage(reason.response.data.message);
            } else {
                setAlertMessage(fieldErrors.email)
            }
            setShowAlert(true);
        })
    }

    return (
        <Container style={{height: "100%"}}>
            <Row style={{height: "100%"}} className={"align-items-center justify-content-center d-flex"}>
                <Card className="login-form">
                    <img src="/logo.png" alt="logo" height={70} className="logo"/>
                    <h1 className="fs-4 text-center m-4">Log In</h1>
                    <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                        {alertMessage}
                    </Alert>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Control name="email" className="form-control" type="text" placeholder="Email"
                                      {...register("email", {required: true})}/>
                        {errors.email && <Form.Text className="text-danger">Email is required</Form.Text>}
                        <Form.Control name="password" className="form-control" type="password" placeholder="Password"
                                      {...register("password", {required: true})}/>
                        {errors.password && <Form.Text className="text-danger">Password is required</Form.Text>}
                        <Row style={{marginTop: 20}}>
                            <Col>
                                <FormCheck label={"Remember me"}/>
                            </Col>
                            <Col>
                                <Link style={{textAlign: "right"}} to="#">Forgot
                                    your password?</Link>
                            </Col>
                        </Row>
                        <Button type="submit"
                                className="form-control"
                                disabled={!isValid}
                                style={{marginTop: 10}}>
                            LOG IN
                        </Button>
                    </Form>
                    <span className="text-center mt-4">Don't have account? <Link
                        to={"/signup"}><strong>Sign Up</strong></Link></span>
                </Card>
            </Row>
        </Container>
    );
};

export default Login;