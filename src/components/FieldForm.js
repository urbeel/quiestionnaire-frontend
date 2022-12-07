import React, {useState} from 'react';
import {Col, Form, FormGroup, Modal, Row} from "react-bootstrap";
import Select from "./Select";

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
        const isValidOptions = props.isValidOptions;
        const setIsValidOptions = props.setIsValidOptions;
        const parseOptionsStr = props.parseOptionsStr;

        const handleShowOptions = (type) => {
            if (type === "COMBOBOX" || type === "RADIO_BUTTON") {
                setShowOptions(true);
            } else {
                setShowOptions(false);
            }
        }

        const checkValidityOptions = (e) => {
          const options = e.target.value;
          const optionsNew=parseOptionsStr(options);
          if (optionsNew) {
              setIsValidOptions(true);
          }else {
              setIsValidOptions(false);
          }
        }

        return (
            <Modal.Body>
                <FormGroup as={Row} className="mb-2">
                    <Form.Label column sm="2">Label<span style={{color: "red"}}>*</span></Form.Label>
                    <Col sm={8}>
                        <Form.Control
                            type="text"
                            placeholder="Enter label"
                            {...register("label", {
                                required: "Label is required",
                                maxLength:{
                                    value:100,
                                    message:"Max length of label is 100 characters"
                                },
                                minLength:{
                                    value:1,
                                    message:"Min length of label is 1 character"
                                }
                            })}
                        />
                    </Col>
                    {errors.label && <Form.Text style={{color: "red"}}>{errors.label.message}</Form.Text>}
                </FormGroup>
                <FormGroup as={Row} className="mb-2">
                    <Form.Label column sm="2">Type<span style={{color: "red"}}>*</span></Form.Label>
                    <Col sm="8">
                        {props.field ?
                            <Select
                                fieldTypes={fieldTypes}
                                defaultType={props.field.type}
                                register={register}
                                errors={errors}
                                handleShowOptions={handleShowOptions}
                            />
                            :
                            <Select
                                fieldTypes={fieldTypes}
                                register={register}
                                errors={errors}
                                handleShowOptions={handleShowOptions}
                            />
                        }

                    </Col>
                </FormGroup>
                {
                    showOptions && <FormGroup as={Row} className="mb-2">
                        <Form.Label column sm="2">Options<span style={{color: "red"}}>*</span></Form.Label>
                        <Col sm="8">
                            <Form.Control
                                as={"textarea"}
                                rows={"5"}
                                placeholder="Enter options"
                                {...register("options", {
                                    required: "Options is required",
                                    onChange: (e) => {checkValidityOptions(e)},
                                })}
                            />
                        </Col>
                        {errors.options && <Form.Text style={{color: "red"}}>{errors.options.message}</Form.Text>}
                        {!isValidOptions && <Form.Text style={{color: "red"}}>Invalid options</Form.Text>}
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