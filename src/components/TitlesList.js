import React, {Component, useEffect, useState} from "react";
import {Row,Col, Card} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import {useTranslation} from "react-i18next";
import {LABELS_LIST} from "../constants/constants";



export default function TitlesList(props){


    const { t, i18n } = useTranslation();
    const [labelList, setLabelList] = useState(LABELS_LIST)



    return(
        <Container fluid="sm, md">
            <Row className="justify-content-sm-center">
                {labelList.map((label, index) => (

                    <Col key={index} lg="auto">
                        <Card style={{ width: '9rem' , height : '6rem'}}>{t(label)}</Card>

                    </Col>

                ))}
            </Row >
            <Row className="justify-content-sm-center">
                {
                    props.data.map((measure, index)=>(
                        <Col key={index} lg="auto">
                            <Card style={{ width: '9rem' , height : '4rem'}}>{measure}</Card>
                        </Col>
                    ))
                }
            </Row>
        </Container>

    )
}






