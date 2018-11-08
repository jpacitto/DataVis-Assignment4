/*
*Joseph Pacitto
*Data Visualization - Assignment 3 - Fall 2018
*Part 1 - Create map with bike locations
*/


//map data, station data, and specific districts
var mapOutline = "https://gitcdn.xyz/repo/dakoop/fb4d65af84db0ee3f2233e02cdeb1874/raw/9a819d894ff29f786b61b7c3d0fa18f84b244362/nyc-community-districts.geojson";
var mapData = "https://gitcdn.xyz/repo/dakoop/fb4d65af84db0ee3f2233e02cdeb1874/raw/bb31d4c41bda64891455a68741accdfef40aeef3/bikeStationData.json";
var comDist = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 164, 301, 302, 303, 306, 307, 308, 309, 355, 401, 402];

//pull data from sources
Promise.all([d3.json(mapOutline), d3.csv(mapData)]).then(processData);

//processData filters the map and station location data.
//removes New Jersey districts from map
//removes New Jersey stations
function processData(cityData)
{
	var map = cityData[0];
	var data = cityData[1];
	var width = 500;
	var height = 500;

	//filter out NJ districts
	var filteredDist = map.features.filter(communityDistricts);
	map.features = filteredDist;
	//filter out NJ stations
	var filteredData = data.filter(nyDistricts);
	//create projections
	var projection = d3.geoAlbersUsa()
		.fitSize([width, height], map);

	createMap(map, filteredData, "#part1", projection, width, height);
}

//creates the map of Manhatten and adds circles for station locations
function createMap(map, data, divId, projection, width, height)
{
	//initialize svg for map
	var mapSVG = d3.select(divId).append("svg")
		.attr("width", width)
		.attr("height", height);

	var path = d3.geoPath()
		.projection(projection);

	//create the map
	mapSVG.append("path")
		.datum(map)
		.attr("d", path)
		.style("stroke", "black")
		.style("fill", "none");

	//creates array of all location longitude and latitude
	var locations = [];
	data.forEach(function(element){
		locations.push([element.longitude, element.latitude]);
	});

	//adds circles to the map for station locations
	mapSVG.selectAll("circle")
		.data(locations)
		.enter().append("circle")
	    .attr("cx", function(d) { return projection(d)[0]})
	    .attr("cy", function(d) { return projection(d)[1]})
	    .attr("r", 2.5)
	    .style("fill", "red");
}

//function used for filtering districts
function communityDistricts(district)
{
	if(comDist.includes(district.properties.communityDistrict))
	{
		return district;
	}
}

//function used for filtering stations
function nyDistricts(district)
{
	if(district.district != -999)
	{
		return district;
	}
}