import React, {useEffect, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {useForm} from "react-hook-form";
import api from "../http";
import FieldForm from "./FieldForm";

const AddFieldModal = (props) => {
    const {register, handleSubmit, setError, reset, formState: {errors}} = useForm();
    const [isValidOptions, setIsValidOptions] = useState(true);

    useEffect(() => {
        reset();
        setIsValidOptions(true);
    }, [props.showModal])

    const handleCloseModal = () => {
        props.setShowModal(false);
    }

    const handleSaveField = (field) => {
        if (field.options) {
            field.options = parseOptionsStr(field.options);
            if (!field.options) {
                delete field.options;
                setIsValidOptions(false);
                return;
            }else {
                setIsValidOptions(true);
            }
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
            if (optionsStr && !optionsStr.isEmpty) {
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
                    isValidOptions={isValidOptions}
                    setIsValidOptions={setIsValidOptions}
                    parseOptionsStr={parseOptionsStr}
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