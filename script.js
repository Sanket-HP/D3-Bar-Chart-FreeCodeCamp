document.addEventListener("DOMContentLoaded", function() {
    const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const dataset = data.data;
            createChart(dataset);
        });

    function createChart(dataset) {
        const svg = d3.select("#chart");
        const margin = { top: 50, right: 30, bottom: 50, left: 60 };
        const width = svg.node().getBoundingClientRect().width - margin.left - margin.right;
        const height = svg.node().getBoundingClientRect().height - margin.top - margin.bottom;

        const xScale = d3.scaleBand()
            .domain(dataset.map(d => d[0]))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d[1])])
            .nice()
            .range([height, 0]);

        const xAxis = d3.axisBottom(xScale)
            .tickValues(xScale.domain().filter((d, i) => i % Math.ceil(dataset.length / 10) === 0));

        const yAxis = d3.axisLeft(yScale);

        const chart = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        chart.append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .selectAll(".tick text")
            .attr("transform", "rotate(45)")
            .style("text-anchor", "start");

        chart.append("g")
            .attr("id", "y-axis")
            .call(yAxis);

        chart.selectAll(".bar")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d[0]))
            .attr("y", d => yScale(d[1]))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d[1]))
            .attr("data-date", d => d[0])
            .attr("data-gdp", d => d[1])
            .on("mouseover", function(event, d) {
                d3.select("#tooltip")
                    .style("display", "block")
                    .style("left", `${event.pageX + 5}px`)
                    .style("top", `${event.pageY - 28}px`)
                    .attr("data-date", d[0])
                    .html(`Date: ${d[0]}<br>GDP: ${d[1]} Billion`);
            })
            .on("mouseout", function() {
                d3.select("#tooltip")
                    .style("display", "none");
            });
    }
});
