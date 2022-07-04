import React, {Component} from "react";
import {Row,Col, Card} from "react-bootstrap";
import Container from "react-bootstrap/Container";

export default function TitlesList(props){

    return(
        <Container fluid="sm, md">
            <Row className="justify-content-sm-center">
                {props.labels.map((label, index) => (
                    <Col key={index} lg="auto">
                        <Card style={{ width: '8rem' }}>{label.name}</Card>
                    </Col>))}
            </Row>
        </Container>

    )
}






