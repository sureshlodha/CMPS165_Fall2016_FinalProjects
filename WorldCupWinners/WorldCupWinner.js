//Define Margins
var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
     width = 960 - margin.left -margin.right,
    height = 500 - margin.top - margin.bottom;

//Define Color
var colors = d3.scale.category20();

//Define SVG
var svg = d3.select("body")
    .append("svg")
    .attr("class", "viz")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    
var scatterdataset;
    
d3.csv("WorldCupWinner.csv", function(error, data){
    data.forEach(function(d){
        d.player = d.player;
        d.nation = d.nation;
        d.team = d.team;
        d.age = +d.age;
        d.feet = +d.feet;
        d.inches = +d.inches;
        d.weight = +d.weight;
        d.games = +d.games;
        d.goals = +d.goals;
        d.assists = +d.assists;
        d.shots = +d.shots;
        d.shotsOT = +d.shotsOT;
        d.yearEarnings = +d.yearEarnings;
    });
scatterdataset = data;
console.log(scatterdataset);
program();
});

var xScale = d3.scale.linear()
    .domain([0, 70]) //Need to redfine this after loading the data
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain([0, 70]) //Need to redfine this after loading the data
    .range([height, 0]);
    
//Define Tooltip here
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
      
//Define Axis
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .innerTickSize(-height)
    .outerTickSize(5)
    .tickPadding(10);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .innerTickSize(-width)
    .outerTickSize(5)
    .tickPadding(10);

var xAxisData;
var yAxisData;
var toggle = 0;
var mode = 0;

function program(){
    
    //Draw Scatterplot
    svg.selectAll(".dot")
        .data(scatterdataset)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) { return (d.yearEarnings)/2; })
        .attr("cx", function(d) {return xScale(d.games);})
        .attr("cy", function(d) {return yScale(d.goals);})
        .style("fill", function (d) { return colors(d.player); })
        .style("cursor", "pointer")
        .on("mouseover", function(d){
            div.transition()		
                .duration(500)
                .ease("linear")
                .style("opacity", .9);
            div .html(d.player + "<br/>" + "Nationality: " +d.nation + "<br/>" + "Team: " + d.team + "<br/><br/>" + "Age: " + d.age +",  " + "Height: " + d.feet + "'" + d.inches + "''" + ",  " + "Weight: " + d.weight + "<br/>")	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 30) + "px");
        })
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(10)	
                .ease("linear")
                .style("opacity", 0);
        });
    
    //Draw Player Names
    svg.selectAll(".text")
        .data(scatterdataset)
        .enter().append("text")
        .attr("class","text")
        .attr("id", "pNames")
        .style("text-anchor", "middle")
        .attr("x", function(d) {return xScale(d.games);})
        .attr("y", function(d) {return yScale(d.goals);})
        .style("fill", "black")
        .style("display", "block")
        .text(function (d) {
            return d.player; });
    
    //So the tooltip displays when you mouseover names as well
    svg.selectAll(".text")
        .style("cursor", "pointer")
        .on("mouseover", function(d){
            div.transition()		
                .duration(500)
                .ease("linear")
                .style("opacity", .9);
            div .html(d.player + "<br/>" + "Nationality: " +d.nation + "<br/>" + "Team: " + d.team + "<br/><br/>" + "Age: " + d.age +",  " + "Height: " + d.feet + "'" + d.inches + "''" + ",  " + "Weight: " + d.weight + "<br/>")	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 30) + "px");
        })
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(10)	
                .ease("linear")
                .style("opacity", 0);
        });

    //x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("y", 40)
        .attr("x", width/2)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Games");

    //Y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", -150)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .text("Goals");
}

function xSelector(scatterdataset){
    var d = scatterdataset;
    var xSelectData;
    var myselect = document.getElementById("xSelect");
    console.log(myselect.options[myselect.selectedIndex].value);
    xSelectData = (myselect.options[myselect.selectedIndex].value);
    if(xSelectData == 1){
        mode = 1;
    }else if(xSelectData == 2){
        mode = 2;
    }else if(xSelectData == 3){
        mode = 3;
    }else if(xSelectData == 4){
        mode = 4;
    }else if(xSelectData == 5){
        mode = 5;
    }else if(xSelectData == 6){
        mode = 6;
    }
   
}

/*
function ySelector(scatterdataset){
    var d = scatterdataset;
    var ySelectData;
    var myselect = document.getElementById("ySelect");
    console.log(myselect.options[myselect.selectedIndex].value);
    ySelectData = (myselect.options[myselect.selectedIndex].value);
    
    if(ySelectData == 1){
        yAxisData = d.age;
    }else if(ySelectData == 2){
        yAxisData = d.games;
    }else if(ySelectData == 3){
        yAxisData = d.goals;
    }else if(ySelectData == 4){
        yAxisData = d.assists;
    }else if(ySelectData == 5){
        yAxisData = d.shots;
    }else if(ySelectData == 6){
        yAxisData = d.shotsOT;
    }
}*/

function hideNames(){
    if(toggle == 0){
        toggle = 1;
        d3.selectAll(".text").transition().attr("opacity", "0");
    }else{
        d3.selectAll(".text").transition().attr("opacity", "1");
        toggle = 0;
    }
}

function update(mode, scatterdataset, xAxis, yAxis, xAxisData, yAxisData){
    if(mode == 1){
        svg.selectAll("#cLabel").remove();
        svg.selectAll("#dLabel").remove();
        svg.selectAll(".label").transition().attr("opacity", "0");
        //update scales
        xScale.domain([0, 40]);
        yScale.domain([0, 70]);
        //update axes
        svg.select(".x.axis")
            .call(xAxis)
            .append("text")
            .attr("id", "cLabel")
            .attr("y", 40)
            .attr("x", width/2)
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .text("Age")
            .transition()
            .duration(1000)
            .call(xAxis);
        
        svg.select(".y.axis")
            .call(yAxis)
            .append("text")
            .attr("id", "dLabel")
            .attr("transform", "rotate(-90)")
            .attr("y", -60)
            .attr("x", -150)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .attr("font-size", "12px")
            .text("Goals")
            .transition()
            .duration(1000)
            .call(yAxis);
        
        //update circles
        svg.selectAll(".dot")
        .data(scatterdataset)
        .transition()
   	    .duration(1000)
        .attr("cx", function(d) {return xScale(d.age);})
        .attr("cy", function(d) {return yScale(d.goals);})
    
        //update player names
        svg.selectAll(".text")
            .data(scatterdataset)
            .transition()
   	        .duration(1000)
            .attr("x", function(d) {return xScale(d.age);})
            .attr("y", function(d) {return yScale(d.goals);});
    }
    if(mode == 2){
        svg.selectAll("#cLabel").remove();
        svg.selectAll("#dLabel").remove();
        svg.selectAll(".label").transition().attr("opacity", "0");
        //update scales
        xScale.domain([0, 35]);
        yScale.domain([0, 70]);
        //update axes
        svg.select(".x.axis")
            .call(xAxis)
            .append("text")
            .attr("id", "cLabel")
            .attr("y", 40)
            .attr("x", width/2)
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .text("Assists")
            .transition()
            .duration(1000)
            .call(xAxis);
        
        svg.select(".y.axis")
            .call(yAxis)
            .append("text")
            .attr("id", "dLabel")
            .attr("transform", "rotate(-90)")
            .attr("y", -60)
            .attr("x", -150)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .attr("font-size", "12px")
            .text("Goals")
            .transition()
            .duration(1000)
            .call(yAxis);
        
        //update circles
        svg.selectAll(".dot")
        .data(scatterdataset)
        .transition()
   	    .duration(1000)
        .attr("cx", function(d) {return xScale(d.assists);})
        .attr("cy", function(d) {return yScale(d.goals);})
    
        //update player names
        svg.selectAll(".text")
            .data(scatterdataset)
            .transition()
   	        .duration(1000)
            .attr("x", function(d) {return xScale(d.assists);})
            .attr("y", function(d) {return yScale(d.goals);});
    }
    if(mode == 3){
        svg.selectAll("#cLabel").remove();
        svg.selectAll("#dLabel").remove();
        svg.selectAll(".label").transition().attr("opacity", "0");
        //update scales
        xScale.domain([0, 400]);
        yScale.domain([0, 200]);
        //update axes
        svg.select(".x.axis")
            .call(xAxis)
            .append("text")
            .attr("id", "cLabel")
            .attr("y", 40)
            .attr("x", width/2)
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .text("Shots Taken")
            .transition()
            .duration(1000)
            .call(xAxis);
        
        svg.select(".y.axis")
            .call(yAxis)
            .append("text")
            .attr("id", "dLabel")
            .attr("transform", "rotate(-90)")
            .attr("y", -60)
            .attr("x", -150)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .attr("font-size", "12px")
            .text("Shots on Target")
            .transition()
            .duration(1000)
            .call(yAxis);
        
        //update circles
        svg.selectAll(".dot")
        .data(scatterdataset)
        .transition()
   	    .duration(1000)
        .attr("cx", function(d) {return xScale(d.shots);})
        .attr("cy", function(d) {return yScale(d.shotsOT);})
    
        //update player names
        svg.selectAll(".text")
            .data(scatterdataset)
            .transition()
   	        .duration(1000)
            .attr("x", function(d) {return xScale(d.shots);})
            .attr("y", function(d) {return yScale(d.shotsOT);});
    }
    if(mode == 4){
        svg.selectAll("#cLabel").remove();
        svg.selectAll("#dLabel").remove();
        svg.selectAll(".label").transition().attr("opacity", "0");
        //update scales
        xScale.domain([0, 180]);
        yScale.domain([0, 100]);
        //update axes
        svg.select(".x.axis")
            .call(xAxis)
            .append("text")
            .attr("id", "cLabel")
            .attr("y", 40)
            .attr("x", width/2)
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .text("Shots on Target")
            .transition()
            .duration(1000)
            .call(xAxis);
        
        svg.select(".y.axis")
            .call(yAxis)
            .append("text")
            .attr("id", "dLabel")
            .attr("transform", "rotate(-90)")
            .attr("y", -60)
            .attr("x", -150)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .attr("font-size", "12px")
            .text("Goals")
            .transition()
            .duration(1000)
            .call(yAxis);
        
        //update circles
        svg.selectAll(".dot")
        .data(scatterdataset)
        .transition()
   	    .duration(1000)
        .attr("cx", function(d) {return xScale(d.shotsOT);})
        .attr("cy", function(d) {return yScale(d.goals);})
    
        //update player names
        svg.selectAll(".text")
            .data(scatterdataset)
            .transition()
   	        .duration(1000)
            .attr("x", function(d) {return xScale(d.shotsOT);})
            .attr("y", function(d) {return yScale(d.goals);});
    }
    if(mode == 5){
        svg.selectAll("#cLabel").remove();
        svg.selectAll("#dLabel").remove();
        svg.selectAll(".label").transition().attr("opacity", "0");
        //update scales
        xScale.domain([0, 70]);
        yScale.domain([0, 70]);
        //update axes
        svg.select(".x.axis")
            .call(xAxis)
            .append("text")
            .attr("id", "cLabel")
            .attr("y", 40)
            .attr("x", width/2)
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .text("Games")
            .transition()
            .duration(1000)
            .call(xAxis);
        
        svg.select(".y.axis")
            .call(yAxis)
            .append("text")
            .attr("id", "dLabel")
            .attr("transform", "rotate(-90)")
            .attr("y", -60)
            .attr("x", -150)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .attr("font-size", "12px")
            .text("Goals")
            .transition()
            .duration(1000)
            .call(yAxis);
        
        //update circles
        svg.selectAll(".dot")
        .data(scatterdataset)
        .transition()
   	    .duration(1000)
        .attr("cx", function(d) {return xScale(d.games);})
        .attr("cy", function(d) {return yScale(d.goals);})
    
        //update player names
        svg.selectAll(".text")
            .data(scatterdataset)
            .transition()
   	        .duration(1000)
            .attr("x", function(d) {return xScale(d.games);})
            .attr("y", function(d) {return yScale(d.goals);});
    }
    if(mode == 6){
        svg.selectAll("#cLabel").remove();
        svg.selectAll("#dLabel").remove();
        svg.selectAll(".label").transition().attr("opacity", "0");
        //update scales
        xScale.domain([0, 70]);
        yScale.domain([0, 35]);
        //update axes
        svg.select(".x.axis")
            .call(xAxis)
            .append("text")
            .attr("id", "cLabel")
            .attr("y", 40)
            .attr("x", width/2)
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .text("Games")
            .transition()
            .duration(1000)
            .call(xAxis);
        
        svg.select(".y.axis")
            .call(yAxis)
            .append("text")
            .attr("id", "dLabel")
            .attr("transform", "rotate(-90)")
            .attr("y", -60)
            .attr("x", -150)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .attr("font-size", "12px")
            .text("Assists")
            .transition()
            .duration(1000)
            .call(yAxis);
        
        //update circles
        svg.selectAll(".dot")
        .data(scatterdataset)
        .transition()
   	    .duration(1000)
        .attr("cx", function(d) {return xScale(d.games);})
        .attr("cy", function(d) {return yScale(d.assists);})
    
        //update player names
        svg.selectAll(".text")
            .data(scatterdataset)
            .transition()
   	        .duration(1000)
            .attr("x", function(d) {return xScale(d.games);})
            .attr("y", function(d) {return yScale(d.assists);});
    }
}
