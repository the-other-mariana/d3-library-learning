/*
*    main.js
*/

var margin = {top: 50, right: 10, bottom: 100, left:100};
var width = 800;
var height = 600;

var flag = true;
var t = d3.transition().duration(750);

var svg = d3.select("#chart-area")
	.append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var x = d3.scaleBand()
    .range([0, width])
    .paddingInner(0.2)
    .paddingOuter(0.3);

var y = d3.scaleLinear()
    .range([height, 0]);

var xAxisGroup = g.append("g")
    .attr("class", "bottom axis")
    .attr("transform", "translate(0, " + height + ")")

var yAxisGroup = g.append("g")
    .attr("class", "y axis")

var yLabel = g.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (height / 2))
    .attr("y", -60)
    .attr("font-size", "30px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue (dlls.)");

d3.json("data/revenues.json").then((data)=> {
    console.log("Transitions");
    
	data.forEach((d)=>{
		d.revenue = parseInt(d.revenue);
        d.profit= +d.profit;
	});
    console.log(data);
    
    
    d3.interval( ( ) => {
        var newData = flag ? data : data.slice(1);
		update(newData);
        console.log("Updating...");
        flag = !flag;
	}, 1000);
    update(flag ? data : data.slice(1));
        
}).catch((error)=> {
    console.log(error);
});

function update(data) {
    
    var value = flag ? "revenue" : "profit";
    
    x.domain(data.map((d) => { return d.month; }))
    y.domain([0, d3.max(data, (d) => { return d[value]; })])

    // bottom axis ticks
    var bottomAxis = d3.axisBottom(x);
    
    xAxisGroup.transition(t).call(bottomAxis)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("filled", "white")
    .attr("text-anchor", "middle");
    //.attr("transform", "rotate(-20)");

    // left y axis
    var yAxisCall = d3.axisLeft(y)
        .ticks(10)
	    .tickFormat((d) => { return "$" + + d/1000 + "K"; });

    
    yAxisGroup.transition(t).call(yAxisCall);
    
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
    var label = flag ? "Revenue" : "Profit";
    yLabel.text(label)

    var rects = g.selectAll("rect").data(data, (d) => { return d.month; });
    rects.exit()
	    .transition(t)
		.attr("y", y(0))
		.attr("height", 0).remove();

    rects.transition(t)
        .attr("x", (d) => { return x(d.month); })
	    .attr("y", (d) => { return y(d[value]); })
	    .attr("width", x.bandwidth)
	    .attr("height",(d) => { return height - y(d[value])});

    rects.enter()
        .append("rect")
            .attr("fill", "yellow")
            .attr("x", (d) => {
                return x(d.month);
            })
            .attr("y", height)
            .attr("height", 0)
            .attr("width", x.bandwidth())
            .merge(rects)
            .transition(t)
                .attr("x", (d) => { return x(d.month) })
                .attr("width", x.bandwidth)
                .attr("y", (d) => { return y(d[value]); })
                .attr("height", (d) => { return height - y(d[value]); })
                .attr("fill", ()=>{ return flag ? "yellow" : "orange"; });

}

