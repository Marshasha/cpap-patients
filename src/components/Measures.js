import React from "react";
import {useTranslation} from "react-i18next";
import {LABELS_LIST} from "../constants/constants";
import Table from "react-bootstrap/Table";




export default function Measures(props){


    const { t } = useTranslation();

    return(
       <Table responsive>
           <tbody>
           <tr>

               {Array.from(LABELS_LIST).map((label,index)=>(
                   <th key={index} className="table-responsive">{t(label)}</th>
               ))}
           </tr>
           <tr>
               {Array.from(props.data).map((measure, index)=>(
                <th key={index} className="table-responsive">{measure}</th>
               ))}
           </tr>
           </tbody>
       </Table>
    )
}
