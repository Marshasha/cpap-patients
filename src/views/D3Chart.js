import * as d3 from 'd3';
//import usagetime from "../data/OnDuration.csv";
//import usagetime from "../data/62ceee38ba5772c8f771a526-2022-07-21T08 46 57.848Z.csv";
//import usagetime from "../data/62cd1abf897f6ef0e954b860-2022-08-30T08 18 41.719Z.csv";
//import usagetime from "../data/62cd1abf897f6ef0e954b860-2022-08-30T08 21 34.896Z.csv";
import usagetime from "../data/62cd1abf897f6ef0e954b860-2022-08-30T08 25 15.768Z.csv";


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


                if(+d.duration<0){

                    d.duration=0;
                }

                return +d.duration/60
            })


            const y = d3.scaleLinear()
                .domain([0, max])
                .range([HEIGHT, 0])


            const x = d3.scaleBand()
                .domain(figures.map(d => {
                    return d.duration
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
                .attr("x", d => x(d.duration))
                .attr("y", d => y(d.duration/60))
                .attr("width", x.bandwidth)
                .attr("height",d => HEIGHT - y(d.duration/60))
                .attr("fill", d => {
                    if(d.duration/60<4){
                        return "red"
                    }else if(d.duration/60 <5 ){
                        return "orange"
                    }else{
                        return "green"
                    }
        })
        });




    }
}