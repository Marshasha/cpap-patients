import React, {useEffect, useState} from 'react'

import {useTranslation} from "react-i18next";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";


export default function DoctorsBoard(){

    const labelList = ['date','duration', 'maxpress', 'minpress', 'tgtipap95', 'tgtepapmax', 'leakmax', 'ahi','cai', 'uai'  ]

    const [measureslist, setMeasuresList ] = useState([])
    const { t, i18n } = useTranslation();

    useEffect(()=>{
        axios.get('/api/getMeasures')
            .then(response =>{
               setMeasuresList(response.data)
                console.log(response.data)
            })
    }, [])



    return (
        <div>
            <h1>{t('patients')}</h1>
            <Table responsive>
                <tbody>
                <tr>
                    <th>Name</th>
                    {Array.from(labelList).map((label,index)=>(
                        <th key={index}>{t(label)}</th>
                    ))}
                </tr>
                {Array.from(measureslist).map((measure)=>(
                    <tr key={measure._id}>
                        <td>{measure.index}</td>
                        <td>{measure.date}</td>
                        <td className="fa fa-download mr-2 grey-text" aria-hidden="true">{measure.averageUsage}</td>
                        <td>{measure.maxPressure}</td>
                        <td>{measure.minPressure}</td>
                        <td>{measure.pressure95}</td>
                        <td>{measure.pressureMax}</td>
                        <td>{measure.leakMax}</td>
                        <td>{measure.ahi}</td>
                        <td>{measure.cai}</td>
                        <td>{measure.uai}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <MDBTable btn fixed>
                <MDBTableHead class="bg-success bg-gradient text-white">
                    <tr>
                        <th>Name</th>
                        {Array.from(labelList).map((label,index)=>(
                            <th key={index}>{t(label)}</th>
                        ))}
                    </tr>
                </MDBTableHead>
                <MDBTableBody children={measureslist.map((measure)=>(
                    <tr key={measure._id}>
                        <td>{measure.index}</td>
                        <td>{measure.date}</td>
                        <td className="far fa-clock" aria-hidden="true">{measure.averageUsage}</td>
                        <td>{measure.maxPressure}</td>
                        <td>{measure.minPressure}</td>
                        <td>{measure.pressure95}</td>
                        <td>{measure.pressureMax}</td>
                        <td>{measure.leakMax}</td>
                        <td>{measure.ahi}</td>
                        <td>{measure.cai}</td>
                        <td>{measure.uai}</td>
                    </tr>
                ))}/>
            </MDBTable>
        </div>

    )
}