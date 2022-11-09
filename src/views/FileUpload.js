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

    const labelsList10 = ['days','duration', 'maxpress', 'minpress', 'tgtipap.95', 'tgtipap.max', 'leak.max', 'ahi', 'oai','cai', 'uai'  ]
    const labelsList9 = ['dur', 'pression max', 'pression min', 'therapy press 95', 'therapy press ma', 'leak.max', 'ahi', 'oai','cai', 'uai'  ]

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

    const nbrOfSignals =() => {
        let numberOfSignals = output._header.nbSignals

        return numberOfSignals
    }

    const dateSetting = () => {
        /**
         * Date settings
         */

        let result = ' '

        let startingDateString = output._header.localRecordingId
        let startingDate = startingDateString.slice(10,21)
        const format = "dd-LLL-yyyy"

        let date = DateTime.fromFormat(startingDate, format)
        let dateString = date.toString().slice(0,10)
        console.log("Date Start ", dateString)


        const signal = output._physicalSignals[0]

        for(let i=0; i<signal.length; i++){
            signal[i] = dateString
            date = date.plus({days : 1})
            dateString = date.toString().slice(0,10)
        }

        result = 'date' + ' , ' + signal + '\n'

        date = date.minus({days : 1}).toString().slice(0,10)
        console.log("Date End ", date)


        return result
    }

    const showCPAPdata = () => {

        let result = ''
        let table = []
        let average = ''

        let check = nbrOfSignals()
        console.log(" Check " , check)

        /**
         * Date settings
         */

        let startingDateString = output._header.localRecordingId
        let startingDate = startingDateString.slice(10,21)
        const format = "dd-LLL-yyyy"

        let date = DateTime.fromFormat(startingDate, format)
        let dateString = date.toString().slice(0,10)

        const signal = output._physicalSignals[0]  // to adapt for AirSense9

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

        for(let i=1; i<labelsList10.length; i++){

            const channelNumber = output._header.signalInfo.findIndex(
                ({label}) => label.toLowerCase().indexOf(labelsList10[i]) > -1
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

            switch (i) {
                case 1 :

                    /**
                     * Count the percentage of days when CPAP was used
                     * @type {Ratio of Usage}
                     */

                    let daysNoUsage = countDaysOfNonUsage(signal)
                    let daysTotal = parseInt(signal.length )

                    let days = daysTotal-daysNoUsage
                    let ratioOfUsage = Number(days / daysTotal * 100).toFixed(1)
                    let ratioOfUsageString = ratioOfUsage + ' % '

                    let daysOfUsage = countDaysOfUsage(signal)
                    table.push(daysOfUsage)

                    /**
                     * Count total hours for ResMed algorithm : total hours / total days
                     * @type {number}
                     */
                    let totalHours = countTotalHoursOfUsage(signal)
                    console.log("Total hours " + totalHours)

                    let totalDur = Duration.Duration.fromObject({minutes : totalHours})
                    let totalHourDuration = totalDur.toFormat('hh:mm').toString()
                    console.log("Total hours " + totalHourDuration)

                    /**
                     * Count Average Usage time based on the average result of an array
                     * @type {Average Usage Time}
                     */

                    average = calculateAverage(signal)
                    let dur = Duration.Duration.fromObject( {minutes : average})
                    average = dur.toFormat('hh:mm').toString()
                //    table.push(average)

                    /**
                     * Count the Usage time based on the median result of an array
                     */

                    let usageTimeMedian = median(signal)
                    let durMedian = Duration.Duration.fromObject( {minutes : usageTimeMedian})
                    usageTimeMedian = durMedian.toFormat('hh:mm').toString()
                    table.push(usageTimeMedian)

                    console.log("Median average time  ", usageTimeMedian)

                    console.log("Label " + label + " channel number " + channelNumber + " i " + i + " average " + average)


                    break;
                case 2 :
                case 3 :
                case 4 :
                case 5 :
                    console.log("Case 3, 4, 5 ")
                    average = median(signal)
                    table.push(average)
                    console.log("Label " + label + " channel number " + channelNumber + " i " + i + " average " + average)
                    break;

                case 6 :
                    console.log("Case 6 ")
                    average = median(signal)
                    average = (average*60).toFixed(2) // To get the measurement of Leaks per minute
                    table.push(average)
                    console.log("Label " + label + " channel number " + channelNumber + " i " + i + " average " + average)
                    break;
                case 7 :
                case 8 :
                case 9 :
                case 10:
                    console.log("Case 7, 8, 9, 10 ")
                    average = median(signal)
                    table.push(average)
                    console.log("Label " + label + " channel number " + channelNumber + " i " + i + " average " + average)
                    break;

                }

        }

        setMeasures(result)

        setChannels(table)
        console.log("table " + table)

        let separator = ','
        let transposedCSV = lib.transpose(result, separator)

        setFile(transposedCSV)


    }

    function countTotalHoursOfUsage(signal){
        let hours = 0

        for(let i=0; i<signal.length; i++){

            let hoursPerDay = parseInt(signal[i])

            if(hoursPerDay >= 0){
                hours = hours + hoursPerDay
            }

        }

        return hours
    }

    const saveCPAPdata = () => {

        const fileName = userId

        postCPAPdata()

        download(file, `${fileName}-${getIsoDate()}.csv`) // save to a file
    }

    const postCPAPdata = () => {
        console.log("File is cteated " + file.length)

        axios.post('/api3/upload-csv-file', {
            file
        }).
            then(response => {
                console.log(response.data)
        })

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
            oai : channels[9],
            cai : channels[10],
            uai : channels[11],
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

    function countDaysOfNonUsage(signal){
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

    function countDaysOfUsage(signal){
        let days = 0
        let usageActive = true

        for(let i=0; i<signal.length; i++){

            let signalValue = parseFloat(signal[i])

            if(signalValue < 0) {
                usageActive = false
            }else{
                usageActive = true
            }

            if(usageActive){
                days = days + 1
            }
        }
        return days
    }

    function calculateAverage (signal) {

        let countPositive = 0;
        let countNegative = 0;
        let signalCum = 0;


        for(let i=0; i < signal.length; i++){

            let signalValue = parseFloat(signal[i])

            if(signalValue < 0) {
                countNegative = countNegative +1;
            }else{
                countPositive = countPositive + 1;
                signalCum = signalCum + signalValue;
            }
        }

        const signalAverage = signalCum/countPositive;

        return Number((signalAverage).toFixed(2));
    }

    function median(signal){

        // get first element of each float array
        signal = signal.map(s => s[0]);

        // Sort out negative values
        signal = signal.filter(x => x >= 0);

        // calculate the median of an array
        let mid = Math.floor(signal.length/2)

        let numbers = [...signal].sort((a,b) => a - b);

        let result = signal.length%2 !== 0 ? numbers[mid] : (numbers[mid-1] + numbers[mid]) / 2

        if(isNaN(result)){
            result = -1
        }
        return result.toFixed(2);
    }

    const handleSliderChange = (event, newValue) => {
            setValue(newValue);
            channels[12] = newValue

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

            <p className="steps">
                {t('step3')}
                <label className="mx-3"> {t('pleaseSaveTheData')} </label>
            </p>

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