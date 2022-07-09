import React, {Component, useEffect, useState} from "react";
import {Row,Col, Card} from "react-bootstrap";
import Container from "react-bootstrap/Container";

export default function MeasureList(props){

    console.log("Props were sent " + props.data + " object " + props.data.typeOf)


    return(
        <Container fluid="sm, md">
            <Row className="justify-content-sm-center">
                {props.data.map((measure, index) => (
                    <Col key={index} lg="auto">
                        <Card style={{ width: '8rem' }}>{measure}</Card>
                    </Col>))}
            </Row>
        </Container>

    )
}