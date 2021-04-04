/*
*    main.js
*/

var margin = {left:100, right: 10, top: 10, bottom: 100};
var width = 600;
var height = 400;

var t = d3.transition().duration(1000);
var k = 0
var g = d3.select("#chart-area")
	.append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var x = d3.scaleLog()
	.domain([142, 150000])
	.range([0, width])
	.base(10);

var y = d3.scaleLinear()
	.domain([0, 90])
	.range([height, 0]);

var area = d3.scaleLinear()
	.domain([2000, 1400000000])
	.range([25*Math.PI, 1500*Math.PI]);

var color = d3.scaleOrdinal()
	.range(d3.schemePastel1);

var bottomAxis = d3.axisBottom(x)
	.tickValues([400,4000,40000])
	.tickFormat(d3.format("$"));

var yAxisCall = d3.axisLeft(y);

var xAxisGroup = g.append("g")
    .attr("class", "bottom axis")
    .attr("transform", "translate(0, " + height + ")");

var yAxisGroup = g.append("g")
    .attr("class", "y axis");

var legend = g.append("g")
 	.attr("transform", "translate(" + (width - 10) + "," + (height - 170) + ")");

var yLabel = g.append("text")
	.attr("class", "y axis-label")
	.attr("x", - (height / 2))
	.attr("y", -60)
	.attr("font-size", "30px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.text("Life Expectancy (Years)");

var xLabel = g.append("text")
    .attr("class", "x axis-label")
    .attr("x", (width / 2))
    .attr("y", height + 140)
    .attr("font-size", "30px")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(0, -70)")
    .text("GDP Per Capita ($)");

var legendArea = g.append("text")
	.attr("class", "x axis-label")
	.attr("x", width - 50)
	.attr("y", height - 20)
	.attr("font-size", "50px")
	.attr("text-anchor", "middle")
	.attr("fill", "gray")


d3.json("data/data.json").then((data)=>{
	console.log(data);
	console.log("Leaf Project");
    
	data.forEach((d)=>{
		d.year = +d.year;
		
	});
    console.log(data);
	const formattedData = data.map((year) => {
		return year["countries"].filter((country) => {
		var dataExists = (country.income && country.life_exp);
		return dataExists;
		}).map((country) => {
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country;
		})
	});
	var years = data.map((d) => {return d.year;});
	var cont = formattedData[0].map((d) => {return d.continent;});
	var continents = [...new Set(cont)];

	color.domain(continents)
	continents.forEach((c, i) => {
		var cRow = legend.append("g")
			.attr("transform", "translate(0, " + (i * 20) + ")");

		cRow.append("rect")
			.attr("width", 10)
			.attr("height", 10)
			.attr("fill", color(c))
			.attr("stroke", "white");

		cRow.append("text")
			.attr("x", -20)
			.attr("y", 10)
			.attr("text-anchor", "end")
			.text(c);
		 });
	d3.interval( ( ) => {
		
		update(years[k % years.length], formattedData[k % years.length]);
		console.log("Updating Circles...");
		k += 1;
	}, 1000);
	update(years[k % years.length], formattedData[k % years.length]);
	k += 1;
});

function update(year, data) {
	legendArea.text(year);
	xAxisGroup.call(bottomAxis)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("filled", "white")
    .attr("text-anchor", "middle");

	yAxisGroup.call(yAxisCall);

	var circles = g.selectAll("circle").data(data, (d) => { return d.country; });

	circles.exit()
	    .transition(t)
		.attr("fill", (d) => {
			return color(d.continent);
		})
		.attr("cx", (d) => {
			return y(d.income);
		})
		.attr("cy", (d) => {
			return y(d.life_exp);
		})
		.attr("r", (d)=>{
			return Math.sqrt(area(d.population) / Math.PI);
		})
		.remove();

	circles.transition(t)
		.attr("fill", (d) => {
			return color(d.continent);
		})
		.attr("cx", (d) => {
			return x(d.income);
		})
		.attr("cy", (d) => {
			return y(d.life_exp);
		})
		.attr("r", (d)=>{
			return Math.sqrt(area(d.population) / Math.PI);
		})

	circles.enter()
	.append("circle")
		.attr("fill", (d) => {
			return color(d.continent)
		})
		.attr("cx", (d) => {
			return x(d.income);
		})
		.attr("cy", (d) => {
			return y(d.life_exp);
		})
		.attr("r", (d)=>{
			return Math.sqrt(area(d.population) / Math.PI);
		})
		.merge(circles)
		.transition(t)
			.attr("cx", (d) => {
				return x(d.income);
			})
			.attr("cy", (d) => {
				return y(d.life_exp);
			})
			.attr("r", (d)=>{
				return Math.sqrt(area(d.population) / Math.PI);
			});
}

