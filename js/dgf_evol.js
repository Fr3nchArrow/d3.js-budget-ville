// set the dimensions and margins of the graph
var margin = {top:70, right:20, bottom:30, left:50},
    width = 500,
    height = 400;

// append the svg object to the body of the page
var svg = d3.select('#dgf_chart2')
            .append('svg')
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 650 650")
            .classed("svg-content-responsive", true)
            .append('g')
            .attr('transform', 'translate(' + (margin.left)*2 + ',' + margin.top + ')');

// Parse the Data
d3.csv("dgf_evolution.csv", function(error,data) {
if (error) throw error;

var w = document.getElementById("dgf_chart2").offsetWidth;
var h = document.getElementById("dgf_chart2").offsetHeight;
console.log(w);
console.log(h);

var div = d3.select("#dgf_chart2").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  function computeWidth(selection) {
    var dimensions = null;
    var node = selection.node();
    var dimensions = node.getBoundingClientRect();
    console.log(dimensions);
    console.log(dimensions.width/2);
    return +dimensions.width/2;
  }

  function computeHeight(selection) {
    var dimensions = null;
    var node = selection.node();
    var dimensions = node.getBoundingClientRect();
    console.log(dimensions);
    console.log(dimensions.height/2);
    return +dimensions.height/2;
  }

// X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.annee; }))
  .padding(1);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .style("text-anchor", "middle");

// Add Y axis
var y = d3.scaleLinear()
  .domain([4000000, 6000000])
  //.domain([3500000, d3.max(data, function(d){return d.dgf;})])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y).ticks(5));

  var valueline = d3.line()
                  .x(function(d){return x(d.annee);})
                  .y(function(d){return y(d.dgf);});

  svg.append('path')
      .data([data])
      .attr('class','line')
      .attr('d',valueline);

// Lines
svg.selectAll("myline")
  .data(data)
  .enter()
  .append('path')
  .attr('class','linechart')
  .attr("d",function(d){return  "M" + x(d.annee) + "," + height + "L" + x(d.annee) + "," + y(d.dgf);});

// Circles
svg.selectAll("mycircle")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", function(d) { return x(d.annee);})
    .attr("cy", function(d) { return y(d.dgf);})
    .attr("r", 5)
    .style("fill","#3d10c9")
    .on("mouseover", function(d,i) {
      div.html(d.annee + "<br>" + (d3.format(",")(d.dgf).replace(/,/g, ' ')) + " €");
          div.style("margin-left", w/2)
              .style("margin-top",h/4)
              .style("background","#3d10c9");
          div.transition()
              .duration(200)
              .style("opacity", .9);
         })
     .on("mouseout", function(d) {
         div.transition()
             .duration(500)
             .style("opacity", 0);
     });
});
