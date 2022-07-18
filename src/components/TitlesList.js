import React, {Component} from "react";
import {Row,Col, Card} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import {useTranslation} from "react-i18next";


export default function TitlesList(props){

    const { t, i18n } = useTranslation();

    return(
        <Container fluid="sm, md">
            <Row className="justify-content-sm-center">
                {props.labels.map((label, index) => (

                    <Col key={index} lg="auto">
                        <Card style={{ width: '9rem' , height : '6rem'}}>{t(label)}</Card>
                    </Col>))}
            </Row>
        </Container>

    )
}






