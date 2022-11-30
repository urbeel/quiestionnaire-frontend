import React, {useEffect, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {useForm} from "react-hook-form";
import api from "../http";
import FieldForm from "./FieldForm";

const EditFieldModal = (props) => {

    const {register, handleSubmit, reset, formState: {errors}} = useForm({
        defaultValues:props.field
    });

    useEffect(()=>{
        reset(props.field);
    },[])

    const handleCloseModal = () => {
        reset();
        props.setShowModal(false);
    }

    const handleEditField = (field) => {
        field.options=parseOptionsStr(field.options);
        field.questionnaireId = localStorage.getItem("questionnaireId");
        api.put( `/fields/${props.field.id}`, field).then((response) => {
            if (response.status === 200) {
                props.setReloadFields(!props.reloadFields);
                handleCloseModal();
            }
        }).catch((reason) => {
            alert("Error while saving field!");
            console.log(reason);
        })
    }

    const parseOptionsStr = (optionsStr) => {
        if (typeof optionsStr !== 'undefined' && !optionsStr && !optionsStr.trim().isEmpty()) {
            const options = optionsStr.split('\n');
            return options.map(elem => elem.trim()).filter(elm => elm);
        } else {
            return null;
        }
    }

    return (
        <Modal show={props.showModal} centered onHide={handleCloseModal}>
            <Form onSubmit={handleSubmit(handleEditField)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Field</Modal.Title>
                </Modal.Header>
                <FieldForm
                    register={register}
                    errors={errors}
                    field = {props.field}
                />
                <Modal.Footer>
                    <Button variant="light" onClick={handleCloseModal}>
                        CANCEL
                    </Button>
                    <Button variant="primary" type="submit">
                        Edit
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditFieldModal;