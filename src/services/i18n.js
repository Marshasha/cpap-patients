import i18n from 'i18next';
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import { DEFAULT_LANGUAGE } from "../constants/constants";
import { TranslationEN } from "../translation/en";
import { TranslationFR } from "../translation/fr";


const resources = {
    EN: {
        translation: TranslationEN,
    },
    FR: {
        translation: TranslationFR,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        debug : true,
        compatibilityJSON: 'v3', //  added from https://www.i18next.com/misc/migration-guide
        resources,
        fallbackLng: DEFAULT_LANGUAGE, // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option

        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
