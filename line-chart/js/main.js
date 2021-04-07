/*
*    main.js
*/

var margin = { left:80, right:100, top:50, bottom:100 },
    height = 500 - margin.top - margin.bottom, 
    width = 800 - margin.left - margin.right;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + 
        ", " + margin.top + ")");

// Time parser for x-scale
var parseTime = d3.timeParse("%Y");
// For tooltip
var bisectDate = d3.bisector((d) => { return d.year; }).left;

// Scales
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Axis generators
var xAxisCall = d3.axisBottom()
var yAxisCall = d3.axisLeft()
    .ticks(6)
    .tickFormat((d) => { return parseInt(d / 1000) + "k"; });

// Axis groups
var xAxis = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");
var yAxis = g.append("g")
    .attr("class", "y axis")
    
// Y-Axis label
yAxis.append("text")
    .attr("class", "axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .attr("fill", "#5D6971")
    .text("Population)");

// Line path generator
// TODO: Implement the line generator
var line = d3.line()
	.x((d) => { return x(d.year); })
	.y((d) => { return y(d.value); });

d3.json("data/example.json").then((data) => {
    // Data cleaning
    data.forEach((d) => {
        d.year = parseTime(d.year);
        d.value = +d.value;
    });
    console.log("Line Chart");

    // Set scale domains
    // TODO: set domain of axes
    x.domain([d3.min(data, (d) => { return d.year; }), d3.max(data, (d) => { return d.year; })]);
    y.domain([d3.min(data, (d) => { return d.value; }), d3.max(data, (d) => { return d.value; })]);

    // Generate axes once scales have been set
    xAxis.call(xAxisCall.scale(x))
    yAxis.call(yAxisCall.scale(y))

    // Add line to chart
    // TODO: add line path
    g.append("path")
	.attr("class", "line")
	.attr("fill", "white")
	.attr("stroke", "white")
	.attr("stroke-with", "3px")
	.attr("d", line(data));

    /******************************** Tooltip Code ********************************/

    var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", 0)
        .attr("x2", width);

    focus.append("circle")
        .attr("r", 7.5);

    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");

    g.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", () => { focus.style("display", null); })
        .on("mouseout", () => { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.year > d1.year - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
        focus.select("text").text(d.value);
        focus.select(".x-hover-line").attr("y2", height - y(d.value));
        focus.select(".y-hover-line").attr("x2", -x(d.year));
    }
    /******************************** Tooltip Code ********************************/

});

