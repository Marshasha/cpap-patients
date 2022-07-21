import React, {useEffect, useState} from 'react'

import {useTranslation} from "react-i18next";
import axios from "axios";
import Table from "react-bootstrap/Table";
import {useSelector} from "react-redux";
import {LABELS_LIST} from "../constants/constants";



export default function DoctorsBoard(){

    const [measureslist, setMeasuresList ] = useState([])
    const [patients, setPatients] = useState([])
    const [list, setList] = useState([])
    const { user: currentUser } = useSelector(state => state.auth)

    const { t } = useTranslation();

    useEffect(()=>{

        axios.get('/api2/getMeasures')
            .then(response =>{
                setMeasuresList(response.data)
            })


    }, [])

    useEffect(()=>{

    axios.get('/api/users/patients', {headers : {"Authorization" : `Bearer ${currentUser.token}`} })
        .then(response =>{
            setPatients(response.data)
            console.log("Data from 3090 " + JSON.stringify(response.data))

        })

    }, [])

    useEffect(()=>{

        let joinedNamesAndMeasures = []

        async function mergeData(){

            const infoString = t('nodata')


            for(let i=0; i<patients.length; i++){
                let key = patients[i]._id
                console.log("Key " + patients[i]._id)

                const userMeasures =  measureslist.find(({ userId}) => userId === key)

                const arr = JSON.stringify(userMeasures)

                console.log("Measures " + arr)

                if(arr){
                    joinedNamesAndMeasures.push({username : patients[i].username, ...userMeasures})


                }else{
                    joinedNamesAndMeasures.push({username : patients[i].username, date : infoString})
                }
            }

            return joinedNamesAndMeasures
        }

     //   console.log("Patients " + patients + " measures " + measureslist)

        if(patients && measureslist){
            mergeData()
            setList(joinedNamesAndMeasures)
            console.log("Data joined " + JSON.stringify(joinedNamesAndMeasures))
        }


    }, [patients, measureslist])


    return (
        <div>
            <h1>{t('patients')}</h1>
            <Table responsive>
                <tbody>
                <tr>
                    <th>Name</th>
                    {Array.from(LABELS_LIST).map((label,index)=>(
                        <th key={index}>{t(label)}</th>
                    ))}
                </tr>
                {Array.from(list).map((measure, index)=>(
                    <tr key={index}>
                        <td>{measure.username}</td>
                        <td>{measure.date}</td>
                        <td style={parseInt(measure.ratioOfUsage) > 70 ? { color : 'green'}:{color: 'red'}}>{measure.ratioOfUsage}</td>
                        <td style={parseInt(measure.averageUsage) > 4 ? { color : 'green'}:{color: 'red'}}>{measure.averageUsage}</td>
                        <td>{measure.maxPressure}</td>
                        <td>{measure.minPressure}</td>
                        <td>{measure.pressure95}</td>
                        <td>{measure.pressureMax}</td>
                        <td>{measure.leakMax}</td>
                        <td>{measure.ahi}</td>
                        <td>{measure.cai}</td>
                        <td>{measure.uai}</td>
                        <td style={parseInt(measure.mark) > 70 ? { color : 'green'}:{color: 'red'}}>{measure.mark}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>

    )
}