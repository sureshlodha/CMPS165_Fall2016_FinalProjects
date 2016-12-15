/** Set our variables: margins, x-axis and y-axis **/
//create the title of our graph
var title = "Uber Versus Lyft";
    

var formatNumber = d3.format("d");

//set our margins
var margin = {top: 20, right: 20, bottom: 50, left: 50},
    width = 1200 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

//time.format. takes in date_Entered as input (needs to be the same format)
var parsedtg = d3.time.format("%m/%d/%Y").parse;

//x-axis is a time scale for each day in September, 2014
var x = d3.time.scale()
    .range([0, width]);

//linear scale for our y-axis based on number of rides given
var y = d3.scale.linear()
    .range([height, 0]);

//create our x-axis and orient it on the bottom 
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

//create our y-axis 
var yAxis = d3.svg.axis()
    .scale(y)
    .tickFormat(formatCurrency) //creates our tick marks : 10 ticks from [0,50,000]
    .orient("right");

/**  Create our lines for the difference chart **/
//create our Uber line 
var lineUber = d3.svg.area()
    .interpolate("basis") //smoothes out the peaks so it looks nicer
    .x(function(d) { return x(d.dtg); })  //x coordinate is date
    .y(function(d) { return y(d["Uber"]); }); //y coordinate is number of hails

var lineLyft = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x(d.dtg); })
    .y(function(d) { return y(d["Lyft"]); });

var area = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x(d.dtg); })
    .y1(function(d) { return y(d["Uber"]); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
 function formatCurrency(d) {
    var s = formatNumber(d / 1e6);
     return d === y.domain()[1]
      ? "50,000" + s + " thousand rides"
      : "";
};


d3.csv("hails.csv", function(error, collection) {

    collection.forEach(function(d) {
      d.dtg = parsedtg(d.date_entered);
      d.hails = +d.hails;
    });
    
    //nesting the date reorganizes the csv file in a column. we could have created a csv file in the proper style and ommited d3.nest
    var data = d3.nest()
      .key(function(d) {return d.dtg;})
      .entries(collection);

  data.forEach(function(d) {
      d.dtg = d.values[0]['dtg'];
      d["Uber"] = +d.values[0]['hails'];
      d["Lyft"] = +d.values[1]['hails'];
  });

  for(i=data.length-1;i>0;i--) {
          data[i].Uber  = data[i].Uber - data[(i-1)].Uber ;
          data[i].Lyft     = data[i].Lyft - data[(i-1)].Lyft ;
      }

  data.shift();

    x.domain(d3.extent(data, function(d) { return d.dtg; }));

    y.domain([-10000,10000]);

    svg.datum(data);

    
    svg.append("clipPath")
        .attr("id", "clip-below")
        .append("path")
        .attr("d", area.y0(height));

    svg.append("clipPath")
        .attr("id", "clip-above")
        .append("path")
        .attr("d", area.y0(0));
/** create our axis, lines, and style the region representing the difference between two graphs **/
    
    //create our x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    //create our y-axis and give it a title
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dx","-10em")
        .attr("dy", "-2em")
        .style("text-anchor", "end")
        .style("font-size", "18px")
        .text("Number of Rides given Per Day");
    

    //Uber line gets colored grey
    svg.append("path")
        .attr("class", "line")
        .style("stroke", "grey")
        .attr("d", lineUber);

    //Lyft line gets colored purple
    svg.append("path")
        .attr("class", "line")
        .style("stroke", "purple")
        .attr("d", lineLyft);

    
    //color the difference betweeen the two graphs with purple to represent lyft
    svg.append("a")
        .append("path")
        .attr("class", "area above")
        .attr("clip-path", "url(#clip-above)")
        .attr("d", area.y0(function(d) { return y(d["Lyft"]); }));

    //color the difference between the two graphs with red to represent uber
    svg.append("a")
        .append("path")
        .attr("class", "area below")
        .attr("clip-path", "url(#clip-below)")
        .attr("d", area.y0(function(d) { return y(d["Lyft"]); }));


    // ******* Title Block ********
    svg.append("text") // Title shadow
      .attr("x", (width / 2))
      .attr("y", 50 )
      .attr("text-anchor", "middle")
      .style("font-size", "30px")
      .attr("class", "shadow")
      .text(title);

    svg.append("text") // Title
      .attr("x", (width / 2))
      .attr("y", 50 )
      .attr("text-anchor", "middle")
      .style("font-size", "30px")
      .style("stroke", "none")
      .text(title);

    // ******* Legend Block ********
    var xox = 300;   // rectangle width and position
 
    //Rectange representing color for Uber rides
    svg.append("rect") 
      .attr("x", ((width / 2)/2)+(width / 2)-(xox/2))
      .attr("y", height+(margin.bottom/2) )
      .attr("width", xox)
      .attr("height", "25")
      .attr("class", "area below");
    
    //Shadow for the uber rides box
    svg.append("text") 
      .attr("x", ((width / 2)/2)+(width / 2))
      .attr("y", height+(margin.bottom/2) + 5)
      .attr("dy", ".71em")
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .attr("class", "shadow")
      .text("Rides provided by Uber");
    
     //Rectangle representing color for Lyft rides
    svg.append("rect") 
      .attr("x", ((width / 2)/2)-(xox/2))
      .attr("y", height+(margin.bottom/2) )
      .attr("width", xox)
      .attr("height", "25")
      .attr("class", "area above");
    
    // shadow for the lyft rides box
    svg.append("text") 
      .attr("x", ((width / 2)/2))
      .attr("y", height+(margin.bottom/2) + 5)
      .attr("dy", ".71em")
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .attr("class", "shadow")
      .text("Rides Provided by Lyft");

    
    //Text inside the Lyft rides box
    svg.append("a")
      .append("text") 
      .attr("x", ((width / 2)/2))
      .attr("y", height+(margin.bottom/2) + 5)
      .attr("dy", ".71em")
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("stroke", "none")
      .text("Rides Provided by Lyft");
     // Science Legend Text
    svg.append("a")
      .append("text")
      .attr("x", ((width / 2)/2)+(width / 2))
      .attr("y", height+(margin.bottom/2) + 5)
      .attr("dy", ".71em")
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("stroke", "none")
      .text("Rides provided by Uber");

});

