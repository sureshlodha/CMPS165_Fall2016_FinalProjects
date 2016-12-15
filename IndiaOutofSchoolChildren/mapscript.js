var state;
var width = 1100,
height = 1100;
var formatNumber = d3.format(",d");
var projection = d3.geo.albers()
.center([0, 20.5937])   //center latitude of India
.rotate([-78.9629, 0])   //center longitude of India
.parallels([50, 60])
.scale(1000)
.translate([400, 400 ]);

var path = d3.geo.path()
.projection(projection);

var color = d3.scale.threshold()
.domain([.5, 1, 3, 5, 10, 15, 20, 25])
.range([ "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"]);
    
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "#map");
    
// A position encoding for the key only.
var x = d3.scale.linear()
    .domain([0, 25])
    .range([0, 480]);
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(13)
    .tickValues(color.domain())
    .tickFormat(function(d) { return d;});

    // Append Div for tooltip to SVG
var div = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

var first = 0;

//Legend for color code
var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(40,40)");
g.selectAll("rect")
    .data(color.range().map(function(d, i) {
                return {
x0: i ? x(color.domain()[i - 1]) : x.range()[0],
x1: i < color.domain().length ? x(color.domain()[i]) : x.range()[1],
z: d
};
}))
.enter().append("rect")
.attr("height", 8)
.attr("x", function(d) { return d.x0; })
.attr("width", function(d) { return d.x1 - d.x0; })
.style("fill", function(d) { return d.z; });
g.call(xAxis).append("text")
.attr("class", "caption")
.attr("y", -6)
.text("Out Of School Children(OSC) in Millions");

//Function to create Indian state map
function rect_clicked(d) {
    
        var cur_districts = document.getElementsByClassName('#districts');

        // Now remove them
        var len = cur_districts.length;
        for (var i = 0; i < len; i++) {
            cur_districts[0].parentElement.removeChild(cur_districts[0]);
        }
        //console.log(document.getElementsByClassName('state-border'));
        var cur_districtborder = document.getElementsByClassName('district-border');
    len = cur_districtborder.length;
        for (var i = 0; i < len; i++) {
           cur_districtborder[i].parentElement.removeChild(cur_districtborder[i]);
        }
    
     var cur_stateborder = document.getElementsByClassName('state-border');
    len = cur_stateborder.length;
        for (var i = 0; i < len; i++) {
           cur_stateborder[i].parentElement.removeChild(cur_stateborder[i]);
        }
    
        var sel_district = document.getElementsByClassName('seldist');

        // Now remove them
        len = sel_district.length;
        for (var i = 0; i < len; i++) {
            sel_district[i].parentElement.removeChild(sel_district[i]);
        }
        
        create_bar({statecode:"00",districtcode:"000",name:"India"});
        d3.json("indiaST.json", function(error, ut) {
        if (error) throw error;
        var states = topojson.feature(ut, ut.objects.IND_STATE);

        svg.append("g")
        .attr("class", "#states")
        .attr("clip-path", "url(#clip-land)")
        .selectAll("path")
        .datum(topojson.feature(ut, ut.objects.IND_STATE))
             .attr("class", "state-border")
             .attr("d", path);

        svg.append("g")
          .attr("class", "#states")
          .attr("clip-path", "url(#clip-land)")
        .selectAll("path")
        .data(topojson.feature(ut, ut.objects.IND_STATE).features)
        .enter().append("path")
        .style("fill", function(d) { return color(d.properties.outofschool * 0.000001); })
            .attr("d", path)
        .on("click", state_clicked)
        .on("mouseover", function(d) {
                        d3.select(this).attr("class", "highlight");
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                        div.append("div").text(d.properties.statename);
                        
                            var tmp = "" + d.properties.outofschool;
                            var stnum = "";
                            var tmplen = tmp.length;
                            console.log(tmp+"|"+tmplen);
                            if(tmplen>6){
                                stnum = tmp.substr(0,tmplen-6)+","+tmp.substr(tmplen-6,3)+","+tmp.substr(tmplen-3,3);
                            }else if(tmplen>3){
                                stnum = tmp.substr(0,tmplen-3)+","+tmp.substr(tmplen-3,3);
                            }else{
                                stnum = tmp;
                            }
                        div.append("div").text("OSC: "+stnum);
                })
                // fade out tooltip on mouse out
                .on("mouseout", function(d) {
                    d3.select(this).classed("highlight", false);
                    div.selectAll("*").remove();
                    div.transition()
                        .duration(0)
                        .style("opacity", 0);
                });
        svg.append("path")
                .datum(topojson.mesh(ut, ut.objects.IND_STATE))
                .attr("class", "state-border")
                .attr("d", path);
       
    svg.append("text")
    .attr("class", "#states")
      .attr("x", 40)
      .attr("y", 80)
      .style("text-anchor", "middle")
      .text("Select a State to transition or hover over the state to show total OSC for the state.")
      .attr("style","font-weight: normal; font-size: 12px;");
    });
    
}

//Function to highlight the selected district
function district_clicked(d) {
    var sel_district = document.getElementsByClassName('seldist');

        // Now remove them
        var len = sel_district.length;
        for (var i = 0; i < len; i++) {
            sel_district[0].parentElement.removeChild(sel_district[0]);
        }

    var district_id = d.id;
    create_bar({statecode:d.properties.statecode,districtcode:d.id,name:d.properties.name});
    
    d3.json("indiaDST.json", function(error, districts) {
                svg.append("g")
                  .attr("class", "#district")
                  .attr("clip-path", "url(#clip-land)")
                .selectAll("path")
                .data(topojson.feature(districts, districts.objects.Dist).features.filter(function(d) { return d.id == district_id  ; }))
                .enter().append("path")
                  .attr("class", "seldist")
                    .attr("d", path);
    
    });
}
 
//Function to create district split map of selected state 
function state_clicked(d) {
        var cur_states = document.getElementsByClassName('#states');

        // Now remove them
        var len = cur_states.length;
        for (var i = 0; i < len; i++) {
            cur_states[0].parentElement.removeChild(cur_states[0]);
        }
    
    
       
        if (d && state !== d) {
            state = d;
            var state_name = state.properties.statename;
            var state_id = state.id;
            create_bar({statecode:state.id,districtcode:"000",name:state.properties.statename});

            d3.json("indiaDST.json", function(error, districts) {
                svg.append("g")
                  .attr("class", "#districts")
                  .attr("clip-path", "url(#clip-land)")
                .selectAll("path")
                .data(topojson.feature(districts, districts.objects.Dist).features.filter(function(d) { return d.properties.statecode == state_id  ; }))
                .enter().append("path")
                .style("fill", function(d) { 
                        var districtcolor;
                        if(d.properties.name == "POK"){
                            districtcolor = "gray";
                        }else{
                            districtcolor = color(d.properties.outofschool * 0.000001);
                        }
                        return districtcolor; 
                    })
                    .attr("d", path)
                .on("click", district_clicked)
                .on("mouseover", function(d) {
                                d3.select(this).attr("class", "highlight");
                                div.transition()
                                    .duration(200)
                                    .style("opacity", .9);
                                div.style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY - 28) + "px");
                                div.append("div").text(d.properties.name);
                                var tmp = "" + d.properties.outofschool;
                            var stnum = "";
                            var tmplen = tmp.length;
                            console.log(tmp+"|"+tmplen);
                            if(tmplen>6){
                                stnum = tmp.substr(0,tmplen-6)+","+tmp.substr(tmplen-6,3)+","+tmp.substr(tmplen-3,3);
                            }else if(tmplen>3){
                                stnum = tmp.substr(0,tmplen-3)+","+tmp.substr(tmplen-3,3);
                            }else{
                                stnum = tmp;
                            }
                    
                            if(d.properties.name == "POK"){
                                stnum = "No Data";
                            }
                        div.append("div").text("OSC: "+stnum);
                        })
                        // fade out tooltip on mouse out
                        .on("mouseout", function(d) {
                            d3.select(this).classed("highlight", false);
                            div.selectAll("*").remove();
                            div.transition()
                                .duration(0)
                                .style("opacity", 0);
                        });
                
                svg.append("path")
                .datum(topojson.mesh(districts, districts.objects.Dist, function(a, b){ return (a.properties.statecode== state_id || b.properties.statecode== state_id);}))
                .attr("class", "district-border")
                .attr("d", path);
                
                svg.append("text")
                .attr("class", "#districts")
                  .attr("x", 40)
                  .attr("y", 80)
                  .style("text-anchor", "middle")
                  .text("Select a District to transition")
                  .attr("style","font-weight: normal; font-size: 12px;");
                
                svg.append("text")
                .attr("class", "#districts")
                  .attr("x", 40)
                  .attr("y", 80)
                  .style("text-anchor", "middle")
                  .text("Select a District to transition or click away from the state to return to previous map or hover over the district to show total OSC for the district.")
                  .attr("style","font-weight: normal; font-size: 12px;");
            });
        }
        
    }


//when clicked out of the state, we return back to the Indian state map
 svg.append("rect")
    .attr("class", "background")
    .attr("width", width-500)
    .attr("height", height)
    .style("opacity", 0)
    .on("click", rect_clicked);

//Initialize India State map
rect_clicked();
    

//Function to create bar chart
function create_bar(a){
    var barchar = document.getElementsByClassName('barchart');
    var len  = barchar.length;
    for (var i = 0; i < len; i++) {
            barchar[0].parentElement.removeChild(barchar[0]);
     
    }

var margin = {top: 10, right: 40, bottom: 150, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    
    svgn = svg.append("g")
    .attr("class", "barchart")
    .attr("transform", "translate(120,750)");


// Define X and Y SCALE.

var xScale = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.6);

var yScale = d3.scale.linear()
    .range([height, 0]);
    
var yScale2 = d3.scale.linear()
    .range([height, 0]);

// Define X and Y AXIS

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickSize(7,1)
    .ticks(15);
    
var yAxis = d3.svg.axis() 
    .scale(yScale)
    .orient("left")
    .ticks(10)
    .tickSize(7,1);
    
var yAxis2 = d3.svg.axis() 
    .scale(yScale2)
    .orient("right")
    .ticks(10)
    .tickSize(7,1);

var csv;
if(a.districtcode=="000"){
    csv = "statebar.csv";
}else{
    csv = "districtbar.csv";
}
    
//bars for state or district
if(a.statecode != "00" || a.districtcode!="000"){
    d3.csv(csv,function(error, data1){
        var data=[];
        data1.forEach(function(d) {

            if(d.StateCode == a.statecode && d.DistrictCode == a.districtcode){

                data.push({
                    key:   d.Age,
                    value:  +d.OutOfSchoolChildren
                });
            }
        });

        xScale.domain(data.map(function(d){ 
            return d.key; 
        }));
        yScale2.domain([0,d3.max(data, function(d) {return Math.round(d.value/100)/100; })]);

 
       //bars for state or district
        svgn.append("g").selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr("height", 0) 
            .attr("y", height)
            .attr({
                "x": function(d) { return xScale(d.key)+12; },
                "y": function(d) { return yScale2(Math.round(d.value/100)/100); },
                "width": xScale.rangeBand(),
                "height": function(d) { return  height - yScale2(Math.round(d.value/100)/100); },
                "style": function(d,i) {
                    return "fill: "+ color(d.value/1000000) ;
                },
            });

        // Label the data values
          svgn.append("g").selectAll("text")
             .data(data)
             .enter()
             .append("text")
             .text(function(d) {
                 return Math.round(d.value/100)/100;
             })
             .attr("x", function(d, i) {
                 return (i * 58)+60;
             })
             .attr("y", function(d) {
                 return yScale2(Math.round(d.value/100)/100)+15;
             })
             .attr("style","text-anchor:middle;font-weight:bold;font-family:sans-serif;font-size:9px;fill:black;");


        var nametxt;
        if(a.statecode != "00" && a.districtcode=="000"){
            nametxt = a.name + " State";
        }else if(a.districtcode!="000"){
            nametxt = a.name + " District";
        }else {
            nametxt = a.name;
        }

        // Draw yAxis for state or district and postion the label
        var txt = "In Ten Thousand Children (" + nametxt + ")";
        svgn.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + width + ",0)")
          .call(yAxis2)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -height/2) 
          .attr("y", 50)
          .text(txt)
          .attr("style", "text-anchor: middle;font-weight: bold; font-size: 14px;fill: #7f0000");



    });
}

//Bars for India
d3.csv("statebar.csv",function(error, data1){
    //console.log("in state");
    var data=[];
    data1.forEach(function(d) {
        
        if(d.StateCode == "00" && d.DistrictCode == "000"){
            
            data.push({
                key:   d.Age,
                value: +d.OutOfSchoolChildren
            });
        }
    });

    
    xScale.domain(data.map(function(d){ 
        return d.key; 
    }));
    yScale.domain([0,d3.max(data, function(d) {return Math.round(d.value/10000)/100; })]);
    

    //bars for statistics of India
    svgn.append("g").selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr("height", 0) 
        .attr("y", height)
        .attr({
            "x": function(d) { return xScale(d.key)-11; },
            "y": function(d) { return yScale(Math.round(d.value/10000)/100); },
            "width": xScale.rangeBand(),
            "height": function(d) { return  height - yScale(Math.round(d.value/10000)/100); },
            "style": function(d,i) {
                if(a.statecode != "00" || a.districtcode!="000"){
                    return "fill: gray"+";opacity: 0.5";
                }else{
                    return "fill: "+ color(Math.round(d.value/10000)/100) ;
                }
            },
        });
    
    //label data values
      svgn.append("g").selectAll("text")
         .data(data)
         .enter()
         .append("text")
         .text(function(d) {
             return Math.round(d.value/10000)/100;
         })
         .attr("x", function(d, i) {
             return (i * 58)+37;
         })
         .attr("y", function(d) {
             return yScale(Math.round(d.value/10000)/100)+15;
         })
         .attr("style","text-anchor:middle;font-weight:bold;font-family:sans-serif;font-size:9px;fill:black;");
    
    // Draw xAxis and postion the label 
    svgn.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("x", width/2)
        .attr("y", 40)
        .text("Age")
        .attr("style", "text-anchor: middle;font-size: 14px;");
        
    
    // Draw yAxis for India and postion the label 
    var txt = "In Million Children (India)";
    svgn.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height/2))
      .attr("y", -40)
      .text(txt)
      .attr("style",function(d,i) {
                if(a.statecode != "00" || a.districtcode!="000"){
                    return "text-anchor: middle;font-weight: bold; font-size: 14px;fill: gray;opacity: 0.5";
                }else{
                    return "text-anchor: middle;font-weight: bold; font-size: 14px;fill: #7f0000";
                }
            });
    
    var nametxt;
    if(a.statecode != "00" && a.districtcode=="000"){
        nametxt = "India & " + a.name + " State";
    }else if(a.districtcode!="000"){
        nametxt = "India & " + a.name + " District";
    }else {
        nametxt = a.name;
    }
    
    svgn.append("text")
      .attr("x", width/2)
      .attr("y", -25)
      .text(nametxt)
      .attr("style","text-anchor: middle;font-weight: bold; font-size: 14px;");
    
    svgn.append("text")
      .attr("x", width/2)
      .attr("y", -10)
      .text("Out of School Children Statistics per Age")
      .attr("style","text-anchor: middle;font-weight: bold; font-size: 14px;");
      
});
    

}
