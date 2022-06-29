import React, {useState} from 'react';

const edfdecoder = require('edfdecoder');

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
    const [dateHeader, setDateHeader] = useState('')
    const [date, setDate] = useState('')

    const uploadFile = event => { // event reads better than 'e' because a function or a callback
        // could also have an exception as it's first parameter. Changed it for a sake of readability
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

    const extractUsageTime = () => {
        const usageTime = output._header.signalInfo.findIndex(
            ({label}) => label.toLowerCase().indexOf('onduration') > -1
        )

        const dateOfUsage = output._header.signalInfo.findIndex(
            ({label}) => label.toLowerCase().indexOf('date') > -1
        )

        const { labelDate } = output._header.signalInfo[0] // undefined ??
        const date = output._physicalSignals[dateOfUsage]

        const { label } = output._header.signalInfo[usageTime]
        const signal = output._physicalSignals[usageTime]


        setDateHeader(labelDate)
        setDate(date)

        setHeader(label)
        setMeasure(signal)

        const result = labelDate + ' , ' + date + '\n' + label + ' , ' + signal

        console.log(result); // log result
        download(result, `${label}-${getIsoDate()}.csv`) // save to a file
    }

    const showMaxPressure = () => {
        const maxPressureIndex = output._header.signalInfo.findIndex( // remove signal index hardcode
            ({ label }) => label.toLowerCase().indexOf('maxpress') > -1
        )

        const dateOfMeasure = output._header.signalInfo.findIndex(
            ({label}) => label.toLowerCase().indexOf('date') > -1
        )

        const { labelDate } = output._header.signalInfo[0] // undefined ??
        const date = output._physicalSignals[dateOfMeasure]

        const { label } = output._header.signalInfo[maxPressureIndex]
        const signal = output._physicalSignals[maxPressureIndex]


        setDateHeader(labelDate)
        setDate(date)

        setHeader(label)
        setMeasure(signal)

        const result = labelDate + ' , ' + date + '\n' + label + ' , ' + signal

        console.log(result); // log result
        download(result, `${label}-${getIsoDate()}.csv`) // save to a file
    }

    const printData = () => {
        const result = (output._physicalSignals || [])
            .map((value, index) => {
                const { label } = output._header.signalInfo[ index ]
                return `${label}, ${value.join(',')}` // join columns like a CSV
            })
            .join('\n') // join lines with new line symbol

        //  console.log(result); // log result
        download(result, `result-${getIsoDate()}.csv`) // save to a file
    }

    return (
        <div className="App">
            <h2> Please choose your edf file  </h2>
            <input type='file' onChange={uploadFile} />
            <p>   </p>
            <div>
                <label> Print data </label>
                <button onClick={printData}> Save all data </button>
                <button onClick={showMaxPressure}> Save only a header </button>
                <button onClick={extractUsageTime}> Save usage time </button>
                <label> Header : </label>
                <h2> My configuration is </h2>


                {
                    (output._physicalSignals || []).map((value, index) => {
                        const {label} = output._header.signalInfo[index]
                        return (<>
                            <b>{label}</b>
                            <pre>{value.slice(0, 5).join(',')}...</pre>
                        </>)
                    })
                }

            </div>
        </div>
    )
}