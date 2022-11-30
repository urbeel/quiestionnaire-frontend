import React, {useState} from 'react';
import {Col, Form, FormGroup, Modal, Row} from "react-bootstrap";

const FieldForm = (props) => {
        const [showOptions, setShowOptions] = useState(false);
        const [fieldTypes] = useState(['Single line text',
            'Multiline text',
            'Radio button',
            'Checkbox',
            'Combobox',
            'Date',]);
        const register = props.register;
        const errors = props.errors;

        const handleShowOptions = (e) => {
            if (e.target.value === "COMBOBOX" || e.target.value === "RADIO_BUTTON") {
                setShowOptions(true);
            } else {
                setShowOptions(false);

            }
        }

        const strToEnum = (str) => {
            return str.replaceAll(' ', '_').toUpperCase();
        }

        return (
            <Modal.Body>
                <FormGroup as={Row} className="mb-2">
                    <Form.Label column sm="2">Label<span style={{color: "red"}}>*</span></Form.Label>
                    <Col sm={8}>
                        <Form.Control
                            type="text"
                            placeholder="Enter label"
                            {...register("label", {required: true})}
                        />
                    </Col>
                    {errors.label && <Form.Text style={{color: "red"}}>This field is required</Form.Text>}
                </FormGroup>
                <FormGroup as={Row} className="mb-2">
                    <Form.Label column sm="2">Type<span style={{color: "red"}}>*</span></Form.Label>
                    <Col sm="8">
                        <Form.Select
                            {...register("type", {onChange: handleShowOptions})}
                        >
                            {
                                fieldTypes.map((type, i) =>
                                    <option key={i} value={strToEnum(type)}>{type}</option>
                                )
                            }
                        </Form.Select>
                    </Col>
                    {errors.type && <Form.Text style={{color: "red"}}>This field is required</Form.Text>}
                </FormGroup>
                {
                    showOptions && <FormGroup as={Row} className="mb-2">
                        <Form.Label column sm="2">Options<span style={{color: "red"}}>*</span></Form.Label>
                        <Col sm="8">
                            <Form.Control
                                as={"textarea"}
                                rows={"5"}
                                placeholder="Enter options"
                                {...register("options", {required: true})}
                            />
                        </Col>
                        {errors.options && <Form.Text style={{color: "red"}}>This field is required</Form.Text>}
                    </FormGroup>
                }
                <Row>
                    <Col sm={2}>
                    </Col>
                    <Col sm={10}>
                        <Row>
                            <Col>
                                <Form.Check
                                    label="Required"
                                    {...register("isRequired")}
                                />
                            </Col>
                            <Col>
                                <Form.Check
                                    label="Is Active"
                                    {...register("isActive")}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Modal.Body>
        )
            ;
    }
;

export default FieldForm;