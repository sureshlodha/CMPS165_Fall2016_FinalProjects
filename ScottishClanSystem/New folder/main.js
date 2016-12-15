$(document).ready(function() {
    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
        var matches, substringRegex;

        // an array that will be populated with substring matches
        matches = [];

        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function(i, str) {
          if (substrRegex.test(str)) {
            matches.push(str);
          }
        });

        cb(matches);
      };
    };
    
    console.log(clans);
    var all_lands = {"000": {"num": 0, "clans": []}};
    for(clan in clans) {
        if(clans[clan]["Lands"] != null) {
            var lands = clans[clan]["Lands"].split(/\s*,\s*/);
            for(var i = 0; i < lands.length; i++) {
                if(!(lands[i] in all_lands)) {
                    all_lands[lands[i]] = {"num": 1, "clans": [clan]};
                } else {
                    all_lands[lands[i]]["num"]++;
                    all_lands[lands[i]]["clans"].push(clan);
                }
            }
        } else {
            all_lands["000"]["num"]++;
            all_lands["000"]["clans"].push(clan);
        }
    }
    console.log(all_lands);
    
    var tartans_wo_clans = [];
    for(var x = 0; x < tartans.length; x++) {
        if(typeof tartans[x] == "object") {
            if(!(Object.keys(tartans[x])[0] in clans)) {
                tartans_wo_clans.push(Object.keys(tartans[x])[0]);
            }
        }
    }
    console.log(tartans_wo_clans);
    
    var width = ($(document).width()*2)/3,
        height = $(document).height() - 200;
    
    $('#clan-container').height(height - 2);
    
    $('#default').height(height/2);
    
    var selected_county = null;
    var selected_clan = null;
    var hover_county = null;
    var hover_clan = null;
    var sort_mode = 'alpha';

    var color = d3.scale.threshold()
        .range(["#aaaaaa", "#a8d5ff", "#7eb7ed", "#5499db", "#2a7bc9", "#005eb8"])
        .domain([1, 5, 15, 25, 35, 50]);
    
    var legend = d3.scale.linear()
        .domain([1, 50])
        .range([0, height - 50]);
    
    //Map projection
    var projection = d3.geo.mercator()
        .scale(3720.418244913092 /* 1.5+(width/height)*/)
        .center([-4.68730835113287,57.8814974007145]) //projection center
        .translate([width/2,height/2]) //translate to center the map in view

    //Generate paths based on projection
    var path = d3.geo.path()
        .projection(projection);

    //Create an SVG
    var svg = d3.select("#map-container").append("svg")
        .attr("width", width)
        .attr("height", height);

    //Group for the map features
    var features = svg.append("g")
        .attr("class","features");

    //Create zoom/pan listener
    //Change [1,Infinity] to adjust the min/max zoom scale
    var zoom = d3.behavior.zoom()
        .scaleExtent([1, Infinity])
        .on("zoom",zoomed);

    svg.call(zoom);

    //Create a tooltip, hidden at the start
    var tooltip = d3.select("body").append("div").attr("class","county-tooltip");
    var tooltipOffset = {x: 5, y: -25, height: 550, width: 250};

    d3.json("Map_scotland.json",function(error, geodata) {
        if (error) return console.log(error); //unknown error, check the console
        
        var yAxis = d3.svg.axis()
            .scale(legend)
            .orient('left')
            .ticks(color.domain().length)
            .tickValues(color.domain());
        
        showDefault(sort_mode);
        
        //Create a path for each map feature in the data
        features.selectAll("path")
            .data(topojson.feature(geodata, geodata.objects.lad).features) //generate features from TopoJSON
            .enter()
            .append("path")
            .attr("d",path)
            .attr('id', function(d) {
                return d.properties.LAD13NM;  
            })
            .attr('class', function(d) {
                return d.properties.LAD13NM in all_lands ? getCountyClass(all_lands[d.properties.LAD13NM]['num']): getCountyClass(0);
            })
            .on('mouseover', function(d) {
              //d.properties.LAD13NM
              showTooltip(d);
              hover_county = this.style.fill;
              d3.select(this)
                .classed('hover_over', true);
            })
            .on('mousemove', function() {
              moveTooltip();
            })
            .on('mouseout', function(d) {
              hideTooltip();
              if(selected_clan != null) {
                  if(clans[selected_clan]["Lands"].indexOf(d.properties.LAD13NM) == -1) {
                      d3.select(this)
                        .classed('hover_over', false);
                  }
              } else {
                  d3.selectAll('.hover_over')
                    .classed('hover_over', false);
              }
              hover_county = null;
            })
            .on('click', function(d) {
              if(selected_county == d.properties.LAD13NM) {
                  d3.selectAll('.selected')
                    .classed('selected', false);
                  selected_county = null;
                  showDefault('alpha');
              } else {
                  selected_county = d.properties.LAD13NM;
                  d3.selectAll('.selected')
                    .classed('selected', false);
                  d3.select(this)
                    .classed('selected', true);
                  showClans(selected_county);
              }
              //console.log($('#' + selected_county).attr('id'));
        })
      var g = svg.append('g')
        .attr('class', 'key')
        .attr('transform', 'translate(75, 30)');
        
      g.selectAll('rect')
        .data(color.range().map(function(d, i) {
          return {
                  y0: i ? legend(color.domain()[i - 1]): legend.range()[0],
                  y1: i < color.domain().length ? legend(color.domain()[i]) : legend.range()[1],
                  z: d
          };
      }))
      .enter().append('rect')
        .attr('width', 8)
        .attr('y', function(d) { return d.y0; })
        .attr('height', function(d) { return d.y1 - d.y0; })
        .style('fill', function(d) { 
          return d.z; 
        });
        
      g.call(yAxis).append('text')
        .attr('class', 'caption')
        .attr('y', -10)
        .attr('x', -68)
        .style('font-family', 'Arial')
        .text('Number of Clans')
    })
    
    $('#the-basics .typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'states',
      source: substringMatcher(getClans())
    });
    
    $('.typeahead').bind('typeahead:select', function(ev, suggestion) {
        showClanInfo(suggestion);
        d3.selectAll('.hover_over')
            .classed('hover_over', false);
        d3.selectAll('.selected')
            .classed('selected', false);
        var clan = clans[suggestion.replace(/[ ]/g, "_")];
        console.log(clan["Lands"]);
        for(var i = 0; i < clan["Lands"].length; i++) {
            document.getElementById(clan["Lands"][i]).classList.add('hover_over');
        }
    });

    //Update map on zoom/pan
    function zoomed() {
      features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
          .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );
    }
    function showTooltip(data) {
        moveTooltip();
        tooltip.style("visibility","visible")
            .style('padding', '4px 8px')
            .style('width', 'auto')
            .html('<strong>' + data.properties.LAD13NM + '</strong>');
    }

    //Move the tooltip to track the mouse
    function moveTooltip() {
      tooltip.style("top",(d3.event.pageY+tooltipOffset.y)+"px")
          .style("left",(d3.event.pageX+tooltipOffset.x)+"px");
    }

    //Create a tooltip, hidden at the start
    function hideTooltip() {
      tooltip.style("visibility","hidden");
    }
    
    function showDefault() {
        var sort_clans = [];
        d3.selectAll('.hover_over')
            .classed('hover_over', false);
        for(clan in clans) {
            if(clans[clan]["Lands"] == null) continue;
            if(typeof clans[clan]["Lands"] === "string"){
                clans[clan]["Lands"] = clans[clan]["Lands"].split(/\s*,\s*/);
            }
            sort_clans.push({'name': clan,
                             'Crest': clans[clan]["Crest"],
                             'Crest_Image': clans[clan]["Crest_Image"],
                             'Gailic_Name': clans[clan]["Gaelic_Name"],
                             'Lands': clans[clan]["Lands"],
                             'Motto': clans[clan]["Motto"],
                             'Origin': clans[clan]["Origin"],
                             'Origin_Time': clans[clan]["Origin_Time"],
                             'Tartan_Image': clans[clan]["Tartan_Image"]
                            });
        }
        
        sort_clans.sort(function(a, b) {
            if(sort_mode == 'alpha') {
                if(a["name"] < b["name"]) {
                    return -1
                } else if(b["name"] < a["name"]) {
                    return 1
                }
                return 0
            } else if(sort_mode == 'lands') {
                if(a["Lands"].length > b["Lands"].length) {
                    return -1
                } else if(b["Lands"].length > a["Lands"].length) {
                    return 1
                }
                return 0
            }
        });
        $('#clan-container').html("");
            
        var county_name_div = document.createElement('div');
        var county_name_id = document.createAttribute('id');

        var county_content_div = document.createElement('div');
        var county_content_id = document.createAttribute('id');

        county_name_id.value = "county-name";
        county_name_div.classList.add(getCountyClass(49))
        county_name_div.setAttributeNode(county_name_id);

        county_content_id.value = "county-content";
        county_content_div.setAttributeNode(county_content_id);

        county_name_div.classList.add('container-fluid');
        county_name_div.innerHTML = '<h2>All Clans</h2>';

        var clan_list = document.createElement('ul');
        for(var i = 0; i < sort_clans.length; i++) {
            var list_item = document.createElement('li');
            list_item.innerHTML = '<span id="' + sort_clans[i]["name"] + '" class="list_item">' + sort_clans[i]["name"].replace(/[_]/g, " ") + '</span>';
            clan_list.appendChild(list_item);
            list_item.addEventListener('click', function(d) {
                showClanInfo(d.path[0].id);
                selected_clan = d.path[0].id;
            });
            list_item.addEventListener('mouseover', function(d) {
                if(d.path[0].id != "") {
                    tooltip.style("width", tooltipOffset.width + 'px')
                        .style('padding', '0')
                        .html(showClanInfoTooltip(d.path[0].id));
                    if(d.pageX + tooltipOffset.x + tooltipOffset.width > $(document).width()) {
                        tooltip.style('left', d.pageX-tooltipOffset.x-tooltipOffset.width + 'px');
                    } else {
                        tooltip.style('left', d.pageX+tooltipOffset.x + 'px');
                    }
                    if(d.pageY + tooltipOffset.y + tooltipOffset.height > $('#clan-container').height() + $('.navbar').height()) {
                        tooltip.style('top', $('#clan-container').height() + $('.navbar').height() - tooltipOffset.height + "px");
                    } else {
                        tooltip.style('top', d.pageY+tooltipOffset.y + 'px');
                    }
                    tooltip.style("visibility","visible");
                    var lands;
                    if(typeof clans[d.path[0].id]["Lands"] === "string"){
                        lands = clans[d.path[0].id]["Lands"].split(/\s*,\s*/);
                    } else {
                        lands = clans[d.path[0].id]["Lands"];
                    }
                    for(var i = 0; i < lands.length; i++) {
                        if(lands[i] == selected_county) continue;
                        if(lands[i] == "Perth" || lands[i] == "Kinross") {
                            document.getElementById('Perth and Kinross').classList.add('hover_over');
                        } else if(lands[i] == "Argyll" || lands[i] == "Bute") {
                            document.getElementById('Argyll and Bute').classList.add('hover_over');
                        } else if(lands[i] == "Dumfries" || lands[i] == "Galloway") {
                            document.getElementById('Dumfries and Galloway').classList.add('hover_over');
                        } else {
                            document.getElementById(lands[i]).classList.add('hover_over');
                        }
                    }
                }
            });
            list_item.addEventListener('mousemove', function(d) {
                if(d.pageX + tooltipOffset.x + tooltipOffset.width > $(document).width()) {
                        tooltip.style('left', d.pageX-tooltipOffset.x-tooltipOffset.width + 'px');
                    } else {
                        tooltip.style('left', d.pageX+tooltipOffset.x + 'px');
                    }
                if(d.pageY + tooltipOffset.y + tooltipOffset.height > $('#clan-container').height() + $('.navbar').height()) {
                    tooltip.style('top', $('#clan-container').height() + $('.navbar').height() - tooltipOffset.height + "px");
                } else {
                    tooltip.style('top', d.pageY+tooltipOffset.y + 'px');
                }
            });
            list_item.addEventListener('mouseout', function(d) {
                tooltip.style('visibility', 'hidden');
                d3.selectAll('.hover_over')
                    .classed('hover_over', false);
            })
        }
        
        var mode_sel = document.createElement('select');
        mode_sel.setAttribute('id', 'sel1');
        mode_sel.setAttribute('class', 'form-control');
        
        mode_sel.innerHTML = '<option' + (sort_mode == 'alpha' ? ' selected': '') + '>Alphabetical</option>' +
                    '<option' + (sort_mode == 'lands' ? ' selected': '') + '>Number of Lands</option>';
        
        mode_sel.addEventListener('change', function(d) {
            if($('#sel1 option:selected').html() == "Alphebetical") {
                sort_mode = 'alpha';
                showDefault();
            } else if($('#sel1 option:selected').html() == "Number of Lands") {
                sort_mode = 'lands';
                showDefault();
            }
        });
        var select_div = document.createElement('div');
        select_div.innerHTML = '<label for="sel1">Sort by:</label>';
        select_div.appendChild(mode_sel);
        
        county_content_div.appendChild(select_div);
        county_content_div.appendChild(clan_list);

        $('#clan-container').append(county_name_div);
        $('#clan-container').append(county_content_div);

    }
    
    function showClans(county) {
        if(county != null) {
            selected_clan = null;
            d3.selectAll('.hover_over')
                .classed('hover_over', false);
            if(!document.getElementById(county).classList.contains('selected')) {
                document.getElementById(county).classList.add('selected');
            }
            var counties = [county];
            var county_clans = [];
            for(var j = 0; j < counties.length; j++) {
                for(var k = 0; k < all_lands[counties[j]].clans.length; k++) {
                    if(county_clans.indexOf(all_lands[counties[j]].clans[k]) == -1) {
                        county_clans.push(all_lands[counties[j]].clans[k])
                    }
                }
            }
            county_clans.sort(function(a, b) {
                if(sort_mode == 'alpha') {
                    if(a < b) {
                        return -1
                    } else if(b < a) {
                        return 1
                    }
                    return 0
                } else if(sort_mode == 'lands') {
                    if(clans[a]["Lands"].length > clans[b]["Lands"].length) {
                        return -1
                    } else if(clans[b]["Lands"].length > clans[a]["Lands"].length) {
                        return 1
                    }
                    return 0
                }
            });
            $('#clan-container').html("");
            
            var county_name_div = document.createElement('div');
            var county_name_id = document.createAttribute('id');

            var county_content_div = document.createElement('div');
            var county_content_id = document.createAttribute('id');

            county_name_id.value = "county-name";
            county_name_div.classList.add(getCountyClass(county_clans.length))
            county_name_div.setAttributeNode(county_name_id);

            county_content_id.value = "county-content";
            county_content_div.setAttributeNode(county_content_id);

            county_name_div.classList.add('container-fluid');
            county_name_div.innerHTML = '<h2>' + county + '</h2>';

            var clan_list = document.createElement('ul');
            for(var i = 0; i < county_clans.length; i++) {
                var list_item = document.createElement('li');
                list_item.innerHTML = '<span id="' + county_clans[i] + '" class="list_item">' + county_clans[i].replace(/[_]/g, " ") + '</span>';
                clan_list.appendChild(list_item);
                list_item.addEventListener('click', function(d) {
                    showClanInfo(d.path[0].id);
                    selected_clan = d.path[0].id;
                });
                list_item.addEventListener('mouseover', function(d) {
                    if(d.path[0].id != "") {
                        tooltip.style("width", tooltipOffset.width + 'px')
                            .style('padding', '0')
                            .html(showClanInfoTooltip(d.path[0].id));
                        if(d.pageX + tooltipOffset.x + tooltipOffset.width > $(document).width()) {
                            tooltip.style('left', d.pageX-tooltipOffset.x-tooltipOffset.width + 'px');
                        } else {
                            tooltip.style('left', d.pageX+tooltipOffset.x + 'px');
                        }
                        if(d.pageY + tooltipOffset.y + tooltipOffset.height > $('#clan-container').height() + $('.navbar').height()) {
                            tooltip.style('top', $('#clan-container').height() + $('.navbar').height() - tooltipOffset.height + "px");
                        } else {
                            tooltip.style('top', d.pageY+tooltipOffset.y + 'px');
                        }
                        tooltip.style("visibility","visible");
                        var lands;
                        if(typeof clans[d.path[0].id]["Lands"] === "string"){
                            lands = clans[d.path[0].id]["Lands"].split(/\s*,\s*/);
                        } else {
                            lands = clans[d.path[0].id]["Lands"];
                        }
                        for(var i = 0; i < lands.length; i++) {
                            if(lands[i] == selected_county) continue;
                            if(lands[i] == "Perth" || lands[i] == "Kinross") {
                                document.getElementById('Perth and Kinross').classList.add('hover_over');
                            } else if(lands[i] == "Argyll" || lands[i] == "Bute") {
                                document.getElementById('Argyll and Bute').classList.add('hover_over');
                            } else if(lands[i] == "Dumfries" || lands[i] == "Galloway") {
                                document.getElementById('Dumfries and Galloway').classList.add('hover_over');
                            } else if(lands[i] == "Lothian") {
                                document.getElementById('Midlothian').classList.add('hover_over');
                                document.getElementById('East Lothian').classList.add('hover_over');
                                document.getElementById('City of Edinburgh').classList.add('hover_over');
                                document.getElementById('West Lothian').classList.add('hover_over');
                            } else {
                                document.getElementById(lands[i]).classList.add('hover_over');
                            }
                        }
                    }
                });
                list_item.addEventListener('mousemove', function(d) {
                    if(d.pageX + tooltipOffset.x + tooltipOffset.width > $(document).width()) {
                            tooltip.style('left', d.pageX-tooltipOffset.x-tooltipOffset.width + 'px');
                        } else {
                            tooltip.style('left', d.pageX+tooltipOffset.x + 'px');
                        }
                    if(d.pageY + tooltipOffset.y + tooltipOffset.height > $('#clan-container').height() + $('.navbar').height()) {
                        tooltip.style('top', $('#clan-container').height() + $('.navbar').height() - tooltipOffset.height + "px");
                    } else {
                        tooltip.style('top', d.pageY+tooltipOffset.y + 'px');
                    }
                });
                list_item.addEventListener('mouseout', function(d) {
                    tooltip.style('visibility', 'hidden');
                    d3.selectAll('.hover_over')
                        .classed('hover_over', false);
                })
            }
        var mode_sel = document.createElement('select');
        mode_sel.setAttribute('id', 'sel1');
        mode_sel.setAttribute('class', 'form-control');

        mode_sel.innerHTML = '<option' + (sort_mode == 'alpha' ? ' selected': '') + '>Alphabetical</option>' +
                    '<option' + (sort_mode == 'lands' ? ' selected': '') + '>Number of Lands</option>';

        mode_sel.addEventListener('change', function(d) {
            if($('#sel1 option:selected').html() == "Alphebetical") {
                sort_mode = 'alpha';
                showClans(county);
            } else if($('#sel1 option:selected').html() == "Number of Lands") {
                sort_mode = 'lands';
                showClans(county);
            }
        });
        var select_div = document.createElement('div');
        select_div.innerHTML = '<label for="sel1">Sort by:</label>';
        select_div.appendChild(mode_sel);
        
        county_content_div.appendChild(select_div);
            county_content_div.appendChild(clan_list);
            $('#clan-container').append(county_name_div);
            $('#clan-container').append(county_content_div);
        }
    }
    
    function showClanInfo(clan) {
        hideTooltip();
        var selected_clan = clans[clan];
        console.log(selected_clan);
        var clan_name_div = document.createElement('div');
        var clan_name_id = document.createAttribute('id');
        
        var clan_content_div = document.createElement('div');
        var clan_content_id = document.createAttribute('id');
        
        clan_name_id.value = "clan-name";
        clan_name_div.setAttributeNode(clan_name_id);
        
        clan_content_id.value = "clan-content";
        clan_content_div.setAttributeNode(clan_content_id);
        
        clan_name_div.classList.add('container-fluid');
        if(selected_clan.Tartan_Image != null) {
            clan_name_div.style.backgroundImage = "url('" + selected_clan.Tartan_Image[0] + "')";
        }
        clan_name_div.innerHTML = (selected_clan["Gaelic_Name"] != null ? '<h2 style="margin-top:5px;"><strong>' + clan.replace(/[_]/g, " ") + '</strong></h2>' + '<h4>' + selected_clan["Gaelic_Name"] + '</h4>': '<h2 style="margin: 21px 0;"><strong>' + clan.replace(/[_]/g, " ") + '</strong></h2>');
        
        clan_content_div.innerHTML = '<img class="img-responsive crest-image"src=' + selected_clan["Crest_Image"] + '><br>';
        
        clan_content_div.innerHTML += ((selected_clan["Crest"] != null ? ('<strong>Crest Description</strong>: ' + selected_clan["Crest"] + '<br><br>'): '')) + 
            ((selected_clan["Motto"] != null ? ('<strong>Motto</strong>: ' + selected_clan["Motto"] + '<br><br>'): '')) + 
            ((selected_clan["Origin_Time"] != null ? ('<strong>Origin Year</strong>: ' + selected_clan["Origin_Time"] + '<br><br>'): '')) + 
            ((selected_clan["Origin"] != null ? ('<strong>Origin</strong>: ' + selected_clan["Origin"] + '<br><br>'): ''));
        
        if(typeof selected_clan["Lands"] == "string") {
            selected_clan["Lands"] = selected_clan["Lands"].split(/\s*,\s*/);
        }
        
        clan_content_div.innerHTML += '<strong>Occupied Lands: </strong>';
        var county_list = document.createElement('ul');
        
        for(var i = 0; i < selected_clan["Lands"].length; i++) {
            var list_item = document.createElement('li');
            var land_id = document.createAttribute('id');
            land_id.value = selected_clan["Lands"][i];
            list_item.setAttributeNode(land_id);
            
            list_item.innerHTML = '<span id="' + selected_clan["Lands"][i] + '" class="list_item">' + selected_clan["Lands"][i] + '</span>';
            
            list_item.addEventListener('mouseover', function(d) {
                document.getElementById(d.path[0].id).style.stroke = 'black';
            });
            
            list_item.addEventListener('mouseout', function(d) {
                document.getElementById(d.path[0].id).style.stroke = 'white';
            });
            
            list_item.addEventListener('click', function(d) {
                var county_name = d.path[0].id;
                document.getElementById(county_name).style.stroke = 'white';
                if(selected_county != county_name) {
                    d3.selectAll('.selected')
                        .classed('selected', false);
                    selected_county = county_name;
                    d3.select(this)
                        .classed('selected', true);
                    showClans(selected_county);
                }
                showClans(county_name);
            });
            county_list.appendChild(list_item);
        }
        
        clan_content_div.appendChild(county_list);
        
        var tartan_viewer = document.createElement('div');
        var data_id = document.createAttribute('data-id');
        var tab_ind = document.createAttribute('tabindex');
        tab_ind.value = 1;
        data_id.value = "0";
        tartan_viewer.setAttributeNode(data_id);
        tartan_viewer.setAttributeNode(tab_ind);
        tartan_viewer.innerHTML = "Hover to view " + clan + "'s Tartan" + (selected_clan["Tartan_Image"].length > 1 ? 's': '');
        tartan_viewer.addEventListener('mouseover', function(d) {
            console.log(d);
            this.focus();
            tooltip.style("width", '300px')
                   .style('padding', '5px')
                   .html(function() {
                        var index = parseInt(d.path[0].dataset["id"]);
                        return '<img class="img-responsive" src="' + selected_clan["Tartan_Image"][index] + '"><p>Use left and right arrow keys to scroll<br>' + (index + 1) + ' of ' + selected_clan["Tartan_Image"].length + '</p>';
                    });
            if(d.pageX + tooltipOffset.x + 300 > $(document).width()) {
                tooltip.style('left', d.pageX-tooltipOffset.x-300 + 'px');
            } else {
                tooltip.style('left', d.pageX+tooltipOffset.x + 'px');
            }
            if(d.pageY + tooltipOffset.y + tooltipOffset.height > $('#clan-container').height() + $('.navbar').height()) {
                tooltip.style('top', $('#clan-container').height() + $('.navbar').height() - 300 + "px");
            } else {
                tooltip.style('top', d.pageY+tooltipOffset.y + 'px');
            }
            tooltip.style("visibility","visible");
        });
        tartan_viewer.addEventListener('mousemove', function(d) {
            if(d.pageX + tooltipOffset.x + 300 > $(document).width()) {
                tooltip.style('left', d.pageX-tooltipOffset.x-300 + 'px');
            } else {
                tooltip.style('left', d.pageX+tooltipOffset.x + 'px');
            }
            if(d.pageY + tooltipOffset.y + tooltipOffset.height > $('#clan-container').height() + $('.navbar').height()) {
                tooltip.style('top', $('#clan-container').height() + $('.navbar').height() - 300 + "px");
            } else {
                tooltip.style('top', d.pageY+tooltipOffset.y + 'px');
            }
        });
        tartan_viewer.addEventListener('mouseout', function(d) {
            tooltip.style('visibility', 'hidden');
            this.blur();
        });
        tartan_viewer.addEventListener('keydown', function(d) {
            var curr_index = parseInt(tartan_viewer.getAttribute('data-id'));
            if(d.keyCode == 37) {
                if(curr_index - 1 >= 0) {
                    curr_index--;
                } else {
                    curr_index = selected_clan["Tartan_Image"].length - 1;
                }
                tartan_viewer.setAttribute('data-id', curr_index + '');
            } else if(d.keyCode == 39) {
                if(curr_index + 1 <= selected_clan["Tartan_Image"].length - 1) {
                    curr_index++;
                } else {
                    curr_index = 0;
                }
                tartan_viewer.setAttribute('data-id', curr_index + '');
            }
            tooltip.html(function() {
                        var index = parseInt(d.path[0].dataset["id"]);
                        return '<img class="img-responsive" src="' + selected_clan["Tartan_Image"][curr_index] + '"><p>Use left and right arrow keys to scroll<br>' + (curr_index + 1) + ' of ' + selected_clan["Tartan_Image"].length + '</p>';
                    });
        });
        
        clan_content_div.appendChild(tartan_viewer);
        
        var back = document.createElement('div');
        back.setAttribute('id', 'back-button');
        back.innerHTML = "<span><strong><< Back</strong></span>";
        back.addEventListener('click', function(d) {
            if($('.selected')[0].id != null) {
                return showClans($('.selected')[0].id)
            } 
            return showDefault();
        });
        
        clan_content_div.appendChild(back);
        
        $('#clan-container').html("");
        document.getElementById('clan-container').appendChild(clan_name_div);
        document.getElementById('clan-container').appendChild(clan_content_div);
    }
    
    function showClanInfoTooltip(clan) {
        hover_clan = clans[clan];
        var clan_name_div = document.createElement('div');
        var clan_name_id = document.createAttribute('id');
        
        var clan_content_div = document.createElement('div');
        var clan_content_id = document.createAttribute('id');
        
        clan_name_id.value = "clan-name";
        clan_name_div.setAttributeNode(clan_name_id);
        
        clan_content_id.value = "clan-content";
        clan_content_div.setAttributeNode(clan_content_id);
        
        clan_name_div.classList.add('container-fluid');
        if(hover_clan.Tartan_Image != null) {
            clan_name_div.style.backgroundImage = "url('" + hover_clan.Tartan_Image[0] + "')";
        }
        clan_name_div.innerHTML = (hover_clan["Gaelic_Name"] != null ? '<h2 style="margin-top:5px;"><strong>' + clan.replace(/[_]/g, " ") + '</strong></h2>' + '<h4>' + hover_clan["Gaelic_Name"] + '</h4>': '<h2 style="margin: 21px 0;"><strong>' + clan.replace(/[_]/g, " ") + '</strong></h2>');
        
        clan_content_div.innerHTML = '<img class="img-responsive crest-image"src=' + hover_clan["Crest_Image"] + '><br>';
            
        clan_content_div.innerHTML += ((hover_clan["Crest"] != null ? ('<strong>Crest Description</strong>: ' + hover_clan["Crest"] + '<br><br>'): '')) + 
            ((hover_clan["Motto"] != null ? ('<strong>Motto</strong>: ' + hover_clan["Motto"] + '<br><br>'): '')) + 
            ((hover_clan["Origin_Time"] != null ? ('<strong>Origin Year</strong>: ' + hover_clan["Origin_Time"] + '<br><br>'): '')) + 
            ((hover_clan["Origin"] != null ? ('<strong>Origin</strong>: ' + hover_clan["Origin"] + '<br><br>'): ''));
        
        if(typeof hover_clan["Lands"] == "string") {
            hover_clan["Lands"] = hover_clan["Lands"].split(/\s*,\s*/);
            //console.log(selected_clan);
        }
        
        clan_content_div.innerHTML += '<strong>Occupied Lands: </strong>';
        var county_list = document.createElement('ul');
        
        for(var i = 0; i < hover_clan["Lands"].length; i++) {
            var list_item = document.createElement('li');
            var land_id = document.createAttribute('id');
            land_id.value = hover_clan["Lands"][i];
            list_item.setAttributeNode(land_id);
            
            list_item.innerHTML = '<span style="color: black; text-decoration: none;" class="list_item">' + hover_clan["Lands"][i] + '</span>';
            
            county_list.appendChild(list_item);
        }
        
        clan_content_div.appendChild(county_list);
        
        clan_content_div.innerHTML += "<br><i>Click for more info<i><br>";
        
        var tooltip_div = document.createElement('div')
        tooltip_div.appendChild(clan_name_div);
        tooltip_div.appendChild(clan_content_div);
        return tooltip_div.innerHTML;
    }
    function getClans() {
        var clan_list = Object.keys(clans);
        clan_list.sort();
        for(var i = 0; i < clan_list.length; i++) {
            clan_list[i] = clan_list[i].replace(/[_]/g, " ");
        }
        return clan_list;
    }
    function getCountyClass(num) {
        if(num >= 1 && num < 5) {
            return 'county1';
        } else if(num >= 5 && num < 15) {
            return 'county2';
        } else if(num >= 15 && num < 25) {
            return 'county3';
        } else if(num >= 25 && num < 35) {
            return 'county4';
        } else if(num >= 35 && num < 50) {
            return 'county5';
        }
        return 'county0';
    }
});