/*
*Joseph Pacitto
*Data Visualization - Assignment 4 - Fall 2018
*Part 1 - Daily Choropleths
*/


//map data, station data, and specific districts
var mapOutline = "https://gitcdn.xyz/repo/dakoop/fb4d65af84db0ee3f2233e02cdeb1874/raw/9a819d894ff29f786b61b7c3d0fa18f84b244362/nyc-community-districts.geojson";
var mapData = "https://gitcdn.xyz/repo/dakoop/69f3c7132f4319c62a296897a2f83d0c/raw/995bed69e03fc2d91fc62ed8530c2df6061db716/bikeTripData.csv";
var comDist = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 164, 301, 302, 303, 306, 307, 308, 309, 355, 401, 402];


//pull data from sources
Promise.all([d3.json(mapOutline), d3.csv(mapData)]).then(processData);

var sliderValue = 1;

slider.addEventListener('input',function()
{
	sliderValue = this.value;

	var mapID = "#left";
	for(var i = 0; i < 2; i++)
	{
		if(i > 0){mapID = "#right"}
			
		var svg = d3.select(mapID);
		svg.selectAll("path").style("fill", "none");
		map.features.forEach(function(element)
		{
			svg.selectAll("path").style("fill", function(d)
				{
					var dist = d.properties.communityDistrict;
					if (bikeData[sliderValue[dist]] > 13000)
					{
						return "#01042B";
					}else if(bikeData[sliderValue][dist] > 10000){
						return "#1B2175";
					}else if(bikeData[sliderValue][dist] > 7000){
						return "#43499C";
					}else if(bikeData[sliderValue][dist] > 4000){
						return "#8288D0";
					}else if(bikeData[sliderValue][dist] > 1000){
						return "#BBBEE5";
					}

					return "#DCDEF5";
				});
		});
	}
});

var map;
var data;
var width;
var height;
var path;
var bikeData = new Object();


function processData(cityData)
{
	map = cityData[0];
	data = cityData[1];
	width = 500;
	height = 500;

	var filteredDist = map.features.filter(communityDistricts);
	map.features = filteredDist;

	var projection = d3.geoAlbersUsa()
		.fitSize([width, height], map);

	data.forEach(function(element)
	{
		var start = element.startDistrict;
		var end = element.endDistrict;
		var day = element.day;
		var count = element.count;
		var num;

		if(element.day in bikeData)
		{

			if((start == end) && (start in bikeData[day]))
			{
				num = parseInt(bikeData[day][start]) + parseInt(count);
				bikeData[day][start] = num;
			}
			else
			{
				if(start in bikeData[day])
				{
					num = parseInt(bikeData[day][start]) + parseInt(count);
					bikeData[day][start] = num;
				}
				else
				{
					bikeData[day][start] = count;
				}

				if(end in bikeData[day])
				{
					num = parseInt(bikeData[day][end]) + parseInt(count);
					bikeData[day][end] = num;
				}
				else
				{
					bikeData[day][end] = count;
				}
			}

		}
		else
		{
			bikeData[day] = new Object();
			if(start == end)
			{
				bikeData[day][start] = count;
			}
		}
	});


	createMap(map, "#part1Left", projection, width, height, "left");
	createMap(map, "#part1Right", projection, width, height, "right");
}

function createMap(map, divId, projection, width, height, id)
{
	var mapSVG = d3.select(divId).append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("id", id);

	path = d3.geoPath()
		.projection(projection);

	map.features.forEach(function(element)
	{
		mapSVG.append("path")
		.datum(element)
		.attr("d", path)
		.style("stroke", "black")
		.style("fill", function(d)
			{
				var dist = d.properties.communityDistrict;
				if (bikeData[sliderValue[dist]] > 13000)
				{
					return "#01042B";
				}else if(bikeData[sliderValue][dist] > 10000){
					return "#1B2175";
				}else if(bikeData[sliderValue][dist] > 7000){
					return "#43499C";
				}else if(bikeData[sliderValue][dist] > 4000){
					return "#8288D0";
				}else if(bikeData[sliderValue][dist] > 1000){
					return "#BBBEE5";
				}

				return "#DCDEF5";
			});
	});

	console.log(mapSVG);
}

function communityDistricts(district)
{
	if(comDist.includes(district.properties.communityDistrict))
	{
		return district;
	}
}