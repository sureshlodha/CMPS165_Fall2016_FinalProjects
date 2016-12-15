var width = 645,
    height = 750;
//700, 948

var formatNumber = d3.format(",d");

var path = d3.geo.path()
    .projection(null);

var coordinates = [0, 0];

var toolscaleX = d3.scale.linear()
    .domain([0, 960])
    .range([0, width]);

var svg = d3.select("body").append("svg")
    .attr("id", "svgElem")
    .attr("viewBox", "0, 65, 989, 1150") //960, 1300
    .attr("width", width)
    .attr("height", height);

/*var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(440,40)");*/

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var val = document.getElementById("svgElem").getBoundingClientRect();
var svgLeft = val.left;
var svgTop = val.top;
var svgBottom = val.bottom;
var svgRight = val.right;
var viewBoxHeight = 1150;
console.log(svgBottom);
//console.log("position is " + val.top + "," + val.left);

/*var displaySites = function(data) {
  var sites = svg.selectAll(".site")
      .data(data, function(d) {
        return d.permalink;
      });*/

var slider = d3.slider().min(1895).max(2015).step(1).axis(true).value([1895, 2015]);

// Extend moveToFront/Back functionalities + some Bostock magick as seen on:
// http://bl.ocks.org/eesur/4e0a69d57d3bfc8a82c2
d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};
d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

d3.json("caFire.json", function (error, caFire) {
    if (error) throw error;

    var fires = topojson.feature(caFire, caFire.objects.fires);
    //var vals = values[0].properties;

    // Clip tracts to land.
    svg.append("defs").append("clipPath")
        .attr("id", "clip-land")
        .append("path")
        .datum(topojson.feature(caFire, caFire.objects.counties))
        .attr("d", path);

    // Group tracts by color for faster rendering.
    svg.append("g")
        .attr("class", "fireclip")
        .attr("clip-path", "url(#clip-land)")
        .selectAll("path")
        .data(d3.nest()
            .key(function (d) {
                return (d.properties.area * 2.58999e6);
            })
            .entries(fires.features.filter(function (d) {
                return d.properties.area;
            })))

    .enter().append("path")
        .attr("class", "fire")
        .attr("d", function (d) {
            return path({
                type: "FeatureCollection",
                features: d.values
            });
        })
        .on("mouseover", function (d) {
            if (this.getAttribute("hoverable") == "true") {
                // Display data from fire onto tooltip
                d3.select(this).moveToFront(); // Brings selection to front
                var t_acreage = d3.format(",f")(d.values[0].properties.acres);

                var t_name = d.values[0].properties.name.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });

                var t_agency = d.values[0].properties.agency;
                t_agency = agencyCode(t_agency);

                var t_cause = d.values[0].properties.cause;
                t_cause = causeCode(t_cause);

                coordinates = d3.mouse(this);
                var Y = coordinates[1];
                //console.log(Y);

                div.style("opacity", 0)
                    .transition().duration(400)
                    .style("opacity", .8)
                    // campy code that makes the tooltip follow California's border
                    // good for now (11.23), will need to be changed later
                    .style("left", function () {
                        //console.log(Y);
                        //return toolscaleX(960 + width) + "px";
                        if (Y < ((viewBoxHeight + svgTop) * .28))
                            return svgLeft + width / 2.4 + "px";
                        //return toolscaleX(430 + width) + "px";
                        else if (Y >= ((viewBoxHeight + svgTop) * .28) && Y <= ((viewBoxHeight + svgTop) * .65))
                            return ((Y / 1.5) + (width + 40)) + "px";
                        else if (Y > ((viewBoxHeight + svgTop) * .65))
                            return (svgLeft + width) + "px";
                    })
                    .style("top", function (d) {
                        if (Y < (viewBoxHeight + svgTop) * .85)
                            return (d3.event.pageY - 28) + "px"
                        else
                            return 650 + "px";
                    });
                div.html("<tab1>Fire Name: </tab1><tab2>" + t_name + "</tab2><br>" +
                        "<tab1>Year:</tab1><tab2>" + d.values[0].properties.year + "</tab2><br>" +
                        "<tab1>Agency: </tab1><tab2>&nbsp&nbsp" + t_agency + "</tab2><br>" +
                        "<tab1>Cause: </tab1><tab2>" + t_cause + "</tab2><br>" +
                        "<tab1>Total Acreage: </tab1><tab2>" + t_acreage + "</tab2>")
                    /*.style("left", (d3.event.pageX + 20) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")*/
                d3.select(".tooltip").classed("hidden", false);
            }
        })
        .on("mouseout", function (d) { // move selection to back to make room
            d3.select(this).moveToBack()
            div.style("opacity", .8)
                .transition().duration(400)
                .style("opacity", 0);
            //div.style("opacity", 0)
            //d3.select(".tooltip").classed("hidden", true);
        })
        .on("click", function (d) { // move selection back on click to see more
            d3.select(this).moveToBack();
        });


    // Draw fires.
    svg.append("path")
        .datum(topojson.mesh(caFire, fires, function (a, b) {
            return a == b
        }))
        .attr("d", path)
        .data(topojson.feature(caFire, fires))
        .attr("d", path);


    // Draw state border
    svg.append("path")
        .datum(topojson.mesh(caFire, caFire.objects.state, function (d) {
            return true;
        }))
        .attr("class", "state-border")
        .attr("d", path)
        .on("mouseover", function (d) {
            console.log(d3.event.pageX + ", ")
            console.log(d3.event.pageY)
        });
    // assign all elements (fire) to false.
    svg.selectAll(".fire").attr("hoverable", true)
        // Draw county borders.
    svg.append("path")
        .datum(topojson.mesh(caFire, caFire.objects.counties, function (a, b) {
            return a !== b;
        }))
        .attr("class", "county-border")
        .attr("d", path);

    // Render the slider in the div and give it functionality
    d3.select('#slider').call(slider
        .on("slide", function (evt, targetyear) {
            d3.select("#handle-one").select(".yearBox")
                .html(targetyear[0]);
            d3.select("#handle-two").select(".yearBox")
                .html(targetyear[1]);
            svg.selectAll(".fire").each(function (d) {
                if (d.values[0].properties.year > targetyear[0] && d.values[0].properties.year < targetyear[1]) {
                    //this.style.opactiy += 0.8;
                    this.setAttribute("hoverable", "true");
                    //this.style.opacity = (d.values[0].properties.year > targetyear[0] && d.values[0].properties.year < targetyear[1]) ? .8 : 0;
                    // iterate through fires, only display fires in slider range
                    //this.style.opacity = (d.values[0].properties.year > targetyear[0] && d.values[0].properties.year < targetyear[1]) ? .8 : 0;
                } else {
                    //this.style.opacity += 0;
                    //this.style.opacity = (d.values[0].properties.year > targetyear[0] && d.values[0].properties.year < targetyear[1]) ? .8 : 0;
                    this.setAttribute("hoverable", "false");
                }
                this.style.fillOpacity = (d.values[0].properties.year > targetyear[0] && d.values[0].properties.year < targetyear[1]) ? .5 : 0;
            })
        })
    )
    .selectAll(".d3-slider-handle")
        .append("div")
        .attr("class", "yearBox")
    
    d3.select("#handle-one").select(".yearBox")
        .html("1895");
    d3.select("#handle-two").select(".yearBox")
        .html("2015");
});

function agencyCode(a) {
    switch (a) {
        case "BIA":
            a = "USDI Bureau of Indian Affairs"
            break;
        case "BLM":
            a = "Bureau of Land Management"
            break;
        case "CAL":
            a = "California Department of Forestry (CAL FIRE)"
            break;
        case "CCO":
            a = "Contract Counties"
            break;
        case "DOD":
            a = "Department of Defense"
            break;
        case "FWS":
            a = "USDI Fish and Wildlife Service"
            break;
        case "LRA":
            a = "Local Response Area"
            break;
        case "NOP":
            a = "No Protection"
            break;
        case "NPS":
            a = "National Park Service"
            break;
        case "PVT":
            a = "Private"
            break;
        case "USF":
            a = "United States Forest Service"
            break;
        case "OTH":
            a = "Other"
            break;
        case "CDF":
            a = "California Department of Forestry (CAL FIRE)"
            break;
    }
    return a;
}


function causeCode(c) {

    switch (c) {
        case 1:
            c = "Lightning"
            break;
        case 2:
            c = "Equipment Use"
            break;
        case 3:
            c = "Smoking"
            break;
        case 4:
            c = "Campfire"
            break;
        case 5:
            c = "Debris"
            break;
        case 6:
            c = "Railroad"
            break;
        case 7:
            c = "Arson"
            break;
        case 8:
            c = "Playing with Fire"
            break;
        case 9:
            c = "Miscellaneous"
            break;
        case 10:
            c = "Vehicle"
            break;
        case 11:
            c = "Power Line"
            break;
        case 12:
            c = "Firefighter Training"
            break;
        case 13:
            c = "Non-Firefighter Training"
            break;
        case 14:
            c = "Unknown/Unidentified"
            break;
        case 15:
            c = "Structure"
            break;
        case 16:
            c = "Aircraft"
            break;
        case 17:
            c = "Volcanic"
            break;
        case 18:
            c = "Escaped Prescribed Burn"
            break;
        case 19:
            c = "Illegal Alien Campfire"
    };
    return c;
}
