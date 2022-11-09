import React from "react";
import {useTranslation} from "react-i18next";
import "./Components.css"

export default function DoctorsGuide (){
    const { t } = useTranslation()

    return (
        <div className="questions-list">
            <h1 className="title">{t('userGuide')}</h1>
            <p>{t('introduction')}</p>
            <h2 className="title">{t('questionD1')}</h2>
            <p>{t('answerD1')}</p>
            <h2 className="title">{t('questionD2')}</h2>
            <p>{t('answerD2')}</p>
            <h2 className="title">{t('questionD3')}</h2>
            <p>{t('answerD3')}</p>
        </div>
    )
}