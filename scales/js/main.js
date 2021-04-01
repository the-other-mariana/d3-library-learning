/*
*    main.js
*/

var gap = 20;
var width = 40;

var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);

d3.json("data/buildings.json").then((data)=> {
    
    console.log("Scales");
	data.forEach((d)=>{
		d.height = parseInt(d.height);
	});
    console.log(data);

    var names = data.map((d) => { return d.name; }) ;

    var x = d3.scaleBand()
        .domain(names)
        .range([0, 400])
        .paddingInner(0.2)
        .paddingOuter(0.3);

    var maxHeight = d3.max(data, (d) => { return d.height; });
    console.log(d3.schemeSet3); // list of hex colors

    var y = d3.scaleLinear()
        .domain([0, maxHeight])
        .range([0, 400]);

    var color = d3.scaleOrdinal()
        .domain(names)
        .range(d3.schemeSet3);

    var rects = svg.selectAll("circle").data(data);
    rects.enter()
        .append("rect")
            .attr("x", (d) => {
                return x(d.name);
            })
            .attr("y", (d) => {
                return 500 - y(d.height);
            })
            .attr("height", (d) => {
                return y(d.height);
            })
            .attr("width", x.bandwidth())
            .attr("fill", (d) => {
                return color(d.name);
            })
            .attr("stroke", "black");
}).catch((error)=> {
    console.log(error);
});

