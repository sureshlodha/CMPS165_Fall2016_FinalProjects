/*
Svg Width and Height
*/
var mapWidth = 600,
    mapHeight = 600;

var format = d3.format(",")

var legWidth = 300;
var legHeight = 600;

var svg = d3.select("body").append("svg")
    .attr("width", mapWidth)
    .attr("height", mapHeight)
	.style("margin", "none")
	.style("display", "inline-block");

var legendBox = d3.select("body").append("svg")
	.attr("width", legWidth)
	.attr("height", legHeight)
	.style("margin", "0px 0px 0px 5px")
	.style("display", "inline-block");


var legend = [
	{
	color: '#a50f15',
	info: ' < $2,000,000'
			 },
	{
	color: '#de2d26',
	info: ' < $700,000'
			 },
	{
	color: '#fb6a4a',
	info: " < $400,000"
			 },
	{
	color: "#fcae91",
	info: " < $200,000"
			 },
	{
	
	color: "#fee5d9",
	info: "No Data"
			 }];


var color = d3.scaleThreshold()
    .domain([200000,400000,700000,2000000])
    .range(['#fcae91', '#fb6a4a', '#de2d26', '#a50f15']);

var borderPath = svg.append("rect")
	.attr("x", 0)
    .attr("y", 0)
    .attr("height", mapHeight)
    .attr("width", mapWidth)
    .style("stroke", "#000")
    .attr("fill", "#add8e6")
    .style("stroke-width", "1");


var trueProjection = d3.geoAlbers()
	.center([-26,37.4])
	.parallels([37.6, 37.85])
	.scale(70000);

var expandedProjection = d3.geoAlbers()
	.center([-25.8,37.65])
	.parallels([37.6, 37.85])
	.scale(39000);

var path = d3.geoPath()
    .projection(expandedProjection);


d3.json("valleyZipFinal.json", function(error, ca) {
	if (error) return console.error(error);

	svg.append("g")
		.selectAll("path")
		.data(topojson.feature(ca, ca.objects.caCounty).features)
		.enter().append("path")
		.attr("fill", "#fee5d9")
		.attr("opacity", "1")
		.attr("d", path);
	
	svg.append("path")
      	.datum(topojson.mesh(ca, ca.objects.caCounty, function(a, b) { return a != b; }))
      	.attr("fill", "none")
		.attr("stroke", "black")
		.attr("stroke-opacity", "0")
      	.attr("d", path);
	
	svg.append("g")
    	.selectAll("path")
    	.data(topojson.feature(ca, ca.objects.expandedValley).features)
    	.enter().append("path")
      	.attr("fill", function(d){
			currData = d.properties.Y2015_09
			if (currData == null) {
      			return "#fee5d9";
			}
			else{
				return color(d.properties.Y2015_09);
			}
		})
		.attr("opacity", "1")
		.attr("d", path)
		.on('mousemove', function(d) {
                    var mouse = d3.mouse(svg.node()).map(function(d) {
                        return parseInt(d);
                    });
                    tooltip.classed('hidden', false)
                        .attr('style', 'left:' + (mouse[0] + 15) +
                                'px; top:' + (mouse[1] - 35) + 'px');
					
					tooltip.html("");
					tooltip.append("p").text("ZIP: " + d.id);
					tooltip.append("p").text("Price: " + "$" + format(d.properties.Y2015_09));
                })
                .on('mouseout', function() {
                    tooltip.classed('hidden', true);
					tooltip.html("");
                });;
	
	legendBox.append("text")
	.attr("y", "140px")
	.attr("x", "13px")
	.text("Average Home Sales Price by ZIP code");

	var box = legendBox.selectAll("g").data(legend).enter()
		.append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * 1 + ")"; });

	box.append("rect")
		.attr("width", "30px")
		.attr("height", "30px")
		.attr("x", "13px")
		.attr("y", function(d, i){
		return "" + (150 + (i * 40)) + "px";
	})
		.attr("fill", function(d){
		return d.color;
	});

	box.append("text")
		.attr("width", "30px")
		.attr("height", "30px")
		.attr("x", "48px")
		.attr("y", function(d, i){
		return "" + (170 + (i * 40)) + "px";
	})
		.text(function(d){
		return d.info;
	});
	

	
	
	
	d3.json("cityGrid.json", function(error, city){
		
		svg.append("path")
      		.datum(topojson.mesh(city, city.objects.Freemont, function(a, b) { return true; }))
      		.attr("class", "city-border")
      		.attr("d", path);
		
		svg.append("path")
      		.datum(topojson.mesh(city, city.objects.Oakland, function(a, b) { return true; }))
      		.attr("class", "city-border")
      		.attr("d", path);
		
		svg.append("path")
      		.datum(topojson.mesh(city, city.objects.Hayward, function(a, b) { return true; }))
      		.attr("class", "city-border")
      		.attr("d", path);
		
		svg.append("path")
      		.datum(topojson.mesh(city, city.objects.SanJose, function(a, b) { return true; }))
      		.attr("class", "city-border")
      		.attr("d", path);
		
		svg.append("path")
      		.datum(topojson.mesh(city, city.objects.SF, function(a, b) { return true; }))
      		.attr("class", "city-border")
      		.attr("d", path);
		
		svg.append("path")
      		.datum(topojson.mesh(city, city.objects.PaloAlto, function(a, b) { return true; }))
      		.attr("class", "city-border")
      		.attr("d", path);
		
		svg.append("path")
      		.datum(topojson.mesh(city, city.objects.SanMateo, function(a, b) { return true; }))
      		.attr("class", "city-border")
      		.attr("d", path);
		});
	
		
	var tooltip = d3.select('body').append('div')
            .attr('class', 'hidden tooltip');
	
	
	
	
});




	
			


