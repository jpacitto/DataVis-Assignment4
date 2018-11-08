/*
*Joseph Pacitto
*Data Visualization - Assignment 3 - Fall 2018
*Part 2 - Citibike Station Scatterplot
*/

var data = "https://gitcdn.xyz/repo/dakoop/fb4d65af84db0ee3f2233e02cdeb1874/raw/bb31d4c41bda64891455a68741accdfef40aeef3/bikeStationData.json";

Promise.all([d3.csv(data)]).then(processData);

function processData(data)
{
	//remove stations that are in NJ
	var nyStations = data[0].filter(stationFilter);

	var stations = [];
	nyStations.forEach(function(element){
		stations.push([element.availableDocks, element.availableBikes, element.district]);
	});

	createGraph(stations);
}

function stationFilter(station)
{
	if(station.district != -999)
	{
		return station;
	}
}


//draws the graph and places the circles
function createGraph(stations)
{
	var width = 1100;
	var height = 700;
	var padding = 40;

	//define the x and y axis
	var xScale = d3.scaleLinear()
		.domain([0, max(stations, 1)])
		.range([padding, width - padding * 2]);

	var yScale = d3.scaleLinear()
		.domain([0, max(stations, 0)])
		.range([height - padding, padding]);

	var xAxis = d3.axisBottom().scale(xScale).ticks(max(stations, 1) / 5);
	var yAxis = d3.axisLeft().scale(yScale).ticks(max(stations, 0) / 5);

	//create graph
	var svg = d3.select("#part2")
		.append("svg")
		.style("position", "center")
		.attr("width", width)
		.attr("height", height+25);

	//add circles to scatter plot
	svg.selectAll("circle")
		.data(stations)
		.enter()
		.append("circle")
		.attr("cx", function(d){
			return xScale(d[1]);
		})
		.attr("cy", function(d){
			return yScale(d[0]);
		})
		.attr("r", 4)
		.attr("fill", function(d){
			var dist = parseInt(d[2]);

			if(dist > 400)
			{
				return "blue";
			}
			else if(dist > 300)
			{
				return "red";
			}
			return "green"
		});

	//axis labels
	svg.append("g")
			.attr("class", "x axis")	
			.attr("transform", "translate(0," + (height - padding) + ")")
			.call(xAxis);
		
		//y axis
		svg.append("g")
			.attr("class", "y axis")	
			.attr("transform", "translate(" + padding + ", 0)")
			.call(yAxis);

	//axis label
	svg.append("text")
		.attr("y", 10)
		.attr("x", 55)
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.attr("tranform", "rotate-90)")
		.text("Available Docks");

	svg.append("text")
		.attr("y", height)
		.attr("x", width/2)
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text("Available Bikes");

	var color = [["blue", 10, "Queens"],["red", 32, "Brooklyn"], ["green", 54, "Manhattan"]];
	var legend = svg.selectAll(".legend")
		.data(color)
		.enter().append("g")
		.attr("class", "legend")

	// draw legend colored rectangles
	var i = -22;
	legend.append("rect")
		.attr("x", width - 25)
		.attr("y", function(){
			i += 22;
			return i;
		})
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", function(d){
			return d[0];
		});

	// draw legend text
	legend.append("text")
		.attr("x", width - 30)
		.attr("y", function(d){
			return d[1];
		})
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d[2];})
}	

function max(stations, x)
{
	var max = 0;
	for(var i = 0; i < stations.length; i++)
	{
		if(parseInt(stations[i][x]) > max)
		{
			max = parseInt(stations[i][x]);
		}
	}

	return max;
}