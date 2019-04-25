(function(d3) {
  'use strict';
    var box = document.querySelector('#chart_gc');
  	var w_box = box.clientWidth;
  	var h_box = box.clientHeight;

    console.log(w_box);
    console.log(h_box);

  var radius = Math.min(w_box, h_box)*5 / 12;
  var donutWidth = w_box/10;
  var legendRectSize = 18;
  var legendSpacing = 4;

console.log(donutWidth);

  //var color = d3.scaleOrdinal(d3.schemeCategory20b);

  let color = d3.scaleOrdinal()
    .domain(["Fonctionnement", "Investissement"])
    .range(["#00A68C","#E34132"]);

  var svg = d3.select('#chart_gc')
              .append('svg')
              .attr("preserveAspectRatio", "xMinYMin meet")
              .attr("viewBox", "0 0 " + w_box + " " + h_box +"")
              .classed("svg-content-responsive", true)
              .append('g')
              .attr('transform', 'translate(' + (w_box / 2) + ',' + (h_box / 2) + ')');

  var leg = d3.select('#legend_gc')
            .append('svg')
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 480 480")
            .classed("svg-content-responsive", true)
            .append('g')
            .attr('transform', 'translate(' + ((w_box*3)/4) + ',' + (h_box / 2) + ')');


  var arc = d3.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);

  var pie = d3.pie()
    .value(function(d) { return d.count; })
    .sort(null);

  d3.csv('budget.csv', function(error, dataset) {
    dataset.forEach(function(d) {
      d.count = +d.count;
      d.enabled = true;
    });

    var myArray = Array.from(dataset);
    var montant_inv = myArray[1].count,
        montant_fonct = myArray[0].count;

    var div = d3.select("#chart_gc").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

var aargh = d3.select("#legend_bc");

    aargh.selectAll("svg-container")
          .data(dataset)
          .enter()
          .append("div")
          .attr('class',"col-md-6");

    aargh.selectAll("div")
          .append("h3")
          .html(function(d) { return (d.label).toUpperCase();})
          .data(pie(dataset))
          .style('color', function(d){return color(d.data.label);})
           .append("p");

    aargh.selectAll("div")
          .data(pie(dataset))
          .on("mouseover", function(d,i) {
            glurb.html(d.data.label + "<br>" + (d3.format(",")(d.value).replace(/,/g, ' ')) + " €" + "<br>" + (((d.value)*100)/somme_budget).toFixed(2) + " %")
              .style("font-size","80%")
            .style('color', color(d.data.label));
                    //.style('background',color(d.data.label));
               })
           .on("mouseout", function(d) {
             glurb.html("BUDGET PRIMITIF 2019 <br>" + (d3.format(",")(somme_budget).replace(/,/g, ' ')) + " €")
                .style('color', "#555");
           })
           .each(function(d) { this._current = d; });
                       // NEW
    aargh.selectAll("p")
          .data(pie(dataset))
           .html(function(d) {return (d.data.descr);})
           .attr("class","intro p")
           .style("margin-right",10)
           .style("margin-left",10)
           .style("padding-top",0)
           .attr("id", function(d,i){return "p"+i;});

    var somme_budget = d3.sum(dataset, function(d) {
              return d.count;
            });

            var side = 600,
                dx = -50;

            var g = svg.append('g')
                .attr('transform', 'translate(' + [-w_box/2, -h_box/5] + ')');

            var glurb = g.append("foreignObject")
                .attr("x",w_box/6)
                .attr("y",h_box/24)
                .attr("width", w_box/1.6)
                .attr("height", h_box/2.4)
                .append("xhtml:h5")
                .html("BUDGET PRIMITIF 2019 <br>" + (d3.format(",")(somme_budget).replace(/,/g, ' ')) + " €");

    var percent_inv= ((montant_inv*100)/somme_budget).toFixed(0),
        percent_fonct= ((montant_fonct*100)/somme_budget).toFixed(0);


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

    document.getElementById("demo").innerHTML = d3.format(",")(somme_budget).replace(/,/g, ' ') + " €";
    document.getElementById("demo3").innerHTML = percent_inv + " %";
    document.getElementById("demo4").innerHTML = percent_fonct + " %";

    var path = svg.selectAll('path')
      .data(pie(dataset))
      .enter()
      .append('path')
      .attr('d', arc)
      .style('stroke', '#f8f8f8')
      .attr('fill', function(d, i) {
        return color(d.data.label);
      })
      .on("mouseover", function(d,i) {
        glurb.html(d.data.label + "<br>" + (d3.format(",")(d.value).replace(/,/g, ' ')) + " €" + "<br>" + (((d.value)*100)/somme_budget).toFixed(2) + " %")
        .style('color', color(d.data.label));
                //.style('background',color(d.data.label));
           })
       .on("mouseout", function(d) {
         glurb.html("BUDGET PRIMITIF 2019 <br>" + (d3.format(",")(somme_budget).replace(/,/g, ' ')) + " €")
            .style('color', "#555");
       })                                               // UPDATED (removed semicolon)
      .each(function(d) { this._current = d; });                // NEW

  var legend = leg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend_gc')
        .attr('id',function(d,i){return 'legend' + i + '';})
        .attr('transform', function(d, i) {
          var hgt = legendRectSize + legendSpacing*2;
          var offset =  hgt * color.domain().length / 2;
          var horz = -w_box/2;
          var vert = (i * hgt) - h_box/2 + legendSpacing;
          return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('circle')
          .attr('cx', 1 + legendRectSize/2)
          .attr('cy',legendRectSize/2)
          .attr('r', legendRectSize/2)
          .style('fill', color)
          .style('stroke', color)                                   // UPDATED (removed semicolon)
          .on('click', function(label) {                            // NEW
            var circle = d3.select(this);                             // NEW
            var enabled = true;                                     // NEW
            var totalEnabled = d3.sum(dataset.map(function(d) {     // NEW
              return (d.enabled) ? 1 : 0;                           // NEW
            }));                                                    // NEW

            if (circle.attr('class') === 'disabled') {                // NEW
              circle.attr('class', '')
                    .style('fill',color);                               // NEW
            } else {                                                // NEW
              if (totalEnabled < 2) return;                         // NEW
              circle.attr('class', 'disabled')
                    .style('fill',"#FFFFFF");                       // NEW
              enabled = false;                                      // NEW
            }                                                       // NEW

        pie.value(function(d) {                                 // NEW
          if (d.label === label) d.enabled = enabled;           // NEW
          return (d.enabled) ? d.count : 0;                     // NEW
        });                                                     // NEW

        path = path.data(pie(dataset));                         // NEW

        path.transition()                                       // NEW
          .duration(750)                                        // NEW
          .attrTween('d', function(d) {                         // NEW
            var interpolate = d3.interpolate(this._current, d); // NEW
            this._current = interpolate(0);                     // NEW
            return function(t) {                                // NEW
              return arc(interpolate(t));                       // NEW
            };                                                  // NEW
          });                                                   // NEW
      });                                                       // NEW

       });

})(window.d3);
