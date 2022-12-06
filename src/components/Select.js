import React, {useEffect} from 'react';
import {Form} from "react-bootstrap";

const Select = (props) => {
    const fieldTypes = props.fieldTypes;
    const defaultType = props.defaultType;
    const register = props.register;
    const errors = props.errors;
    const handleShowOptions = props.handleShowOptions;

    useEffect(() => {
        handleShowOptions(strToEnum(props.defaultType));
    }, [])

    const strToEnum = (str) => {
        if (str) {
            return str.replaceAll(' ', '_').toUpperCase();
        } else {
            return null;
        }
    }

    return (
        (fieldTypes && fieldTypes.length !== 0) &&
        <>
            <Form.Select
                defaultValue={strToEnum(defaultType)}
                {...register("type", {onChange: (e) => handleShowOptions(e.target.value)})}
            >
                {fieldTypes.map((type, i) =>
                    <option key={i + type} value={strToEnum(type)}>{type}</option>
                )}
            </Form.Select>
            {errors.type && <Form.Text style={{color: "red"}}>This field is required</Form.Text>}
        </>
    );
};

export default Select;