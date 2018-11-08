/*
*Joseph Pacitto
*Data Visualization - Assignment 3 - Fall 2018
*Part 3 - Citibike Availability by District
*/


//map data, station data, and specific districts
var mapOutline = "https://gitcdn.xyz/repo/dakoop/fb4d65af84db0ee3f2233e02cdeb1874/raw/9a819d894ff29f786b61b7c3d0fa18f84b244362/nyc-community-districts.geojson";
var mapData = "https://gitcdn.xyz/repo/dakoop/fb4d65af84db0ee3f2233e02cdeb1874/raw/bb31d4c41bda64891455a68741accdfef40aeef3/bikeStationData.json";
var comDist = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 164, 301, 302, 303, 306, 307, 308, 309, 355, 401, 402];

//pull data from sources
Promise.all([d3.json(mapOutline), d3.csv(mapData)]).then(processData2);

//processData filters the map and station location data.
//removes New Jersey districts from map
//removes New Jersey stations
function processData2(cityData)
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

	createMap2(map, filteredData, "#part3", projection, width, height);
}

//creates the map of Manhatten and adds circles for station locations
function createMap2(map, data, divId, projection, width, height)
{
	//initialize svg for map
	var mapSVG2 = d3.select(divId).append("svg")
		.attr("width", width)
		.attr("height", height);

	var path2 = d3.geoPath()
		.projection(projection);

	//create key value pair of district to ratio
	var distTotal = new Object();
	data.forEach(function(element)
	{
		var districtbikes = element.district + "bikes";
		var districtdocks = element.district + "docks";

		if(districtbikes in distTotal)
		{
			var bikes = distTotal[districtbikes];
			bikes = parseInt(element.availableBikes) + parseInt(bikes);
			distTotal[districtbikes] = bikes;

			var docks = distTotal[districtdocks];
			docks = parseInt(element.availableDocks) + parseInt(docks);
			distTotal[districtdocks] = docks;
		}
		else
		{
			distTotal[districtbikes] = element.availableBikes;
			distTotal[districtdocks] = element.availableDocks;
		}
	});

	var distPercent = new Object();
	comDist.forEach(function(element)
	{
		distPercent[element] = parseInt(distTotal[element + "bikes"]) / parseInt(distTotal[element + "docks"]); 
	});

	//draw and color each region individually
	map.features.forEach(function(element)
	{
		mapSVG2.append("path")
			.datum(element)
			.attr("d", path2)
			.style("stroke", "black")
			.style("fill", function(d)
				{
					var dist = d.properties.communityDistrict;
					if(distPercent[dist] > 2)
					{
						return "#860808";
					}
					else if(distPercent[dist] > 0.75)
					{
						return "#B12424";
					}
					else if(distPercent[dist] > 0.5)
					{
						return "#C63E3E";
					}else if(distPercent[dist] > 0.25)
					{
						return "#DD5A5A";
					}
					else if(distPercent[dist] > 0.10)
					{
						return "#F17E7E";
					}
					return "F8B1B1"
				});
	});

	//creates array of all location longitude and latitude
	var locations = [];
	data.forEach(function(element){
		locations.push([element.longitude, element.latitude]);
	});
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