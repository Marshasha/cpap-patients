import React, {useEffect, useState} from 'react';
import MeasureList from "../components/Measure";
import {useParams} from "react-router";
import { useTranslation } from 'react-i18next';
import labels from '../data/jsonplaceholder.labelsList.json';
import TitlesList from "../components/TitlesList";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";


const edfdecoder = require('edfdecoder');
const lib = require('csv-transpose')

const decoder = new edfdecoder.EdfDecoder();


function readEdfFile( buff ){
    decoder.setInput( buff );
    decoder.decode();
    return decoder.getOutput();
}


// Function to download data to a file
function download(data, filename, type = 'text/plain') {
    let file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        let a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

const getIsoDate = () => new Date().toISOString()

export default function FileUpload() {

    const [output, setOutput] = useState('')
    const [header, setHeader] = useState('')
    const [measure, setMeasure] = useState('')
    const [measures, setMeasures] = useState([''])
    let [channels, setChannels] = useState([''])
    const [labelList, setLabelList] = useState(labels.listLabels)
    const { t, i18n } = useTranslation();
    const [userId, setUserId] = useState('01')
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const { user: currentUser } = useSelector(state => state.auth)

    const labelsList = ['date','duration', 'maxpress', 'minpress', 'tgtipap.95', 'tgtepap.max', 'leak.max', 'ahi','cai', 'uai'  ]
    const {id} = useParams();


    useEffect(() => {

    }, [output])
    useEffect(()=>{

    },[measures])
    useEffect(()=>{

    },[channels])

    useEffect(()=>{

    }, [header])
    useEffect(()=>{
        if(currentUser){
            setUserId(currentUser.user._id)
        }
    }, [userId])


    const uploadFile = event => {
        const { target: { files } } = event
        const reader = new FileReader();

        if (!files.length) return

        reader.onloadend = loadEvent => {
            const { target: { result } } = loadEvent
            const parsed = readEdfFile(result)
            setOutput( parsed )
            console.log(parsed)
        }

        reader.readAsArrayBuffer(files[0]);

    }

    const saveCPAPdata = () => {

        let result = ''
        let table = []
        let average = ''

        for(let i=0; i<labelsList.length; i++){

            const channelNumber = output._header.signalInfo.findIndex(
                ({label}) => label.toLowerCase().indexOf(labelsList[i]) > -1
            )

            const  { label } = output._header.signalInfo[channelNumber]

            const signal = output._physicalSignals[channelNumber]

            let labelString = label.replace(/\./g,'').toLowerCase()

            setHeader(label)
            setMeasure(signal)

            if(i===0){
                result = labelString + ' , ' + signal + '\n'
            }else{
                result = result + labelString + ' , ' + signal + '\n'
            }

            if(i===1){
                average = calculateAverage(signal)
                average = Number((average/60).toFixed(1) )               // Usage time from minutes to hours Number((signalAverage).toFixed(1))
            }else{
                average = calculateAverage(signal)
            }

            table.push(average)
        }

        setMeasures(result)

        setChannels(table)

        let separator = ','
        let transposedCSV = lib.transpose(result, separator)

        const fileName = userId // to replace with loggedIn user

        download(transposedCSV, `${fileName}-${getIsoDate()}.csv`) // save to a file
    }

    const postKeyData = () =>{
        console.log("Measures " + channels)

        axios.post('/api2/addmeasures', {
            userId : userId,
            date : channels[0],
            averageUsage : channels[1],
            maxPressure : channels[2],
            minPressure : channels[3],
            pressure95 : channels[4],
            pressureMax : channels[5],
            leakMax : channels[6],
            ahi : channels[7],
            cai : channels[8],
            uai : channels[9],
        })
            .then(response => {
                console.log(response.data)
            })
    }


    const printData = () => {
        const result = (output._physicalSignals || [])
            .map((value, index) => {
                const { label } = output._header.signalInfo[ index ]
                return `${label}, ${value.join(',')}` // join columns like a CSV
            })
            .join('\n') // join lines with new line symbol

          console.log(result); // log result
        download(result, `result-${getIsoDate()}.csv`) // save to a file
    }

    function calculateAverage (signal) {

        let countPositive = 0;
        let countNegative = 0;
        let signalCum = 0;


        for(let i=0; i < signal.length; i++){

            let signalValue = parseFloat(signal[i])

            if(signalValue < 0) {

            //    signalCum = signalCum;
                countNegative = countNegative +1;

            }else{
                countPositive = countPositive + 1;
                signalCum = signalCum + signalValue;
            }
        }

        const signalAverage = signalCum/countPositive;

        return Number((signalAverage).toFixed(1));
    }

    const showAll = () => {
        (output._physicalSignals || []).map((value, index) => {

            const {label} = output._header.signalInfo[index]

            const dataString = output._physicalSignals[index]

            return (<>
                <div key={value.id}>
                    <b>{label}</b>
                    <pre>{
                        value.slice(0, 5).join(',')
                    }...</pre>
                    <pre>{
                        dataString.slice(0, 10).join( ' ')
                    }...</pre>
                </div>

            </>)
        })
    }

    return (
        <div className="App">
            <h2> {t('chooseFile')} </h2>
            <input type='file' onChange={uploadFile} />
            <p>   </p>
            <div>

                <button onClick={printData}> Save all data </button>
                <button onClick={saveCPAPdata} > Save CPAP key data </button>
                <button onClick={postKeyData} > {t('saveMyData')}  </button>


                <h2> {t('myData')} </h2>
                <TitlesList labels={labelList}/>
                <MeasureList data={channels}/>

            </div>
        </div>
    )
}