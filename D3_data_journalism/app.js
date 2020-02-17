// @TODO: YOUR CODE HERE!

// Set dimensions 
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 55
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// // initial params
// var chosenXAxis = "poverty";
// var chosedYAxis = "healthcare"


// Import Data
d3.csv("data.csv")
  .then(function(data){

// 1- parsedata/ cast as numbers
data.forEach(function(d){
    d.poverty = +d.poverty;
    d.smokes = +d.smokes;
    d.healthcare = +d.healthcare;
    d.obesity = +d.obesity;
    d.income = +d.income;
    d.age = +d.age;

});
// // function used for updating x-scale var upon click on axis 
// function xScale(healthData, chosenXAxis){

// Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(data, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

// Step 5:  append initial Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "20")
    .attr("fill", "blue")
    .attr("opacity", ".5");

 //Adding state abbr inside the circles
 chartGroup.selectAll("null").data(data)
 .enter().append("text").text(function(d){
  return d.abbr;
})
.attr("x",d => xLinearScale(d.poverty))
.attr("y", d => yLinearScale(d.healthcare))
.attr("text-anchor", "middle")
.attr('fill', 'white')
.attr('font-size', 10);

// Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br> Poverty: ${d.poverty}<br> Healthcare: ${d.healthcare}`);
      });

// Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);
// Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(d) {
      toolTip.show(d, this);
    })
    // step 9 onmouse event
    .on("mouseout", function(d, index){
      toolTip.hide(d);
    });
        
  // step 10  Create axes labels
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 8)
  .attr("x", 0 - (height / 1.5))
  .attr("dy", "5px")
  .attr("class", "axisText")
  .text("Lacks Healthcare (%)");


  chartGroup.append("text")
  .attr("transform", "translate(" + (width / 2)+ "," + (height + margin.top + 20)+")")
  .style("text-anchor", "middle")
  .text("In Poverty");
});







