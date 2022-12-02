import React, {useEffect} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {useForm} from "react-hook-form";
import api from "../http";
import FieldForm from "./FieldForm";

const EditFieldModal = (props) => {

    const {register, handleSubmit, reset, formState: {errors}} = useForm({
        defaultValues: props.field
    });

    useEffect(() => {
        reset(props.field);
    }, [props.showModal])

    const handleCloseModal = () => {
        props.setShowModal(false);
    }

    const strToEnum = (str) => {
        return str.replaceAll(' ', '_').toUpperCase();
    }

    const handleEditField = (field) => {
        console.log(field);
        field.type = strToEnum(field.type);
        if (field.options && (field.type === "RADIO_BUTTON" || field.type === "COMBOBOX")) {
            field.options = parseOptionsStr(field.options);
        } else {
            delete field.options;
        }
        field.questionnaireId = localStorage.getItem("questionnaireId");
        console.log(field);
        api.put(`/fields/${props.field.id}`, field).then((response) => {
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
            <Form onSubmit={handleSubmit(handleEditField)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Field</Modal.Title>
                </Modal.Header>
                <FieldForm
                    register={register}
                    errors={errors}
                    field={props.field}
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