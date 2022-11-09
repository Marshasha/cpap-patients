import React from 'react';
import ChartWrapper from './ChartWrapper';
import Container from 'react-bootstrap/Container';
import "./Views.css"
import {useTranslation} from "react-i18next";


function UsageTime ()  {

    const { t } = useTranslation();


        return (
            <div className="Charts">
            <div className="warning">
                <p className="warning">{t('warning')}</p>
            </div>
            <Container>
                <ChartWrapper/>
            </Container>

        </div>
        )



}

export default UsageTime;