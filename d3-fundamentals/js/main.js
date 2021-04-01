/*
*    main.js
*/
var svg = d3.select("#chart-area").append("svg").attr("width", 400).attr("height", 400);
svg.attr("id", "canvas");
var circle = svg.append("circle").attr("cx", 100).attr("cy", 250).attr("r", 70).attr("fill", "blue");
var rect = svg.append("rect").attr("x", 20).attr("y", 20).attr("width", 20).attr("height", 30).attr("fill","red");

// palying around

var poly = svg.append("polygon")
    .attr("points", "200 20 210 30 180 70 170 45 150 25")
    .attr("fill", "rgb(106, 90, 205)")
    .attr("stroke", "black");

var circle = svg.append("circle")
    .attr("cx", 300)
    .attr("cy", 262)
    .attr("r", 60)
    .attr("fill", "yellow");

var eye1 = svg.append("circle")
    .attr("cx", 280)
    .attr("cy", 250)
    .attr("r", 10)
    .attr("fill", "black");

var eye2 = svg.append("circle")
    .attr("cx", 320)
    .attr("cy", 250)
    .attr("r", 10)
    .attr("fill", "black");

var smile = svg.append("path")
    .attr("d", "M 270 275 A 30 40 -90 0 0 330 275")
    .attr("stroke", "black")
    .attr("stroke-width", 5)
    .attr("fill", "transparent");
