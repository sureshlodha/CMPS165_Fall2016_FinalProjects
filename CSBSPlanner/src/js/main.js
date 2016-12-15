/**
 * Move nodes toward cluster focus
 * Mike Bostock
 * https://bl.ocks.org/mbostock/1804919
 */
function gravity(alpha) {
    return function(d) {
        d.y += (d.cy - d.y) * alpha;
        d.x += (d.cx - d.x) * alpha;
    };
}

/* Create number formatter function */
var format_number = d3.format(",.2f");

/* Initialize default plate foods */
var defaults = [
    /*"CMPE 16",
    "CMPE 12/L",
    "CMPE 110",
    "CMPE 104A",
    "CMPS 101",
    "CMPS 112",
    "CMPS 111",
    "CMPS 102",
    "CMPS 130"*/
];

scroll_courses = 
intro_courses = ["cmps_12_a", "cmps_5_j", "cmps_11", "cmpe_13_l", "cmps_12_b", "cmps_13_h"]
phys_courses = ["phys_5_a", "phys_5_b", "phys_5_c", "phys_6_a", "phys_6_b", "phys_6_c", "chem_1_a", "chem_1_b", "chem_1_c"]
math_courses = ["math_19_a", "math_19_b", "math_23_a", "ams_10", "math_21"]
cmpe_courses = ["cmpe_16", "cmpe_12_l", "cmpe_110"]
cmps_courses = ["cmps_101", "cmps_104_a", "cmps_111", "cmps_102", "cmps_112", "cmps_130"]
electives_courses = ["elective_1","elective_2", "elective_3", "elective_4"]
scroll_courses = [intro_courses, phys_courses, math_courses, cmpe_courses, cmps_courses, electives_courses]

/* Create categories */
var categories = [
    {
        name: "Computer Science",
        type: "cmps",
        row: 1,
        col: 1,
        color: "#b5bd68"},
    {
        name: "Computer Engineering",
        type: "cmpe",
        row: 1,
        col: 2,
        color: "#a3685a"},
    {
        name: "Math",
        type: "math",
        row: 1,
        col: 3,
        color: "#81a2be"},
    {
        name: "Physics",
        type: "physics",
        row: 2,
        col: 1,
        color: "#cc6666"},
    {
        name: "Chemistry",
        type: "chemistry",
        row: 2,
        col: 2,
        color: "#f0c674"},
    {
        name: "Capstone",
        type: "capstone",
        row: 2,
        col: 3,
        color: "#b294bb"}
];

/* Create category lookup */
var category_lookup = categories.reduce(function(lookup, c, i) {
    lookup[c.type] = i;
    return lookup;
}, {});

/* Initialize menu settings */
var m_margin = {top: 0, right: 0, bottom: 0, left: 0},
    m_width  = 840 - m_margin.left - m_margin.right,
    m_height = 600 - m_margin.top - m_margin.bottom,
    m_radius = 26,
    m_padding = 48,
    m_count = 0,   //new
    m_xdata = [];  //new - maybe not needed

/* Initialize plate settings */
var p_margin = {top: 0, right: 0, bottom: 0, left: 0},
    p_width  = 440 - p_margin.left - p_margin.right,
    p_height = 600 - p_margin.top - p_margin.bottom,
    p_radius = 26,
    p_padding = 0,
    p_count = 0,
    p_data = [];

/* Create menu canvas */
var menu = d3.select("#menu")
        .attr("style", 
        	"width:" + (m_width + m_margin.left + m_margin.right) + 
        	"px;height:" + (m_height + m_margin.top + m_margin.bottom) + "px;")
        .append("svg")
        .attr("width", m_width + m_margin.left + m_margin.right)
        .attr("height", m_height + m_margin.top + m_margin.bottom)
        .append("g")
        .attr("transform", "translate(" + m_margin.left + "," + m_margin.top + ")");

/* Import and process foods data */
d3.json("src/json/classes.json", function(error, m_data) {
    if (error) throw error;

    /* Iterate over data */
    m_data.forEach(function(d) {
        /* Get default food occurrence count */
        var count = defaults.reduce(function(n, f) {
            return n + (f === d.course ? 1 : 0);
        }, 0);

        /* Set focus */
        d.row = categories[category_lookup[d.type]].row;
        d.col = categories[category_lookup[d.type]].col;

        /* Set color */
        d.color = categories[category_lookup[d.type]].color;

        /* Set position */
        d.cy = d.row * Math.floor(m_height / 2) - Math.floor(m_height / 4);
        d.cx = d.col * Math.floor(m_width / 3) - Math.floor(m_width / 6);

        /* Set radius */
        d.radius = m_radius;

        /* Add default foods to plate */
        for (var i = 0; i < count; i++) {
            p_data.push({
                "course": d.course,
                "type": d.type,
                "img": d.img,
                "title": d.title,
                "prereq": d.prereq,
                "info": d.info,
                "color": d.color,
                "id": d.id,
                "radius": p_radius,
                "cx": p_width / 2,
                "cy": p_height / 2
            });
        }
    });

    /* Initialize default plate */
    p_start(false);

    /* Initialize tooltip */
    var m_tip = d3.tip()
        .attr("class", "d3-tip")
        .offset(function(d) {
            return [d.row === 1 ? 6 : -6, 0];
        })
        .direction(function(d) {
            return d.row === 1 ? "s" : "n";
        })
        .html(function(d) {
        var data = "<strong><em>" + d.course + "</em></strong>";

        data += "<div class='clearfix'><strong>Course Title: </strong><em>"  + d.title  + "</em></div>";
        data += "<div class='clearfix'><strong>Units: </strong><em>"         + d.units  + "</em></div>";
        data += "<div class='clearfix'><strong>Prerequisites: </strong><em>" + d.prereq + "</em></div>";
        //data += "<div class='clearfix'><strong>Description: </strong><em>"   + d.info   + "</em></div>";

            return data;
        });

    /* Invoke tooltip */
    menu.call(m_tip);

    /* Create force layout */
    var m_force = d3.layout.force()
        .nodes(m_data)
        .size([m_width, m_height])
        .gravity(0)
        .charge(0)
        .on("tick", m_tick)
        .start();

    /* Create nodes */
    var m_node = menu.selectAll(".node")
        .data(m_data)
        .enter().append("g");

    /* Create circles */
    var m_circle = m_node.append("circle")
        .attr("class", "circle")
        .attr("r", function() { return m_radius; })
        .style("fill", function(d) { return d.color; })
        .on("mouseover", m_tip.show)
        .on("mouseleave", m_tip.hide)
        .on("click", function(d) {
            p_data.push({
                "course": d.course,
                "type": d.type,
                "img": d.img,
                "title": d.title,
                "prereq": d.prereq,
                "info": d.info,
                "color": d.color,
                "id": d.id,
                "radius": p_radius,
                "cx": p_width / 2,
                "cy": p_height / 2
            });

            p_start(false);

            /* On this click, the class is moved onto the plate */
            console.log ("viktor");
            course_id = d.id;
            square = document.getElementById(course_id);
            square.style.backgroundColor = d.color;
            square.style.color = "black";

            lightUpCourses();
            //m_start(false);

        });

    /* Create images */
    var m_img = m_node.append("image")
        .attr("class", "image")
        .attr("width", "52")
        .attr("height", "52")
        .attr("xlink:href", function(d) { return "src/img/" + d.type + "/" + d.img + ".png"; });

    /* Create labels */
    var m_label = menu.selectAll(".category")
        .data(categories)
        .enter().append("text")
            .attr("class", "category")
            .attr("text-anchor", "middle")
            .attr("x", function(d) { return d.col * Math.floor(m_width / 3) - Math.floor(m_width / 6); })
            .attr("y", function(d) { return d.row * Math.floor(m_height / 2) - Math.floor(m_height / 4) + (d.row === 1 ? -135 : 135); })
            .text(function(d) { return d.name; });

function m_start(removal) {
    /* Update node */
    m_node = m_node.data(m_data);

    /* Remove old circles and images */
    m_node.selectAll(".p-" + m_count).remove();

    /* Remove old nodes */
    m_node.exit().remove();

    /* Increment count */
    m_count++;

    /* Create node */
    m_node
        .enter()
        .append("g");

    /* Create circle */
    m_circle = m_node
        .data(m_data)
        .append("circle")
            .attr("class", "circle m-" + m_count)
            .attr("r", function() { return m_radius; })
            .style("fill", function(d) { return d.color; })
            .on("mouseover", m_tip.show)
            .on("mouseleave", m_tip.hide)
            .on("click", function(d) {
                m_data.splice(d.index, 1);

                //m_start(true);
            });

    /* Create image */
    m_img = m_node
        .data(m_data)
        .append("image")
            .attr("class", "image m-" + m_count)
            .attr("width", "52")
            .attr("height", "52")
            .attr("xlink:href", function(d) { return "src/img/" + d.type + "/" + d.img + ".png"; });

    /* Hide tooltip */
    if (removal) {
        m_tip.hide();
    }

    m_force.start();
}

    /**
     * Mike Bostock
     * https://bl.ocks.org/mbostock/1804919
     */
    function m_tick(e) {
        m_circle
            .each(gravity(0.5 * e.alpha))
            .each(m_collide(0.85))
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        m_img
            .each(gravity(0.5 * e.alpha))
            .each(m_collide(0.85))
            .attr("x", function(d) { return d.x - m_radius / 2 - 10; })
            .attr("y", function(d) { return d.y - m_radius / 2 - 10; });
    }

    /**
     * Resolve collisions between nodes
     * Mike Bostock
     * https://bl.ocks.org/mbostock/1804919
     */
    function m_collide(alpha) {
        var quadtree = d3.geom.quadtree(m_data);

        return function(d) {
            var r = d.radius + m_radius + m_padding,
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;

            quadtree.visit(function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + quad.point.radius + (d.color !== quad.point.color) * m_padding;

                    if (l < r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }

                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }
});

function lightUpCourses() {
  for (var i=0; i < scroll_courses.length; i++) {
    course_array = scroll_courses[i]
    all_done = true
    for (var j = 0; j < course_array.length; j++) {
      course_id = course_array[j]
      square = document.getElementById(course_id)

      if (square !== null) {
        bg_color = square.style.backgroundColor
        if (bg_color === "" || bg_color == "white") {
          all_done = false
        }
      }
    }

    if (all_done) {
      first = course_array[0]
      top_elem = document.getElementById(first).parentElement.parentElement.parentElement
      top_elem.style.backgroundColor = "#f0c674"
    }
    else {
      first = course_array[0]
      top_elem = document.getElementById(first).parentElement.parentElement.parentElement
      top_elem.style.backgroundColor = "#e6e7e8"
    }
    
  }
}

function clearColors() {
  for (var i=0; i < scroll_courses.length; i++) {
    course_array = scroll_courses[i]
    all_done = true
    for (var j = 0; j < course_array.length; j++) {
      course_id = course_array[j]
      square = document.getElementById(course_id)

      if (square !== null) {
        square.style.backgroundColor = "white"
        square.style.color = "#e6e7e8"
      }
    }

    first = course_array[0]
    top_elem = document.getElementById(first).parentElement.parentElement.parentElement
    top_elem.style.backgroundColor = "#e6e7e8"
    
  }
}

/* Create plate canvas */
var plate = d3.select("#plate")
        .attr("style", "width:" + (p_width + p_margin.left + p_margin.right) + "px;height:" + (p_height + p_margin.top + p_margin.bottom) + "px;")
        .append("svg")
        .attr("width", p_width + p_margin.left + p_margin.right)
        .attr("height", p_height + p_margin.top + p_margin.bottom)
        .append("g")
        .attr("transform", "translate(" + p_margin.left + "," + p_margin.top + ")");

/* Initialize tooltip */
var p_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-6, 0])
    .html(function(d) {
        var data = "<strong><em>" + d.course + "</em></strong>";
        data += "<div class='clearfix'><strong>Course Title: </strong><em>"  + d.title  + "</em></div>";
        data += "<div class='clearfix'><strong>Units: </strong><em>"         + d.units  + "</em></div>";
        data += "<div class='clearfix'><strong>Prerequisites: </strong><em>" + d.prereq + "</em></div>";
        //data += "<div class='clearfix'><strong>Description: </strong><em>"   + d.info   + "</em></div>";

        return data;
    });

/* Invoke tooltip */
menu.call(p_tip);

/* Create force layout */
var p_force = d3.layout.force()
    .nodes(p_data)
    .size([p_width, p_height])
    .gravity(0)
    .charge(0)
    .on("tick", p_tick)
    .start();

/* Initialize nodes */
var p_node = plate.selectAll(".node");

/* Initialize circles */
var p_circle;

/* Initialize images */
var p_img;

/**
 * Mike Bostock
 * https://bl.ocks.org/mbostock/1804919
 */
function p_tick(e) {
    if (p_circle !== undefined) {
        p_circle
            .each(gravity(0.5 * e.alpha))
            .each(p_collide(0.85))
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        p_img
            .each(gravity(0.5 * e.alpha))
            .each(p_collide(0.85))
            .attr("x", function(d) { return d.x - p_radius / 2 - 10; })
            .attr("y", function(d) { return d.y - p_radius / 2 - 10; });
    }
}

/**
 * Resolve collisions between nodes
 * Mike Bostock
 * https://bl.ocks.org/mbostock/1804919
 */
function p_collide(alpha) {
    var quadtree = d3.geom.quadtree(p_data);

    return function(d) {
        var r = d.radius + p_radius + p_padding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;

        quadtree.visit(function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + (d.color !== quad.point.color) * p_padding;

                if (l < r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }

            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
    };
}

/**
 * Modifying a force layout
 * Mike Bostock
 * https://bl.ocks.org/mbostock/1095795
 */
function p_start(removal) {
    /* Update node */
    p_node = p_node.data(p_data);

    /* Remove old circles and images */
    p_node.selectAll(".p-" + p_count).remove();

    /* Remove old nodes */
    p_node.exit().remove();

    /* Increment count */
    p_count++;

    /* Create node */
    p_node
        .enter()
        .append("g");

    /* Create circle */
    p_circle = p_node
        .data(p_data)
        .append("circle")
            .attr("class", "circle p-" + p_count)
            .attr("r", function() { return p_radius; })
            .style("fill", function(d) { return d.color; })
            .on("mouseover", p_tip.show)
            .on("mouseleave", p_tip.hide)
            .on("click", function(d) {
                p_data.splice(d.index, 1);
                p_start(true);
                //m_start(true);

                /*console.log("course_id" + d.course_id);*/
                /* On this click, the class is moved off the plate */
                console.log("jankov");
                console.log (JSON.stringify(d)) 
                course_id = d.id
                console.log(course_id);
                square = document.getElementById(course_id)
                square.style.backgroundColor = "white"
                square.style.color = "#e6e7e8";

                lightUpCourses()
            });

    /* Create image */
    p_img = p_node
        .data(p_data)
        .append("image")
            .attr("class", "image p-" + p_count)
            .attr("width", "52")
            .attr("height", "52")
            .attr("xlink:href", function(d) { return "src/img/" + d.type + "/" + d.img + ".png"; });

    /* Hide tooltip */
    if (removal) {
        p_tip.hide();
    }

    p_force.start();
}


function m_start(removal) {
    /* Update node */
    m_node = m_node.data(m_data);

    /* Remove old circles and images */
    m_node.selectAll(".p-" + m_count).remove();

    /* Remove old nodes */
    m_node.exit().remove();

    /* Increment count */
    m_count++;

    /* Create node */
    m_node
        .enter()
        .append("g");

    /* Create circle */
    m_circle = m_node
        .data(m_data)
        .append("circle")
            .attr("class", "circle m-" + m_count)
            .attr("r", function() { return m_radius; })
            .style("fill", function(d) { return d.color; })
            .on("mouseover", m_tip.show)
            .on("mouseleave", m_tip.hide)
            .on("click", function(d) {
                m_data.splice(d.index, 1);

                m_start(true);
            });

    /* Create image */
    m_img = m_node
        .data(m_data)
        .append("image")
            .attr("class", "image m-" + m_count)
            .attr("width", "52")
            .attr("height", "52")
            .attr("xlink:href", function(d) { return "src/img/" + d.type + "/" + d.img + ".png"; });

    /* Hide tooltip */
    if (removal) {
        m_tip.hide();
    }

    m_force.start();
}

/* Handle clear plate button */
d3.select("#clear_plate").on("click", function() {
    p_data.splice(0, p_data.length)

    p_start(true);

    clearColors()
});
