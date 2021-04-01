/*
*    main.js
*/

var gap = 20;
var width = 40;

var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 1000);

d3.json("data/buildings.json").then((data)=> {
    console.log(data);
    var heights = []
	data.forEach((d)=>{
		d.height = +d.height;
        heights.push(d.height);
	});

    var maxHeight = Math.max.apply(Math, heights);
    console.log(maxHeight);

    var rects = svg.selectAll("circle").data(data);
    rects.enter()
        .append("rect")
            .attr("x", (d, i) => {
                return width * i + width * i * 0.5 + gap;
            })
            .attr("y", (d, i) => {
                return (maxHeight) - d.height;
            })
            .attr("height", (d) => {
                return d.height;
            })
            .attr("width", width)
            .attr("fill", "blue");
}).catch((error)=> {
    console.log(error);
});

