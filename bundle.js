// Advanced Data Manipulation - 
  // Medium: https://medium.com/@sub.metu/advanced-data-manipulation-javascript-b309fd008c6d
  // https://medium.com/@TK_CodeBear/manipulating-objects-in-javascript-59fefeb6a738
  // http://learnjsdata.com/

// Data Visualisation Guide 
// https://sunlightfoundation.com/2014/03/12/datavizguide/

const render = (data) => {
  console.log(data)
  const height = 600;
  const width = 960;
  const margin = {top: 50, right:50, bottom: 70, left: 120 };
  const graphWidth = width - margin.right - margin.left;
  const graphHeight = height - margin.top - margin.bottom;
  
  
  const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
  
  const graph = svg.append("g")
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr("width", graphWidth)
    .attr("height", graphHeight)
  

  const xAxisGroup = graph.append("g")
    .attr("transform", `translate(0, ${graphHeight})`);
  const yAxisGroup = graph.append("g");
  
  
  // Value Accessors to replace repeated code:
  const xValue = d => d.population;
  const yValue = d => d.country;
  
  
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, xValue)])
    .range([0, graphWidth])
  
  const yScale = d3.scaleBand()
    .domain(data.map(yValue))
    .range([0, graphHeight])
    .paddingInner(0.1)
    .paddingOuter(0.1)
//  console.log(yScale.bandwidth())
  
  
  const xAxisTickFormat = number => d3.format(".3s")(number)
    .replace("G", "B") // Custom axis text formatting function 
  const yAxis = d3.axisLeft(yScale)
  const xAxis = d3.axisBottom(xScale)
    .ticks(6)
    .tickFormat(xAxisTickFormat)
    .tickSize(-graphHeight)
  
  yAxis(yAxisGroup)// works like "yAxis.call(yAxisGroup)"
   
  xAxis(xAxisGroup);
  
  xAxisGroup.selectAll("text")
//    .attr("text-anchor", "end")
//    .attr("transform", "rotate(-30)")
  
  xAxisGroup.selectAll("line")
    .attr("stroke", "#ccc")
  xAxisGroup.select(".domain")
    .remove();
  yAxisGroup.selectAll(".domain, .tick line")
    .remove(); 
  xAxisGroup.append("text")
    .attr("class", "xAxis-title")
    .text("Population in millions M")
    .attr("fill", "#555")
    .attr("x", graphWidth / 2)
    .attr("y", 50)
  
/*
  yAxisGroup.selectAll("line")
    .remove(); 
*/

  const rects = graph.selectAll("rect")
    .data(data);
  
  rects
    .enter().append("rect")
      .attr("width", d => xScale(xValue(d)))
      .attr("height", yScale.bandwidth())
      .attr("y", d => yScale(yValue(d)))
  
  graph.append("text")
    .attr("class", "graph-title")
    .text("Most Populous Countries in the world in 2019")
    .attr("y", -15)
}



// DATA MANIPULATION OF csv file
d3.csv("population.csv").then(res => {
//  console.log(res)
  
  // SIMPLE Math.max()
  /*let arr = [3, 4, 1 ,66, 33 ,64, 123, 5432, 54, 334,233]
  console.log(arr.findIndex(el => el == Math.max(...arr)))
*/
  
  
  let arr10 = [];
  
  //1. Make arr with country, population only 
    //should it be contained in a function? popByCountry = function() { ...  return ....} 
  let PopByCountry = [];
  for (let i=0; i<res.length; i++) {
    let singleCountry = {};
    singleCountry.country = res[i].Country;
    singleCountry.population = +(res[i].Year_2016); // "+" parses string into numbers
    PopByCountry.push(singleCountry);
  }
//  console.log(PopByCountry)
  
  // 2. Create arr with population numbers & find index of the largest 
  let findMaxIndex = function(arr) {
    let valueArr = [];
    for (let el of arr) {
      valueArr.push(el.population)
    }
    return valueArr.findIndex(el => el == Math.max(...valueArr))
  }
  
  
  // 3. Create variable with top 10 largest countries
  let topTen = function() {
    let arrTotal = PopByCountry;
    
    for (let i=0; i<55; i++) {
      let currentMax = findMaxIndex(arrTotal);
      arr10.push(arrTotal[currentMax])
      arrTotal.splice(currentMax, 1)
    }
    
    // Filter out regions (but it eliminates also United States!!!) 
    arr10 = arr10.filter(el => {
      for (let key in el) {
//        console.log(key)
//        console.log(Object.keys(el))
//        console.log(Object.entries(el))
//        console.log(Object.values(el))
        if (typeof el[key] == "string" && el[key] !== "World") {
          let keyValue = el[key];
          let keyArr = keyValue.split(" ");
          
          if (keyArr.length == 1) {
            return el;
          }
        }
      }
    })
    
//    return arr10;
  }
  topTen();
//  console.log(arr10);
  
  render(arr10); // it didn't work with render(topTen()) - argument shouldn't be a function
})