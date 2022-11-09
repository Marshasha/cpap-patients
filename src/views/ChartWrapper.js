import React, { useEffect, useRef, useState} from 'react';
import D3Chart from './D3Chart';

const ChartWrapper = ({data}) => {

    const chartArea = useRef(null)
    const [chart, setChart] = useState(null)

    useEffect( () => {
    if (!chart) {
    setChart(new D3Chart(chartArea.current))
    }
    else {
        console.log("update doesnt work")
        }
    }, [chart, data])

    return (
    <div className="chart-area" ref={chartArea}></div>
    )
}

export default ChartWrapper
