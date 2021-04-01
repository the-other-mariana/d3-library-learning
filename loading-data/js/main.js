/*
*    main.js
*/


d3.csv("data/ages.csv").then((data)=> {
	console.log(data);
});

d3.tsv("data/ages.tsv").then((data)=> {
	console.log(data);
});

var gap = 20;
var colors = ["red", "green", "yellow", "black", "orange"]

var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", 400)
    .attr("height", 400);

d3.json("data/ages.json").then((data)=> {
    console.log(data);
	data.forEach((d)=>{
		d.age = +d.age;
	});
    var circs = svg.selectAll("circles").data(data);
    circs.enter()
        .append("circle")
            .attr("r", (person) => {
                return person.age;
            })
            .attr("cx", (d, i) => {
                return gap * i + gap * i * 0.5 + gap;
            })
            .attr("cy", 200)
            .attr("fill", (d, i) => {
                if (d.age > 10) {
                    return colors[i % colors.length];
                    
                } else {
                    return "blue";
                }
            });
}).catch((error)=> {
    console.log(error);
});


