import React, {useEffect} from 'react';
import {Form, FormGroup} from "react-bootstrap";

const DisplayField = (props) => {
    const field = props.field;
    const register = props.register;
    const setValue = props.setValue;
    const index = props.index;
    const errors = props.errors;

    useEffect(() => {
        setValue(`fieldAnswers.${index}.fieldId`, field.id);
    }, [])

    const getCheckboxLabel = () => {
        if (field.isRequired) {
            return <span className="text-secondary">
                {field.label}
                <span style={{color: "red", marginLeft: 1}}>*</span>
            </span>
        }
    }

    const displayInputElement = () => {
        switch (field.type) {
            case "Single line text":
                return <Form.Control
                    required={field.isRequired}
                    {...register(`fieldAnswers.${index}.value`, {required: field.isRequired})}
                />;
            case "Multiline text":
                return <Form.Control
                    required={field.isRequired}
                    as="textarea"
                    rows={5}
                    {...register(`fieldAnswers.${index}.value`, {required: field.isRequired})}
                />
            case "Radio button":
                return <>
                    {
                        field.options.map((option, i) =>
                            <Form.Check
                                type="radio"
                                key={i}
                                label={option}
                                value={option}
                                required={field.isRequired}
                                name={field.label}
                                {...register(`fieldAnswers.${index}.value`, {required: field.isRequired})}
                            />
                        )}
                </>
            case "Checkbox":
                return <Form.Check
                    type="checkbox"
                    label={getCheckboxLabel()}
                    {...register(`fieldAnswers.${index}.value`, {required: field.isRequired})}
                />;
            case "Combobox":
                return <Form.Select
                    required={field.isRequired}
                    defaultValue={""}
                    {...register(`fieldAnswers.${index}.value`, {required: field.isRequired})}
                >
                    <option value="" disabled selected hidden>Select option</option>
                    {(field.options && field.options.length !== 0) && field.options.map((option, i) =>
                        <option key={i}>{option}</option>
                    )}
                </Form.Select>
                    ;
            case "Date":
                return <Form.Control
                    required={field.isRequired}
                    type={"date"}
                    {...register(`fieldAnswers.${index}.value`, {required: field.isRequired})}
                />;
            default:
                return null;
        }
    }

    return (
        <FormGroup className="mb-3">
            {field.type !== "Checkbox" &&
                <Form.Label className="text-secondary">
                    {field.label}
                    {field.isRequired && <span style={{color: "red", marginLeft: 1}}>*</span>}
                </Form.Label>
            }
            {displayInputElement()}
        </FormGroup>
    );
};

export default DisplayField;