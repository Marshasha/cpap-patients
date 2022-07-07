import React, {useEffect, useState} from 'react';
import MeasureList from "../components/Measure";
import {useParams} from "react-router";
import { useTranslation } from 'react-i18next';
import labels from '../data/jsonplaceholder.labelsList.json';
import TitlesList from "../components/TitlesList";


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
    const [ahi, setAHI] = useState('')
    const [labelList, setLabelList] = useState(labels.listLabels)
    const { t, i18n } = useTranslation();



    const labelsList = ['date','duration', 'maxpress', 'minpress', 'tgtipap.95', 'tgtepap.max', 'leak.max', 'ahi','cai', 'uai'  ]
    const {id} = useParams();


    useEffect(() => {
        console.log( "output " + output)
    }, [output])
    useEffect(()=>{
        console.log("Measures in table" + measures)
    },[measures])
    useEffect(()=>{

        console.log("UploadFile page - Use effect channels " + channels)
    },[channels])

    useEffect(()=>{
        console.log("Headers " + header)
    }, [header])

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
        let arr = []

        for(let i=0; i<labelsList.length; i++){

            const channelNumber = output._header.signalInfo.findIndex(
                ({label}) => label.toLowerCase().indexOf(labelsList[i]) > -1
            )


            const  { label } = output._header.signalInfo[channelNumber]

            const signal = output._physicalSignals[channelNumber]

            setHeader(label)
            setMeasure(signal)

            if(i===0){
                result = label + ' , ' + signal + '\n'
            }else{
                result = result + label + ' , ' + signal + '\n'
            }

          /*  arr.push(label)
            arr.push(",")
            arr.push(signal) */


            average = calculateAverage(signal)
            table.push(average)
        }

        setMeasures(result)

        setChannels(table)

        let separator = ','
        let transposedCSV = lib.transpose(result, separator)

        const fileName = 'userID' // to replace with loggedIn user

        download(transposedCSV, `${fileName}-${getIsoDate()}.csv`) // save to a file
    }




    function writeMapIntoCSV(map){

        console.log([...map.entries()])

        let str = ""

        for(let key of map.keys()){
            str += key+","
        }
        str = str.slice(0,-1)+"\r\n";

        console.log("Map String " + str)

        const [firstValue] = map.values()

        for(let i = 0; i<firstValue.length; i++){
            let row = ""
            for(let key of map.keys()){
                if(map.get(key)[i]){
                    row += map.get(key)[i]+","
                }else{
                    row += ","
                }
            }
            str += row.slice(0, -1)+"\r\n";
        }

        console.log("Final string " + str)
        return str
    }

    function createAndFillTwoArray(row, column, value){

        console.log("Row " + row + " Col " + column + " value " + value)
        return Array.from({length : row}, () => (
            Array.from({length : column}, () => value)))
    }

    function transpose(matrix){
        console.log("Length before " + matrix[0].length)
        for (let i = 0; i < matrix[0].length; i++) {
            for (let j = 0; j < i; j++) {
                console.log("Data cell" + matrix[i][j])
                const temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
        console.log("Length after " + matrix.length)
        return matrix;
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

                signalCum = signalCum;
                countNegative = countNegative +1;

            }else{
                countPositive = countPositive + 1;
                signalCum = signalCum + signalValue;
            }
        }

        const signalAverage = signalCum/countPositive;

        return Number((signalAverage).toFixed(1));
    }

    const showAHI = () => {
       const ahiLabel= output._header.signalInfo.findIndex( // remove signal index hardcode
            ({ label }) => label.toLowerCase().indexOf('ahi') > -1
        )

        const { label } = output._header.signalInfo[ahiLabel]
        console.log("Label " + label)
        const signal = output._physicalSignals[ahiLabel]


        let countPositive = 0;
        let countNegative = 0;
        let ahiCum = 0;


        for(let i=0; i < signal.length; i++){

            let signalValue = parseFloat(signal[i])

            if(signalValue < 0) {
                //     console.log("Signal " + signalValue)
                ahiCum = ahiCum;
                countNegative = countNegative +1;
                //     console.log("AHICUM " + ahiCum + " count Negative" + countNegative)
            }else{
                countPositive = countPositive + 1;
                ahiCum = ahiCum + signalValue;
                //     console.log("AHICUM " + ahiCum + " count Positive " + countPositive)
            }

        }
        //   console.log("AHICUM " + ahiCum + " count Positive " + countPositive)
        const ahiAverage = ahiCum/countPositive;
        setAHI(ahiAverage);
        console.log("ahiAverage " + ahiAverage);
        console.log(" AHI " + ahi)

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
                <button onClick={showAHI}> AHI  </button>


                <h2> {t('myData')} </h2>
                <TitlesList labels={labelList}/>
                <MeasureList data={channels}/>

            </div>
        </div>
    )
}