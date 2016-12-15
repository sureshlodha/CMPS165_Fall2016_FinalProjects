
// Various accessors that specify the four dimensions of data to visualize.
function x(d) {
    return d[params.x];
}
function y(d) {
    return d[params.y] / 1000;
}

function radius(d) {
    return d[params.radius];
}

function key(d) {
    return d[params.key];
}

var timeElapsed = 0;

//Define Color
var colors = d3.scale.ordinal()
    .range(["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#fbb4ae"]);

var currentYear = '1964';

// Chart dimensions.
var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 41.5},
    width = params.width - margin.right,
    height = params.height - margin.top - margin.bottom,
    yearMargin = 105;

var xScale = d3.scale.log().domain([params.xmin, params.xmax]).range([0, width - yearMargin]),
    yScale = d3.scale.linear().domain([params.ymin, params.ymax]).range([height, 0]);
    //radiusScale = d3.scale.sqrt().domain([params.rmin, params.rmax]).range([5, 25]);

// The x & y axes.
var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(12, d3.format(",d")),
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// Create the SVG container and set the origin.
var svg = d3.select("#" + params.dom).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
    .attr("x", width - yearMargin)
    .attr("y", height - 6)
    .text(params.xlabel);

// Add a y-axis label.
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text(params.ylabel);

// Add the year label; the value is set on transition.
var label = svg.append("text")
    .attr("class", "year label")
    .attr("text-anchor", "end")
    .attr("y", 48)
    .attr("x", width)
    .text(params.yearMin);

// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//Define radius of legend
var radius2 = d3.scale.sqrt()
    .domain([0, 1e6])
    .range([0, 10]);



function motionChart(nations) {



    // A bisector since many nation's data is sparsely-defined.
    var bisect = d3.bisector(function (d) {
        return d[0];
    });

    // Add a dot per nation. Initialize the data at 1800, and set the colors.
    var dots = svg.append("g")
        .attr("class", "dots")

    var dot = dots.selectAll(".dot")
        .data(interpolateData(params.yearMin))
        .enter().append("circle")
        .attr("class", "dot")
        .style("fill", function (d) {
            return colors(d.occupation);
        }).on("click", function(d,i){var titleElement = this.firstChild;
            titleElement.getAttribute("class") === "hidden" ? titleElement.setAttribute("class", "visible") :
                titleElement.setAttribute("class", "hidden");
        })
        .on("touch", function(d,i) { country.text(d[params.key]); })
        .on("mouseover", function(d,i){
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("<p style='font-weight: bolder;'>" + d.occupation + "</p>"
                      + "<p style='float: left;  clear: both;'><b>Year:</b></p><p style='float: right'> "
                + currentYear.toFixed(0) + "</p>"
                      + "<p style='float: left; margin-top: -10px; clear: both;'><b>Weekly Income (Dollars):</b><p/><p style='float: right; margin-top: -10px;'>$"
                + getIncome(d) + "</p>"
                      +  "<p style='float: left; margin-top: -10px; clear: both;''><b>Total Employed (Million):</b></p><p style='float: right; margin-top: -10px;'> "
                + getEmployed(d)+ "</p>")
                .style("left", (d3.event.pageX - 100) + "px")
                .style("top", (d3.event.pageY) + "px");

            //Show the tooltip
            d3.select("#tooltip").classed("hidden", false);

        })
        .on("mouseout", function() {
            div.transition()
                .duration(500)
                .style("opacity", 0);

            d3.select("#tooltip").classed("hidden",  true);
        })
        .call(position)
        .sort(order);

    // Add a title.
    dot.append("text")
        .text(function (d) {
            return d[params.key];
        });

    function getIncome(d) {
        return d['income'].toFixed(0);
    }

    function getEmployed(d) {
        return (d['employed'] / 1000).toFixed(1);
    }

    //Legend
    var legend = svg.append("g")
        .attr("class", "legend")
        .selectAll("g")
        .data(interpolateData(params.yearMin))
        .enter()
        .append("g")
        .attr("transform", function(d,i){
            return "translate(" + 700 + "," + i*20 + ")";
        });

    legend.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d){return colors(d.occupation)});

    legend.append("text")
        .attr("x", 25)
        .attr("dy", "0.75em")
        .style("font-size","11px")
        .text(function(d){return d.occupation;})

    //Radius Correlation
    var legend2 = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + 775 + "," + 350 + ")")
        .selectAll("g")
        .data([1e6, 5e6, 15e6, 30e6])
        .enter().append("g");

    legend2.append("circle")
        .attr("cy", function(d) { return -radius2(d); })
        .attr("r", radius2);

    legend2.append("text")
        .attr("y", function(d) { return -2 * radius2(d); })
        .attr("dy", "1.3em")
        .attr("x", "-7")
        .text(d3.format(".1s"));

    var box = label.node().getBBox();


    var overlay = svg.append("rect")
        .attr("class", "overlay")
        .attr("x", box.x)
        .attr("y", box.y)
        .attr("width", box.width);


    // Start a transition that interpolates the data based on year.
    svg.transition()
        .duration(30000)
        .ease("linear")
        .tween("year", tweenYear)
        .each("end", enableInteraction);

    // Positions the dots based on data.
    function position(dot) {
        dot.attr("cx", function (d) {
            return xScale(x(d));
        })
            .attr("cy", function (d) {
                return yScale(y(d));
            })
            .attr("r", function (d) {

                return radius2(d.employed * 1000);
            });
    }

    // Defines a sort order so that the smallest dots are drawn on top.
    function order(a, b) {
        return radius(b) - radius(a);
    }

    // After the transition finishes, you can mouseover to change the year.

    function enableInteraction() {


        overlay
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);

        overlay
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);

        function mouseover() {
            label.classed("active", true);
        }

        function mouseout() {
            label.classed("active", false);
        }

    }

    // Tweens the entire chart by first tweening the year, and then the data.
    // For the interpolated data, the dots and label are redrawn.
    function tweenYear() {
        var year = d3.interpolateNumber(params.yearMin, params.yearMax);
        return function (t) {
            displayYear(year(t));
        };
    }

    function resume() {
        var year = d3.interpolateNumber(currentYear, params.yearMax);
        return function (t) {
            displayYear(year(t));
        };
    }
    // Updates the display to show the specified year.
    function displayYear(year) {
        timeElapsed++;
        currentYear = year;
        dot.data(interpolateData(year), key).call(position).sort(order);
        label.text(Math.round(year))
            //.attr("y", 48 + (year - params.yearMin) * (height - 64)/ (params.yearMax - params.yearMin));
          .attr("y", 425);
    }

    // Interpolates the dataset for the given (fractional) year.
    function interpolateData(year) {
        return nations.map(function (d) {
            var tmp={};
            tmp[params.key]= d[params.key],
                tmp[params.color]= d[params.color]
            tmp[params.x]= interpolateValues(d[params.x], year)
            tmp[params.radius]= interpolateValues(d[params.radius], year)
            tmp[params.y]= interpolateValues(d[params.y], year)
            return tmp;
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


    $( "#pause" ).click(function() {
        svg.transition().duration(0);
    });

    $( "#play" ).click(function() {

        //38.6 calls to the display year function per second
        //timeelapsed var is incremented each time
        //divide bby 38.6 and multiply by 1000 to get time elapsed in secs
        //Subtract this amount from the beginning duration
        svg.transition()
            .duration(30000 - (timeElapsed / 38.6) * 1000)
            .ease("linear")
            .tween("year", resume)
            .each("end", enableInteraction);
    });

    $( "#restart" ).click(function() {

        timeElapsed = 0;
        svg.transition()
            .duration(30000)
            .ease("linear")
            .tween("year", tweenYear)
            .each("end", enableInteraction);
    });

}

// Load the data.
d3.json(params.jsondatafile, function (nations) {
    motionChart(nations)
});

