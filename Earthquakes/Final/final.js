
//margin
var margin = {top: 50, right: 22, bottom: 20, left: 20},
    width = 1200 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom,
    active;


// Set the projection methods for the world map
var projection = d3.geo.equirectangular()
                   .translate([width / 2, height / 2])
                   .scale((width) / 2.5 / Math.PI)
                   .rotate([180]);

// Set the world map path
var path = d3.geo.path()
    .projection(projection);

//SVG container
var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
		.call(d3.behavior.zoom().scaleExtent([1, 7]).on("zoom", redraw))
		.append("g");

 function redraw() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      
//    svg.selectAll("circle")
//                .transition()
//                .attr("r", 4 / d3.event.scale);
}
               

//tile
var tile = d3.geo.tile()
    .scale(projection.scale() * 2 * Math.PI)
    .translate(projection([0, 0]))
    .zoomDelta((window.devicePixelRatio || 1) - 0.2);


//Adding water
svg.append("path")
        .datum({type: "Sphere"})
        .attr("class", "water")
        .attr("d", path);
	


var g = svg.append("g");


// draw legend colored circles 

g.append("rect")
        .attr("x", width - 1130)
        .attr("y", height - 170)
        .attr("width", 60)
        .attr("height", 130)
        .attr("fill", "lightgrey")
        .style("stroke-size", "1px");

g.append("circle")
		.attr('r', 14)
		.attr("cx", width - 1108)
        .attr("cy", height - 150)
		.style("fill", "red");
	
	
g.append("circle")
		.attr("class", "dot")
		.attr('r', 8.5)
        .attr("cx", width - 1108)
        .attr("cy", height - 100)
        .style("fill", "red");
	

g.append("circle")
		.attr("class", "dot")
		.attr('r', 3)
        .attr("cx", width - 1108)
        .attr("cy", height - 60)
        .style("fill", "red");


g.append("text")
        .attr("class", "label")
        .attr("x", width - 1085)
        .attr("y", height - 146.5)
        .style("text-anchor", "end")
        .text("9")
		.style("fill", "brown");



g.append("text")
        .attr("class", "label")
        .attr("x", width - 1085)
        .attr("y", height - 95)
        .style("text-anchor", "end")
        .text("8")
		.style("fill", "brown");


g.append("text")
        .attr("class", "label")
        .attr("x", width - 1085)
        .attr("y", height - 56)
        .style("text-anchor", "end")
        .text("7")
		.style("fill", "brown");


    
g.append("text")
        .attr("class", "label")
        .attr("x", width - 1102)
        .attr("y", height - 15)
        .style("text-anchor", "middle")
        .style("fill", "Green")
        .attr("font-size", "16px")
        .text("Richter Scale");


//Define Tooltip here
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
 

//tectonics json file
d3.json('tectonics.json', function (error, data) {
	if (error) throw error;
	g.insert("path")
		.datum(topojson.mesh(data, data.objects.tec))
		.attr("class", "tectonic")
		.attr("d", path);
});


//country tooltip and list
var countryTooltip = d3.select("body").append("div").attr("class", "countryTooltip")

//Queue
queue()
    .defer(d3.json, "world_110m.json")
    .defer(d3.tsv, "world-110m-country-names.tsv")
    .await(ready);


//Main function
function ready(error, world, countryData) {
	
    var countryById = {},
		countries = topojson.object(world, world.objects.countries).geometries;
    
   
    //Adding countries to select
    countryData.forEach(function (d) {
        countryById[d.id] = d.name;
       })
      

    //Drawing countries on the globe
    var country1 = g.selectAll(".country").data(countries)
        .enter()
        .insert("path")
        .attr("class", "country")
        .attr("title", function (d, i) { return d.name; })
        .attr("d", path)
        .text(function(d) {return (d.name)})
        .on("click", function (d) { click(d); })
        .on("mouseover", function (d) {
            countryTooltip.text(countryById[d.id])
                    .style("left", (d3.event.pageX + 7) + "px")
                    .style("top", (d3.event.pageY - 15) + "px")
                    .style("display", "block")
                    .style("opacity", 1);
        })
        .on("mouseout", function (d) {
            countryTooltip.style("opacity", 0)
                    .style("display", "none");
        });	
 


//Earthquake Data	
  d3.tsv("rest_7771.txt")
    .row(function(d) {
      return {
        id: d.id,
        lat: parseFloat(d.latitude),
        lng: parseFloat(d.longitude),
        city: d.place,
		mag: d.mag,
		depth: d.depth,
		time: moment(d.time,"YYYY-MM-DD'T'HH:mm:ss.SSS'z'").utc().format("YYYY-MM-DD HH:mm:ss"), 
        created_at: moment(d.time,"YYYY-MM-DD'T'HH:mm:ss.SSS'z'").utc().format("YYYY")
      };
    })
    .get(function(err, rows) {
    	if (err) return console.error(err);

      window.site_data = rows;
    });



var displaySites = function(data) {
  var sites = g.selectAll(".site")
      .data(data, function(d) {
        return d.id;
      });
    
    var rScale = d3.scale.sqrt()
        .domain(d3.extent(window.site_data, function(d) { return d.mag; }))
        .range([3, 15])    
    
  sites.enter()
	  .append("circle")
      .attr("class", "site")
      .attr("cx", function(d) {
        return projection([d.lng, d.lat])[0];
      })
      .attr("cy", function(d) {
        return projection([d.lng, d.lat])[1];
      })
  	  .attr("r", function(d) { return rScale(d.mag)})
      .on("mouseover", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html("<b><center>"+(d.city)+ "</center></b>"+"<table>"
+"<tr><td align='left'>Magnitude</td><td align='center'>:<td align='right'>" + d.mag + "</td></tr>"
+ "<tr><td align='left'>Time</td><td align='center'>:<td align='right'>" +(d.time)+ "</td></tr>"
+ "<tr><td align='left'>Depth</td><td align='center'>:<td align='right'>" +(d.depth)+ " km" +"</td></tr>"+"</table>")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
  sites.exit()
    .transition()
//      .duration(200)
      .attr("r",0)
      .remove();
    
};    



var minDate = moment('1900-01-01', "YYYY MM DD").utc().format("YYYY");
var maxDate = moment('2016-11-26', "YYYY MM DD").utc().format("YYYY");

d3.select('#slider3').call(d3.slider()
 .axis(d3.svg.axis()
	   .ticks(25)
	   .tickSize(8)
	   .tickFormat(d3.format(""))
	  )
	.min(minDate)
	.max(maxDate)
	.value([1955,1965])
	.step(1,2,3,4,5,6,7,8,9,10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116)
  	.on("slide", function(evt, value) {
		d3.select('#slider3textmin').text(value[0]);  
        d3.select('#slider3textmax').text(value[1]);
    
   	var newData = _(site_data).filter( function(site) {			
      	return (site.created_at >= value[0] && site.created_at <= value[1]);
	})
	displaySites(newData);
 	}));
 };


   
