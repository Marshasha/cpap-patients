import * as d3 from 'd3';
//import usagetime from "../data/OnDuration.csv";
import usagetime from "../data/62ce8d0d6f99d1493af52d9e-2022-07-18T10 16 11.622Z.csv";

const MARGIN = { TOP : 10, BOTTOM : 50, LEFT : 70, RIGHT : 10}
const WIDTH = 1000 -MARGIN.LEFT -MARGIN.RIGHT;
const HEIGHT = 600 - MARGIN.TOP - MARGIN.BOTTOM;


export default class D3Chart {
    constructor(element){
        const svg = d3.select(element)
            .append("svg")
            .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
            .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
            .append("g")
            .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

        d3.csv(usagetime).then(figures => {

            const max = d3.max(figures, d => {

                if(+d.time<0){

                    d.time=0;
                }
                console.log(d.time)
                return +d.time/60
            })

            const day = figures.map(d => {
                return d.date%1000
            })

            const y = d3.scaleLinear()
                .domain([0, max])
                .range([HEIGHT, 0])
         //   console.log(figures)

            const x = d3.scaleBand()
                .domain(figures.map(d => {
                    return d.time
                }))
                .range([0, WIDTH])
                .padding(0.4)

            const xAxisName = d3.axisBottom(x)
            svg.append("g")
                .attr("transform", `translate(0, ${HEIGHT})`)
                .call(xAxisName)

            const yAxisName = d3.axisLeft(y)
            svg.append("g").call(yAxisName)

            svg.append("text")
                .attr("x", WIDTH / 2)
                .attr("y", HEIGHT + 50)
                .attr("text-anchor", "middle")
                .text("The usage time")

            svg.append("text")
                .attr("x", -HEIGHT/2)
                .attr("y", -40)
                .attr("text-anchor", "middle")
                .text("Hours per night")
                .attr("transform", "rotate(-90)")

            const rects = svg.selectAll("rect")
                .data(figures)

            rects.enter()
                .append("rect")
                .attr("x", d => x(d.time))
                .attr("y", d => y(d.time/60))
                .attr("width", x.bandwidth)
                .attr("height",d => HEIGHT - y(d.time/60))
                .attr("fill", d => {
                    if(d.time/60<4){
                        return "red"
                    }else if(d.time/60 <5 ){
                        return "orange"
                    }else{
                        return "green"
                    }
        })
        });




    }
}