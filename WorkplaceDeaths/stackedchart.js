//Define Margin
    var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
        width = 1060 - margin.left -margin.right,
        height = 500 - margin.top - margin.bottom;
			
			//Create scale functions
			var xScale = d3.scale.linear()
								 .domain([1, 12])
								 .range([10, 900]);

			var yScale = d3.scale.linear()
								 .domain([0, 65])
								 .range([900, 10]);
        

			var rScale = d3.scale.linear()
								 .domain([0, 100])
								 .range([2, 5]);

/////////////////////////////////http://bl.ocks.org/mbostock/1849162

var x = d3.time.scale()
    .domain([new Date(2012, 0, 1), new Date(2012, 11, 31)])
    .range([0, width]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(d3.time.months)
    .tickSize(16, 0)
    .tickFormat(d3.time.format("%B"));
//////////////////////////////////////


//Define Y axis
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(12);

//Define SVG
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
//Create X axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (height) + ")")
    .call(xAxis);

//Create Y axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (-500) + ")")
    .call(yAxis);

//Y label
svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -170)
        .attr("dy", "-3em")
        .style("text-anchor", "middle")
        .text("Number of Deaths");


var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

var array = new Array(54);
for(i=1;i<=53;++i){
    array[i] = 0;
}

//draw initial plot
drawPlot(false,false,false,false,false,false);

/**********************************************************************************************/
/*******************BUTTONS********************************************************************/
/**********************************************************************************************/

//Called when CONSTRUCTION button is pressed
function highlightCON(){
    var constr = true;
    var maint = false;
    var manufac = false;
    var serv = false;
    var food = false;
    var other = false;
    d3.selectAll("circle").remove();
    drawPlot(constr, maint, manufac, serv, food, other);
}

//Called when MAINTENANCE button is pressed
function highlightMAI(){
    var constr = false;
    var maint = true;
    var manufac = false;
    var serv = false;
    var food = false;
    var other = false;
    d3.selectAll("circle").remove();
    drawPlot(constr, maint, manufac, serv, food, other);
}

//Called when MANUFACTURING button is pressed
function highlightMAN(){
    var constr = false;
    var maint = false;
    var manufac = true;
    var serv = false;
    var food = false;
    var other = false;
    d3.selectAll("circle").remove();
    drawPlot(constr, maint, manufac, serv, food, other);
}

//Called when SERVICE button is pressed
function highlightSER(){
    var constr = false;
    var maint = false;
    var manufac = false;
    var serv = true;
    var food = false;
    var other = false;
    d3.selectAll("circle").remove();
    drawPlot(constr, maint, manufac, serv, food, other);drawPlot();
}

//Called when FOOD PRODUCTION button is pressed
function highlightFOO(){
    var constr = false;
    var maint = false;
    var manufac = false;
    var serv = false;
    var food = true;
    var other = false;
    d3.selectAll("circle").remove();
    drawPlot(constr, maint, manufac, serv, food, other);
}

//Called when OTHER button is pressed
function highlightOTH(){
    var constr = false;
    var maint = false;
    var manufac = false;
    var serv = false;
    var food = false;
    var other = true;
    d3.selectAll("circle").remove();
    drawPlot(constr, maint, manufac, serv, food, other);
}
/**********************************************************************************************/
/**********************************************************************************************/
/**********************************************************************************************/

function drawPlot(con, main, man, svc, fp, other){
d3.csv("data.csv", function(data) {
    data.forEach(function(d) {//input from the csv
        d.week = +d.week;
        for(var i = 1; i<=53; ++i){
            if(i == +d.week){
                ++array[i];
            }
        }
        d.count = +d.count;
        d.date = d.date;
        d.description = d.description;
        d.industry = d.industry;
        d.cause = d.cause;
    });

     svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function(d) { 
           var c = "";
           if(d.cause == "fell"){
             c = "fell"     
           }
           if(d.cause == "crush"){
               c = "crush"
           }
           return c;
        })  
        .attr("r", 7)
        .attr("cx", function(d){
           return (d.week * 16.8); 
        })
        .attr("cy", function(d){
           return (405 - (d.count * 14)); //stack circles
        })
        
        //Assigns colors to bubbles based on cause
        .style("fill", function(d){
           if(d.cause == 'fell'){
              return "#8c510a";    
           }
           if(d.cause == 'crush'){
               return "#d8b365";
           }
           if(d.cause == 'air'){
               return "#f6e8c3";
           }
           if(d.cause == 'zap'){
               return "#c7eae5";
           }
           if(d.cause == 'vehicle'){
               return "#5ab4ac";
           }
           if(d.cause == 'other' || d.cause == 'crime'){
               return "#01665e";
           }
           if(d.cause == 'none'){
               return "lightgray";
           }
        })
        .style("stroke", "#000000") //adds border around circles

        //change opacity based on button selection
        .style("opacity", function(d){
           if(con == true){
               if(d.industry == 'construction')
                   return 1;
               else
                   return 0.1;
           }
           
           if(main == true){
               if(d.industry == 'maintenance')
                   return "1";
               else
                   return "0.1";
           }
           if(man == true){
               if(d.industry == 'manufacturing')
                   return "1";
               else
                   return "0.1";
           }
           if(svc == true){
               if(d.industry == 'service')
                   return "1";
               else
                   return "0.1";
           }
           if(fp == true){
               if(d.industry == 'food production')
                   return "1";
               else
                   return "0.1";
           }
           if(other == true){
               if(d.industry == 'other')
                   return "1";
               else
                   return "0.1";
           }
              
        })
     
    
     
        /*adapted from bl.ocks.org/d3noob*/
        .on("mouseover", function(d) {	
            div.transition()		//transition time of tooltop
                .duration(200)		
                .style("opacity", .9);		
            div	.html(d.date+ "<br/>" + d.description) //this is the content of the tooltip 
                .style("left", (d3.event.pageX) + "px")		//position of tooltip
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		//fade out
                .duration(500)		
                .style("opacity", 0);
        });
    
        var falling = d3.selectAll("fell")
        var circles = d3.selectAll("circle")
        });
}
