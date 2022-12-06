import React, {useEffect, useState} from 'react';
import NavBar from "../components/NavBar";
import {Button, Card, Col, Container, Form, Pagination, Row, Table} from "react-bootstrap";
import api from "../http";
import moment from "moment";
import SockJsClient from 'react-stomp';
import {Link} from "react-router-dom";

const AllResponses = () => {
        const [fields, setFields] = useState(null);
        const [responses, setResponses] = useState(null);
        const [page, setPage] = useState(0);
        const [pageCount, setPageCount] = useState(1);
        const [pageSize, setPageSize] = useState(10);
        const [totalSize, setTotalSize] = useState(0);
        const [reloadPage, setReloadPage] = useState(false);

        useEffect(() => {
                api.get("/responses/size", {
                    params: {"questionnaireId": localStorage.getItem("questionnaireId")}
                }).then((response) => {
                    const fieldsSize = response.data;
                    setTotalSize(fieldsSize);
                    if (fieldsSize % pageSize === 0) {
                        setPageCount(Math.floor(response.data / pageSize));
                    } else {
                        setPageCount(Math.floor((response.data / pageSize) + 1));
                    }
                })
                api.get("/fields", {
                    params: {
                        "questionnaireId": localStorage.getItem("questionnaireId")
                    }
                })
                    .then((response) => {
                        if (response.status === 200) {
                            setFields(response.data.sort(function (a, b) {
                                return a.id - b.id;
                            }));
                            console.log(response.data);
                            api.get("/responses", {
                                params: {
                                    "size": pageSize,
                                    "page": page,
                                    "questionnaireId": localStorage.getItem("questionnaireId")
                                }
                            }).then(response => {
                                if (response.status === 200) {
                                    setResponses(response.data);
                                }
                            }).catch(reason => {
                                console.error(reason);
                                alert("Error while reading responses. Try later...")
                            })
                        }
                    })
            }, [page, pageSize, reloadPage]
        );

        const getValue = (fieldAnswers, columnIndex) => {
            const fieldAnswer = fieldAnswers.find(fieldAnswer => fieldAnswer.fieldId === fields[columnIndex].id);
            if (typeof fieldAnswer === "undefined") {
                return "N/A";
            }
            if (fieldAnswer && fieldAnswer !== "") {
                const value = fieldAnswer.value;
                if (value && !value.isEmpty) {
                    if (fields[columnIndex].type === "Date") {
                        return moment(value).format("DD MMM yyyy");
                    } else {
                        return value;

                    }
                } else {
                    return "N/A";
                }
            }
        }

        const pagePrevClickHandler = () => {
            if (page !== 0) {
                setPage(page - 1);
            }
        }

        const pageNextClickHandler = () => {
            if (page !== pageCount - 1) {
                setPage(page + 1);
            }
        }

        const calculateLeftBound = () => {
            const maxIndexOnPage = (page + 1) * pageSize;
            if (maxIndexOnPage > totalSize) return totalSize;
            return maxIndexOnPage;
        }

        const changePageSizeHandler = (e) => {
            const val = Math.round(e.target.value / 10) * 10;
            if (val >= 10 && val <= 50) {
                setPageSize(val);
            }
        }

        const authHeader = {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        };

        return (
            <div>
                <SockJsClient
                    url={`${process.env.REACT_APP_API_URL}/ws`}
                    headers={
                        authHeader
                    }
                    topics={['/topic/responses']}
                    onConnect={() => {
                        console.log("Connected!")
                    }}
                    onDisconnect={() => {
                        console.log("Disconnected!")
                    }}
                    onMessage={() => {
                        setReloadPage(!reloadPage);
                    }}
                    debug={false}
                />
                <NavBar/>
                <Container>
                    <Card className="mt-4">
                        <Card.Header style={{background: "white"}}>
                            <Card.Title className="my-2 d-flex align-content-between">
                                <Col>Responses</Col>
                                <Col className="text-end">
                                    <Button as={Link} to={`/questionnaires/${localStorage.getItem("questionnaireId")}`}>
                                        Questionnaire
                                    </Button>
                                </Col>
                            </Card.Title>
                        </Card.Header>
                        {(fields && fields.length !== 0 && responses && responses.length !== 0) ?
                            <Card.Body className="pt-0">
                                <Table style={{tableLayout: "fixed"}} responsive striped hover className="text-center">
                                    <thead>
                                    <tr>
                                        {fields.map((field, i) =>
                                            <th key={field.id} style={{width: 250}}>{field.label}</th>
                                        )}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {responses.map((response, responseIndex) => {
                                        return (<tr key={response.id}>
                                            {fields.map((field, fieldIndex) =>
                                                <td key={field.id} style={{width: 600}}
                                                    className="col-12">{getValue(response.fieldAnswers, fieldIndex)}</td>
                                            )}
                                        </tr>)
                                    })}
                                    </tbody>
                                </Table>
                                <Row className="mt-3">
                                    <Col>{page * pageSize + 1}-{calculateLeftBound()} of {totalSize}</Col>
                                    <Col className="d-flex justify-content-center">
                                        <Pagination>
                                            <Pagination.Prev onClick={pagePrevClickHandler}/>
                                            <Pagination.Item active>{page + 1}</Pagination.Item>
                                            <Pagination.Next onClick={pageNextClickHandler}/>
                                        </Pagination>
                                    </Col>
                                    <Col className="d-flex justify-content-end">
                                        <Form.Control
                                            type="number"
                                            min="10"
                                            step="10"
                                            max="50"
                                            onKeyDown={(e) => {
                                                if (e.key !== "ArrowUp" && e.key !== "ArrowDown") {
                                                    e.preventDefault();
                                                }
                                            }}
                                            defaultValue={pageSize}
                                            style={{width: 70}}
                                            onChange={changePageSizeHandler}
                                        />
                                    </Col>
                                </Row>
                            </Card.Body>
                            : <Card.Body>
                                <h1 className={"text-center my-5"}>No responses</h1>
                            </Card.Body>}
                    </Card>
                </Container>
            </div>
        );
    }
;

export default AllResponses;