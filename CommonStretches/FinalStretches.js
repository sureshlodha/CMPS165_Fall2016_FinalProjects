var margin = {top: 100, right: 400, bottom: 150, left: 100},
    width = 1250 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    
// Define SVG. 
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "Shoulders")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define X and Y SCALE. 
var xScale = d3.scale.ordinal()
    .rangeRoundBands([0,width], 0.1);

var yScale = d3.scale.linear()
    .range([height,0]);

//Define tooltip
var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

// Define X and Y AXIS
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(5);

var dataSource = 'allStretches.csv',
dataSource2 = 'dynamic.csv',
dataSource3 = 'static.csv',
dataSource4 = 'allStretches.csv';

//take out +
function updateChart(sourcefile) {

        d3.csv(sourcefile,function(error, data){
    data.forEach(function(d) {
        d.key = d.key;
        d.value = d.value;
    });
    
    
    // Return X and Y SCALES (domain). 
    xScale.domain(data.map(function(d){ return d.key; }));
    yScale.domain([0,10]);
    
    // Creating rectangular bars to represent the data. 
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr("height", 0) 
        .attr("y", height)
        .attr({
            "x": function(d) { return xScale(d.key); },
            "y": function(d) { return yScale(d.value); },
            "width": xScale.rangeBand(),
            "height": function(d) { return  height - yScale(d.value); },
            // create increasing to decreasing shade of blue
            "fill": function(d,i) { return 'rgb(0, 110, 110)'}
        })
        .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html(d.type);	
//                .style("left", (d3.event.pageX) + "px")		
//                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);
            });
    
    // Label the data values(d.value)
    svg.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .transition().duration(1000)
        .delay( function(d,i) {
			return i * 100;
		})
        .text(function(d){
            return d.value;
        })
        .attr({
            "x": function(d){ return xScale(d.key) + xScale.rangeBand()/2; },
            "y": function(d){ return yScale(d.value)+ 12; },
            "font-family": 'sans-serif',
            "font-size": '13px',
            "font-weight": 'bold',
            "fill": 'white',
            "text-anchor": 'middle'
        });
    
    // Draw xAxis and position the label
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .attr("transform", "rotate(-40)" )
        .style("text-anchor", "end")
        .attr("font-size", "12px");
        
    
    // Draw yAxis and postion the label
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -170)
        .attr("dy", "-3em")
        .style("text-anchor", "start")
        .text("Stretch Rating");
      
});
}
updateChart(dataSource);

function dynamic() {
    svg.remove();
    svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "Shoulders")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    updateChart(dataSource2);
}
function static() {
    svg.remove();
    svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "Shoulders")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    updateChart(dataSource3);
}

function both() {
    svg.remove();
    svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "Shoulders")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    updateChart(dataSource4);
}



