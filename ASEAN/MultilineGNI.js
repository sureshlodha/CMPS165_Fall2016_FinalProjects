       
//=======ParsingFunctions======================================================   
///////////////////////////////////////////////////////////////////////////////
//Justin - changing graphs, csv names, and y-axis labels from the dropdown menu

var changeGraph = 2;
var csvName = "";
var yAxisLabel = "";

function setValHDI() {changeGraph = 1; redraw(); console.log("setValHDI");}
function setValGNI() {changeGraph = 2; redraw(); console.log("setValGNI");}
function setValLife() {changeGraph = 3;}
function setValSchool() {changeGraph = 4;}

    
var margin = {top: 20, right: 110, bottom: 30, left: 80}, //margins to make sure everything is on screen
    width = 960 - margin.left - margin.right + 25, //another margin inside the margin
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse; //parse just for the years first column with 2000-2010

var x = d3.time.scale() //to keep the time within the margins
    .range([0, width]);

var y = d3.scale.linear() //scale y in a linear fashion
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis() //x-axis declaration for the line chart
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis() //y-axis declaration
    .scale(y)
    .orient("left");

var line = d3.svg.line() //interpolation of the data points
    .interpolate("basis") //smooths out lines
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.energy); });

var svg = d3.select("#linesvg").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


switch (changeGraph) {
    case 1:
        csvName = "HDI.csv";
        yAxisLabel = "Human Development Index (HDI)"
        break;
    case 2:
        csvName = "GNI.csv";
        yAxisLabel = "Gross National Income per capita ($)"
        break;
    case 3:
        csvName = "LifeExpectancy.csv";
        yAxisLabel = "Life Expectancy (years)"
        break;
    case 4:
        csvName = "YearsSchooling.csv";
        yAxisLabel = "Years of Schooling"
        break;
    default:
        break;
}




//d3.csv("EPC_2000_2010_new.csv", //was orginally .tsv but I changed it to take in .csv files
d3.csv(csvName, 
//d3.csv("LifeExpectancy.csv", 
//d3.csv("YearsSchooling.csv",        
    function(d){
          return{
             // date: new Date(+d.Year, 0, 1), //convert to column date
              date: parseDate(d.Year), //parses the date(vertical columns in csv file)
              //date: +d.Year,
              Brunei: +d.Brunei, //returns a string representing an Object
              Cambodia: +d.Cambodia,
              Indonesia: +d.Indonesia,
              Laos: +d.Laos,
              "Malaysia": +d.Malaysia, //"" to make South Africa one word, "string-concatenation"
              "Myanmar": +d.Myanmar,
              Philippines: +d.Philippines,
              Singapore: +d.Singapore,
              Thailand: +d.Thailand,
              Vietnam: +d.Vietnam
              
          }; //end of the return
    
    
    
       },//end of function(d) 
          
       
       
//===================================================================       
       
    function(error, data) {
         color.domain(d3.keys(data[0]).filter(function(key) { 
             return key !== "date"; 
         }));

  

  var countries = color.domain().map(function(name) { //map the country names to the lines
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, energy: +d[name]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([ //lower and upper bounds of the lines
    d3.min(countries, function(c) { return d3.min(c.values, function(v) { return v.energy; }); }),
    d3.max(countries, function(c) { return d3.max(c.values, function(v) { return v.energy; }); })
  ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
   // Y-axis label
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
        .attr("font-size","12px")
      .attr("transform", "rotate(-90)")
      .attr("y", -1)
      .attr("dy", "-5.7em")
      .attr("dx", "-12.2em") //so i'm able to shift vertically down.
      .style("text-anchor", "end")
      .text(yAxisLabel); //y-axis label
    
       //YEAR in the right bottom corner
      svg.append("g")
      .attr("class", "x axis")
      .call(yAxis)
    .append("text")
      .attr("font-size","12px")
      .attr("transform", "rotate(0)")
      .attr("x", 0) //changed to x from y
      //.transition().duration(1000)
      .attr("dx", "70.2em")
      .attr("dy", "38.2em")
      .style("text-anchor", "end")
      .text("year");
      /////////
    
    
    
/////////////////////////////////////////////////////////////////////////
//cite:http://www.d3noob.org/2013/01/adding-grid-lines-to-d3js-graph.html    
//======GRIDS==============================================//////////////
 svg.append("g")         //horizontal
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis
            .tickSize(-height, 0, 0)
            .tickFormat("")
        )

    svg.append("g")         
        .attr("class", "grid")
        .call(yAxis
            .tickSize(-width, 0, 0)
            .tickFormat("")
        )   
    
    


    
  
  var country = svg.selectAll(".country")
      .data(countries)
    .enter().append("g")
      .attr("class", "country");

    
    
    

    
//======================================================================//     
    

  country.append("path")  //vertical
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });
    
//=====Transitions//////////   
    
    
path = country.select("path");

  var totalLength = path.node().getTotalLength() ///looks at each individual node and tacks on the transition.
  
  
  //site: http://bl.ocks.org/duopixel/4063326
  //I used this because normally transition function would not work.
  
  path
      .attr("stroke-dasharray", (totalLength*.9999+35) + " " + totalLength) //for creating the line
      .attr("stroke-dashoffset", totalLength)
      .transition()
        .duration(3000)
        .ease("linear")
        .attr("stroke-dashoffset", 0); //since offset is 0, line stays in tack
   
    

    
//===============================================================    
    //omar - adding legend
//=======================================
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
        //var horz = 52.5 * legendRectSize;
           var horz = 48 * legendRectSize - 55;
        var vert = i * height - offset; //add more here to change y value
        return 'translate(' + horz + ',' + vert + ')';
      });

    // create the map legend
    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', color)
      .style('stroke', color);
    legend.append('text')
      .text(function(d) {return ""})
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function(d) { return d; });
    return svg; //return the svg object to further modification
});

   


 //end of draw()
