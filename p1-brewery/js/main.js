/*
*    main.js
*/

var margin = {top: 50, right: 10, bottom: 100, left:100};
var width = 800;
var height = 600;

var svg = d3.select("#chart-area")
	.append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

d3.json("data/revenues.json").then((data)=> {
    console.log("Brewery");
    
	data.forEach((d)=>{
		d.revenue = parseInt(d.revenue);
	});
    console.log(data);
    
    var months = data.map((d) => { return d.month; }) ;

    var x = d3.scaleBand()
        .domain(months)
        .range([0, width])
        .paddingInner(0.2)
        .paddingOuter(0.3);

    var maxRev = d3.max(data, (d) => { return d.revenue; });

    var y = d3.scaleLinear()
        .domain([maxRev, 0])
        .range([0, height]);

    var color = d3.scaleOrdinal()
        .domain(months)
        .range(d3.schemeSet3);

    var rects = g.selectAll("rect").data(data);
    rects.enter()
        .append("rect")
            .attr("x", (d) => {
                return x(d.month);
            })
            .attr("y", (d) => {
                return y(d.revenue);
            })
            .attr("height", (d) => {
                return height - y(d.revenue);
            })
            .attr("width", x.bandwidth())
            .attr("fill", (d) => {
                return "yellow";
            })

    // bottom axis ticks
    var bottomAxis = d3.axisBottom(x);
    g.append("g")
    .attr("class", "bottom axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(bottomAxis)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("filled", "white")
    .attr("text-anchor", "middle")
    //.attr("transform", "rotate(-20)");

    // left y axis
    var yAxisCall = d3.axisLeft(y)
        .ticks(10)
	    .tickFormat((d) => { return "$" + + d/1000 + "K"; });

    g.append("g")
    .call(yAxisCall);
    
    // x axis label
    g.append("text")
    .attr("class", "x axis-label")
    .attr("x", (width / 2))
    .attr("y", height + 140)
    .attr("font-size", "30px")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(0, -70)")
    .text("Month");

    // y axis label
    g.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (height / 2))
    .attr("y", -60)
    .attr("font-size", "30px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue (dlls.)");
        
}).catch((error)=> {
    console.log(error);
});

