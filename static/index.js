const base_url = 'http://boulder.sidak.xyz'

async function init() {

    const response = await fetch(base_url + '/status');
    const data = await response.json();

    let best_name = null;
    let best_value = 110;

    let location_array = [];

    for (let location in data) {
        const location_object = {"name": location, "usage": +data[location]}
        location_array.push(location_object);

        if ((data[location] < best_value) && location != 'Wienerberg') {
            best_value = data[location]
            best_name = location
        }
    }

    document.getElementById('best').innerHTML = best_name+ " wins!";

    const svgHeight = 200;
    const svgWidth = 500;
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
                return i * (barsWidth + offset)+30;
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
                return i * (barsWidth + offset)+30;
            })
        .attr("y", barsHeight + 20);

    let scale = d3.scaleLinear()
        .domain([0, 100])
        .range([200, 0]);

    let y_axis = d3.axisLeft()
        .scale(scale);

    mySvg.append("g")
        .attr("transform", "translate(20, -30)")
        .call(y_axis);


}