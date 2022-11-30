import React from 'react';
import NavBar from "../components/NavBar";
import {Card, Container} from "react-bootstrap";

const SuccessSavedResponse = () => {
    return (
        <div>
            <NavBar/>
            <Container className={"justify-content-center d-flex mt-4"}>
                <Card className="p-3" style={{width: 500}}>
                    <Card.Body className="text-center">
                        <Card.Title>Thank you!</Card.Title>
                        <Card.Text>Your response was saved.</Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default SuccessSavedResponse;