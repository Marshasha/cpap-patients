import React from "react";
import {useTranslation} from "react-i18next";
import "./Components.css";
import image_step1 from "../images/File.PNG";

export default function PatientsGuide (){
    const { t } = useTranslation()

    return (
        <div className="questions-list">
            <h1 className="title">{t('userGuide')}</h1>
            <h2 className="title">{t('questionP1')}</h2>
            <p>{t('answerP1')}</p>
            <div>
                <img src={require(image_step1)} alt="step 1 STR.edf"/>
            </div>
            <h2 className="title">{t('questionP2')}</h2>
            <p>{t('answerP2')}</p>
            <h2 className="title">{t('questionP3')}</h2>
            <p>{t('answerP3')}</p>
        </div>
    )
}