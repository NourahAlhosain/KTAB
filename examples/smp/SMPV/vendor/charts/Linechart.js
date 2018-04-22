// Define margins        
var margin = { top: 30, right: 20, bottom: 30, left: 50 },
  width = 500 - margin.left - margin.right,
  height = 270 - margin.top - margin.bottom;

var svg = d3.select("#Linechart")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("preserveAspectRatio", "xMidYMid meet")
  .attr("viewBox", "0 0 500 300")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

var x_axix_data = [], // create an array for x-axix 
  names = [],
  XScale,
  YScale,
  xAxis,
  yAxis,
  turns,
  line,
  positionsData =[],
  allpos,
  selectedLine;


function drawLinechart() {

  //from loadSQL.js
  allpos = positionalData;
  names = ActorsNames;
  turns = NumOfTurns + 1;

  for (var i = 0; i < allpos[0].length; i += 1) {
    positionsData.push(allpos[0][i].positions);
}

  //define the scales
  XScale = d3.scaleLinear().domain([0, turns - 1]).range([0, width]);
  YScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

  // Define the axes
  xAxis = d3.axisBottom(XScale).scale(XScale).ticks(turns);
  yAxis = d3.axisLeft(YScale).scale(YScale);

  // Define the line
  line = d3.line()
    .x(function (d) { return XScale(d.Turn); })
    .y(function (d, i) { return YScale(d.val[i]); });

  for (var i = 0; i < turns; i++) {
    x_axix_data.push(i);
  }

  // add the X gridlines
  svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
      .tickSize(-height)
      .tickFormat("")
    );

  // add the Y gridlines
  svg.append("g")
    .attr("class", "grid")
    .call(make_y_gridlines()
      .tickSize(-width)
      .tickFormat("")
    );

  // Add the X Axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  //text label for the x axis
  svg.append("text")
    .attr("transform",
    "translate(" + (width / 2) + " ," +
    (height + 30) + ")")
    .style("text-anchor", "middle")
    .text("Turn");

  // Add the Y Axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  // text label for the y axis
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Position");

  var colors = d3.scaleOrdinal()
    .domain(names)
    .range(["#5C8598", "#219DD8", "#96C9E5", "#3C3D3B",
      "#ECCE6A", "#f8ecba", "#60805D", "#8AC791",
      "#bebfc1", "#636664", "#a5f3cc", "#6acbec",
      "#6aecec", "#ff9966", "#1d80e2", "#6a8aec",
      "#a5a5f3", "#ffd857", "#a8bfa6", "#cb6aec",
      "#c88dc8", "#ec6a6a", "#ec6aab", "#e84a72",
      "#f1a7a7", "#e3994f", "#d87d22", "#d8ab22",
      "#d8d822", "#a6e765", "#4fd822", "#1cb01c",
      "#22d84f", "#22d87d", "#22d8ab", "#22d8d8",
      "#22abd8", "#156184", "#d3e6f8", "#224fd8",
      // Darker Shade for (Set #1)
      "#436170", "#18719a", "#5cabd6", "#1a1a19",
      "#e5bb34", "#f1d874", "#425940", "#75bd7e",
      "#97989b", "#3f4040", "#62eaa6", "#1db1e2",
      "#1de2e2", "#ff5500", "#124d87", "#1a47cb",
      "#4b4be7", "#ffc91a", "#6e946b", "#b11de2",
      "#ac53ac", "#e21d1d", "#e21d80", "#b5173f",
      "#e34f4f", "#b0661c", "#844d15", "#846815",
      "#848415", "#73c71f", "#318415", "#0e580e",
      "#158431", "#15844d", "#158468", "#158484",
      "#156884", "#07202c", "#7bb4ea", "#153184",
      // Lighter Shade for (Set #2)
      "#8faebc", "#7bc7ea", "#d6eaf5", "#737570",
      "#f9f0d2", "#fdf9e8", "#9ab497", "#ddeedf",
      "#e5e5e6", "#8b8d8c", "#e9fcf2", "#d2eff9",
      "#bbf6f6", "#ffddcc", "#8ebff0", "#d2dcf9",
      "#e9e9fc", "#fff3cc", "#e2eae1", "#efd2f9",
      "#e6cbe6", "#f9d2d2", "#f9d2e6", "#f6bbca",
      "#fce9e9", "#f5d9bd", "#eab37b", "#eace7b",
      "#eaea7b", "#d9f5bd", "#97ea7b", "#65e765",
      "#7bea97", "#7beab3", "#38e0b6", "#65e7e7",
      "#7bceea", "#38abe0", "#e9f3fc", "#91a8ee",
      // Another set of 18 (warm) Distinct Colors (Set #2)
      "#e6194b", "#3cb44b", "#ffe119", "#0082c8",
      "#f58231", "#911eb4", "#46f0f0", "#f032e6",
      "#d2f53c", "#fabebe", "#008080", "#e6beff",
      "#aa6e28", "#fffac8", "#800000", "#aaffc3",
      "#808000", "#ffd8b1", "#000080", "#808080",
      // Darker shade for set #2
      "#8a0f2e", "#267330", "#b39b00", "#004266",
      "#c35709", "#58126d", "#0fbdbd", "#be0eb5",
      "#a0c20a", "#f47171", "#003333", "#c466ff",
      "#674218", "#fff266", "#330000", "#66ff94",
      "#333300", "#ff9933", "#000033", "#4d4d4d"
    ]);


  //create an object for each actor, map all the properties.
  var actors = names.map(function (row, i) {
    return {
      actor_name: row,
      visible: true,
      values: x_axix_data.map(function (x_value) {
        return {
          Turn: x_value,
          val: positionsData[i].map(function (y_values) {
            return y_values
          })
        }
      }),
      color: colors(row)
    }
  });

  actors.forEach(function (d, i) {

    //draw the lines
    svg.append("path")
      .attr("class", "line")
      .style("stroke", d.color)
      .attr("id", 'Line_' + d.actor_name.replace(/\s+/g, '').replace(".", '')) // assign ID
      .attr("d", line(d.values))
      .on("mouseover", function () {
        selectedLine = "#Line_" + d.actor_name;
        onMouseover();
      })
      .on("mouseout", onMouseout)
      .attr("stroke-dasharray", function () {
        var totalLength = this.getTotalLength();
        return totalLength + " " + totalLength;
      })
      .attr("stroke-dashoffset", function () {
        var totalLength = this.getTotalLength();
        return totalLength;
      })
      .transition("drawLines")
      .duration(3000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

  }) // end of forEach

  function onMouseover() {

    actors.forEach(function (d, i) {

      d3.selectAll("#Line_" + d.actor_name.replace(/\s+/g, '').replace(".", ''))
        .transition()
        .duration(50)
        .style("opacity", function () {
          return ("#Line_" + d.actor_name === selectedLine) ? 1.0 : 0.2;
        })
      d3.select(selectedLine.replace(/\s+/g, ''))
        .style("stroke-width", 4);

    })

  }

  function onMouseout() {
    actors.forEach(function (d, i) {
      d3.selectAll("#Line_" + d.actor_name.replace(/\s+/g, '').replace(".", ''))
        .transition()
        .duration(50)
        .style("opacity", function () {
          return d.visible ? 1 : 0;
        })
      d3.select(selectedLine.replace(/\s+/g, ''))
        .style("stroke-width", 1.2);
    })
  }

  // gridlines in x axis function
  function make_x_gridlines() {
    return d3.axisBottom(XScale)
      .ticks(turns)
  }

  // gridlines in y axis function
  function make_y_gridlines() {
    return d3.axisLeft(YScale)
      .ticks(10)
  }
}