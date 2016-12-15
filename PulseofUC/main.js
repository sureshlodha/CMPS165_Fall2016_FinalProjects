var width = 500,
    height = 25;

var dayValue = 0;
var schoolVal = 1;
var topWord = "final";

var xScale = d3.scale.ordinal()
		      .domain(d3.range(7))
                .rangeRoundBands([0, width], 0.05);

//day's of the week for the slider
var day = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
//x variable for the slider
var x = d3.scale.linear()
    .domain([0, 6])
    .range([0, width])
    .clamp(true);

var dispatch = d3.dispatch("sliderChange");

var slider = d3.select(".slider")
    .style("width", width + "px");

var sliderTray = slider.append("div")
    .attr("class", "slider-tray");

var sliderHandle = slider.append("div")
    .attr("class", "slider-handle");

sliderHandle.append("div")
    .attr("class", "slider-handle-icon")

slider.call(d3.behavior.drag()
    .on("dragstart", function() {
      dispatch.sliderChange(x.invert(d3.mouse(sliderTray.node())[0]));
      d3.event.sourceEvent.preventDefault();
    })//dragging updates the value
    .on("dragstart", function(d) {
		//Get this bar's x/y values, then augment for the tooltip
		var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
		var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + height / 2;

        //Update the tooltip position and value
		d3.select("#tooltip")
		  .style("left", xPosition + "px")
		  .style("top", yPosition + "px");
			   
		//Show the tooltip
		d3.select("#tooltip").classed("hidden", false);
		})
    .on("drag", function() {
      dispatch.sliderChange(x.invert(d3.mouse(sliderTray.node())[0]));
    }));

dispatch.on("sliderChange.slider", function(value) {
  sliderHandle.style("left", x(value) + "px")
  console.log(value)
  if(Math.floor(value) != dayValue){
  dayValue = Math.floor(value)
  updateData(schoolVal)
  }
  /*if (value == 0 || value == 1 || value == 2 || value == 3 || value == 4 || value == 5 || value == 6){
      updateData(schoolVal);
  }*/
  d3.select("#tooltip")			   //selects the tooltip to edit
	.select("#value")              //selects the value in the div
	.text(day[Math.floor(value)]); //0-6 for the index of the words
});


//Simple animated example of d3-cloud - https://github.com/jasondavies/d3-cloud
//Based on https://github.com/jasondavies/d3-cloud/blob/master/examples/simple.html

function updateData(x){
    schools = ["UCB", "UCI", "UCD", "UCLA", "UCM", "UCR", "UCSB", "UCSC", "UCSD"]
    schoolVal = x;
    console.log(x);
    d3.selectAll("#clound").transition()
                .duration(150)
                .style('fill-opacity', 1e-6)
                .attr('font-size', 1)
                .remove();
    d3.select("#tooltip")
        .select("#schoolID")
        .text(" " + schools[x - 1])
        .select("#topWord")
        .text(topWord)
    console.log("CSVs/"+ x + "_" + dayValue + ".csv")
    loadData("CSVs/"+ x + "_" + dayValue + ".csv")
}


//load data
function loadData(dLoad){
d3.csv(dLoad, function(wordData){
    
var xScale = d3.scale.linear().range([90, 30]);
xScale.domain(d3.extent(wordData, function(d) { return d.Rank; }));


// Encapsulate the word cloud functionality
function wordCloud(selector) {

    var fill = d3.scale.category20();

    //Construct the word cloud's SVG element
    var svg = d3.select("#cloud").append("svg")
        .attr("width", 500)
        .attr("height", 500)
        .attr("id", "clound")
        .append("g")
        .attr("transform", "translate(250,250)");

    //Draw the word cloud
    function draw(words) {
        var cloud = svg.selectAll("g text")
                        .data(words, function(d) { return d.text; })

        //Entering words
        cloud.enter()
            .append("text")
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr('font-size', 1)
            .text(function(d) { return d.text; });

        //Entering and existing words
        cloud
            .transition()
                .delay(200)
                .duration(76)
                .style("font-size", function(d) { return d.size + "px"; })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("fill-opacity", 1);

        //Exiting words
        cloud.exit()
            .transition()
                .duration(200)
                .style('fill-opacity', 1e-6)
                .attr('font-size', 1)
                .remove();
    }


    //Use the module pattern to encapsulate the visualisation code. We'll
    // expose only the parts that need to be public.
    return {

        //Recompute the word cloud for a new set of words. This method will
        // asycnhronously call draw when the layout has been computed.
        //The outside world will need to call this function, so make it part
        // of the wordCloud return value.
        update: function(words) {
            d3.layout.cloud().size([500, 500])
                .words(words)
                .padding(5)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function(d) { return d.size; })
                .on("end", draw)
                .start();
        }
    }

}

//Some sample data - http://en.wikiquote.org/wiki/Opening_lines
var wordCount = [
    "0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24",
]



//Prepare one of the sample sentences by removing punctuation,
// creating an array of words and computing a random size attribute.
function getWords(i) {
        //console.log("data:", data)
        //console.log("data[0:]", data['10'])
    return wordCount[i]
            .replace(/[!\.,:;\?]/g, '')
            .split(' ')
            .map(function(d) {
                topWord = wordData[0].Word;
                return {text: wordData[d].Word, size: xScale(wordData[d].Rank)};
            })
}

/*function getWords_(){
    d3.csv("textData.csv", function(data){
        console.log("data:", data)
        console.log("data[0:]", data['3'])
        data.forEach(function(d){
            return {text: d.word, size: d.freq};
        })
    })
}
getWords_();*/
//This method tells the word cloud to redraw with a new set of words.
//In reality the new words would probably come from a server request,
// user input or some other source.
function showNewWords(vis, i) {
    i = i || 0;

    vis.update(getWords(i ++ % wordCount.length))
    //setTimeout(function() { showNewWords(vis, i + 1)}, 2000)
}

//Create a new instance of the word cloud visualisation.
var myWordCloud = wordCloud('div');

//Start cycling through the demo data
showNewWords(myWordCloud);

})
}