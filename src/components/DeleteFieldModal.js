import React, {useEffect, useState} from 'react';
import {Button, Modal} from "react-bootstrap";
import api from "../http";

const DeleteFieldModal = (props) => {
    const [label, setLabel] = useState("");

    useEffect(() => {
        if (props.field != null) {
            setLabel(props.field.label);
        }
    }, [props.field])

    const handleClose = () => {
        props.setShowModal(false);
    }

    const deleteBtnHandler = () => {
        api.delete(`/fields/${props.field.id}`)
            .then(() => {
                if (props.fieldsSizeOnPage === 1) {
                    props.setCurrentPage(0);
                }
                props.setReloadFields(!props.reloadFields)
                props.setShowModal(false);
            })
    }

    return (
        <Modal centered show={props.showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{wordBreak:"break-word"}}>Do you wanna delete field {label}?
                <span className="text-danger"> All answers on this field will be deleted.</span>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={deleteBtnHandler}>
                    DELETE
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteFieldModal;