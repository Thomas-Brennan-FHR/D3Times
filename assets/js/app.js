var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//X Axis labels
var xlabelsGroup = chartGroup.append("g")
.attr("transform", `translate(${width / 3}, ${height + 20})`);

var povertyLabel = xlabelsGroup.append("text")
.attr("x", 0)
.attr("y", 20)
.attr("value", "poverty") // value to grab for event listener
.classed("active xLable", true)
.text("% In Poverty");

var ageLabel = xlabelsGroup.append("text")
.attr("x", 0)
.attr("y", 40)
.attr("value", "age") // value to grab for event listener
.classed("inactive xLable", true)
.text("Averge Age");

var incomeLabel = xlabelsGroup.append("text")
.attr("x", 0)
.attr("y", 60)
.attr("value", "income") // value to grab for event listener
.classed("inactive xLable", true)
.text("Averge Income");

//Y Axis labels
var ylabelsGroup = chartGroup.append("g");

var healthcareLabel = ylabelsGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.attr("value", "healthcare") // value to grab for event listener
.classed("active yLable", true)
.text("Lacks Healthcare %");

var smokesLabel = ylabelsGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 20 - margin.left)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.attr("value", "smokes") // value to grab for event listener
.classed("inactive yLable", true)
.text("Smokes %");

var obeseLabel = ylabelsGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 40 - margin.left)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.attr("value", "obesity") // value to grab for event listener
.classed("inactive yLable", true)
.text("Obeses %");


// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(csvData) {
  
  // parse data convert to numbers
   csvData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;

    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });
  
  activeXaxis="poverty";
  activeYaxis="healthcare";

 //Build Plot
  buildPlot(csvData,activeXaxis,activeYaxis);


 // On Click x-Axis
  d3.selectAll(".xLable").on("click", function() {
      var self = d3.select(this)
      activeXaxis = self.attr("value");
      d3.selectAll(".xLable").attr("class","inactive xLable");
      self.attr("class","active xLable");

      xLinear = d3.scaleLinear().domain(d3.extent(csvData, d => d[activeXaxis])).range([0, width]);
      
      chartGroup.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cx", d => xLinear(d[activeXaxis]));

      chartGroup.selectAll("tspan")
      .transition()
      .duration(1000)
      .attr("x", d => xLinear(d[activeXaxis]));

      chartGroup.selectAll(".xAxis")
      .transition()
      .duration(1000)
      .call(d3.axisBottom(xLinear));
  });

  //On click y-axis
  d3.selectAll(".yLable").on("click", function() {
      var self = d3.select(this)
      activeYaxis = self.attr("value");
      d3.selectAll(".yLable").attr("class","inactive yLable");
      self.attr("class","active yLable");

      yLinear = d3.scaleLinear().domain(d3.extent(csvData, d => d[activeYaxis])).range([height, 0]);
      
      chartGroup.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cy", d => yLinear(d[activeYaxis]));

      chartGroup.selectAll("tspan")
      .transition()
      .duration(1000)
      .attr("y", d => yLinear(d[activeYaxis])+4);

      chartGroup.selectAll(".yAxis")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(yLinear));
  });

 //Mouseover
    d3.selectAll("circle").on("mouseover", function(){
      d3.select(this)
          .transition()
          .duration(250) //ms
          .attr("fill", "red")
          .attr("r", "20");
    })

      .on("mouseout", function(){
      d3.select(this)
          .transition()
          .duration(250) //ms
          .attr("fill", "blue")
          .attr("r", "10");
    });


});



function buildPlot(csvData,xaxis,yaxis){

  var xLinear = d3.scaleLinear().domain(d3.extent(csvData, d => d[xaxis])).range([0, width]);
  var yLinear = d3.scaleLinear().domain(d3.extent(csvData, d => d[yaxis])).range([height, 0]);

  chartGroup.append("g").classed("xAxis", true).attr("transform",`translate(0, ${height})`).call(d3.axisBottom(xLinear));

  chartGroup.append("g").classed("yAxis", true).call(d3.axisLeft(yLinear));


  var circlesGroup = chartGroup.selectAll("circle")
    .data(csvData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinear(d[xaxis]))
    .attr("cy", d => yLinear(d[yaxis]))
    .attr("r", 10)
    .attr("fill", "blue")
    .attr("opacity", ".5");

  chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .selectAll("tspan")
        .data(csvData)
        .enter()
        .append("tspan")
            .attr("x", d => xLinear(d[xaxis]))
            .attr("y", d => yLinear(d[yaxis])+4)
            .text(d => d.abbr);

};