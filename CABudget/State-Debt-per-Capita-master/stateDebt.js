    // Various accessors that specify the four dimensions of data to visualize.
    function x(d) { return d.expenses; }
    function y(d) { return d.income; }
    function radius(d) { return d.perCapita; }
    function color(d) { return d.region; }
    function key(d) { return d.name; }

    // Map Dimensions
    var width = 1100, height = 140;

    // Create the SVG container and set the origin.
    var map = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");

    // D3 Projection
    var projection = d3.geo.albersUsa()
        .translate([width/2, 65])
        .scale([250]);

    // Define path generator
    var path = d3.geo.path()
        .projection(projection);

    var colorScale = d3.scale.linear()                  .range(["#FFFFFF","#32CD32","#FF0000","#0000CD","#0000FF","#3CB371","#FFA500","#FF0000",
        "#D2691E","#A0522D","#FFD700"]);

    d3.csv("states.csv", function(data){
        colorScale.domain([0,1,2,3,4,5,6,7,8,9,10]);

        d3.json("us-states.json", function(json) {
            // Loop through each state data value in the .csv file
            for (var i = 0; i < data.length; i++) {
                // Grab State Name
                var dataState = data[i].state;
                // Grab data value 
                var dataValue = data[i].addColor;
                // Find the corresponding state inside the GeoJSON
                for (var j = 0; j < json.features.length; j++)  {
                    var jsonState = json.features[j].properties.name;
                    if (dataState == jsonState) {
                        // Copy the data value into the JSON
                        json.features[j].properties.addColor = dataValue; 
                        // Stop looking through the JSON
                        break;
                    }
                }
            }

            // Bind the data to the SVG and create one path per GeoJSON feature
            map.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("stroke", "#000000")
                .style("stroke-width", "1")
                .style("fill", function(d) {
                    // Get data value
                    var value = d.properties.addColor;
                    if (value) {
                        //If value exists…
                        return colorScale(value);
                    } else {
                        //If value is undefined…
                        return "rgb(213,222,217)";
                    }
                });
        });
    });

    // Chart dimensions.
    var margin2 = {top: 5, right: 20, bottom: 30, left: 40},
        width = 1024 - margin2.left - margin2.right,
        height = 550 - margin2.top - margin2.bottom;
    
    // Various scales. These domains make assumptions of data, naturally.
    var xScale = d3.scale.linear().domain([1, 60])
        .range([0, width]);
    var yScale = d3.scale.linear().domain([1, 60])
        .range([height, 0]);
    var radiusScale = d3.scale.sqrt().domain([0, 12500])
        .range([0, 50]);
    var colorScale2 = d3.scale.ordinal().domain(["1","2","3","4","5","6","7","8","9","10"])  .range(["#32CD32","#FF0000","#0000CD","#0000FF","#3CB371","#FFA500","#FF0000","#D2691E",
                                                    "#A0522D","#FFD700"]);
		
    // The x & y axes.
    var xAxis = d3.svg.axis()
        .orient("bottom").scale(xScale)
        .ticks(12, d3.format(",d"));
    
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");
		
    // Create the SVG container and set the origin.
    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin2.left + margin2.right)
        .attr("height", height + margin2.top + margin2.bottom)
        .append("g")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
    
    // Add the x-axis.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
    // Add the y-axis.
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    
    // Add an x-axis label.
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Expenses (billions)");
    
    // Add a y-axis label.
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Revenue (billions)");

    //legend for population size
    // draw legend colored rectangles
    svg.append("rect")
        .attr("x", 25)
        //.attr("y", height-230)
        .attr("y", 0)
        .attr("width", 260)
        .attr("height", 175)
        .attr("fill", "lightgrey")
        .style("stroke-size", "1px");

    svg.append("circle")
        .attr("r", 10)
        .attr("cx", 225)
        //.attr("cy", height-215)
        .attr("cy", 160)
        .style("fill", "white");
    
    svg.append("circle")
        .attr("r", 20)
        .attr("cx", 225)
        //.attr("cy", height-190)
        .attr("cy", 130)
        .style("fill", "white");

    svg.append("circle")
        .attr("r", 50)
        .attr("cx", 225)
        //.attr("cy", height-120)
        .attr("cy", 60)
        .style("fill", "white");

    svg.append("text")
        .attr("class", "label")
        .attr("x", 160)
        //.attr("y", height-212)
        .attr("y", 165)
        .style("text-anchor", "end")
        .text("$650 debt per Capita");

    svg.append("text")
        .attr("class", "label")
        .attr("x", 160)
        //.attr("y", height-187)
        .attr("y", 130)
        .style("text-anchor", "end")
        .text("$5000 debt per Capita");

    svg.append("text")
        .attr("class", "label")
        .attr("x", 160)
        //.attr("y", height-117)
        .attr("y", 65)
        .style("text-anchor", "end")
        .text("$12,500 debt per Capita");
    
    // Add the year label; the value is set on transition.
    var label = svg.append("text")
        .attr("class", "year label")
        .attr("text-anchor", "end")
        .attr("y", height - 24)
        .attr("x", width)
        .text(2000);

    var div = d3.select("#chart").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
		
    // Load the data.
    d3.json("states.json", function(error, states) {
		if (error) throw error;
        
        // A bisector since many nation's data is sparsely-defined.
        var bisect = d3.bisector(function(d) { return d[0]; });

        // Add a dot per nation. Initialize the data at 2009, and set the colors.
        var dot = svg.append("g")
            .attr("class", "dots")
            .selectAll(".dot")
            .data(interpolateData(2000))
            .enter().append("circle")
            .attr("class", "dot")
            .style("fill", function(d) { return colorScale2(color(d)); })
            .call(position)
            .sort(order)
            .on("mouseover", function(d) {
                div.transition()
                .duration(275)
                .style("opacity", .9);
                var expenses = "Expenses: " + Math.round(d.expenses * 10)/10 + " Billion";
                var income = "Income: " + Math.round(d.income * 10)/10 + " Billion";
                var perCapita = "Debt per Capita: " + Math.round(d.perCapita * 10)/10;
                div.html(d.name + "<br>" + expenses + "<br>" + income + "<br>" + perCapita)
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                   .duration(300)
                   .style("opacity", 0);
            });

          // Add a title.
          dot.append("title")
              .text(function(d) { return d.name; });

          // Add an overlay for the year label.
          var box = label.node().getBBox();

          var overlay = svg.append("rect")
                .attr("class", "overlay")
                .attr("x", box.x)
                .attr("y", box.y)
                .attr("width", box.width)
                .attr("height", box.height - 20)
                .on("mouseover", enableInteraction);

          // Start a transition that interpolates the data based on year.
          svg.transition()
              .duration(15000)
              .ease("linear")
              .tween("year", tweenYear)
              .each("end", enableInteraction);

          // Positions the dots based on data.
          function position(dot) {
             dot.attr("cx", function(d) { return xScale(x(d)); })
                .attr("cy", function(d) { return yScale(y(d)); })
                .attr("r", function(d) { return radiusScale(radius(d)); });
          }

          // Defines a sort order so that the smallest dots are drawn on top.
          function order(a, b) {
            return radius(b) - radius(a);
          }

          // After the transition finishes, you can mouseover to change the year.
          function enableInteraction() {
            var yearScale = d3.scale.linear()
                .domain([2000, 2016])
                .range([box.x + 10, box.x + box.width - 10])
                .clamp(true);

            // Cancel the current transition, if any.
            svg.transition().duration(0);

            overlay
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)
                .on("mousemove", mousemove)
                .on("touchmove", mousemove);

            function mouseover() {
                label.classed("active", true);
            }

            function mouseout() {
                label.classed("active", false);
            }

            function mousemove() {
                displayYear(yearScale.invert(d3.mouse(this)[0]));
            }
          }

          // Tweens the entire chart by first tweening the year, and then the data.
          // For the interpolated data, the dots and label are redrawn.
          function tweenYear() {
            var year = d3.interpolateNumber(2000, 2016);
            return function(t) { displayYear(year(t)); };
          }

          // Updates the display to show the specified year.
          function displayYear(year) {
            dot.data(interpolateData(year), key).call(position).sort(order);
            label.text(Math.round(year));
          }

          // Interpolates the dataset for the given (fractional) year.
          function interpolateData(year) {
            return states.map(function(d) {
              return {
                name: d.state,
                region: d.state,
                expenses: interpolateValues(d.expenses, year),
                income: interpolateValues(d.income, year),
                perCapita: interpolateValues(d.perCapita, year)
              };
            });
          }

          // Finds (and possibly interpolates) the value for the specified year.
          function interpolateValues(values, year) {
            var i = bisect.left(values, year, 0, values.length - 1),
                a = values[i];
            if (i > 0) {
              var b = values[i - 1],
                  t = (year - a[0]) / (b[0] - a[0]);
              return a[1] * (1 - t) + b[1] * t;
            }
            return a[1];
          }
    });

    function showAllTen(){
        d3.select("svg").remove();
        d3.select("svg").remove();
        
        // Map Dimensions
        var width = 1100, height = 140;

        // Create the SVG container and set the origin.
        var map = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g");

        // D3 Projection
        var projection = d3.geo.albersUsa()
            .translate([width/2, 65])
            .scale([250]);

        // Define path generator
        var path = d3.geo.path()
            .projection(projection);

        var colorScale = d3.scale.linear()                  .range(["#FFFFFF","#32CD32","#FF0000","#0000CD","#0000FF","#3CB371","#FFA500","#FF0000",
            "#D2691E","#A0522D","#FFD700"]);

        d3.csv("states.csv", function(data){
            colorScale.domain([0,1,2,3,4,5,6,7,8,9,10]);

            d3.json("us-states.json", function(json) {
                // Loop through each state data value in the .csv file
                for (var i = 0; i < data.length; i++) {
                    // Grab State Name
                    var dataState = data[i].state;
                    // Grab data value 
                    var dataValue;
                    if (data[i].addColor == 0){
                        dataValue = 0;
                    }
                    else if(data[i].addColor == 1){
                        dataValue = 1;
                    }
                    else
                        dataValue = data[i].addColor - 1;
                    // Find the corresponding state inside the GeoJSON
                    for (var j = 0; j < json.features.length; j++)  {
                        var jsonState = json.features[j].properties.name;
                        if (dataState == jsonState) {
                            // Copy the data value into the JSON
                            json.features[j].properties.addColor = dataValue; 
                            // Stop looking through the JSON
                            break;
                        }
                    }
                }

                // Bind the data to the SVG and create one path per GeoJSON feature
                map.selectAll("path")
                    .data(json.features)
                    .enter()
                    .append("path")
                    .attr("d", path)
                    .style("stroke", "#000000")
                    .style("stroke-width", "1")
                    .style("fill", function(d) {
                        // Get data value
                        var value = d.properties.addColor;
                        if (value) {
                            //If value exists…
                            return colorScale(value);
                        } else {
                            //If value is undefined…
                            return "#FFFFFF";
                        }
                    });
            });
        });
        
        // Chart dimensions.
        var margin2 = {top: 5, right: 20, bottom: 30, left: 40},
            width = 1024 - margin2.right - margin2.left,
            height = 550 - margin2.top - margin2.bottom;

        // Various scales. These domains make assumptions of data, naturally.
        var xScale = d3.scale.linear().domain([1, 60])
            .range([0, width]);
        var yScale = d3.scale.linear().domain([1, 60])
            .range([height, 0]);
        var radiusScale = d3.scale.sqrt().domain([0, 12500])
            .range([0, 50]);
        var colorScale = d3.scale.ordinal().domain(["1","2","3","4","5","6","7","8","9","10"])
            .range(["#32CD32","#FF0000","#0000CD","#0000FF","#3CB371","#FFA500","#FF0000",
        "#D2691E","#A0522D","#FFD700"]);

        // The x & y axes.
        var xAxis = d3.svg.axis()
            .orient("bottom").scale(xScale)
            .ticks(12, d3.format(",d"));

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        // Create the SVG container and set the origin.
        var svg = d3.select("#chart").append("svg")
            .attr("width", width + margin2.left + margin2.right)
            .attr("height", height + margin2.top + margin2.bottom)
            .append("g")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        // Add the x-axis.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add the y-axis.
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        // Add an x-axis label.
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text("Expenses (billions)");

        // Add a y-axis label.
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Revenue (billions)");
        
        //legend for population size
        // draw legend colored rectangles
        svg.append("rect")
            .attr("x", 25)
            //.attr("y", height-230)
            .attr("y", 0)
            .attr("width", 260)
            .attr("height", 175)
            .attr("fill", "lightgrey")
            .style("stroke-size", "1px");

        svg.append("circle")
            .attr("r", 10)
            .attr("cx", 225)
            //.attr("cy", height-215)
            .attr("cy", 160)
            .style("fill", "white");

        svg.append("circle")
            .attr("r", 20)
            .attr("cx", 225)
            //.attr("cy", height-190)
            .attr("cy", 130)
            .style("fill", "white");

        svg.append("circle")
            .attr("r", 50)
            .attr("cx", 225)
            //.attr("cy", height-120)
            .attr("cy", 60)
            .style("fill", "white");

        svg.append("text")
            .attr("class", "label")
            .attr("x", 160)
            //.attr("y", height-212)
            .attr("y", 165)
            .style("text-anchor", "end")
            .text("$650 debt per Capita");

        svg.append("text")
            .attr("class", "label")
            .attr("x", 160)
            //.attr("y", height-187)
            .attr("y", 130)
            .style("text-anchor", "end")
            .text("$5000 debt per Capita");

        svg.append("text")
            .attr("class", "label")
            .attr("x", 160)
            //.attr("y", height-117)
            .attr("y", 65)
            .style("text-anchor", "end")
            .text("$12,500 debt per Capita");

        // Add the year label; the value is set on transition.
        var label = svg.append("text")
            .attr("class", "year label")
            .attr("text-anchor", "end")
            .attr("y", height - 24)
            .attr("x", width)
            .text(2000);

        var div = d3.select("#chart").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Load the data.
        d3.json("states.json", function(error, states) {
            if (error) throw error;

            // A bisector since many nation's data is sparsely-defined.
            var bisect = d3.bisector(function(d) { return d[0]; });

            // Add a dot per nation. Initialize the data at 2009, and set the colors.
            var dot = svg.append("g")
                .attr("class", "dots")
                .selectAll(".dot")
                .data(interpolateData(2000))
                .enter().append("circle")
                .attr("class", "dot")
                .style("fill", function(d) { return colorScale2(color(d)); })
                .call(position)
                .sort(order)
                .on("mouseover", function(d) {
                    div.transition()
                    .duration(275)
                    .style("opacity", .9);
                    var expenses = "Expenses: " + Math.round(d.expenses * 10)/10 + " Billion";
                    var income = "Income: " + Math.round(d.income * 10)/10 + " Billion";
                    var perCapita = "Debt per Capita: " + Math.round(d.perCapita * 10)/10;
                    div.html(d.name + "<br>" + expenses + "<br>" + income + "<br>" + perCapita)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    div.transition()
                       .duration(300)
                       .style("opacity", 0);
                });

              // Add a title.
              dot.append("title")
                  .text(function(d) { return d.name; });

              // Add an overlay for the year label.
              var box = label.node().getBBox();

              var overlay = svg.append("rect")
                    .attr("class", "overlay")
                    .attr("x", box.x)
                    .attr("y", box.y)
                    .attr("width", box.width)
                    .attr("height", box.height - 20)
                    .on("mouseover", enableInteraction);

              // Start a transition that interpolates the data based on year.
              svg.transition()
                  .duration(15000)
                  .ease("linear")
                  .tween("year", tweenYear)
                  .each("end", enableInteraction);

              // Positions the dots based on data.
              function position(dot) {
                 dot.attr("cx", function(d) { return xScale(x(d)); })
                    .attr("cy", function(d) { return yScale(y(d)); })
                    .attr("r", function(d) { return radiusScale(radius(d)); });
              }

              // Defines a sort order so that the smallest dots are drawn on top.
              function order(a, b) {
                return radius(b) - radius(a);
              }

              // After the transition finishes, you can mouseover to change the year.
              function enableInteraction() {
                var yearScale = d3.scale.linear()
                    .domain([2000, 2016])
                    .range([box.x + 10, box.x + box.width - 10])
                    .clamp(true);

                // Cancel the current transition, if any.
                svg.transition().duration(0);

                overlay
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .on("mousemove", mousemove)
                    .on("touchmove", mousemove);

                function mouseover() {
                    label.classed("active", true);
                }

                function mouseout() {
                    label.classed("active", false);
                }

                function mousemove() {
                    displayYear(yearScale.invert(d3.mouse(this)[0]));
                }
              }

              // Tweens the entire chart by first tweening the year, and then the data.
              // For the interpolated data, the dots and label are redrawn.
              function tweenYear() {
                var year = d3.interpolateNumber(2000, 2016);
                return function(t) { displayYear(year(t)); };
              }

              // Updates the display to show the specified year.
              function displayYear(year) {
                dot.data(interpolateData(year), key).call(position).sort(order);
                label.text(Math.round(year));
              }

              // Interpolates the dataset for the given (fractional) year.
              function interpolateData(year) {
                return states.map(function(d) {
                  return {
                    name: d.state,
                    region: d.state,
                    expenses: interpolateValues(d.expenses, year),
                    income: interpolateValues(d.income, year),
                    perCapita: interpolateValues(d.perCapita, year)
                  };
                });
              }

              // Finds (and possibly interpolates) the value for the specified year.
              function interpolateValues(values, year) {
                var i = bisect.left(values, year, 0, values.length - 1),
                    a = values[i];
                if (i > 0) {
                  var b = values[i - 1],
                      t = (year - a[0]) / (b[0] - a[0]);
                  return a[1] * (1 - t) + b[1] * t;
                }
                return a[1];
              }
        });
    }
    
    function showBiggest(){
        d3.select("svg").remove();
        d3.select("svg").remove();
        
        // Map Dimensions
        var width = 1100, height = 140;

        // Create the SVG container and set the origin.
        var map = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g");

        // D3 Projection
        var projection = d3.geo.albersUsa()
            .translate([width/2, 65])
            .scale([250]);

        // Define path generator
        var path = d3.geo.path()
            .projection(projection);

        var colorScale = d3.scale.linear()          .range(["#FFFFFF","#32CD32","#FF0000","#0000CD","#0000FF","#3CB371","#FFA500","#FF0000",
        "#D2691E","#A0522D","#FFD700"]);

        d3.csv("biggest.csv", function(data){
            colorScale.domain([0,1,2,3,4,5,6,7,8,9,10]);

            d3.json("us-states.json", function(json) {
                // Loop through each state data value in the .csv file
                for (var i = 0; i < data.length; i++) {
                    // Grab State Name
                    var dataState = data[i].state;
                    // Grab data value 
                    var dataValue = data[i].addColor;
                    // Find the corresponding state inside the GeoJSON
                    for (var j = 0; j < json.features.length; j++)  {
                        var jsonState = json.features[j].properties.name;
                        if (dataState == jsonState) {
                            // Copy the data value into the JSON
                            json.features[j].properties.addColor = dataValue; 
                            // Stop looking through the JSON
                            break;
                        }
                    }
                }

                // Bind the data to the SVG and create one path per GeoJSON feature
                map.selectAll("path")
                    .data(json.features)
                    .enter()
                    .append("path")
                    .attr("d", path)
                    .style("stroke", "#000000")
                    .style("stroke-width", "1")
                    .style("fill", function(d) {
                        // Get data value
                        var value = d.properties.addColor;
                        if (value) {
                        //If value exists…
                        return colorScale(value);
                        } else {
                        //If value is undefined…
                        return "rgb(213,222,217)";
                        }
                    });
            });
        });
        
        // Chart dimensions.
        var margin2 = {top: 5, right: 20, bottom: 30, left: 40},
            width = 1024 - margin2.right - margin2.left,
            height = 550 - margin2.top - margin2.bottom;

        // Various scales. These domains make assumptions of data, naturally.
        var xScale = d3.scale.linear().domain([1, 60])
            .range([0, width]);
        var yScale = d3.scale.linear().domain([1, 60])
            .range([height, 0]);
        var radiusScale = d3.scale.sqrt().domain([0, 12500])
            .range([0, 50]);
        var colorScale2 = d3.scale.ordinal().domain(["1","2","3","4","5"])
            .range(["#32CD32","#FF0000","#0000CD","#0000FF","#3CB371"]);

        // The x & y axes.
        var xAxis = d3.svg.axis()
            .orient("bottom").scale(xScale)
            .ticks(12, d3.format(",d"));

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        // Create the SVG container and set the origin.
        var svg = d3.select("#chart").append("svg")
            .attr("width", width + margin2.left + margin2.right)
            .attr("height", height + margin2.top + margin2.bottom)
            .append("g")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
        
        // Add the x-axis.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add the y-axis.
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        // Add an x-axis label.
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text("Expenses (billions)");

        // Add a y-axis label.
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Revenue (billions)");
        
        //legend for population size
        // draw legend colored rectangles
        svg.append("rect")
            .attr("x", 25)
            //.attr("y", height-230)
            .attr("y", 0)
            .attr("width", 260)
            .attr("height", 175)
            .attr("fill", "lightgrey")
            .style("stroke-size", "1px");

        svg.append("circle")
            .attr("r", 10)
            .attr("cx", 225)
            //.attr("cy", height-215)
            .attr("cy", 160)
            .style("fill", "white");

        svg.append("circle")
            .attr("r", 20)
            .attr("cx", 225)
            //.attr("cy", height-190)
            .attr("cy", 130)
            .style("fill", "white");

        svg.append("circle")
            .attr("r", 50)
            .attr("cx", 225)
            //.attr("cy", height-120)
            .attr("cy", 60)
            .style("fill", "white");

        svg.append("text")
            .attr("class", "label")
            .attr("x", 160)
            //.attr("y", height-212)
            .attr("y", 165)
            .style("text-anchor", "end")
            .text("$650 debt per Capita");

        svg.append("text")
            .attr("class", "label")
            .attr("x", 160)
            //.attr("y", height-187)
            .attr("y", 130)
            .style("text-anchor", "end")
            .text("$5000 debt per Capita");

        svg.append("text")
            .attr("class", "label")
            .attr("x", 160)
            //.attr("y", height-117)
            .attr("y", 65)
            .style("text-anchor", "end")
            .text("$12,500 debt per Capita");
    

        // Add the year label; the value is set on transition.
        var label = svg.append("text")
            .attr("class", "year label")
            .attr("text-anchor", "end")
            .attr("y", height - 24)
            .attr("x", width)
            .text(2000);

        var div = d3.select("#chart").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Load the data.
        d3.json("biggest.json", function(error, states) {
            if (error) throw error;

            // A bisector since many nation's data is sparsely-defined.
            var bisect = d3.bisector(function(d) { return d[0]; });

            // Add a dot per nation. Initialize the data at 2009, and set the colors.
            var dot = svg.append("g")
                .attr("class", "dots")
                .selectAll(".dot")
                .data(interpolateData(2000))
                .enter().append("circle")
                .attr("class", "dot")
                .style("fill", function(d) { return colorScale2(color(d)); })
                .call(position)
                .sort(order)
                .on("mouseover", function(d) {
                    div.transition()
                    .duration(275)
                    .style("opacity", .9);
                    var expenses = "Expenses: " + Math.round(d.expenses * 10)/10 + " Billion";
                    var income = "Income: " + Math.round(d.income * 10)/10 + " Billion";
                    var perCapita = "Debt per Capita: " + Math.round(d.perCapita * 10)/10;
                    div.html(d.name + "<br>" + expenses + "<br>" + income + "<br>" + perCapita)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    div.transition()
                       .duration(300)
                       .style("opacity", 0);
                });

              // Add a title.
              dot.append("title")
                  .text(function(d) { return d.name; });

              // Add an overlay for the year label.
              var box = label.node().getBBox();

              var overlay = svg.append("rect")
                    .attr("class", "overlay")
                    .attr("x", box.x)
                    .attr("y", box.y)
                    .attr("width", box.width)
                    .attr("height", box.height - 20)
                    .on("mouseover", enableInteraction);

              // Start a transition that interpolates the data based on year.
              svg.transition()
                  .duration(15000)
                  .ease("linear")
                  .tween("year", tweenYear)
                  .each("end", enableInteraction);

              // Positions the dots based on data.
              function position(dot) {
                 dot.attr("cx", function(d) { return xScale(x(d)); })
                    .attr("cy", function(d) { return yScale(y(d)); })
                    .attr("r", function(d) { return radiusScale(radius(d)); });
              }

              // Defines a sort order so that the smallest dots are drawn on top.
              function order(a, b) {
                return radius(b) - radius(a);
              }

              // After the transition finishes, you can mouseover to change the year.
              function enableInteraction() {
                var yearScale = d3.scale.linear()
                    .domain([2000, 2016])
                    .range([box.x + 10, box.x + box.width - 10])
                    .clamp(true);

                // Cancel the current transition, if any.
                svg.transition().duration(0);

                overlay
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .on("mousemove", mousemove)
                    .on("touchmove", mousemove);

                function mouseover() {
                    label.classed("active", true);
                }

                function mouseout() {
                    label.classed("active", false);
                }

                function mousemove() {
                    displayYear(yearScale.invert(d3.mouse(this)[0]));
                }
              }

              // Tweens the entire chart by first tweening the year, and then the data.
              // For the interpolated data, the dots and label are redrawn.
              function tweenYear() {
                var year = d3.interpolateNumber(2000, 2016);
                return function(t) { displayYear(year(t)); };
              }

              // Updates the display to show the specified year.
              function displayYear(year) {
                dot.data(interpolateData(year), key).call(position).sort(order);
                label.text(Math.round(year));
              }

              // Interpolates the dataset for the given (fractional) year.
              function interpolateData(year) {
                return states.map(function(d) {
                  return {
                    name: d.state,
                    region: d.state,
                    expenses: interpolateValues(d.expenses, year),
                    income: interpolateValues(d.income, year),
                    perCapita: interpolateValues(d.perCapita, year)
                  };
                });
              }

              // Finds (and possibly interpolates) the value for the specified year.
              function interpolateValues(values, year) {
                var i = bisect.left(values, year, 0, values.length - 1),
                    a = values[i];
                if (i > 0) {
                  var b = values[i - 1],
                      t = (year - a[0]) / (b[0] - a[0]);
                  return a[1] * (1 - t) + b[1] * t;
                }
                return a[1];
              }
        });
    }

    function showSmallest(){
        d3.select("svg").remove();
        d3.select("svg").remove();
        
        // Map Dimensions
        var width = 1100, height = 140;

        // Create the SVG container and set the origin.
        var map = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g");

        // D3 Projection
        var projection = d3.geo.albersUsa()
            .translate([width/2, 65])
            .scale([250]);

        // Define path generator
        var path = d3.geo.path()
            .projection(projection);

        var colorScale = d3.scale.linear()          .range(["#FFFFFF","#32CD32","#FF0000","#0000CD","#0000FF","#3CB371","#FFA500","#FF0000",
        "#D2691E","#A0522D","#FFD700"]);

        d3.csv("smallest.csv", function(data){
            colorScale.domain([0,1,2,3,4,5,6,7,8,9,10]);

            d3.json("us-states.json", function(json) {
                // Loop through each state data value in the .csv file
                for (var i = 0; i < data.length; i++) {
                    // Grab State Name
                    var dataState = data[i].state;
                    // Grab data value 
                    var dataValue = data[i].addColor;
                    // Find the corresponding state inside the GeoJSON
                    for (var j = 0; j < json.features.length; j++)  {
                        var jsonState = json.features[j].properties.name;
                        if (dataState == jsonState) {
                            // Copy the data value into the JSON
                            json.features[j].properties.addColor = dataValue; 
                            // Stop looking through the JSON
                            break;
                        }
                    }
                }

                // Bind the data to the SVG and create one path per GeoJSON feature
                map.selectAll("path")
                    .data(json.features)
                    .enter()
                    .append("path")
                    .attr("d", path)
                    .style("stroke", "#000000")
                    .style("stroke-width", "1")
                    .style("fill", function(d) {
                        // Get data value
                        var value = d.properties.addColor;
                        if (value) {
                        //If value exists…
                        return colorScale(value);
                        } else {
                        //If value is undefined…
                        return "rgb(213,222,217)";
                        }
                    });
            });
        });

        // Chart dimensions.
        var margin2 = {top: 5, right: 20, bottom: 30, left: 40},
            width = 1024 - margin2.right - margin2.left,
            height = 550 - margin2.top - margin2.bottom;

        // Various scales. These domains make assumptions of data, naturally.
        var xScale = d3.scale.linear().domain([1, 60])
            .range([0, width]);
        var yScale = d3.scale.linear().domain([1, 60])
            .range([height, 0]);
        var radiusScale = d3.scale.sqrt().domain([0, 12500])
            .range([0, 50]);
        var colorScale2 = d3.scale.ordinal().domain(["1","2","3","4","5"])
        .range(["#FFA500","#FF0000","#D2691E","#A0522D","#FFD700"]);

        // The x & y axes.
        var xAxis = d3.svg.axis()
            .orient("bottom").scale(xScale)
            .ticks(12, d3.format(",d"));

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        // Create the SVG container and set the origin.
        var svg = d3.select("#chart").append("svg")
            .attr("width", width + margin2.left + margin2.right)
            .attr("height", height + margin2.top + margin2.bottom)
            .append("g")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
        
        // Add the x-axis.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add the y-axis.
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        // Add an x-axis label.
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text("Expenses (billions)");

        // Add a y-axis label.
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Revenue (billions)");
        
        //legend for population size
        // draw legend colored rectangles
        svg.append("rect")
            .attr("x", 25)
            //.attr("y", height-230)
            .attr("y", 0)
            .attr("width", 260)
            .attr("height", 175)
            .attr("fill", "lightgrey")
            .style("stroke-size", "1px");

        svg.append("circle")
            .attr("r", 10)
            .attr("cx", 225)
            //.attr("cy", height-215)
            .attr("cy", 160)
            .style("fill", "white");

        svg.append("circle")
            .attr("r", 20)
            .attr("cx", 225)
            //.attr("cy", height-190)
            .attr("cy", 130)
            .style("fill", "white");

        svg.append("circle")
            .attr("r", 50)
            .attr("cx", 225)
            //.attr("cy", height-120)
            .attr("cy", 60)
            .style("fill", "white");

        svg.append("text")
            .attr("class", "label")
            .attr("x", 160)
            //.attr("y", height-212)
            .attr("y", 165)
            .style("text-anchor", "end")
            .text("$650 debt per Capita");

        svg.append("text")
            .attr("class", "label")
            .attr("x", 160)
            //.attr("y", height-187)
            .attr("y", 130)
            .style("text-anchor", "end")
            .text("$5000 debt per Capita");

        svg.append("text")
            .attr("class", "label")
            .attr("x", 160)
            //.attr("y", height-117)
            .attr("y", 65)
            .style("text-anchor", "end")
            .text("$12,500 debt per Capita");
    
        // Add the year label; the value is set on transition.
        var label = svg.append("text")
            .attr("class", "year label")
            .attr("text-anchor", "end")
            .attr("y", height - 24)
            .attr("x", width)
            .text(2000);

        var div = d3.select("#chart").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Load the data.
        d3.json("smallest.json", function(error, states) {
            if (error) throw error;

            // A bisector since many nation's data is sparsely-defined.
            var bisect = d3.bisector(function(d) { return d[0]; });

            // Add a dot per nation. Initialize the data at 2009, and set the colors.
            var dot = svg.append("g")
                .attr("class", "dots")
                .selectAll(".dot")
                .data(interpolateData(2000))
                .enter().append("circle")
                .attr("class", "dot")
                .style("fill", function(d) { return colorScale2(color(d)); })
                .call(position)
                .sort(order)
                .on("mouseover", function(d) {
                    div.transition()
                    .duration(275)
                    .style("opacity", .9);
                    var expenses = "Expenses: " + Math.round(d.expenses * 10)/10 + " Billion";
                    var income = "Income: " + Math.round(d.income * 10)/10 + " Billion";
                    var perCapita = "Debt per Capita: " + Math.round(d.perCapita * 10)/10;
                    div.html(d.name + "<br>" + expenses + "<br>" + income + "<br>" + perCapita)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    div.transition()
                       .duration(300)
                       .style("opacity", 0);
                });

              // Add a title.
              dot.append("title")
                  .text(function(d) { return d.name; });

              // Add an overlay for the year label.
              var box = label.node().getBBox();

              var overlay = svg.append("rect")
                    .attr("class", "overlay")
                    .attr("x", box.x)
                    .attr("y", box.y)
                    .attr("width", box.width)
                    .attr("height", box.height - 20)
                    .on("mouseover", enableInteraction);

              // Start a transition that interpolates the data based on year.
              svg.transition()
                  .duration(15000)
                  .ease("linear")
                  .tween("year", tweenYear)
                  .each("end", enableInteraction);

              // Positions the dots based on data.
              function position(dot) {
                 dot.attr("cx", function(d) { return xScale(x(d)); })
                    .attr("cy", function(d) { return yScale(y(d)); })
                    .attr("r", function(d) { return radiusScale(radius(d)); });
              }

              // Defines a sort order so that the smallest dots are drawn on top.
              function order(a, b) {
                return radius(b) - radius(a);
              }

              // After the transition finishes, you can mouseover to change the year.
              function enableInteraction() {
                var yearScale = d3.scale.linear()
                    .domain([2000, 2016])
                    .range([box.x + 10, box.x + box.width - 10])
                    .clamp(true);

                // Cancel the current transition, if any.
                svg.transition().duration(0);

                overlay
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    .on("mousemove", mousemove)
                    .on("touchmove", mousemove);

                function mouseover() {
                    label.classed("active", true);
                }

                function mouseout() {
                    label.classed("active", false);
                }

                function mousemove() {
                    displayYear(yearScale.invert(d3.mouse(this)[0]));
                }
              }

              // Tweens the entire chart by first tweening the year, and then the data.
              // For the interpolated data, the dots and label are redrawn.
              function tweenYear() {
                var year = d3.interpolateNumber(2000, 2016);
                return function(t) { displayYear(year(t)); };
              }

              // Updates the display to show the specified year.
              function displayYear(year) {
                dot.data(interpolateData(year), key).call(position).sort(order);
                label.text(Math.round(year));
              }

              // Interpolates the dataset for the given (fractional) year.
              function interpolateData(year) {
                return states.map(function(d) {
                  return {
                    name: d.state,
                    region: d.state,
                    expenses: interpolateValues(d.expenses, year),
                    income: interpolateValues(d.income, year),
                    perCapita: interpolateValues(d.perCapita, year)
                  };
                });
              }

              // Finds (and possibly interpolates) the value for the specified year.
              function interpolateValues(values, year) {
                var i = bisect.left(values, year, 0, values.length - 1),
                    a = values[i];
                if (i > 0) {
                  var b = values[i - 1],
                      t = (year - a[0]) / (b[0] - a[0]);
                  return a[1] * (1 - t) + b[1] * t;
                }
                return a[1];
              }
        });
    };


