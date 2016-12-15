var keywidth = 20,
    keyheight = 20;


//Creates the range that domain and range that will be represented by color, referencing CSS color scheme from colorbrewer2.org
var quantizecc = d3.scale.quantize()
    .domain([0, 1250000])
    .range(d3.range(9).map(function(i) { return "c" + i + "-9"; }));

var quantizetc = d3.scale.quantize()
    .domain([0, 1300000])
    .range(d3.range(9).map(function(i) { return "t" + i + "-9"; }));
    
var quantizecp = d3.scale.quantize()
        .domain([0, 72])
        .range(d3.range(9).map(function(i) { return "c" + i + "-9"; }));

var quantizetp = d3.scale.quantize()
        .domain([0, 20])
        .range(d3.range(9).map(function(i) { return "t" + i + "-9"; }));

//'Coffee Consumption' function, 
function cc(){
    svg.selectAll("g.key").remove();
    d3.selectAll("path").remove();
    d3.select("svg").transition().duration(300);
    
    // Creating the color domain for the map (colors) and for the key (keycolors)
    var colors = [100, 40000, 50000, 150000, 200000, 270000, 350000, 500000]
    var keycolors = [0, 100, 40000, 50000, 150000, 200000, 270000, 350000, 500000]
    var key_labels = ["0", "100", "40000", "50000", "150000", "200000", "270000", "350000", "500000"];    

    //Making the color variable the actual domain for the colors
    var color = d3.scale.threshold()
        .domain(colors)
        .range(["#fff7ec","#fee8c8","#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"]);

    
    var key = svg.selectAll("g.key")
        .data(keycolors)
        .enter().append("g")
        .attr("class", "key");

    //Drawing the Key, references correct color
    key.append("rect")
          .attr("x", 20)
          .attr("y", function(d, i){ return height - (i*keyheight) - 2*keyheight;})
          .attr("width", keywidth)
          .attr("height", keyheight)
          .style("fill", function(d, i) { return color(d); })
        ;
    //Key Label Placement
    key.append("text")  
         .attr("x", 50)
         .attr("y", function(d, i){ return height - (i*keyheight) - keyheight - 4;})
         .text(function(d, i){ return key_labels[i]; });
    
    //Key Key
    key.append("text")
         .attr("x", 35)
         .attr("y", 300)
         .text("Tons Consumed");
    
    //Importing Data from JSON,
    d3.json("realfinaljson.json", function(error, globe) {
        svg.selectAll("country")
        .data(topojson.feature(globe, globe.objects.countries).features)
        //Creates path
        .enter().insert("path")
        .attr("class", "country")
        .attr("d", path)
        //country properties
		.attr("stroke-width", 1)
		.attr("stroke", "black")
		.style()
        //Tooltip transition
        .on("click", clicked)
        .on("mouseover", function(d, i, test) {
            div.transition()        
                .duration(300)      
                .style("opacity", .9);

            div .html(				
                    "<div style=\"text-align:center\">" +"<b>" +  d.properties.country + "</b>" +  "</div>" +
                    "<div style=\"float: left\">" + "Coffee Consumed in 2011(Tons): " + "</div>" +  "<div style=\"float:right\">" + d.properties.cc
             )  
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");
        })          
        .on("mouseout", function(d) {
            div .transition()		
                .duration(300)		
                .style("opacity", 0);	
        })
        //Returns
        .attr("class", function(d) { 
            if (d.properties.cc == undefined || d.properties.cc == null) { return "grey" }
            return quantizecc(d.properties.cc*3); });
    })
}



//The following three functions follow the exact same format as CC, but draw different 'returns' in during the data import



//'Tea Consumption' Function
function tc(){
    svg.selectAll("g.key").remove();
    d3.selectAll("path").remove();
    d3.select("svg").transition().duration(300);
     
    var colors = [1000, 10000, 20000, 50000, 100000, 150000, 200000, 400000]
    var keycolors = [0, 1000, 10000, 20000, 50000, 100000, 150000, 200000, 400000]
    var key_labels = ["0", "1000", "10000", "20000", "50000", "100000", "150000", "200000", "400000"];    

    var color = d3.scale.threshold()
        .domain(colors)
        .range(["#f7fcf5","#e5f5e0","#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"]);

    var key = svg.selectAll("g.key")
        .data(keycolors)
        .enter().append("g")
        .attr("class", "key");

    key.append("rect")
          .attr("x", 20)
          .attr("y", function(d, i){ return height - (i*keyheight) - 2*keyheight;})
          .attr("width", keywidth)
          .attr("height", keyheight)
          .style("fill", function(d, i) { return color(d); })
        ;

    key.append("text")  
         .attr("x", 50)
         .attr("y", function(d, i){ return height - (i*keyheight) - keyheight - 4;})
         .text(function(d, i){ return key_labels[i]; });
    
    key.append("text")
         .attr("x", 35)
         .attr("y", 300)
         .text("Tons Consumed");
    
    d3.json("realfinaljson.json", function(error, globe) {
        svg.selectAll("country")
        .data(topojson.feature(globe, globe.objects.countries).features)
        .enter().insert("path")
        .attr("class", "country")
        .attr("d", path)
		.attr("stroke-width", 1)
		.attr("stroke", "black")
		.style()
        .on("click", clicked)
        .on("mouseover", function(d, i, test) {
            div.transition()        
                .duration(300)      
                .style("opacity", .9);

            div .html(				
                    "<div style=\"text-align:center\">" +"<b>" +  d.properties.country + "</b>" +  "</div>" +
                    "<div style=\"float: left\">" + "Tea Consumed in 2011(Tons): " + "</div>" +  "<div style=\"float:right\">" + d.properties.tc
             )  
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");
        })          
        .on("mouseout", function(d) {
            div .transition()		
                .duration(300)		
                .style("opacity", 0);	
        })     
        .attr("class", function(d) { 
            if (d.properties.tc == undefined || d.properties.tc == null) { return "grey" }
            return quantizetc(d.properties.tc*3.5); });
    })
}

//'Coffee per Person' Function
function cp(){
    svg.selectAll("g.key").remove();
    d3.selectAll("path").remove();
    d3.select("body").transition();
    
    // key
    var colors = [1, 5, 8, 10, 15, 17, 20, 22]
    var keycolors = [0, 1, 5, 8, 10, 15, 17, 20, 22]
    var key_labels = ["0", "1", "5", "8", "10", "15", "17", "20", "22"];    

    var color = d3.scale.threshold()
        .domain(colors)
        .range(["#fff7ec","#fee8c8","#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"]);

      var key = svg.selectAll("g.key")
        .data(keycolors)
        .enter().append("g")
        .attr("class", "key");

    key.append("rect")
          .attr("x", 20)
          .attr("y", function(d, i){ return height - (i*keyheight) - 2*keyheight;})
          .attr("width", keywidth)
          .attr("height", keyheight)
          .style("fill", function(d, i) { return color(d); })
        ;

    key.append("text")  
         .attr("x", 50)
         .attr("y", function(d, i){ return height - (i*keyheight) - keyheight - 4;})
         .text(function(d, i){ return key_labels[i]; });
    
    key.append("text")
         .attr("x", 35)
         .attr("y", 300)
         .text("Grams/Capita/Day");
    
    d3.json("realfinaljson.json", function(error, globe) {
        svg.selectAll("country")
        .data(topojson.feature(globe, globe.objects.countries).features)
        .enter().insert("path")
        .attr("class", "country")
        .attr("d", path)
		.attr("stroke-width", 1)
		.attr("stroke", "black")
		.style()
        .on("click", clicked)
        .on("mouseover", function(d, i, test) {
            div.transition()        
                .duration(300)      
                .style("opacity", .9);

            div .html(				
                    "<div style=\"text-align:center\">" +"<b>" +  d.properties.country + "</b>" +  "</div>" +
                    "<div style=\"float: left\">" + "Grams of Coffee Consumed Per Person Per Day: " + "</div>" +  "<div style=\"float:right\">" + d.properties.cp
             )  
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");
        })          
        .on("mouseout", function(d) {
            div .transition()		
                .duration(300)		
                .style("opacity", 0);	
        })     
        .attr("class", function(d) { 
            if (d.properties.cp == undefined || d.properties.cp == null) { return "grey" }
            return quantizecp(d.properties.cp*3); });
    })
}

//'Tea per Person Function'
function tp(){
    svg.selectAll("g.key").remove();
    d3.selectAll("path").remove();
    d3.select("body").transition();
    
    var colors = [0.5, 1, 2, 3, 4, 5, 6, 7]
    var keycolors = [0, 0.5, 1, 2, 3, 4, 5, 6, 7]
    var key_labels = ["0", "0.5", "1", "2", "3", "4", "5", "6", "7"];
    
     var color = d3.scale.threshold()
        .domain(colors)
        .range(["#f7fcf5","#e5f5e0","#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"]);

    var key = svg.selectAll("g.key")
        .data(keycolors)
        .enter().append("g")
        .attr("class", "key");

    key.append("rect")
          .attr("x", 20)
          .attr("y", function(d, i){ return height - (i*keyheight) - 2*keyheight;})
          .attr("width", keywidth)
          .attr("height", keyheight)
          .style("fill", function(d, i) { return color(d); })
        ;

    key.append("text")  
         .attr("x", 50)
         .attr("y", function(d, i){ return height - (i*keyheight) - keyheight - 4;})
         .text(function(d, i){ return key_labels[i]; });
    
    key.append("text")
         .attr("x", 35)
         .attr("y", 300)
         .text("Grams/Capita/Day");
    
    d3.json("realfinaljson.json", function(error, globe) {
        svg.selectAll("country")
        .data(topojson.feature(globe, globe.objects.countries).features)
        .enter().insert("path")
        .attr("class", "country")
        .attr("d", path)
		.attr("stroke-width", 1)
		.attr("stroke", "black")
		.style()
        .on("click", clicked)
        .on("mouseover", function(d, i, test) {
            div.transition()        
                .duration(300)      
                .style("opacity", .9);

            div .html(				
                    "<div style=\"text-align:center\">" +"<b>" +  d.properties.country + "</b>" +  "</div>" +
                    "<div style=\"float: left\">" + "Grams of Tea Consumed Per Person Per Day: " + "</div>" +  "<div style=\"float:right\">" + d.properties.tp
             )  
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");
        })          
        .on("mouseout", function(d) {
            div .transition()		
                .duration(300)		
                .style("opacity", 0);	
        })     
        .attr("class", function(d) { 
            if (d.properties.tp == undefined || d.properties.tp == null) { return "grey" }
            return quantizetp(d.properties.tp*2.75 ); });
    })
}
