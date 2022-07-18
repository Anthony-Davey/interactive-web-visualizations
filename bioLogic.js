// set json location to constant
const samplesJson = "http://localhost:8000/samples.json";

// read data from json
d3.json(samplesJson).then(function(Jsondata) {
    var data = Jsondata;

    console.log(data);

    var names = data.names;

	names.forEach((name) => {
		d3.select("#selDataset").append("option").text(name);
	})
    // filter for initial plots
    plotData = data.samples.filter(sample => sample.id === "940")[0];
	console.log(plotData);

	// assign values to variables for plots	
	plotSampleValues = plotData.sample_values;
	plotIds = plotData.otu_ids;
	plotLabels = plotData.otu_labels;

	// slice data based on top 10
	sampleValuesDefault = plotSampleValues.slice(0, 10).reverse();
	otuIdsDefault = plotIds.slice(0, 10).reverse();
	otuLabelsDefault = plotLabels.slice(0, 10).reverse();

	console.log(sampleValuesDefault);
	console.log(otuIdsDefault);
	console.log(otuLabelsDefault);

    // create bar chart
	var trace1 = {
		x: sampleValuesDefault,
		y: otuIdsDefault.map(outId => `OTU ${outId}`),
		text: otuLabelsDefault,
		type: "bar",
		orientation: "h"
		};

	var barData = [trace1];

	var barlayout = {
		title: `<b>Top 10 OTUs by Individual<b>`,
		xaxis: { title: "Sample Values"},
		yaxis: { title: "OTU IDs"},
		autosize: false,
		}

		
	Plotly.newPlot("bar", barData, barlayout);

    // create bubble chart
	var trace2 = {
		x: otuIdsDefault,
		y: sampleValuesDefault,
		text: otuLabelsDefault,
		mode: 'markers',
		marker: {
			color: otuIdsDefault,
			size: sampleValuesDefault
			}
		};
		
	var bubbleData = [trace2];
		
	var bubbleLayout = {
		title: '<b>Sample Value Frequency by OTU ID<b>',
		xaxis: { title: "OTU ID"},
		yaxis: { title: "Sample Value"}, 
		showlegend: false,
		};
		
	Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // filter meta data for demographics
	demoDefault = data.metadata.filter(sample => sample.id === 940)[0];
	console.log(demoDefault);

	
	Object.entries(demoDefault).forEach(
        ([key, value]) => d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));




    d3.selectAll("#selDataset").on("change", updatePlot);

    // will execute when new test subject is chosen from drop-down list
    function updatePlot() {

        
        var inputElement = d3.select("#selDataset");

        
        var inputValue = inputElement.property("value");
        console.log(inputValue);

        
        dataset = data.samples.filter(sample => sample.id === inputValue)[0];
        console.log(dataset);

        
        plotSampleValues = dataset.sample_values;
        plotIds = dataset.otu_ids;
        plotLabels = dataset.otu_labels;

        
        top10Values = plotSampleValues.slice(0, 10).reverse();
        top10Ids = plotIds.slice(0, 10).reverse();
        top10Labels = plotLabels.slice(0, 10).reverse();

        
        Plotly.restyle("bar", "x", [top10Values]);
        Plotly.restyle("bar", "y", [top10Ids.map(outId => `OTU ${outId}`)]);
        Plotly.restyle("bar", "text", [top10Labels]);

        
        Plotly.restyle('bubble', "x", [plotIds]);
        Plotly.restyle('bubble', "y", [plotSampleValues]);
        Plotly.restyle('bubble', "text", [plotLabels]);
        Plotly.restyle('bubble', "marker.color", [plotIds]);
        Plotly.restyle('bubble', "marker.size", [plotSampleValues]);

        
        metainfo = data.metadata.filter(sample => sample.id == inputValue)[0];

        
        d3.select("#sample-metadata").html("");

        
        Object.entries(metainfo).forEach(([key, value]) => d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));

    }
});





