import React from "react";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import './Views.css'

export default function UserGuide () {

    const { t } = useTranslation()


    return (
        <div className="faq-page">
            <h1 className="title">{t('userGuideChoice')}</h1>
            <div className="choice-container">
                <Link to={'/infoDoctor'} className='nav-link-choice'>
                    {t('doctor')}
                </Link>
                <Link to={'/infoPatient'} className='nav-link-choice'>
                    {t('patient')}
                </Link>
            </div>

        </div>
    );
}
