        //set the cooridnates of our starting view with zoom of '13' for uber vs. lyft
        var map =  L.map('map').setView([40.78, -73.94], 13);


        var margin = {left: 1080, right: 80, top: 150, bottom: 50 }, 
        //width = 560 - margin.left -margin.right,
        //height = 500 - margin.top - margin.bottom;

        
        //var parseDate = d3.time.format("%X").parse;

        mapLink = 
            '<a href="https://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
            }).addTo(map);

         
        map._initPathRoot()
        var svg = d3.select("#map").select("svg"),
	          g = svg.append("g");

        var svg1 = d3.select("#map1")
                              .append("svg")
                              .attr("width",  1750)
                              .attr("height", 650)
                              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");    

        //check HTML for json_soruces option
        var dropdown = d3.select("#json_sources");
        
        //this function allows us to dynamically switch between JSON files
        var change = function() {
            var source = dropdown.node().options[dropdown.node().selectedIndex].value;
            
            //load our json file based on drop down menu button
            d3.json(source, function(collection) {
                
                var tooltip = d3.select("#map")
                     .append("div")
                     .attr("class","tooltip");
                
                
                /* Add a LatLng object to each item in the dataset */
		        collection.objects.forEach(function(d) {
                    d.LatLng = new L.LatLng(d.Lat,d.Lon)
		        })
		      
                //create a circle for each object in our json file
                var circles = g.selectAll("circles")
			               .data(collection.objects)
			               .enter()
                           .append("circle");
                                    
                //styling the circles based on its properties in JSON
			    var circleAttributes = circles              
                           .style("stroke", "black")  
			               .style("opacity", function(d){
                               return d.opacity;
                           } ) 
			               .style("fill", function(d){
                               return d.color;
                           })
			               .attr("r", function(d){
                               return d.radius;
                           })
                            .on("mouseover", function(d) {
                                tooltip.transition()
                                       .duration(100)
                                       .style("opacity", .9)
                                tooltip.html(d["id"] 
                                    + "<br/>"
                                    + d["Time"]
                                    + "<br/> Latitude: " 
                                    + d["Lat"]  
	                                + "<br/> Longitude: " 
                                    + d["Lon"])
                                    .style("left", 1175 + "px")
                                    .style("top", 50 + "px")
                                    
                            });
                
               //[CURRENT] trying to remove circles after changing json files
		    
                //view reset is hooked to the svg.attr(dimensions") code.  the svg can be repositioned and rendered whenever the map zooms
                map.on("viewreset", update);
		        update();

                // Use Leaflet to implement a D3 geometric transformation.
		        function projectPoint(x, y) {
                    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
			        this.stream.point(point.x, point.y);
	    	     }
            
                //update function that repositions the svg and gets smaller as we zoom in -- bigger as we zoom out
                function update() {
                    circles.attr("transform", 
			        function(d) { 
				        return "translate("+ map.latLngToLayerPoint(d.LatLng).x + "," + map.latLngToLayerPoint(d.LatLng).y +")";
                    })
		        }
            })
        };

    dropdown.on("change", change);
    change(); //trigger json on load

/*  Our legend for our leaflet map  */

    svg1.append("rect")
        .attr("x", 1355)
        .attr("y", 0)
        .attr("width", 220)
        .attr("height", 180)
        .attr("fill", "orange")
        .style("stroke-size", "1px");

    svg1.append("circle")
        .attr("r", 20)
        .attr("cx", 1380)
        .attr("cy", 35)
        .style("fill", "red");

    svg1.append("circle")
        .attr("r", 20)
        .attr("cx", 1380)
        .attr("cy", 80)
        .style("fill", "purple");

    svg1.append("circle")
        .attr("r", 20)
        .attr("cx", 1380)
        .attr("cy", 125)
        .style("fill", "green");

    svg1.append("text")
        .attr("class", "label")
        .attr("x", 1475)
        .attr("y", 170)
        .style("text-anchor", "end")
        .text("Legend");

    svg1.append("text")
        .attr("class", "label")
        .attr("x", 1445)
        .attr("y", 40)
        .style("text-anchor", "end")
        .text("Uber");

    svg1.append("text")
        .attr("class", "label")
        .attr("x", 1445)
        .attr("y", 85)
        .style("text-anchor", "end")
        
        .text("Lyft");

    svg1.append("text")
        .attr("class", "label")
        .attr("x", 1480)
        .attr("y", 130)
        .style("text-anchor", "end")
        
        .text("Green Taxi");

    

