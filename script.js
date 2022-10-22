async function getData() {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json');
   return response.data
  } catch (error) {
  }
};

 function render(arr){
  const w = 960;
  const h = 560;
  const padding=55;
  const minDate=(d3.min(arr,d=>d.Year))-1
  const maxDate=(d3.max(arr,d=>d.Year))+1
  const minTime=d3.min(arr,d=>d.Time)
  const maxTime=d3.max(arr,d=>d.Time)

  const time= value => {

  let timeSeconds =parseInt(value.substring(0,2)*60) +
                    parseInt(value.substring(3))

   return new Date(timeSeconds*1000)
  };

  const mouseover=(event,d)=>{

    toolTip.transition().style("opacity",.8)

    toolTip.style("left" , (event.pageX + 10) + "px")
       .style("top" , (event.pageY + 15) + "px")
       .html(`<p>${d.Name}:${d.Nationality} </p><p> Year:${d.Year} ,Time:${d.Time} </p><p> ${d.Doping}</p>`)
   
      .attr("data-year", (d.Year))
  }; 

  const mouseout=()=> {

  toolTip.transition().style("opacity",0)
  };

  const xScale = d3.scaleLinear()
                .domain([minDate,maxDate])
                .range([padding, w -padding ]);

  const yScale = d3.scaleUtc()
                .domain([time(maxTime),time(minTime)])
                .rangeRound([h-padding , padding]);

  const xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format("d"));

  const yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.utcFormat('%M:%S'))		
  

  const toolTip = d3.select("body")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("opacity", 0);	

  const svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("transform", "translate(" + 0 + "," + 0+ ")");

            svg.append("g")
            .attr("id","x-axis")
            .attr("transform", "translate(0," + (h-padding) + ")")
            .call(xAxis)
            
            svg.append("g")
            .attr("id","y-axis")
            .attr("transform", "translate("+padding +",0)")
            .call(yAxis)
          
            d3.select("body")
            .append("div")
            .attr("id","legend")
            .attr("height",100)
            .attr("width",100)
            .html(`<div style="display:flex;font-size:13px;">
                    <div style="background-color:black;width:20px;height:20px;">
                    </div>
                    <div style="padding-left:10px;">Riders with doping allegations</div>
                   </div>
                   <div style="display:flex;padding-top:5px;font-size:13px;">
                    <div style="background-color:red;width:20px;height:20px;">
                    </div>
                    <div style="padding-left:10px;">No doping allegations</div>
                   </div>`);

            svg.selectAll("circle")
            .data(arr)
            .enter()
            .append("circle")
            .attr("class","dot")
            .attr("r",6)
            .attr("cx",d=>xScale(d.Year))
            .attr("cy",d=>yScale(time(d.Time)))
            .attr("fill", d=> d.Doping.length!==0?"black":"red")
            .attr("data-xvalue",d=>(d.Year))
            .attr("data-yvalue",d=>(time(d.Time)))
            .on("mouseover",mouseover)
            .on("mouseout",mouseout)
 };
 
getData()
 .then(data=>render(data) )
 .catch(err=>console.log(err))

