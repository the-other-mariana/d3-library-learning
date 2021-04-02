/*
*    main.js
*/

var margin = {top: 10, right: 10, bottom: 100, left:100};
var width = 600;
var height = 400;

var svg = d3.select("#chart-area")
	.append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

d3.json("data/buildings.json").then((data)=> {
    
    console.log("Scales");
	data.forEach((d)=>{
		d.height = parseInt(d.height);
	});
    console.log(data);

    var names = data.map((d) => { return d.name; }) ;

    var x = d3.scaleBand()
        .domain(names)
        .range([0, width])
        .paddingInner(0.2)
        .paddingOuter(0.3);

    var maxHeight = d3.max(data, (d) => { return d.height; });
    console.log(d3.schemeSet3); // list of hex colors

    var y = d3.scaleLinear()
        .domain([maxHeight, 0])
        .range([0, height]);

    var color = d3.scaleOrdinal()
        .domain(names)
        .range(d3.schemeSet3);

    var rects = g.selectAll("rect").data(data);
    rects.enter()
        .append("rect")
            .attr("x", (d) => {
                return x(d.name);
            })
            .attr("y", (d) => {
                return y(d.height);;
            })
            .attr("height", (d) => {
                return height - y(d.height);
            })
            .attr("width", x.bandwidth())
            .attr("fill", (d) => {
                return color(d.name);
            })
            .attr("stroke", "black");

    // bottom axis ticks
    var bottomAxis = d3.axisBottom(x);
    g.append("g")
    .attr("class", "bottom axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(bottomAxis)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-20)");

    // left y axis
    var yAxisCall = d3.axisLeft(y)
        .ticks(5)
	    .tickFormat((d) => { return d + "m"; });

    g.append("g")
    .attr("class", "left axis")
    .call(yAxisCall);
    
    // x axis label
    g.append("text")
    .attr("class", "x axis-label")
    .attr("x", (width / 2))
    .attr("y", height + 140)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(0, -50)")
    .text("The word's tallest buildings");

    // y axis label
    g.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (height / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Height (m)");

}).catch((error)=> {
    console.log(error);
});

