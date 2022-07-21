import React, { useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import * as Duration from "luxon";
import {history} from "../helpers/history";
import {clearMessage} from "../actions/message";
import Measures from "../components/Measures";
import Button from "react-bootstrap/Button";
import Slider from "@mui/material/Slider";
import { styled } from '@mui/material/styles';
import "./Views.css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MuiInput from '@mui/material/Input';



const { DateTime } = require("luxon");
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
    const { t } = useTranslation();
    const [userId, setUserId] = useState('01')
    const [showCSVSave, setShowCSVSave] = useState(false);
    const [file, setFile] = useState('')
    const Input = styled(MuiInput)`
  width: 42px;
`;
    const [value, setValue] = useState(10);

    const dispatch = useDispatch();

    const { user: currentUser } = useSelector(state => state.auth)
    let [channels, setChannels] = useState([0, 0, 0, 0, t('nodata'), 0, 0, 0, 0, 0, 0, value])

    const labelsList = ['days','duration', 'maxpress', 'minpress', 'tgtipap.95', 'tgtepap.max', 'leak.max', 'ahi','cai', 'uai'  ]


    useEffect(() => {
        history.listen(() => {
            dispatch(clearMessage()) // clear message when changing location
        })
    }, [dispatch])

    useEffect(() => {

        if(output){

            showCPAPdata()
        }

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
            setShowCSVSave(currentUser.user.role.includes('ROLE_DOCTOR'))
        }
    }, [userId, currentUser])

    useEffect(()=>{
        console.log("File " + file.length)
    }, [file])



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

    const showCPAPdata = () => {

        let result = ''
        let table = []
        let average = ''

        /**
         * Date settings
         */

        let startingDateString = output._header.localRecordingId
        let startingDate = startingDateString.slice(10,21)
        const format = "dd-LLL-yyyy"

        let date = DateTime.fromFormat(startingDate, format)
        let dateString = date.toString().slice(0,10)
        console.log("DateString " + dateString)

        const signal = output._physicalSignals[0]

        for(let i=0; i<signal.length; i++){
            signal[i] = dateString
            date = date.plus({days : 1})
            dateString = date.toString().slice(0,10)
        }

        result = 'date' + ' , ' + signal + '\n'
        date = date.minus({days : 1}).toString().slice(0,10)
        table.push(date)

        /**
         * Other channels settings
         *
         */

        for(let i=1; i<labelsList.length; i++){

            const channelNumber = output._header.signalInfo.findIndex(
                ({label}) => label.toLowerCase().indexOf(labelsList[i]) > -1
            )

            const  { label } = output._header.signalInfo[channelNumber]

            const signal = output._physicalSignals[channelNumber]

            let labelString = label.replace(/\./g,'').toLowerCase()

            setHeader(label)
            setMeasure(signal)


            result = result + labelString + ',' + signal + '\n'

            /**
             * Setup of days of usage and average usage
             * the signal of Duration, if it's negative => it was not used, if it's positive we calculate the average usage time
             */



            if(i===1){ // the label Duration == 1
                average = calculateAverage(signal)
                let days = countDaysOfUsage(signal)

                console.log("Days of usage " + days + " signal length " + signal.length)
                let ratioOfUsage = Number(days / parseInt(signal.length ) * 100).toFixed(1)
                let ratioOfUsageString = ratioOfUsage + ' % '
                console.log("ratioOfUsageString " + ratioOfUsageString)
                table.push(ratioOfUsageString)

                let dur = Duration.Duration.fromObject( {minutes : average})
                average = dur.toFormat('hh:mm').toString()

                let separator = ','
                let transposedCSV = lib.transpose(result, separator)

                setFile(transposedCSV)

            }else{
                average = calculateAverage(signal)
            }

            table.push(average)
        }

        setMeasures(result)

        setChannels(table)

   /*     let separator = ','
        let transposedCSV = lib.transpose(result, separator)

        setFile(transposedCSV) */

     //   postCPAPdata()


    }

    const saveCPAPdata = () => {

        const fileName = userId

        postCPAPdata()

        download(file, `${fileName}-${getIsoDate()}.csv`) // save to a file
    }

    const postCPAPdata = () => {
        console.log("File is cteated " + file.length)

        axios.post('/api3/upload-csv-file', file)

    }

    const postKeyData = () =>{

        axios.post('/api2/addmeasures', {
            userId : userId,
            date : channels[0],
            ratioOfUsage : channels[1],
            averageUsage : channels[2],
            maxPressure : channels[3],
            minPressure : channels[4],
            pressure95 : channels[5],
            pressureMax : channels[6],
            leakMax : channels[7],
            ahi : channels[8],
            cai : channels[9],
            uai : channels[10],
            mark : value,
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

    function countDaysOfUsage(signal){
        let days = 0

        for(let i=0; i<signal.length; i++){

            let signalValue = parseFloat(signal[i])

            if(signalValue < 0) {
                days = days + 1
            }
        }

        console.log("days " + days)

        return days
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

    const PrettoSlider = styled(Slider)({
        color: '#52af77',
        height: 8,
        '& .MuiSlider-track': {
            border: 'none',
        },
        '& .MuiSlider-thumb': {
            height: 24,
            width: 24,
            backgroundColor: '#fff',
            border: '2px solid currentColor',
            '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                boxShadow: 'inherit',
            },
            '&:before': {
                display: 'none',
            },
        },
        '& .MuiSlider-valueLabel': {
            lineHeight: 1.2,
            fontSize: 12,
            background: 'unset',
            padding: 0,
            width: 32,
            height: 32,
            borderRadius: '50% 50% 50% 0',
            backgroundColor: '#52af77',
            transformOrigin: 'bottom left',
            transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
            '&:before': { display: 'none' },
            '&.MuiSlider-valueLabelOpen': {
                transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
            },
            '& > *': {
                transform: 'rotate(45deg)',
            },
        },
    });


    const handleSliderChange = (event, newValue) => {
            setValue(newValue);
            channels[11] = newValue

    };

    const handleInputChange = (event) => {
        console.log("Value " + value)
            setValue(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
            if (value < 0) {
                setValue(0);
            } else if (value > 100) {
                setValue(100);
            }
    };


    return (
        <div className="App">
            <p className="steps">
                {t('step1')}
                <label className="mx-3"> {t('chooseFile')} </label>
            </p>

            <input type='file' onChange={uploadFile} className="btn btn-outline-success"/>
            <p className="steps">
                {t('step2')}
                <label className="mx-3"> {t('evaluateTherapy')} </label>
            </p>
            <div className="buttons">

                <Box sx={{ width : 300}} className="slider">
                    <Grid item xs>
                        <Slider
                            value={typeof value === 'number' ? value : 0}
                            onChange={handleSliderChange}
                            aria-labelledby="input-slider"
                            style={{color : '#52af77', height: 8,}}
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            value={value}
                            size="small"
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            inputProps={{
                                step: 10,
                                min: 0,
                                max: 100,
                                type: 'number',
                                'aria-labelledby': "linear-slider",
                            }}
                        />
                    </Grid>
                </Box>
            </div>

            <div>
                <label className="label"> {t('myData')} </label>

                <Measures data={channels} />
            </div>

            <p className="steps"> {t('step3')} </p>
            <div className="buttons">
                { showCSVSave && (
                    <Button onClick={printData} variant="outline-success"  className="button"> {t('saveCSV_ALL')} </Button>
                )}
                <Button onClick={saveCPAPdata} variant="outline-success" className="button"> {t('saveSCV_MINE')} </Button>
                <Button onClick={postKeyData}  variant="outline-success" className="button" > {t('saveMyData')}  </Button>


            </div>


        </div>
    )
}