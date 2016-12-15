//Initialize variables for color and boundary buttons
var change = 0,
    boundary = 0;

var width = 930,
    height = 1100;

var formatNumber = d3.format(",d");
    
var projection = d3.geo.albers()
    .center([10, 50])
    .rotate([-15, 2, 0])
    .parallels([38, 69])
    .scale(1100)
    .translate([width-450, height-640]);

var path = d3.geo.path()
    .projection(projection);
    
var color = d3.scale.threshold()
    .domain([5,10,20,40,60,80,110,130,150])
//.domain([1, 5, 10,15,20,25,30,35,40,45, 50, 55, 60])
    .range(["#00cc0a", 
            "#1aff25", 
            "#63FF9B", 
            "#63FFCB", 
            "#63FFFB", 
            "#63E3FF",
            "#63A3FF", 
            "#6373FF", 
            "#4d4dff",
           ]);

var color2 = d3.scale.threshold()
    .domain([00, 5, 10, 15 ,20 ,30, 40, 55, 70])
 
    .range(["#00cc0a", 
            "#1aff25", 
            "#63FF9B", 
            "#63FFCB", 
            "#63FFFB", 
            "#63E3FF",
            "#63A3FF", 
            "#6373FF", 
            "#4d4dff",
           ]);

/*.range(["#6363FF", 
            "#6373FF", 
            "#63A3FF", 
            "#63E3FF", 
            "#63FFFB", 
            "#63FFCB",
            "#63FF9B", 
            "#63FF6B", 
            "#52ff33",
           ]); */


// A position encoding for the key only.
var x = d3.scale.linear()
    .domain([0, 120])
    .range([0, 275]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(13)
    .tickValues(color.domain());
    //.tickFormat(function(d) { return d >= 100 ? formatNumber(d) : null; });

var svg = d3.select("body").append("svg")
    .attr("width", width + 200)
    .attr("height", height)
    .attr("id", "rightside")
    .attr("overflow-x", "scroll");


//svg.selectAll(".key").remove();//remove the old scale

var g = svg.append("g")//recreate the key object
    .attr("class", "key")
    .attr("transform", "translate(15,50)");
    

xAxis = d3.svg.axis()
    .scale(x)
    .orient("right")
    .tickSize(13)
    .tickValues(color.domain());



d3.json("eu.json", function(error, eu) {
  if (error) throw error;
     var tooltip = d3.select("body").append("countries")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
   //declare boolean for age selection
     var bigHash = new Object();
     var firstStateData = new Object();
     var quantityData = new Object();
     var currScaleData = new Object();
     var ScaleData = new Object();
     var langData = new Object();
     var gen;
     var all = true;
     var older = false;
     var middle = false;
     var youngest = false;
     //var currentCountry = "";
     var currentLang = "";
     var toolString="";
     var allValue = 0;
     var oldValue = 0 ;
     var middleValue = 0;
     var youngestValue = 0;
     var langState = false;
     var toolStringC;
     var toolStringV;
    
  svg.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(eu, eu.objects.world).features)
    .enter().append("path")
    .attr("fill", '#fff')
    .attr("d", path)
    .append("title");
    
  var countrySHAPE  = topojson.feature(eu, eu.objects.world);
  var lang;
    
  // Draw county borders.
   boundaries = svg.append("path")
      .datum(topojson.mesh(eu, eu.objects.world))
      .attr("class", "mesh")
   .style('stroke','#666666')
      .attr("d", path);
    //enable tooltip
    
    parseAll(path);
    var currentState;
    quantifyData(bigHash);
    var langName= "English"
    getLang(langName);
    changeGenName();
function changeGenName(){
     
        if (all)
                {
                    gen = " All Generations";
                }
            else if (older)
                {
                    gen = " Older Generation";
                }
            else if (middle)
                {
                    gen = " Middle Generation";
                }
            else if(youngest)
                {
                    gen = " Youngest Generation";
                }
    changeScale();
}
    function changeScale(){
        
        if(langState){
            x.domain([0,60]);
            x.range([0, 300]);
            
            svg.selectAll(".key").remove();//remove the old scale
            
            g = svg.append("g")//recreate the key object
                .attr("class", "key")
                .attr("transform", "translate(40,50)");
            
              xAxis = d3.svg.axis()
                .scale(x)
                .orient("right")
                .tickSize(13)
                .tickValues(color2.domain());
            
            //g.selectAll("tickValues").attr("transform", "translate(28,150) rotate(90)");
            
            g.call(xAxis).append("text")
                .attr("class", "caption")
                .attr("y", -6)
                .text(lang + gen + " Language Score")
                .attr("transform", "translate(0,-10) rotate(0)");
            
            //redraw new scale
           g.selectAll("rect")    
            .data(color2.range().map(function(d, i) {
               console.log(x.range());
              return {
                x0: i ? x(color2.domain()[i - 1]) : x.range()[0],   
                x1: i < color2.domain().length ? x(color2.domain()[i]) : x.range()[1],
                z: d
              };
            }))
            .enter().append("rect")
            .attr("height", 20)
            .attr("x", function(d) { return d.x0; })
            .attr("width", function(d) { return d.x1 - d.x0; })
            .style("fill", function(d) { return d.z; })
            .attr("transform", "translate(8,0) rotate(-270)");
        
            
        }else{
            x.domain([0,120]);
            x.range([0, 275]);

            svg.selectAll(".key").remove();//remove the old scale

            g = svg.append("g")//recreate the key object
                .attr("class", "key")
                .attr("transform", "translate(15,50)");

              xAxis = d3.svg.axis()
                .scale(x)
                .orient("right")
                .tickSize(13)
                .tickValues(color.domain());

            //g.selectAll("tickValues").attr("transform", "translate(28,150) rotate(90)");

            g.call(xAxis).append("text")
                .attr("class", "caption")
                .attr("y", -6)
                .text(gen + " Secondary Language Score")
                .attr("transform", "translate(0,-10) rotate(0)");

            //redraw new scale
            g.selectAll("rect")    
            .data(color.range().map(function(d, i) {
               console.log(x.range());
              return {
                x0: i ? x(color.domain()[i - 1]) : x.range()[0],   
                x1: i < color.domain().length ? x(color.domain()[i]) : x.range()[1],
                z: d
              };
            }))
            .enter().append("rect")
            .attr("height", 20)
            .attr("x", function(d) { return d.x0; })
            .attr("width", function(d) { return d.x1 - d.x0; })
            .style("fill", function(d) { return d.z; })
            .attr("transform", "translate(8,0) rotate(-270)");
        }
    }
    
     console.log(color(.68));
    function drawColors(){
        
        console.log(" all:" +all + " old:" +older+ " middle:" + middle + " youngest:" +youngest + " langState:" + langState + " lang = "  +lang);
        svg.selectAll('.countries')
            .data(topojson.feature(eu, eu.objects.world).features)
            .enter()
            .append('path')
            .style('stroke','#666666')
            .attr('d', path)
            .style('fill',
                function(d){ 
                  if(langState){
                      
                      if(d.properties.allEnglish == 1000){return "#d3d3d3";
                                                               
                        }else{
                            if(all){ 
                                if(lang == "Croatian"){
                                 return color2( d.properties.allCroatian);  
                                }else if(lang == "Czech"){
                                 return color2( d.properties.allCzech);  
                                }else if(lang == "Danish"){
                                 return color2( d.properties.allDanish);
                                }else  if(lang == "Dutch"){
                                 return color2( d.properties.allDutch);  
                                }else  if(lang == "English"){
                                 return color2( d.properties.allEnglish);  
                                }else  if(lang == "Estonia"){
                                 return color2( d.properties.allEstonian);  
                                }else  if(lang == "Finnish"){
                                 return color2( d.properties.allFinnish);  
                                }else   if(lang == "French"){
                                 return color2( d.properties.allFrench);  
                                }else   if(lang == "German"){
                                 return color2( d.properties.allGerman);  
                                }else   if(lang == "Greek"){
                                 return color2( d.properties.allGreek);  
                                }else   if(lang == "Hungarian"){
                                 return color2( d.properties.allHungarian);  
                                }else   if(lang == "Irish"){
                                 return color2( d.properties.allIrish);  
                                }else  if(lang == "Italian"){
                                 return color2( d.properties.allItalian);  
                                }else  if(lang == "Latvian"){
                                 return color2( d.properties.allLatvian);  
                                }else   if(lang == "Lithuanian"){
                                 return color2( d.properties.allLithuanian);  
                                }else  if(lang == "Luxembourgish"){
                                 return color2( d.properties.allLuxembourgish);  
                                }else  if(lang == "Maltese"){
                                 return color2( d.properties.allMaltese);  
                                }else  if(lang == "Polish"){
                                 return color2( d.properties.allPolish);  
                                }else   if(lang == "Portuguese"){
                                 return color2( d.properties.allPortugese);  
                                }else   if(lang == "Romanian"){
                                 return color2( d.properties.allRomanian);  
                                }else  if(lang == "Slovak"){
                                 return color2( d.properties.allSlovak);  
                                }else  if(lang == "Slovenian"){
                                 return color2( d.properties.allSlovenian);  
                                }else   if(lang == "Spanish"){
                                 return color2( d.properties.allSpanish);  
                                }else   if(lang == "Swedish"){
                                 return color2( d.properties.allSwedish);  
                                }else   if(lang == "Russian"){
                                 return color2( d.properties.allRussian);  
                                }else   if(lang == "Catalan"){
                                 return color2( d.properties.allCatalan); 
                                }
                    
                              }else if(youngest){
                                    if(lang == "Croatian"){
                                     return color2( d.properties.youngestCroatian);  
                                    }else if(lang == "Czech"){
                                     return color2( d.properties.youngestCzech);  
                                    }else if(lang == "Danish"){
                                     return color2( d.properties.youngestDanish);
                                    }else  if(lang == "Dutch"){
                                     return color2( d.properties.youngestDutch);  
                                    }else  if(lang == "English"){
                                     return color2( d.properties.youngestEnglish);  
                                    }else  if(lang == "Estonia"){
                                     return color2( d.properties.youngestEstonian);  
                                    }else  if(lang == "Finnish"){
                                     return color2( d.properties.youngestFinnish);  
                                    }else   if(lang == "French"){
                                     return color2( d.properties.youngestFrench);  
                                    }else   if(lang == "German"){
                                     return color2( d.properties.youngestGerman);  
                                    }else   if(lang == "Greek"){
                                     return color2( d.properties.youngestGreek);  
                                    }else   if(lang == "Hungarian"){
                                     return color2( d.properties.youngestHungarian);  
                                    }else   if(lang == "Irish"){
                                     return color2( d.properties.youngestIrish);  
                                    }else  if(lang == "Italian"){
                                     return color2( d.properties.youngestItalian);  
                                    }else  if(lang == "Latvian"){
                                     return color2( d.properties.youngestLatvian);  
                                    }else   if(lang == "Lithuanian"){
                                     return color2( d.properties.youngestLithuanian);  
                                    }else  if(lang == "Luxembourgish"){
                                     return color2( d.properties.youngestLuxembourgish);  
                                    }else  if(lang == "Maltese"){
                                     return color2( d.properties.youngestMaltese);  
                                    }else  if(lang == "Polish"){
                                     return color2( d.properties.youngestPolish);  
                                    }else   if(lang == "Portuguese"){
                                     return color2( d.properties.youngestPortugese);  
                                    }else   if(lang == "Romanian"){
                                     return color2( d.properties.youngestRomanian);  
                                    }else  if(lang == "Slovak"){
                                     return color2( d.properties.youngestSlovak);  
                                    }else  if(lang == "Slovenian"){
                                     return color2( d.properties.youngestSlovenian);  
                                    }else   if(lang == "Spanish"){
                                     return color2( d.properties.youngestSpanish);  
                                    }else   if(lang == "Swedish"){
                                     return color2( d.properties.youngestSwedish);  
                                    }else   if(lang == "Russian"){
                                     return color2( d.properties.youngestRussian);  
                                    }else   if(lang == "Catalan"){
                                     return color2( d.properties.youngestCatalan); 
                                    }
                              }else if (older){
                                    if(lang == "Croatian"){
                                     return color2( d.properties.olderCroatian);  
                                    }else if(lang == "Czech"){
                                     return color2( d.properties.olderCzech);  
                                    }else if(lang == "Danish"){
                                     return color2( d.properties.olderDanish);
                                    }else  if(lang == "Dutch"){
                                     return color2( d.properties.olderDutch);  
                                    }else  if(lang == "English"){
                                     return color2( d.properties.olderEnglish);  
                                    }else  if(lang == "Estonia"){
                                     return color2( d.properties.olderEstonian);  
                                    }else  if(lang == "Finnish"){
                                     return color2( d.properties.olderFinnish);  
                                    }else   if(lang == "French"){
                                     return color2( d.properties.olderFrench);  
                                    }else   if(lang == "German"){
                                     return color2( d.properties.olderGerman);  
                                    }else   if(lang == "Greek"){
                                     return color2( d.properties.olderGreek);  
                                    }else   if(lang == "Hungarian"){
                                     return color2( d.properties.olderHungarian);  
                                    }else   if(lang == "Irish"){
                                     return color2( d.properties.olderIrish);  
                                    }else  if(lang == "Italian"){
                                     return color2( d.properties.olderItalian);  
                                    }else  if(lang == "Latvian"){
                                     return color2( d.properties.olderLatvian);  
                                    }else   if(lang == "Lithuanian"){
                                     return color2( d.properties.olderLithuanian);  
                                    }else  if(lang == "Luxembourgish"){
                                     return color2( d.properties.olderLuxembourgish);  
                                    }else  if(lang == "Maltese"){
                                     return color2( d.properties.olderMaltese);  
                                    }else  if(lang == "Polish"){
                                     return color2( d.properties.olderPolish);  
                                    }else   if(lang == "Portuguese"){
                                     return color2( d.properties.olderPortugese);  
                                    }else   if(lang == "Romanian"){
                                     return color2( d.properties.olderRomanian);  
                                    }else  if(lang == "Slovak"){
                                     return color2( d.properties.olderSlovak);  
                                    }else  if(lang == "Slovenian"){
                                     return color2( d.properties.olderSlovenian);  
                                    }else   if(lang == "Spanish"){
                                     return color2( d.properties.olderSpanish);  
                                    }else   if(lang == "Swedish"){
                                     return color2( d.properties.olderSwedish);  
                                    }else   if(lang == "Russian"){
                                     return color2( d.properties.olderRussian);  
                                    }else   if(lang == "Catalan"){
                                     return color2( d.properties.olderCatalan); 
                                    }
                              }else if(middle){
                                    if(lang == "Croatian"){
                                     return color2( d.properties.middleCroatian);  
                                    }else if(lang == "Czech"){
                                     return color2( d.properties.middleCzech);  
                                    }else if(lang == "Danish"){
                                     return color2( d.properties.middleDanish);
                                    }else  if(lang == "Dutch"){
                                     return color2( d.properties.middleDutch);  
                                    }else  if(lang == "English"){
                                     return color2( d.properties.middleEnglish);  
                                    }else  if(lang == "Estonia"){
                                     return color2( d.properties.middleEstonian);  
                                    }else  if(lang == "Finnish"){
                                     return color2( d.properties.middleFinnish);  
                                    }else   if(lang == "French"){
                                     return color2( d.properties.middleFrench);  
                                    }else   if(lang == "German"){
                                     return color2( d.properties.middleGerman);  
                                    }else   if(lang == "Greek"){
                                     return color2( d.properties.middleGreek);  
                                    }else   if(lang == "Hungarian"){
                                     return color2( d.properties.middleHungarian);  
                                    }else   if(lang == "Irish"){
                                     return color2( d.properties.middleIrish);  
                                    }else  if(lang == "Italian"){
                                     return color2( d.properties.middleItalian);  
                                    }else  if(lang == "Latvian"){
                                     return color2( d.properties.middleLatvian);  
                                    }else   if(lang == "Lithuanian"){
                                     return color2( d.properties.middleLithuanian);  
                                    }else  if(lang == "Luxembourgish"){
                                     return color2( d.properties.middleLuxembourgish);  
                                    }else  if(lang == "Maltese"){
                                     return color2( d.properties.middleMaltese);  
                                    }else  if(lang == "Polish"){
                                     return color2( d.properties.middlePolish);  
                                    }else   if(lang == "Portuguese"){
                                     return color2( d.properties.middlePortugese);  
                                    }else   if(lang == "Romanian"){
                                     return color2( d.properties.middleRomanian);  
                                    }else  if(lang == "Slovak"){
                                     return color2( d.properties.middleSlovak);  
                                    }else  if(lang == "Slovenian"){
                                     return color2( d.properties.middleSlovenian);  
                                    }else   if(lang == "Spanish"){
                                     return color2( d.properties.middleSpanish);  
                                    }else   if(lang == "Swedish"){
                                     return color2( d.properties.middleSwedish);  
                                    }else   if(lang == "Russian"){
                                     return color2( d.properties.middleRussian);  
                                    }else   if(lang == "Catalan"){
                                     return color2( d.properties.middleCatalan); 
                                    }
                              }
                        }
                  }else{
                      if(d.properties.allBulgarian == 1000 ){return "#e6e6e6";}
                      if(all){
                        
                          return( color(d.properties.allCroatian+d.properties.allCzech+d.properties.allDanish+d.properties.allDutch+d.properties.allEnglish+d.properties.allEstonian+d.properties.allFinnish+d.properties.allFrench+d.properties.allGerman+d.properties.allGreek+d.properties.allHungarian+d.properties.allIrish+d.properties.allItalian+d.properties.allLatvian+d.properties.allLithuanian+d.properties.allLuxembourgish+d.properties.allMaltese+d.properties.allPolish+d.properties.allPortugese+d.properties.allRomanian+d.properties.allSlovak+d.properties.allSlovenian+d.properties.allSpanish+d.properties.allSwedish+d.properties.allRussian+d.properties.allCatalan));
                          
                      
                      }else if(youngest){
                          return(color( d.properties.youngestBulgarian+d.properties.youngestCroatian+d.properties.youngestCzech+d.properties.youngestDanish+d.properties.youngestDutch+d.properties.youngestEnglish+d.properties.youngestEstonian+d.properties.youngestFinnish+d.properties.youngestFrench+d.properties.youngestGerman+d.properties.youngestGreek+d.properties.youngestHungarian+d.properties.youngestIrish+d.properties.youngestItalian+d.properties.youngestLatvian+d.properties.youngestLithuanian+d.properties.youngestLuxembourgish+d.properties.youngestMaltese+d.properties.youngestPolish+d.properties.youngestPortugese+d.properties.youngestRomanian+d.properties.youngestSlovak+d.properties.youngestSlovenian+d.properties.youngestSpanish+d.properties.youngestSwedish+d.properties.youngestRussian+d.properties.youngestCatalan));
                          
                      
                      }else if (older){
                          
                          return ( color( d.properties.olderBulgarian+d.properties.olderCroatian+d.properties.olderCzech+d.properties.olderDanish+d.properties.olderDutch+d.properties.olderEnglish+d.properties.olderEstonian+d.properties.olderFinnish+d.properties.olderFrench+d.properties.olderGerman+d.properties.olderGreek+d.properties.olderHungarian+d.properties.olderIrish+d.properties.olderItalian+d.properties.olderLatvian+d.properties.olderLithuanian+d.properties.olderLuxembourgish+d.properties.olderMaltese+d.properties.olderPolish+d.properties.olderPortugese+d.properties.olderRomanian+d.properties.olderSlovak+d.properties.olderSlovenian+d.properties.olderSpanish+d.properties.olderSwedish+d.properties.olderRussian+d.properties.olderCatalan));
                          
                      
                      }else if(middle){
                                                 
                            return( color( d.properties.middleBulgarian+d.properties.middleCroatian+d.properties.middleCzech+d.properties.middleDanish+d.properties.middleDutch+d.properties.middleEnglish+d.properties.middleEstonian+d.properties.middleFinnish+d.properties.middleFrench+d.properties.middleGerman+d.properties.middleGreek+d.properties.middleHungarian+d.properties.middleIrish+d.properties.middleItalian+d.properties.middleLatvian+d.properties.middleLithuanian+d.properties.middleLuxembourgish+d.properties.middleMaltese+d.properties.middlePolish+d.properties.middlePortugese+d.properties.middleRomanian+d.properties.middleSlovak+d.properties.middleSlovenian+d.properties.middleSpanish+d.properties.middleSwedish+d.properties.middleRussian+d.properties.middleCatalan));
                      
                      }
                  }

      })
        .on("mouseover", function(d) {
          currentState = this;
          chooseData(bigHash[d.properties.NAME],d.properties.NAME);
          if(d.properties.allEnglish != 1000){
            d3.select(this).style('fill-opacity', 0.7);
          }

      })    
        .on("mousemove", function (d) {
                        if(d.properties.allEnglish == 1000){
                            console.log("not in eu");
                        }else if( currentState = this) {
                            tooltip.transition()
                               .duration(50)
                               .style("opacity", 1.0)
                            tooltip.html(function (){
                                return "<div style=\"font-size:15px\">"+ d.properties.NAME+"</div><table> <tbody> <col\"width=\"150\"><col width=\"90\"><tr><td>"+toolStringC+"</td><td style=\"text-align: right;\">"+toolStringV+"</td></tr></tbody></table>";
                            })
 
                               .style("left", (d3.event.pageX + 5) + "px")
                               .style("top", (d3.event.pageY - 28) + "px")
                               .style("color","white");
                            }
                        }
            )
        .on("mouseout", function(d) {
       
          var currentState = this;
          d3.select(this).style('fill-opacity', 1);
       
          tooltip.transition()
               .duration(50)
               .style("opacity", 0);
               toolString = "" //reset tooltip string
        });
    }

    function getLang(langWeWant){
        
        for (var key in langData) delete langData[key];

        var valueLang;
        
        Object.keys(bigHash).forEach(function (key){
            
            var tempData = new Object();
            var newKey;
            tempData = bigHash[key];
            if(all){
                newKey = "all"+langWeWant;
                valueLang = tempData[newKey];
                langData[newKey+key] = valueLang;
            }else if(older){
                newKey = "older"+langWeWant;
                valueLang = tempData[newKey];
                langData[newKey+key] = valueLang;
            }else if(middle){
                newKey = "middle"+langWeWant;
                valueLang = tempData[newKey];
                langData[newKey+key] = valueLang;
            }else if(youngest){
                newKey = "youngest"+langWeWant;
                valueLang = tempData[newKey];
                langData[newKey+key] = valueLang;
            }     
        });
    }
                                     
    function getVal(d){
        var scaleHere = ScaleData[d.properties.NAME];
        console.log(color(scaleHere));
        if(scaleHere!=1000){
        return scaleHere;}
        else{return 1;}
    }

    function filterQuantity(quantityData){
        
        //for (var key in currScaleData) delete currScaleData[key];
        Object.keys(quantityData).forEach(function (key) {//get useful data
    
         //console.log(quantityData[key] + " "+ key);    
            
          if (key.substring(0, 3)== "all" && all){//iff all button
                currScaleData[key] = quantityData[key];
          }else if(key.substring(0, 5)== "older" && older ){//iff older button
                currScaleData[key] = quantityData[key];
          }else if(key.substring(0, 6)== "middle" && middle ){//iff middle button
                currScaleData[key] = quantityData[key];
          }else if(key.substring(0, 8)== "youngest" && youngest){//iff youngest button
                currScaleData[key] = quantityData[key];
          }

        });
        
        parseScale(currScaleData);
        //console.log(ScaleData);
    }
    
    function parseAll(d){
        
        var allCountries = topojson.feature(eu, eu.objects.world);
        var fromstate = allCountries.features.filter( function (d){
            var currentHash = parseJson(d);
            bigHash[d.properties.NAME] = currentHash;
            
        });
        //console.log(bigHash);
    }
    
    function quantifyData(bigHash){
        
        var tempData = new Object();
        
        Object.keys(bigHash).forEach(function (key) {//get useful data
            tempData = bigHash[key];
             var countryName = key;

            Object.keys(tempData).forEach(function (key) {//get useful data
              var keyName;
              
              if(tempData[key]>1){       
                  
                  if (key.substring(0, 3)== "all"){//iff all button
                        keyName = "all" + countryName;
                        allValue = tempData[key] +allValue;
                        quantityData[keyName] = allValue;
                  }else if(key.substring(0, 5)== "older" ){//iff older button
                        keyName = "older"+ countryName;
                        oldValue = tempData[key] +oldValue;
                        quantityData[keyName] = oldValue;
                  }else if(key.substring(0, 6)== "middle" ){//iff middle button
                        keyName = "middle"+ countryName;
                        middleValue = tempData[key] + middleValue;
                        quantityData[keyName] = middleValue;
                  }else if(key.substring(0, 8)== "youngest"){//iff youngest button
                        keyName = "youngest"+ countryName;
                        youngestValue = tempData[key] +youngestValue;
                        quantityData[keyName] = youngestValue;
                  }
              }
            });
            
             allValue = 0;
             oldValue = 0 ;
             middleValue = 0;
             youngestValue = 0;

        });
        //console.log(quantityData);
        
    }
    
    function parseScale(currScaleData){
        
        Object.keys(currScaleData).forEach(function (key){
            if(all){
                var newKey = key.substring(3, key.Length);
                ScaleData[newKey] = currScaleData[key]; 
            }else if(youngest){
                var newKey = key.substring(8, key.Length);
                ScaleData[newKey] = currScaleData[key];
            }else if(middle){
                var newKey = key.substring(6, key.Length);
                ScaleData[newKey] = currScaleData[key];
            }else if(older){
                var newKey = key.substring(5, key.Length);
                ScaleData[newKey] = currScaleData[key];
            }
        });
        console.log(currScaleData);
    for (var key in currScaleData) delete currScaleData[key];

        
    }
    
    function chooseData(hashData,currCountry){
        
        var tooltipData = new Object();
        Object.keys(hashData).forEach(function (key) {//get useful data
 
          if(hashData[key]>1){                  
              if(key.substring(0, 3)== "all" && all){//iff all button
                tooltipData[key]= hashData[key];
                toolString= key.substring(3, key.Length)+": "+tooltipData[key]+"%"+"<br>"+toolString;
              }else if(key.substring(0, 5)== "older" && older){//iff older button
                tooltipData[key]= hashData[key];
                toolString= key.substring(5, key.Length)+": "+tooltipData[key]+"%"+"<br>"+toolString;
              }else if(key.substring(0, 6)== "middle" && middle){//iff middle button
                tooltipData[key]= hashData[key];
                toolString= key.substring(6, key.Length)+": "+tooltipData[key]+"%"+"<br>"+toolString;
              }else if(key.substring(0, 8)== "youngest"&& youngest){//iff youngest button
                tooltipData[key]= hashData[key];
                toolString= key.substring(8, key.Length)+": "+tooltipData[key]+"%"+"<br>"+toolString;
              }
          }
        });
        var list = {"you": 100, "me": 75, "foo": 116, "bar": 15};
        
        keySorted = Object.keys(tooltipData).sort(function(a,b){return tooltipData[b]-tooltipData[a]})
        toolString = currCountry+"<br>"+toolString;
        
        var i;
        toolStringC = "";
        toolStringV = "";
        var preToolString;
        //console.log(keysSorted.length);
        var toolLangName;
        for(i=0; i < keySorted.length;i++){
            if(keySorted[i].substring(0, 3)== "all" && all){
                toolLangName = keySorted[i].substring(3, keySorted[i].Length);
            }else if(keySorted[i].substring(0, 5)== "older" && older){
                toolLangName = keySorted[i].substring(5, keySorted[i].Length);
            }else if(keySorted[i].substring(0, 6)== "middle" && middle){
                toolLangName = keySorted[i].substring(6, keySorted[i].Length);
            }else if(keySorted[i].substring(0, 8)== "youngest" && youngest){
                toolLangName = keySorted[i].substring(8, keySorted[i].Length);
            }
            //console.log(toolLangName + " " + tooltipData[keySorted[i]]);
           
            //preToolString = pad(15,toolLangName.length,tooltipData[keySorted[i]].toString().length);;
            //toolString = toolString +"<br>"+ toolLangName +":"+preToolString+tooltipData[keySorted[i]];
            toolStringC = toolStringC +"<br>"+ toolLangName+":";
            toolStringV = toolStringV +"<br>"+ Math.round(tooltipData[keySorted[i]]*10)/10+" %";
            console.log(toolStringC);
            console.log(toolStringV);
            //console.log (toolString.length*i - toolString.length);
        }
    }
    
    function parseJson(d){       
       //new hash table
       var hashData = new Object();
       //save country name locally
       //currentCountry = d.properties.NAME;
       //set data into hash
       hashData["allBulgarian"] = d.properties.allBulgarian,
       hashData["allCroatian"]= d.properties.allCroatian,
       hashData["allCzech"]= d.properties.allCzech,
       hashData["allDanish"]= d.properties.allDanish,
       hashData["allDutch"]= d.properties.allDutch,
       hashData["allEnglish"]= d.properties.allEnglish,
       hashData["allEstonian"]= d.properties.allEstonian,
       hashData["allFinnish"]= d.properties.allFinnish,
       hashData["allFrench"]= d.properties.allFrench,
       hashData["allGerman"]= d.properties.allGerman,
       hashData["allGreek"]= d.properties.allGreek,
       hashData["allHungarian"]= d.properties.allHungarian,
       hashData["allIrish"]= d.properties.allIrish,
       hashData["allItalian"]= d.properties.allItalian,
       hashData["allLatvian"]= d.properties.allLatvian,
       hashData["allLithuanian"]= d.properties.allLithuanian,
       hashData["allLuxembourgish"]= d.properties.allLuxembourgish,
       hashData["allMaltese"]= d.properties.allMaltese,
       hashData["allPolish"]= d.properties.allPolish,
       hashData["allPortugese"]= d.properties.allPortugese,
       hashData["allRomanian"]= d.properties.allRomanian,
       hashData["allSlovak"]= d.properties.allSlovak,
       hashData["allSlovenian"]= d.properties.allSlovenian,
       hashData["allSpanish"]= d.properties.allSpanish,
       hashData["allSwedish"]= d.properties.allSwedish,
       hashData["allRussian"]= d.properties.allRussian,
       hashData["allCatalan"]= d.properties.allCatalan,
       hashData["olderBulgarian"]= d.properties.olderBulgarian,
       hashData["olderCroatian"]= d.properties.olderCroatian,
       hashData["olderCzech"]= d.properties.olderCzech,
       hashData["olderDanish"]= d.properties.olderDanish,
       hashData["olderDutch"]= d.properties.olderDutch,
       hashData["olderEnglish"]= d.properties.olderEnglish,
       hashData["olderEstonian"]= d.properties.olderEstonian,
       hashData["olderFinnish"]= d.properties.olderFinnish,
       hashData["olderFrench"]= d.properties.olderFrench,
       hashData["olderGerman"]= d.properties.olderGerman,
       hashData["olderGreek"]= d.properties.olderGreek,
       hashData["olderHungarian"]= d.properties.olderHungarian,
       hashData["olderIrish"]= d.properties.olderIrish,
       hashData["olderItalian"]= d.properties.olderItalian,
       hashData["olderLatvian"]= d.properties.olderLatvian,
       hashData["olderLithuanian"]= d.properties.olderLithuanian,
       hashData["olderLuxembourgish"]= d.properties.olderLuxembourgish,
       hashData["olderMaltese"]= d.properties.olderMaltese,
       hashData["olderPolish"]= d.properties.olderPolish,
       hashData["olderPortugese"]= d.properties.olderPortugese,
       hashData["olderRomanian"]= d.properties.olderRomanian,
       hashData["olderSlovak"]= d.properties.olderSlovak,
       hashData["olderSlovenian"]= d.properties.olderSlovenian,
       hashData["olderSpanish"]= d.properties.olderSpanish,
       hashData["olderSwedish"]= d.properties.olderSwedish,
       hashData["olderRussian"]= d.properties.olderRussian,
       hashData["olderCatalan"]= d.properties.olderCatalan,
       hashData["middleBulgarian"]= d.properties.middleBulgarian,
       hashData["middleCroatian"]= d.properties.middleCroatian,
       hashData["middleCzech"]= d.properties.middleCzech,
       hashData["middleDanish"]= d.properties.middleDanish,
       hashData["middleDutch"]= d.properties.middleDutch,
       hashData["middleEnglish"]= d.properties.middleEnglish,
       hashData["middleEstonian"]= d.properties.middleEstonian,
       hashData["middleFinnish"]= d.properties.middleFinnish,
       hashData["middleFrench"]= d.properties.middleFrench,
       hashData["middleGerman"]= d.properties.middleGerman,
       hashData["middleGreek"]= d.properties.middleGreek,
       hashData["middleHungarian"]= d.properties.middleHungarian,
       hashData["middleIrish"]= d.properties.middleIrish,
       hashData["middleItalian"]= d.properties.middleItalian,
       hashData["middleLatvian"]= d.properties.middleLatvian,
       hashData["middleLithuanian"]= d.properties.middleLithuanian,
       hashData["middleLuxembourgish"]= d.properties.middleLuxembourgish,
       hashData["middleMaltese"]= d.properties.middleMaltese,
       hashData["middlePolish"]= d.properties.middlePolish,
       hashData["middlePortugese"]= d.properties.middlePortugese,
       hashData["middleRomanian"]= d.properties.middleRomanian,
       hashData["middleSlovak"]= d.properties.middleSlovak,
       hashData["middleSlovenian"]= d.properties.middleSlovenian,
       hashData["middleSpanish"]= d.properties.middleSpanish,
       hashData["middleSwedish"]= d.properties.middleSwedish,
       hashData["middleRussian"]= d.properties.middleRussian,
       hashData["middleCatalan"]= d.properties.middleCatalan,
       hashData["youngestBulgarian"]= d.properties.youngestBulgarian,
       hashData["youngestCroatian"]= d.properties.youngestCroatian,
       hashData["youngestCzech"]= d.properties.youngestCzech,
       hashData["youngestDanish"]= d.properties.youngestDanish,
       hashData["youngestDutch"]= d.properties.youngestDutch,
       hashData["youngestEnglish"]= d.properties.youngestEnglish,
       hashData["youngestEstonian"]= d.properties.youngestEstonian,
       hashData["youngestFinnish"]= d.properties.youngestFinnish,
       hashData["youngestFrench"]= d.properties.youngestFrench,
       hashData["youngestGerman"]= d.properties.youngestGerman,
       hashData["youngestGreek"]= d.properties.youngestGreek,
       hashData["youngestHungarian"]= d.properties.youngestHungarian,
       hashData["youngestIrish"]= d.properties.youngestIrish,
       hashData["youngestItalian"]= d.properties.youngestItalian,
       hashData["youngestLatvian"]= d.properties.youngestLatvian,
       hashData["youngestLithuanian"]= d.properties.youngestLithuanian,
       hashData["youngestLuxembourgish"]= d.properties.youngestLuxembourgish,
       hashData["youngestMaltese"]= d.properties.youngestMaltese,
       hashData["youngestPolish"]= d.properties.youngestPolish,
       hashData["youngestPortugese"]= d.properties.youngestPortugese,
       hashData["youngestRomanian"]= d.properties.youngestRomanian,
       hashData["youngestSlovak"]= d.properties.youngestSlovak,
       hashData["youngestSlovenian"]= d.properties.youngestSlovenian,
       hashData["youngestSpanish"]= d.properties.youngestSpanish,
       hashData["youngestSwedish"]= d.properties.youngestSwedish,
       hashData["youngestRussian"]= d.properties.youngestRussian,
       hashData["youngestCatalan"]= d.properties.youngestCatalan;
       
       //eradicate the unimportant data
       
        //firstStateData[currentCountry] = toolString;
        //toolString = currentCountry+"<br>"+toolString;
        return hashData;
        
}
    
    drawColors();
    filterQuantity(quantityData);
    
    document.getElementById("buttonAll").onclick = 
        function(){ all = true; older = false; middle = false; youngest = false; changeGenName();filterQuantity(quantityData); drawColors();};
    
    document.getElementById("buttonOld").onclick = 
        function(){all = false; older = true; middle = false; youngest = false;changeGenName();filterQuantity(quantityData); drawColors();};
    
    document.getElementById("buttonMiddle").onclick = 
        function(){all = false; older = false; middle = true; youngest = false; changeGenName();filterQuantity(quantityData); drawColors();};
    
    document.getElementById("buttonYoungest").onclick = 
        function(){all = false; older = false; middle = false; youngest = true;changeGenName();filterQuantity(quantityData); drawColors();};
    
    
    document.getElementById("All").onclick = function(){  langState = false;   lang = ""; changeScale(); drawColors();}  
    //document.getElementById("Czech").onclick = function(){  langState = true;  lang = "Czech"; changeScale();drawColors();}  
    //document.getElementById("Dutch").onclick = function(){  langState = true;  lang = "Dutch";changeScale(); drawColors();};
    document.getElementById("English").onclick = function(){  langState = true;  lang = "English";changeScale(); drawColors();};
    document.getElementById("French").onclick = function(){  langState = true;  lang = "French"; changeScale();drawColors();}      
    document.getElementById("German").onclick = function(){  langState = true;  lang = "German"; changeScale();drawColors();} 
    document.getElementById("Italian").onclick = function(){  langState = true;  lang = "Italian"; changeScale();drawColors();};
    //document.getElementById("Polish").onclick = function(){  langState = true;  lang = "Polish"; changeScale();drawColors();};
    //document.getElementById("Romanian").onclick = function(){  langState = true;  lang = "Romanian"; changeScale();drawColors();};
    document.getElementById("Russian").onclick = function(){  langState = true;  lang = "Russian";changeScale(); drawColors();};
    document.getElementById("Spanish").onclick = function(){  langState = true;  lang = "Spanish";changeScale(); drawColors();};


    
});

d3.select(self.frameElement).style("height", height + "px");