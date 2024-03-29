import React from "react";
import {useTranslation} from "react-i18next";
import "./Components.css";
import ImageStep1 from "../images/Step1.PNG";

export default function PatientsGuide (){
    const { t } = useTranslation()

    return (
        <div className="questions-list">
            <h1 className="title">{t('userGuidePatients')}</h1>
            <h2>{t('questionP1')}</h2>
            <p>{t('answerP1')}</p>
            <div>
                <img src={'../images/Step1.PNG'} alt={`${t('step1')}`}/>
            </div>
            <h2>{t('questionP2')}</h2>
            <p>{t('answerP2')}</p>
            <h2>{t('questionP3')}</h2>
            <p>{t('answerP3')}</p>
        </div>
    )
}