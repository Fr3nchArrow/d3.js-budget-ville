function yearSwitcherConstructor(year) {
  this.currentYear = year;
  this.chiffres = "chf_"+year;
  this.infos = "desc_"+year;
}

var annee = [2019,2018,2017,2016,2015,2014];

var place = document.getElementById("whydataviz");
      w = place.offsetWidth,
      h = place.offsetHeight;

var but = d3.select(place);

but.selectAll("legend-container")
      .data(annee)
      .enter()
      .append("div");

var hop = d3.select('#enough')
            .append('div')
            .attr('id','div1')
            .attr('padding-top','100px')
            .style('text-align','left');

var hip = d3.select('#enough')
            .append('div')
            .attr('id','div2')
            .style('text-align','left');

var sms = d3.select("#div1")
            .append('text')
            .attr('class','h3');

var sns = d3.select("#div2")
            .append('text')
            .attr('class','p');

var bar = but.selectAll('div')
            .append('rect')
            .style('border','#1d68a5')
            .attr('class','rect')
            .attr('width',60)
            .attr('height',30)
            .append('h4')
            .attr('x',12)
            .attr('y',20)
            .style('fill','#FFFFFF')
            .text(function(d){return d;});

var lgd_tm = document.getElementById("leg_sect"),
        w_lgd = lgd_tm.offsetWidth,
        h_lgd = lgd_tm.offsetHeight;

var lgd = d3.select(lgd_tm)
            .append('div')
            .attr("class", "wrapper");

//chargement des données de 2019
currentYear = 2019;
var yearSwitcher = new yearSwitcherConstructor(currentYear);

function treemapEvol(){
//chargement de toutes les donnéels
d3.csv("prog_invest_evol.csv",function(data){

data.forEach (function(d) {
  d[yearSwitcher.chiffres] = + d[yearSwitcher.chiffres];
});

  dataset = data;

var chart = document.getElementById("chart1"),
      width = chart.offsetWidth,
      height = chart.offsetHeight;

let color = d3.scaleOrdinal()
  .range(["#60a917","#00aba9","#f0a30a","#0050EF","#6a00ff","#6d8764","#647687","#d80073","#e51400","#e3c800","#825a2c","#ff5722","#cddc39","#9c27b0"]);

var svg = d3.select(chart)
  .append('svg')
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 "+ width/2 + " " + height/2 + "")
  .classed("svg-content-responsive", true)
  .append('g')
  .attr('transform', 'translate('+ width/4 +','+ height/4 +')');

var div = d3.select(chart).append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    var legend = lgd.selectAll('div')
                .data(data)
                .enter()
                .append('div')
                .attr('transform', function(d,i){return 'translate(0 ' + i*50 + ')';})
                .style('margin','0 0 10px 30px')
                 .on("click", function(d,i) {
                   sms.html(d.secteurs + "<br>" + (d3.format(",")(d[yearSwitcher.chiffres]).replace(/,/g, ' ')) + " €")
                      .style('color',color(d.secteurs));
                   sns.html(d[yearSwitcher.infos]);
                       hip.transition()
                           .duration(200)
                           .style("opacity", .9);
                      })
                  .on("double-click", function(d) {
                      sms.html('');sns.html('');});

                legend.append('rect')
                        .attr('class','rect')
                        .style('fill','#1d68a5')
                        .attr('width',60)
                        .attr('height',30);

                legend.append('text')
                .attr('transform', function(d,i){return 'translate(0 ' + i*50 + ')';})
                .style('class','p')
                .style('float','left')
                .style('margin-left','20px')
                .text("------")
                .style("color",function(d){return color(d.secteurs);})
                .style("background-color",function(d){return color(d.secteurs);});
                legend.append('text')
                .style('class','p')
                .style('float','left')
                .style('margin-left','10px')
                .text(function(d){return d.secteurs;});

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

var simulation = d3.forceSimulation()
.force("x", d3.forceX().strength(0.05))
.force("y", d3.forceY().strength(0.05))
.force("collide", d3.forceCollide(function(d){return radiusScale(d[yearSwitcher.chiffres]);}));

var min = d3.min(data, function(d) {return d[yearSwitcher.chiffres];}),
    max = d3.max(data, function(d) {return d[yearSwitcher.chiffres];}),
    somme = d3.sum(data, function(d) {return d[yearSwitcher.chiffres];});

var radiusScale = d3.scaleSqrt().domain([0,max]).range([0,width/10]);

var circles = svg.selectAll(".label")
  .data(data)
  .enter()
  .append("svg:circle")
  .attr("r",function(d){return radiusScale(d[yearSwitcher.chiffres]);})
  .style('fill', function(d) {var couleur = color(d.secteurs); return couleur;})
  .style('stroke-width',4)
  .on("mouseover", function(d,i) {
    sms.html(d.secteurs + "<br>" + (d3.format(",")(d[yearSwitcher.chiffres]).replace(/,/g, ' ')) + " €")
       .style('color',color(d.secteurs));
    sns.html(d[yearSwitcher.infos]);
        hop.transition()
            .duration(200)
            .style("opacity", .9);
       })
   .on("mouseout", function(d) {
     sms.html('');sns.html('');});

  simulation.nodes(data)
    .on('tick', ticked);

  function ticked() {
    circles
    .attr("cx", function(d){return d.x;})
    .attr("cy", function(d){return d.y;})

  };

bar.on('click',function(d){yearSwitcher = new yearSwitcherConstructor(d);
  data.forEach (function(d) {
    d[yearSwitcher.chiffres] = + d[yearSwitcher.chiffres];
  });
  d3.select("#chart1").selectAll('*').remove();
  treemapEvol();
});



});
}

treemapEvol();
