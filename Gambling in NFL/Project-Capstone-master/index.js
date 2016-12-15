var margin = {top: 10, right: 120, bottom: 25, left: 80},
    width = 1340 - margin.left - margin.right,
    height = 290 - margin.top - margin.bottom;

var svgD = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("z-index", 1)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svgO = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top - 260) + ")");

var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

var nest, ball, year;
var oIndex, dIndex, bet, payout;
var teamA, teamB;
var rT, rG, oC, lG, lT, wr1, wr2, wr3, wr4, rb, qb;
var dl1, dl2, dl3, dl4, ml1, ml2, cb1, cb2, cb3, cb4, fs;

function clearScreenO()
{
    svgO.selectAll("*").remove();
}
function clearScreenD()
{
    svgD.selectAll("*").remove();
}

function showValue(newValue)
{
    document.getElementById("range").innerHTML = "<b> " + newValue + " </b>";
    year = newValue;
    
    parseData();
}

function parseData()
{
    clearScreenO();
    clearScreenD();
    var o = document.getElementById("teamO");
    var d = document.getElementById("teamD");
    if(o.length > 0)
	for(var i = 0; i < 32; i++)
	    o.remove(0);
    if(d.length > 0)
	for(var i = 0; i < 32; i++)
	    d.remove(0);
    document.getElementById("results").value = "Enter bet and select team";
    
    oIndex = -1;
    dIndex = -1;
    payout = 1;
    
    var yearFile = "CSV/" + year + ".csv";
 
    d3.csv(yearFile, function(error, data)
    {    
        nest = d3.nest()
            .key(function(d) { return d.team; })
            .entries(data);
        
        for(var i = 0; i < 32; i++)
        {
            var optionO = document.createElement("option");
            var optionD = document.createElement("option");
            optionO.text = nest[i].key;
            optionD.text = nest[i].key;
            o.append(optionO);
            d.append(optionD);
        }
    });
}

function offenseSelected() 
{
        clearScreenO();

        var selectedValue = document.getElementById("teamO");
        oIndex = selectedValue.selectedIndex;
        
        var oLogo = svgO.append("image")
                    .attr("class", "image")
                    .attr("width", "200")
                    .attr("height", "200")
                    .attr("xlink:href", function() { return "images/" + selectedValue.options[selectedValue.selectedIndex].text + ".png"; })
		    .attr("opacity", 0.75)
                    .attr("x", 500)
                    .attr("y", 300);
        
        var oLineT = svgO.selectAll("oLtext")
                    .data(nest)
                    .enter().append("text")
                    .attr("class","text")
                    .style("text-anchor", "middle")
                    .attr("x", 600)
                    .attr("y", 400)
		    .style("fill-opacity", 0.2)
		    .style("stroke-opacity", 0.2)
                    .style("fill", "white")
                    .style("stroke", "grey")
                    .style("font-family", "verdana")
                    .style("font-size", "90px")
                    .style("stroke-width", 5)
                    .text(function () {return selectedValue.options[selectedValue.selectedIndex].text; });

        lT = svgO.selectAll("ocircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return Math.sqrt(nest[selectedValue.selectedIndex].values[0].rushing) * 0.7; })
                    .attr("cx", 380)
                    .attr("cy", 300)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Left Tackle</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Rushing Yards: " + 
                                  nest[selectedValue.selectedIndex].values[0].rushing + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        lT.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        
                        lT.transition()
                            .delay(50)
                            .attr("cy", 350);
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        lT.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        
                        lT.transition()
                            .delay(100)
                            .attr("cy", 300);
                    });
        lG = svgO.selectAll("ocircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return Math.sqrt(nest[selectedValue.selectedIndex].values[0].rushing) * 0.7; })
                    .attr("cx", 490)
                    .attr("cy", 300)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Left Guard</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Rushing Yards: " + 
                                  nest[selectedValue.selectedIndex].values[0].rushing + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        lG.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; });
            
                        lG.transition()
                            .delay(50)
                            .attr("cy", 350);
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        lG.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; });
            
                        lG.transition()
                            .delay(50)
                            .attr("cy", 300);
                    });
        cO = svgO.selectAll("ocircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return Math.sqrt(nest[selectedValue.selectedIndex].values[0].rushing) * 0.7; })
                    .attr("cx", 600)
                    .attr("cy", 300)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Center</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Rushing Yards: " + 
                                  nest[selectedValue.selectedIndex].values[0].rushing + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        cO.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; });
            
                        cO.transition()
                            .delay(50)
                            .attr("cy", 350);
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        cO.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; });
            
                        cO.transition()
                            .delay(50)
                            .attr("cy", 300);
                    });
        rG = svgO.selectAll("ocircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return Math.sqrt(nest[selectedValue.selectedIndex].values[0].rushing) * 0.7; })
                    .attr("cx", 710)
                    .attr("cy", 300)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Right Guard</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Rushing Yards: " + 
                                  nest[selectedValue.selectedIndex].values[0].rushing + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        rG.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; });
            
                        rG.transition()
                            .delay(50)
                            .attr("cy", 350);
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        rG.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; });
            
                        rG.transition()
                            .delay(50)
                            .attr("cy", 300);
                    });
        rT = svgO.selectAll("ocircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return Math.sqrt(nest[selectedValue.selectedIndex].values[0].rushing) * 0.7; })
                    .attr("cx", 820)
                    .attr("cy", 300)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Right Tackle</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Rushing Yards: " + 
                                  nest[selectedValue.selectedIndex].values[0].rushing + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        rT.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; });
            
                        rT.transition()
                            .delay(50)
                            .attr("cy", 350);
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        rT.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; });
            
                        rT.transition()
                            .delay(50)
                            .attr("cy", 300);
                    });
        qb = svgO.selectAll("qbcircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return nest[selectedValue.selectedIndex].values[0].points * 0.1; })
                    .attr("cx", 600)
                    .attr("cy", 450)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Quaterback</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Rushing Yards: " + nest[selectedValue.selectedIndex].values[0].rushing +
                                  "<br/>Passing Yards: " + nest[selectedValue.selectedIndex].values[0].passing + "<br/>Total Points: " + nest[selectedValue.selectedIndex].values[0].points
                                  + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        qb.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; });
            
                        ball = svgO.append("ellipse")
                            .attr("cx", 600)
                            .attr("cy", 450)
                            .attr("rx", 25)
                            .attr("ry", 15)
                            .attr("fill", "brown");
            
                        ball.transition()
                            .duration(1000)
                            .delay(10)
                            .attr("cx", 140)
                            .attr("cy", 300);
		
			cb1.transition()
                            .duration(1000)
                            .delay(10)
                            .attr("cy", 240);
		
			fs.transition()
                            .duration(1000)
                            .delay(10)
			    .attr("cx", 140)
                            .attr("cy", 150);
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        qb.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; });
            
                        ball.remove();
		
			cb1.transition()
                            .duration(300)
                            .delay(10)
                            .attr("cy", 180);
		
			fs.transition()
                            .duration(300)
                            .delay(10)
			    .attr("cx", 600)
                            .attr("cy", 100);
                    });
        rb = svgO.selectAll("ocircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return Math.sqrt(nest[selectedValue.selectedIndex].values[0].rushing) * 0.7; })
                    .attr("cx", 710)
                    .attr("cy", 500)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Running Back</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Rushing Yards: " + 
                                  nest[selectedValue.selectedIndex].values[0].rushing + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        rb.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; });
            
                        ball = svgO.append("ellipse")
                            .attr("cx", 710)
                            .attr("cy", 500)
                            .attr("rx", 25)
                            .attr("ry", 15)
                            .attr("fill", "brown");
            
                        rb.transition()
                            .duration(500)
                            .delay(200)
                            .attr("cx", 650)
                            .attr("cy", 300);
            
                        ball.transition()
                            .duration(500)
                            .delay(200)
                            .attr("cx", 650)
                            .attr("cy", 300);
		
			ml1.transition()
                            .duration(1000)
                            .delay(10)
			    .attr("cx", 650)
                            .attr("cy", 150);
		
			ml2.transition()
                            .duration(1000)
                            .delay(10)
			    .attr("cx", 650)
                            .attr("cy", 200);
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        rb.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; });
            
                        rb.transition()
                            .delay(100)
                            .attr("cx", 710)
                            .attr("cy", 500);
            
                        ball.remove();
		
			ml1.transition()
                            .duration(300)
                            .delay(10)
			    .attr("cx", 490)
                            .attr("cy", 180);
		
			ml2.transition()
                            .duration(300)
                            .delay(10)
			    .attr("cx", 710)
                            .attr("cy", 180);
                    });
        wr1 = svgO.selectAll("wrcircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return Math.sqrt(nest[selectedValue.selectedIndex].values[0].passing) * 0.5; })
                    .attr("cx", 140)
                    .attr("cy", 300)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Wide Reciever</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Passing Yards: " + 
                                  nest[selectedValue.selectedIndex].values[0].passing + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        wr1.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; });
            
                        ball = svgO.append("ellipse")
                            .attr("cx", 600)
                            .attr("cy", 450)
                            .attr("rx", 25)
                            .attr("ry", 15)
                            .attr("fill", "brown");
            
                        ball.transition()
                            .duration(1000)
                            .delay(10)
                            .attr("cx", 140)
                            .attr("cy", 300);
		
			cb1.transition()
                            .duration(1000)
                            .delay(10)
                            .attr("cy", 240);
		
			fs.transition()
                            .duration(1000)
                            .delay(10)
			    .attr("cx", 200)
                            .attr("cy", 170);
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        wr1.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; });
            
                        ball.remove();
		
			cb1.transition()
                            .duration(300)
                            .delay(10)
                            .attr("cy", 180);
		
			fs.transition()
                            .duration(300)
                            .delay(10)
			    .attr("cx", 600)
                            .attr("cy", 100);
                    });
        wr2 = svgO.selectAll("wrcircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return Math.sqrt(nest[selectedValue.selectedIndex].values[0].passing) * 0.5; })
                    .attr("cx", 250)
                    .attr("cy", 350)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Wide Reciever</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Passing Yards: " +
                                  nest[selectedValue.selectedIndex].values[0].passing + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        wr2.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; });
            
                        ball = svgO.append("ellipse")
                            .attr("cx", 600)
                            .attr("cy", 450)
                            .attr("rx", 25)
                            .attr("ry", 15)
                            .attr("fill", "brown");
            
                        ball.transition()
                            .duration(1000)
                            .delay(10)
                            .attr("cx", 250)
                            .attr("cy", 350);
		
			cb2.transition()
                            .duration(1000)
                            .delay(10)
                            .attr("cy", 180);
		
			fs.transition()
                            .duration(1000)
                            .delay(10)
			    .attr("cx", 310)
                            .attr("cy", 170);
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        wr2.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; });
            
                        ball.remove();
		
			cb2.transition()
                            .duration(300)
                            .delay(10)
                            .attr("cy", 240);
		
			fs.transition()
                            .duration(300)
                            .delay(10)
			    .attr("cx", 600)
                            .attr("cy", 100);
                    });
        wr3 = svgO.selectAll("wrcircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return Math.sqrt(nest[selectedValue.selectedIndex].values[0].passing) * 0.5; })
                    .attr("cx", 1060)
                    .attr("cy", 300)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Wide Reciever</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Passing Yards: " + 
                                  nest[selectedValue.selectedIndex].values[0].passing + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        wr3.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; });
            
                        ball = svgO.append("ellipse")
                            .attr("cx", 600)
                            .attr("cy", 450)
                            .attr("rx", 25)
                            .attr("ry", 15)
                            .attr("fill", "brown");
            
                        ball.transition()
                            .duration(1000)
                            .delay(10)
                            .attr("cx", 1060)
                            .attr("cy", 300);
		
			cb3.transition()
                            .duration(1000)
                            .delay(10)
                            .attr("cy", 240);
		
			fs.transition()
                            .duration(1000)
                            .delay(10)
			    .attr("cx", 1000)
                            .attr("cy", 170);
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        wr3.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; });
            
                        ball.remove();
		
			cb3.transition()
                            .duration(300)
                            .delay(10)
                            .attr("cy", 180);
		
			fs.transition()
                            .duration(300)
                            .delay(10)
			    .attr("cx", 600)
                            .attr("cy", 100);
                    });
        wr4 = svgO.selectAll("wrcircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return Math.sqrt(nest[selectedValue.selectedIndex].values[0].passing) * 0.5; })
                    .attr("cx", 950)
                    .attr("cy", 350)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Wide Reciever</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Passing Yards: " + 
                                  nest[selectedValue.selectedIndex].values[0].passing + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        wr4.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; });
            
                        ball = svgO.append("ellipse")
                            .attr("cx", 600)
                            .attr("cy", 450)
                            .attr("rx", 25)
                            .attr("ry", 15)
                            .attr("fill", "brown");
            
                        ball.transition()
                            .duration(1000)
                            .delay(10)
                            .attr("cx", 950)
                            .attr("cy", 350);
		
			cb4.transition()
                            .duration(1000)
                            .delay(10)
                            .attr("cy", 200);
		
			fs.transition()
                            .duration(1000)
                            .delay(10)
			    .attr("cx", 890)
                            .attr("cy", 170);
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        wr4.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; });
            
                        ball.remove();
		
			cb4.transition()
                            .duration(300)
                            .delay(10)
                            .attr("cy", 240);
		
			fs.transition()
                            .duration(300)
                            .delay(10)
			    .attr("cx", 600)
                            .attr("cy", 100);
                    });
    }

function defenseSelected() 
    {
        clearScreenD();

        var selectedValue = document.getElementById("teamD");
        dIndex = selectedValue.selectedIndex;
        
        var dLogo = svgD.append("image")
            .attr("class", "image")
            .attr("width", "200")
            .attr("height", "200")
            .attr("xlink:href", function() { return "images/" + selectedValue.options[selectedValue.selectedIndex].text + ".png"; })
	    .attr("opacity", 0.75)
            .attr("x", 500)
            .attr("y", 80);
        
        var dLineT = svgD.selectAll("dLtext")
                    .data(nest)
                    .enter().append("text")
                    .attr("class","text")
                    .style("text-anchor", "middle")
                    .attr("x", 600)
                    .attr("y", 210)
		    .style("fill-opacity", 0.2)
		    .style("stroke-opacity", 0.2)
                    .style("fill", "white")
                    .style("stroke", "grey")
                    .style("font-family", "verdana")
                    .style("font-size", "90px")
                    .style("stroke-width", 5)
                    .text(function () {return selectedValue.options[selectedValue.selectedIndex].text; });

        dl1 = svgD.selectAll("dcircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return nest[selectedValue.selectedIndex].values[0].sacks * 0.7; })
                    .attr("cx", 435)
                    .attr("cy", 240)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Defensive Lineman</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Total Sacks: " + 
                                  nest[selectedValue.selectedIndex].values[0].sacks + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        dl1.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; });
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        dl1.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; });
                    });
        dl2 = svgD.selectAll("dcircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return nest[selectedValue.selectedIndex].values[0].sacks * 0.7; })
                    .attr("cx", 545)
                    .attr("cy", 240)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Defensive Lineman</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Total Sacks: " + 
                                  nest[selectedValue.selectedIndex].values[0].sacks + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        dl2.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        dl2.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    });
        dl3 = svgD.selectAll("dcircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return nest[selectedValue.selectedIndex].values[0].sacks * 0.7; })
                    .attr("cx", 655)
                    .attr("cy", 240)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Defensive Lineman</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Total Sacks: " + 
                                  nest[selectedValue.selectedIndex].values[0].sacks + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        dl3.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        dl3.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    });
        dl4 = svgD.selectAll("dcircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return nest[selectedValue.selectedIndex].values[0].sacks * 0.7; })
                    .attr("cx", 765)
                    .attr("cy", 240)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Defensive Lineman</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Total Sacks: " + 
                                  nest[selectedValue.selectedIndex].values[0].sacks + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        dl4.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        dl4.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    });
        ml1 = svgD.selectAll("mcircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return nest[selectedValue.selectedIndex].values[0].fumbles; })
                    .attr("cx", 490)
                    .attr("cy", 180)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Linebacker</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Total Fumbles: " + 
                                  nest[selectedValue.selectedIndex].values[0].fumbles + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        ml1.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; });
		
			ml1.transition()
                            .duration(1000)
                            .delay(10)
                            .attr("cy", 130);
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        ml1.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; });
		
			ml1.transition()
                            .duration(200)
                            .delay(10)
                            .attr("cy", 180);
                    });
        ml2 = svgD.selectAll("mcircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return nest[selectedValue.selectedIndex].values[0].fumbles; })
                    .attr("cx", 710)
                    .attr("cy", 180)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Linebacker</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Total Fumbles: " + 
                                  nest[selectedValue.selectedIndex].values[0].fumbles + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        ml2.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; });
			
			ml2.transition()
                            .duration(1000)
                            .delay(10)
                            .attr("cy", 130);
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        ml2.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; });
		
			ml2.transition()
                            .duration(200)
                            .delay(10)
                            .attr("cy", 180);
                    });
        cb1 = svgD.selectAll("ccircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return (nest[selectedValue.selectedIndex].values[0].ints) * 1.5; })
                    .attr("cx", 140)
                    .attr("cy", 180)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Conerback</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Total Interceptions: " + 
                                  nest[selectedValue.selectedIndex].values[0].ints + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        cb1.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; });
		
			cb1.transition()
                            .duration(1000)
                            .delay(10)
                            .attr("cy", 240);
		
			fs.transition()
                            .duration(1000)
                            .delay(10)
			    .attr("cx", 140)
                            .attr("cy", 150);
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        cb1.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; });
		
			cb1.transition()
                            .duration(200)
                            .delay(10)
                            .attr("cy", 180);
		
			fs.transition()
                            .duration(200)
                            .delay(10)
			    .attr("cx", 600)
                            .attr("cy", 100);
                    });
        cb2 = svgD.selectAll("ccircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return (nest[selectedValue.selectedIndex].values[0].ints) * 1.5; })
                    .attr("cx", 250)
                    .attr("cy", 240)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Conerback</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Total Interceptions: " + 
                                  nest[selectedValue.selectedIndex].values[0].ints + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        cb2.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; });
		
			cb2.transition()
                            .duration(1000)
                            .delay(10)
                            .attr("cy", 210);
		
			fs.transition()
                            .duration(1000)
                            .delay(10)
			    .attr("cx", 310)
                            .attr("cy", 140);
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        cb2.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; });
		
			cb2.transition()
                            .duration(200)
                            .delay(10)
                            .attr("cy", 240);
		
			fs.transition()
                            .duration(200)
                            .delay(10)
			    .attr("cx", 600)
                            .attr("cy", 100);
                    });
        cb3 = svgD.selectAll("ccircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return (nest[selectedValue.selectedIndex].values[0].ints) * 1.5; })
                    .attr("cx", 1060)
                    .attr("cy", 180)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Conerback</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Total Interceptions: " + 
                                  nest[selectedValue.selectedIndex].values[0].ints + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        cb3.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; });
		
			cb3.transition()
                            .duration(1000)
                            .delay(10)
                            .attr("cy", 240);
		
			fs.transition()
                            .duration(1000)
                            .delay(10)
			    .attr("cx", 1060)
                            .attr("cy", 150);
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        cb3.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; });
		
			cb3.transition()
                            .duration(200)
                            .delay(10)
                            .attr("cy", 180);
		
			fs.transition()
                            .duration(200)
                            .delay(10)
			    .attr("cx", 600)
                            .attr("cy", 100);
                    });
        cb4 = svgD.selectAll("ccircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return (nest[selectedValue.selectedIndex].values[0].ints) * 1.5; })
                    .attr("cx", 950)
                    .attr("cy", 240)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Conerback</br>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Total Interceptions: " + 
                                  nest[selectedValue.selectedIndex].values[0].ints + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        cb4.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; });
		
			cb4.transition()
                            .duration(1000)
                            .delay(10)
                            .attr("cy", 210);
		
			fs.transition()
                            .duration(1000)
                            .delay(10)
			    .attr("cx", 890)
                            .attr("cy", 140);
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        cb4.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; });
		
			cb4.transition()
                            .duration(200)
                            .delay(10)
                            .attr("cy", 240);
		
			fs.transition()
                            .duration(200)
                            .delay(10)
			    .attr("cx", 600)
                            .attr("cy", 100);
                    });
        fs = svgD.selectAll("ccircle")
                    .data(nest)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", function() { return (nest[selectedValue.selectedIndex].values[0].ints) * 1.5; })
                    .attr("cx", 600)
                    .attr("cy", 100)
                    .style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                    .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                    .style("stroke-width", 5)
                    .on("mouseover", function() {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html("<strong>Free Safety<br/>" + selectedValue.options[selectedValue.selectedIndex].text + "<br/>Total Interceptions: " + 
                                  nest[selectedValue.selectedIndex].values[0].ints + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            
                        fs.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color1; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color2; });
		
			fs.transition()
                            .duration(600)
                            .delay(10)
			    .attr("cx", 400)
                            .attr("cy", 150);
		
			fs.transition()
                            .duration(600)
                            .delay(600)
			    .attr("cx", 800);
                    })					
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
            
                        fs.style("fill", function () { return nest[selectedValue.selectedIndex].values[0].color2; })
                        .style("stroke", function () { return nest[selectedValue.selectedIndex].values[0].color1; });
		
			fs.transition()
                            .duration(200)
                            .delay(10)
			    .attr("cx", 600)
                            .attr("cy", 100);
                    });
    }

function findBet(value)
{   
    if(value == "o")
    {
        teamA = oIndex;
        teamB = dIndex;
    }
    else if(value == "d")
    {
        teamA = dIndex;
        teamB = oIndex;
    }
    
    bet = document.getElementById("betAmount").value;
    
    /*Comparing the same data from each team*/
    payout = nest[teamA].values[0].passing / nest[teamB].values[0].passing;
    payout += nest[teamA].values[0].rushing / nest[teamB].values[0].rushing;
    payout += nest[teamA].values[0].points / nest[teamB].values[0].points;
    payout += nest[teamA].values[0].ints / nest[teamB].values[0].ints;
    payout += nest[teamA].values[0].sacks / nest[teamB].values[0].sacks;
    payout += nest[teamA].values[0].fumbles / nest[teamB].values[0].fumbles;
    
    /*Comparing the offense against the defense*/
    payout += Math.sqrt(nest[teamA].values[0].passing) / (nest[teamB].values[0].sacks);
    payout += Math.sqrt(nest[teamA].values[0].rushing) / (nest[teamB].values[0].ints + nest[teamB].values[0].fumbles);
    payout += Math.sqrt(nest[teamA].values[0].points) / (nest[teamB].values[0].ints * nest[teamB].values[0].fumbles);
    
    bet *= payout / 10.5;
    
    console.log(bet);
	
    displayResults();
}

function displayResults()
{
	var oldBet = document.getElementById("betAmount").value;

	if(payout > 1.3 || payout < 0.7)
	{
		document.getElementById("results").value = "Your team, the " + nest[teamA].values[0].team + ", will give you a payout of "
			+ d3.round((bet - oldBet), 2);
	}
	else
		document.getElementById("results").value = "The teams are similiarly matched and it will end up close";
}
