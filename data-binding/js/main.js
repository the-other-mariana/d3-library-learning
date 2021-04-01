/*
*    main.js
*/

var data = [25, 20, 15, 10, 5];
width = 40;
height = 200;

var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", 400)
    .attr("height", 400);
    

var rects = svg.selectAll("rect").data(data);

rects.enter()
    .append("rect")
        .attr("x", (d, i) => {
            return width * i  + width * i * 0.5;
        })
        .attr("y", (d) => {
            return height - d;
        })
        .attr("width", width)
        .attr("height", (d) => {
            return d;
        })
        .attr("fill", "red");
