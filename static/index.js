const base_url = 'https://boulder.sidak.xyz:5001'

async function init() {
    const response = await fetch(base_url + '/status');

    const data = await response.json();

    let location_array = [];

    for (let location in data) {
        let location_object = null;
        if (location == "Blockfabrik") {
            location_object = {"name": location, "usage": +data[location]}
        } else {
            const usage = (100 - (+data[location].slice(-2) * 2))
            location_object = {"name": location, "usage": usage}
        }
        location_array.push(location_object);
    }

    location_array.sort(function (a, b) {
        return a.usage - b.usage
    });

    document.getElementById('best').innerHTML = location_array[0].name + " wins!";

    const svgHeight = 200;
    const svgWidth = 600;
    const labelsHeight = 30; //free space for labels.
    const barsHeight = svgHeight - labelsHeight;
    const barsWidth = 80;
    const offset = 40;

    //Create SVG
    let mySvg = d3.select("#bars")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    const dataMax = 100;

    let barScale = d3.scaleLinear()
        .domain([0, dataMax])
        .range([0, barsHeight]);

    mySvg.selectAll("rect")
        .data(location_array)
        .enter()
        .append("svg:rect")
        .attr("x",
            function (d, i) {
                return i * (barsWidth + offset) + 70;
            })
        .attr("y",
            function (d) {
                return barsHeight - barScale(d.usage);
            })
        .attr("width", barsWidth)
        .attr("height",
            function (d) {
                return barScale(d.usage);
            })
        .style("fill", "red");

    //Add the labels
    mySvg.selectAll("text")
        .data(location_array)
        .enter()
        .append("svg:text")
        .text(
            function (d) {
                return d.name;
            })
        .attr("x",
            function (d, i) {
                return i * (barsWidth + offset) + 70;
            })
        .attr("y", barsHeight + 20);

    let scale = d3.scaleLinear()
        .domain([0, 100])
        .range([200, 0]);

    let y_axis = d3.axisLeft()
        .scale(scale);

    mySvg.append("g")
        .attr("transform", "translate(60, -30)")
        .call(y_axis)

    mySvg.append("text")
        .attr('text-anchor', 'middle')
        .attr("transform", function (d) {
            return "rotate(-90)"
        })
        .attr("x", -60)
        .attr("y", 30).text("Usage [%]");


}
