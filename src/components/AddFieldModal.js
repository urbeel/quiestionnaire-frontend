import React, {useEffect} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {useForm} from "react-hook-form";
import api from "../http";
import FieldForm from "./FieldForm";

const AddFieldModal = (props) => {
    const {register, handleSubmit, reset, formState: {errors}} = useForm();

    useEffect(() => {
        reset();
    }, [props.showModal])

    const handleCloseModal = () => {
        props.setShowModal(false);
    }

    const handleSaveField = (field) => {
        if (field.options) {
            field.options = parseOptionsStr(field.options);
        }
        field.questionnaireId = localStorage.getItem("questionnaireId");
        api.post("/fields", field).then((response) => {
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
        if (typeof optionsStr !== 'undefined') {
            optionsStr = optionsStr.trim();
            if (!optionsStr.isEmpty) {
                const options = optionsStr.split('\n');
                return options.map(elem => elem.trim()).filter(elm => elm);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    return (
        <Modal show={props.showModal} centered onHide={handleCloseModal}>
            <Form onSubmit={handleSubmit(handleSaveField)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Field</Modal.Title>
                </Modal.Header>
                <FieldForm
                    register={register}
                    errors={errors}
                />
                <Modal.Footer>
                    <Button variant="light" onClick={handleCloseModal}>
                        CANCEL
                    </Button>
                    <Button variant="primary" type="submit">
                        SAVE
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddFieldModal;