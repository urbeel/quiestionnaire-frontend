import React, {useEffect, useState} from 'react';
import NavBar from "../components/NavBar";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Card, Col, Container, Form, FormGroup, Row} from "react-bootstrap";
import api from "../http";
import DisplayField from "../components/DisplayField";
import "./css/Questionnaire.css";
import {useForm} from "react-hook-form";

const Questionnaire = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [fields, setFields] = useState([]);
    const {register, setValue, handleSubmit, formState: {errors}} = useForm();

    useEffect(() => {
        api.get(`/fields/active`, {
            params: {
                "questionnaireId": params.id
            }
        }).then(response => {
            setFields(response.data);
        }).catch(reason => {
            console.error(reason);
            navigate("/");
        })
    }, [])

    const questionnaireSaveHandler = (questionnaire) => {
        questionnaire.questionnaireId = params.id;
        api.post("/responses", questionnaire)
            .then(response => {
                if (response.status === 200) {
                    navigate("/questionnaires/success")
                }
            })
            .catch(reason => {
                console.error(reason);
                alert("Error while saving response. Try later.")
            })
    }

    return (
        <div>
            <NavBar/>
            <Container className={"justify-content-center d-flex mt-4"}>
                <Card className="questionnaire-form">
                    <Card.Body>
                        {fields && fields.length !== 0 ?
                            <Form onSubmit={handleSubmit(questionnaireSaveHandler)}>
                                {(fields && fields.length !== 0) && fields.map((field, i) =>
                                    <FormGroup key={i}>
                                        <DisplayField
                                            field={field}
                                            errors={errors}
                                            register={register}
                                            setValue={setValue}
                                            index={i}
                                        />
                                    </FormGroup>
                                )}
                                <Row className="justify-items-end d-flex">
                                    <Col md={6} sm={0}/>
                                    <Col md={6} sm={12} className="justify-content-end d-flex">
                                        <Button type="reset" variant="secondary"
                                                style={{marginTop: 10, marginRight: 15}}>RESET</Button>
                                        <Button type="submit" style={{width: 100, marginTop: 10}}>SUBMIT</Button>
                                    </Col>
                                </Row>
                            </Form>
                            :
                            <Form.Text className="text-center"><h1>Questionnaire is empty</h1></Form.Text>
                        }
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default Questionnaire;