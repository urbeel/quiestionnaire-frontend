import React, {useState} from 'react';
import "./css/Registration.css"
import {Alert, Button, Card, Container, Form, Row} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import api from "../http";

const Login = () => {
    const {register, handleSubmit, reset, watch, formState: {errors, isValid}} = useForm(
        {
            mode: "onBlur",
            defaultValues: {
                firstname: null,
                lastname: null,
                phone: null
            }
        }
    );
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const navigate = useNavigate();

    const onSubmit = signupData => {
        refactorSignupData(signupData);
        delete signupData.confirmPassword;
        api.post("/auth/signup", signupData)
            .then((response) => {
                if (response.status === 200) {
                    reset();
                    navigate("/login")
                }
            }).catch((reason => {
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
            }
        ))
    }

    const refactorSignupData = (signupData) => {
        for (let field in signupData) {
            if (!signupData[field] || signupData[field].trim() === "") {
                signupData[field] = null;
            }
        }
    }

    return (
        <Container className={"align-items-center justify-content-center d-flex"} style={{height: "100%"}}>
            <Card className="signup-form">
                <Card.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <img src="/logo.png" className="logo" alt="logo" height={70}/>
                        <Card.Title className="fs-4 text-center m-4">Sign Up</Card.Title>
                        <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                            {alertMessage}
                        </Alert>
                        <Form.Control name="email"
                                      type="text"
                                      maxLength={256}
                                      minLength={2}
                                      placeholder="Email*"
                                      className="mt-2"
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
                                      })}/>
                        {errors?.email && <Form.Text className="text-danger">{errors?.email.message}</Form.Text>}
                        <Form.Control name="password"
                                      type="password"
                                      placeholder="Password*"
                                      className="mt-2"
                                      {...register("password", {
                                          required: "Password is required!",
                                          minLength: {
                                              value: 6,
                                              message: "Min length of password is 6!"
                                          },
                                          maxLength: {
                                              value: 16,
                                              message: "Max length of password is 16!"
                                          }
                                      })}/>
                        {errors.password &&
                            <Form.Text className="text-danger">{errors.password.message}</Form.Text>}
                        <Form.Control name="confirm-password"
                                      type="password"
                                      placeholder="Confirm Password*"
                                      className="mt-2"
                                      {...register("confirmPassword", {
                                          required: "Confirm password!",
                                          minLength: {
                                              value: 6,
                                              message: "Min length of password is 6!"
                                          },
                                          maxLength: {
                                              value: 16,
                                              message: "Max length of password is 16!"
                                          },
                                          validate: (value => {
                                              if (watch("password") !== value) {
                                                  return "Your passwords do no match";
                                              }
                                          })
                                      })}/>
                        {errors.confirmPassword &&
                            <Form.Text className="text-danger">{errors.confirmPassword.message}</Form.Text>}
                        <Form.Control name="firstname"
                                      type="text"
                                      placeholder="First Name"
                                      className="mt-2"
                                      {...register("firstname", {
                                          maxLength: {
                                              value: 50,
                                              message: "Max length of first name is 50!"
                                          }
                                      })}/>
                        {errors.firstname &&
                            <Form.Text className="text-danger">{errors.firstname.message}</Form.Text>}
                        <Form.Control name="lastname"
                                      type="text"
                                      placeholder="Last Name"
                                      className="mt-2"
                                      {...register("lastname", {
                                          maxLength: {
                                              value: 50,
                                              message: "Max length of last name is 50!"
                                          }
                                      })}/>
                        {errors.lastname &&
                            <Form.Text className="text-danger">{errors.lastname.message}</Form.Text>}
                        <Form.Control name="phone"
                                      type="text"
                                      placeholder="Phone Number"
                                      className="mt-2"
                                      {...register("phone", {
                                          maxLength: {
                                              value: 16,
                                              message: "Max length of phone number is 16!"
                                          }
                                      })}/>
                        {errors.phone && <Form.Text className="text-danger">{errors.phone.message}</Form.Text>}
                        <Button
                            type="submit"
                            variant="primary"
                            className="form-control mt-2"
                            disabled={!isValid}
                            style={{marginTop: 20}}>
                            SIGN UP
                        </Button>
                    </Form>
                    <Row className="d-flex justify-content-center">
                         <span className="text-center mt-3">Already have account? <Link
                             to={"/login"}><strong>Log in</strong></Link></span>
                    </Row>
                </Card.Body>


            </Card>
        </Container>
    );
};

export default Login;