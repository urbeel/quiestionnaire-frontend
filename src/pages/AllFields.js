import React, {useEffect, useState} from 'react';
import NavBar from "../components/NavBar";
import {Button, Card, Col, Container, Form, Pagination, Row, Table} from "react-bootstrap";
import {TiPlus} from "react-icons/ti";
import {RiDeleteBin5Fill} from "react-icons/ri";
import {TbEdit} from "react-icons/tb";
import api from "../http";
import AddFieldModal from "../components/AddFieldModal";
import EditFieldModal from "../components/EditFieldModal";
import DeleteFieldModal from "../components/DeleteFieldModal";

const AllFields = () => {
    const [fields, setFields] = useState(null);
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalSize, setTotalSize] = useState(0);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reloadFields, setReloadFields] = useState(false);
    const [selectedField, setSelectedField] = useState(null);

    useEffect(() => {
        api.get("/fields/size", {
            params: {"questionnaireId": localStorage.getItem("questionnaireId")}
        }).then((response) => {
            setTotalSize(response.data);
            setPageCount(Math.floor(totalSize / pageSize) + 1)
        })
        api.get("/fields", {
            params: {
                "size": pageSize,
                "page": page,
                "questionnaireId": localStorage.getItem("questionnaireId")
            }
        })
            .then((response) => {
                setFields(response.data);
            })
    }, [page, pageSize, reloadFields]);

    const pageNextClickHandler = () => {
        if (page !== pageCount - 1) {
            setPage(page + 1);
        }
    }

    const pagePrevClickHandler = () => {
        if (page !== 0) {
            setPage(page - 1);
        }
    }

    const changePageSizeHandler = (e) => {
        const val = Math.round(e.target.value / 10) * 10;
        if (val >= 10 && val <= 50) {
            setPageSize(val);
        }
    }

    const calculateLeftBound = () => {
        const maxIndexOnPage = (page + 1) * pageSize;
        if (maxIndexOnPage > totalSize) return totalSize;
        return maxIndexOnPage;
    }

    return (
        <div>
            <NavBar/>
            <Container>
                <Card className="mt-4">
                    <Card.Header style={{background: "white"}}>
                        <Row>
                            <Col className="d-flex align-items-center">
                                <Card.Title style={{marginBottom: 0}}>Fields
                                </Card.Title>
                            </Col>
                            <Col className="text-end">
                                <Button onClick={() => {
                                    setShowCreateModal(true);
                                }}>
                                    <TiPlus/>
                                    ADD FIELD
                                </Button>
                            </Col>
                        </Row>
                    </Card.Header>
                    {(fields && fields.length !== 0) ?
                        <Card.Body>
                            <Table striped hover>
                                <thead>
                                <tr>
                                    <th>Label</th>
                                    <th>Type</th>
                                    <th>Required</th>
                                    <th>Is Active</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {fields.map((field, i) => {
                                    return (<tr key={field.id}>
                                        <td>{field.label}</td>
                                        <td>{field.type}</td>
                                        <td>{field.isRequired.toString()}</td>
                                        <td>{field.isActive.toString()}</td>
                                        <td align="right">
                                            <Button
                                                variant="link"
                                                onClick={() => {
                                                    setSelectedField(field);
                                                    setShowEditModal(true);
                                                }}
                                            >
                                                <TbEdit size={"20"}/>
                                            </Button>
                                            <Button onClick={() => {
                                                setSelectedField(field);
                                                setShowDeleteModal(true);
                                            }}
                                                    style={{marginRight: 15}}
                                                    variant="link"
                                            >
                                                <RiDeleteBin5Fill size={"20"}/>
                                            </Button>
                                        </td>
                                    </tr>)
                                })}
                                </tbody>
                            </Table>
                            <Row>
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
                                        defaultValue={pageSize}
                                        style={{width: 70}}
                                        onChange={changePageSizeHandler}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                        : <Card.Body>
                            <h1 className={"text-center my-5"}>No fields</h1>
                        </Card.Body>}
                </Card>
            </Container>
            <AddFieldModal
                showModal={showCreateModal}
                setShowModal={setShowCreateModal}
                setReloadFields={setReloadFields}
                reloadFields={reloadFields}
            />
            <EditFieldModal
                showModal={showEditModal}
                setShowModal={setShowEditModal}
                setReloadFields={setReloadFields}
                reloadFields={reloadFields}
                field={selectedField}
            />
            <DeleteFieldModal
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                setReloadFields={setReloadFields}
                reloadFields={reloadFields}
                field={selectedField}
            />
        </div>
    );
};

export default AllFields;