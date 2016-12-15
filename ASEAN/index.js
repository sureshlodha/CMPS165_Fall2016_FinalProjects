var display = function (projection_data, switchnumber){

    var width = 960,
        height = 650;
    
    var color = d3.scaleThreshold()
        .domain([.5, .6, .7, .8, .9].map(function(x){return x;}))
        .range(["#ccffd6", "#93e2a3", "#59c66f", "#3aad51", "#1f8e35", "#006d15"]);     //green
    
    var legend_label = "Years of Schooling"; //label on the legend, defaults to HDI
    var data_file = "HDI.json"; //name of data file, defaults to HDI
    var data_type = "HDI";
    var legend_spacing = 45; //custom spacing for legend labels, defaults to HDI spacing.
    switch (switchnumber) {
        case 1:
            changeColorHDI()
            break;
        case 2:
            changeColorGNI()
            break;
        case 3:
            changeColorLife()
            break;
        case 4:
            changeColorSchool()
            break;
        default: break;
    }
    function changeColorHDI() {
        color = d3.scaleThreshold()
        .domain([.5, .6, .7, .8, .9].map(function(x){return x;}))
        .range(["#ccffd6", "#93e2a3", "#59c66f", "#3aad51", "#1f8e35", "#006d15"]);     //green
        legend_label = "HDI";
        data_file = "HDI.json";
        legend_spacing = 45;
        redraw();
    }
    function changeColorGNI() {
        color = d3.scaleThreshold()
        .domain([2000, 5000, 10000, 20000, 70000].map(function(x){return x;}))
        .range(["#c4f1ff", "#a3eaff", "#6ec8e6", "#17a5d4", "#0086b3", "#00384c"]);     //blue
        legend_label = "GNI per capita ($)";
        data_file = "gniMAP.json";
        legend_spacing = 65;
        redraw();  
    }
    
    function changeColorLife() {
        color = d3.scaleThreshold()
        .domain([67,71,75,78,83].map(function(x){return x;}))
        .range(["#ffddba", "#ffcc91", "#ffaf54", "#ff9419", "#e07800", "#ba6400"]);     //orange
        legend_label = "Life Expectancy (years)";
        data_file = "lifeMAP.json";
        legend_spacing = 43;
        redraw();
    }
    
    function changeColorSchool() {
        color = d3.scaleThreshold()
        .domain([5, 6, 7, 8, 9].map(function(x){return x;}))
        .range(["#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"]);   //red (original shobhit range)
        var legend_label = "Years of School";
        data_file = "yearsMAP.json";
        legend_spacing = 35;
        redraw();
    }
    redraw();
function redraw() {
    //Shobbit helped us figure this out
    //remove the whole html svg element and redraw
    var countrysvg = document.getElementById("countrysvg");
    if(countrysvg.childNodes[0])
        countrysvg.removeChild(countrysvg.childNodes[0])
    
    var svg = d3.select("#countrysvg").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("display", "block")
        .style("margin", "auto");

    // Append Div for tooltip to SVG
    var div = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

    d3.json("region.json", function(error, data) {
        if (error) return console.error(error);

        var subunits = topojson.feature(data, data.objects.countries);

        var projection = d3.geoAlbers()
            .center(projection_data.center)
            .rotate(projection_data.rotate)
            .parallels(projection_data.parallels)
            .scale(projection_data.scale)
            .scale(800)
            .translate([width / 2, (height / 2)-23 ]); //shift up down left right

        var path = d3.geoPath()
            .projection(projection);

        svg.append("path")
            .datum(subunits)
            .attr("d", path);

        d3.json(data_file, function(error, population) {
            var formatNumber = d3.format("");   //removes million formatting
                                                //http://bl.ocks.org/zanarmstrong/05c1e95bf7aa16c4768e

            svg.selectAll(".subunit")
                .data(topojson.feature(data, data.objects.countries).features)
                .enter().append("path")
                .style("fill", function(d){
                    if(d.properties.name)
                        return color(population[d.properties.name]);
                })
                .attr("class", function(d) {
                    if(d.properties.countryname)
                        return "subunit background";
                    else
                        return "subunit";
                })
                .attr("d", path)
                .on("mouseover", function(d) {
                    if(d.properties.name){
                        d3.select(this).attr("class", "highlight");

                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                        div.append("div").text(d.properties.name);
                        div.append("div").text(formatNumber(population[d.properties.name]));
                    }
                })
                // fade out tooltip on mouse out
                .on("mouseout", function(d) {
                    d3.select(this).classed("highlight", false);
                    div.selectAll("*").remove();
                    div.transition()
                        .duration(0)
                        .style("opacity", 0);
                });

            var x = d3.scaleLog()
                .domain([0.4, 1])   //legend scale 
                .range([0, 400]);
            
            var xAxis = d3.axisBottom()
            var g = svg.append("g")
                .attr("transform", "translate(460,40)");
             
            g.append("text")    //title of legend
                .attr("class", "caption")
                .attr("x",-445)
                .attr("y", -25)
                .attr("fill", "#000")
                .text(legend_label)
                   
    //omar - adding legend 
    //======================================= http://bl.ocks.org/KoGor/5685876
            
    var legendRectSize = 18;
    var legendSpacing = 4;
    var legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing;
        var offset = -.5 * height * color.domain().length/2;
        var horz = 48 * legendRectSize - 847;
        var vert = i * height - offset; //add more here to change y value
        return 'translate(' + horz + ',' + vert + ')';
      });
    // create the map legend         
    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .attr('y', function(d, i){ return height - (i*43) - 565;}) //function to reverse order of legend
      .style('fill', color)
      .style('stroke', color);
    legend.append('text')
      .attr('x', legend_spacing) //custom spacing for each variable, because the numbers differ in size
      .attr('y', function(d, i){ return height - (i*43) - 552;})
      .attr('text-anchor', 'end') //align text right
      .text(function(d) { return d; });   
        });
    });
}//end of redraw
    
};//end of display
