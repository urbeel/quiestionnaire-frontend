import React, {useEffect, useState} from 'react';
import {Button, Modal} from "react-bootstrap";
import api from "../http";

const DeleteFieldModal = (props) => {
    const [label,setLabel] = useState("");

    useEffect(()=>{
        if (props.field!=null){
            setLabel(props.field.label);
        }
    },[props.field])

    const handleClose = () => {
        props.setShowModal(false);
    }

    const deleteBtnHandler = () => {
        api.delete(`/fields/${props.field.id}`)
            .then(() => {
                props.setReloadFields(!props.reloadFields)
                props.setShowModal(false);
            })
    }

    return (
        <Modal centered show={props.showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Do you wanna delete field {label}?</Modal.Body>
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