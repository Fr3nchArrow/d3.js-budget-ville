(function(d3) {
  'use strict';

  var width = 500;
  var height = 500;
  var radius = Math.min(width, height) / 3;
  var donutWidth = 50;
  var legendRectSize = 18;
  var legendSpacing = 4;

  //var color = d3.scaleOrdinal(d3.schemeCategory20b);

  let color = d3.scaleOrdinal()
  .range(["#ffa000","#03a9f4","#d32f2F","#009688","#9e9e9e","#512da8","#4caf50"]);

  var svg = d3.select('#chart3')
              .append('svg')
              .attr("preserveAspectRatio", "xMinYMin meet")
              .attr("viewBox", "0 0 480 480")
              .classed("svg-content-responsive", true)
              .attr('id','svg1')
              .append('g')
              .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

  var arc = d3.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);

  var pie = d3.pie()
    .value(function(d) { return d.rec_fonct; })
    .sort(null);

  d3.csv('rec_fonct.csv', function(error, dataset) {
    dataset.forEach(function(d) {
      d.rec_fonct = +d.rec_fonct;
      d.enabled = true;
    });

var w = document.getElementById("chart3").offsetWidth,
    h = document.getElementById("chart3").offsetHeight;

    var div = d3.select("#chart3").append("div")
        .attr("class", "tooltip")
        .style("width",200)
        .style("height",100)
        .style("opacity", 0);

    var somme_df = d3.sum(dataset, function(d) {
              return d.rec_fonct;
            });

            var side = 600,
                dx = -50;

            var g = svg.append('g')
                .attr('transform', 'translate(' + [dx*2, dx] + ')');

            var glurb = g.append("foreignObject")
                .attr("width", 200)
                .attr("height", 100)
                .append("xhtml:h5")
                .html("RECETTES DE FONCTIONNEMENT <br>" + (d3.format(",")(somme_df).replace(/,/g, ' ')) + " €");

                        function computeWidth(selection) {
                        	var dimensions = null;
                          var node = selection.node();
                          var dimensions = node.getBoundingClientRect();
                          return +dimensions.width/2;
                        }

                        function computeHeight(selection) {
                          var dimensions = null;
                          var node = selection.node();
                          var dimensions = node.getBoundingClientRect();
                          return +dimensions.height/2;
                        }

                var path = svg.selectAll('path')
                  .data(pie(dataset))
                  .enter()
                  .append('path')
                  .attr('d', arc)
                  .style('stroke', '#f8f8f8')
                  .attr('fill', function(d, i) {
                    var couleur = color(d.data.label);
                    return couleur;
                  })                                                        // UPDATED (removed semicolon)
                  .on("mouseover click", function(d,i) {
                    var c = arc.centroid(d);
                    glurb.html(d.data.label + "<br>" + (d3.format(",")(d.value).replace(/,/g, ' ')) + " €")
                    .style('color', color(d.data.label));
                            //.style('background',color(d.data.label));
                       })
                   .on("mouseout", function(d) {
                     glurb.html("RECETTES DE FONCTIONNEMENT <br>" + (d3.format(",")(somme_df).replace(/,/g, ' ')) + " €")
                        .style('color', "#555");
                   })
                  .each(function(d) { this._current = d; });

    var aargh = d3.select("#legend3")
                  .style("padding-bottom","0px");

        aargh.selectAll("legend-container")
              .data(pie(dataset))
              .enter()
              .append("div")
              .on("mouseover click", function(d,i) {
                var c = arc.centroid(d);
                glurb.html(d.data.label + "<br>" + (d3.format(",")(d.value).replace(/,/g, ' ')) + " €")
                .style('color', color(d.data.label));
                        //.style('background',color(d.data.label));
                   })
               .on("mouseout", function(d) {
                 glurb.html("RECETTES DE FONCTIONNEMENT <br>" + (d3.format(",")(somme_df).replace(/,/g, ' ')) + " €")
                    .style('color', "#555");
               })
              .each(function(d) { this._current = d; });

         aargh.selectAll("div")
              .append('td')
              .style("padding-left","10px")
               .append('i')
               .style('color', function(d){return color(d.data.label);})
               .style('font-size','30px')
               .text('●');

   var textWidth =[];

          aargh.selectAll('div')
                .append('td')
                .append("p")
                .attr('vertical-align','middle')
                .style('font-size','20px')
                .style("margin","10px 10px 0px")
                .text(function(d) { return (d.data.label);})
                .each(function(d,i) {
                  var thisWidth = this.clientWidth
                  textWidth.push(thisWidth);
              });

var maxtextWidth = Math.max(...textWidth);

                aargh.selectAll("div")
                     .append('td')
                     .style('class','a')
                      .append('i')
                      .style("padding-left",function(d,i){return (maxtextWidth + 30 - textWidth[i]) + "px";})
                      .style('font-size','24px')
                      .attr('class','fa fa-angle-down')
                      .attr('margin-top','20px')
                      .style('cursor','pointer')
                      .attr('type','button')
                      .attr('data-toggle','collapse')
                      .attr('data-target',function(d,i){return "#recfonct" + i;});

                      aargh.selectAll("div")
                            .attr('class','explain')
                            .append("text")
                            .attr('class','collapse')
                            .attr('id',function(d,i){return "recfonct" + i;})
                            .append('p')
                            .style('margin','5px 0px 5px 10px')
                            .attr('class','h3')
                            .style('font-weight','900')
                            .style('color', function(d){return color(d.data.label);})
                            .html(function(d){return (d3.format(",")(d.data.rec_fonct).replace(/,/g, ' ')) + " €";});

                      aargh.selectAll("text")
                            .append('p')
                            .style('margin-left','10px')
                            .html(function(d){return (d.data.rec_descr);});


                $("td").click(function(){
                    $(this).find("i").toggleClass("fa-angle-down fa-angle-up");
                });

  });
})(window.d3);
