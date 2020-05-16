function buildMetadata(sample) {
    var metadataSelector = d3.select('#sample-metadata');

    d3.json(`./data/samples.json`).then( dataS =>{
      metadataSelector.html("");
      var data=dataS.metadata.filter(samples => samples.id==sample );

      console.log(data);
      for (let elem in data[0]){
          metadataSelector
          .append('p').text(`${elem} : ${data[0][elem]}`);
      }

      })
}


function barChart(data) {
    console.log(data);
    var sampleData=data;

    // Prepare a list of objects for sorting
    var list = [];
    for (var i = 0; i < sampleData.otu_ids.length; i++) {
        // Push each object into the list
        list.push({'otu_ids': sampleData.otu_ids[i], 'otu_labels': sampleData.otu_labels[i], 'sample_values': sampleData.sample_values[i]});
    }

    // Sort function of objects by samples values in array 
    console.log(list.sort((a, b) => parseInt(b.sample_values) - parseInt(a.sample_values)));

    let otu_ids = list.slice(0,10).map(record => "OTU " + record.otu_ids.toString());
    let values = list.slice(0,10).map(record => record.sample_values);
    let otu_labels = list.slice(0,10).map(record =>  record.otu_labels );

    var trace1 = [{
      x: values,
      y: otu_ids,
      hovertext:otu_labels,
      type: "bar",
      orientation: "h"
    }];

    var layout = {
      title:"<b> Top 10 OTUs Bar Chart </b>",
      yaxis:{autorange:'reversed'},
    
      height: 550,
      width: 500
    };

    Plotly.newPlot("bar", trace1, layout);
  
}

 

function bubbleChart(data) {
  let x = data.otu_ids;
  let y = data.sample_values;
  let markersize = data.sample_values;
  let markercolors = data.otu_ids;
  let textvalues = data.otu_labels;

  let trace1 =[{
    x: x,
    y: y,
    mode: 'markers',
    marker: {
      size: markersize,
      color: markercolors,
    },
    text: textvalues
  }];

  let layout ={
    title:"<b> Belly Button Bubble Chart </b>",
    xaxis: {
      title: 'OTU ID',
    },
    yaxis: {
      title: 'Sample Value'
    },
    width:1300,
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
  };

  Plotly.newPlot('bubble', trace1, layout, {responsive: true});
}



function buildCharts(sample) {

    d3.json(`./data/samples.json`).then ( dataS =>{
        var wdata=dataS.metadata.filter(samples => samples.id==sample );
      // ## Gauge Chart ##
      gaugeChart(wdata[0])
    });

    d3.json(`./data/samples.json`).then( dataS =>{
      var data=dataS.samples.filter(samples => samples.id==sample );
    
      // ## bar Chart ##
      barChart(data[0]);
      // ## Bubble Chart ##
      bubbleChart(data[0]);
    });


   
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json(`./data/samples.json`).then((data) => {
    var sampleNames=data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected

  buildCharts(newSample);
  buildMetadata(newSample);

}


// Initialize the dashboard
init();
















// function unpack(rows, index) {
//     return rows.map(function(row) {
//       return row[index];
//     });
//   }

// function buildMetadata(sample) {

//     // @TODO: Complete the following function that builds the metadata panel
  
//     // Use `d3.json` to fetch the metadata for a sample
//     var metadataURL = `./data/samples.json`;
//       // Use d3 to select the panel with id of `#sample-metadata`
//       d3.json(metadataURL).then(function(data){
//         var sampleData = d3.select(`#sample-metadata`);
//       // Use `.html("") to clear any existing metadata
//         sampleData.html("");
//       // Use `Object.entries` to add each key and value pair to the panel
//       // Hint: Inside the loop, you will need to use d3 to append new
//       // tags for each key-value in the metadata.
//         var metadata=data.metadata;
//         Object.entries(metadata).forEach(function([key,value]){
//           var row = sampleData.append("p");
//           row.text(`${key}:${value}`)
//         })
//       });
//   }
  
//   function buildCharts(sample) {
//     // @TODO: Use `d3.json` to fetch the sample data for the plots
//     var plotData = `./data/samples.json`;
//     // @TODO: Build a Bubble Chart using the sample data
//     d3.json(plotData).then(function(data){
//       var x_axis = data.samples.otu_ids;
//       var y_axis = data.samples.sample_values;
//       var size = data.samples.sample_values;
//       var color = data.samples.otu_ids;
//       var texts = data.samples.otu_labels;
    
//       var bubble = {
//         x: x_axis,
//         y: y_axis,
//         text: texts,
//         mode: `markers`,
//         marker: {
//           size: size,
//           color: color
//         }
//       };
  
//       var data = [bubble];
//       var layout = {
//         title: "Belly Button Bacteria",
//         xaxis: {title: "OTU ID"}
//       };
//       Plotly.newPlot("bubble", data, layout);
  
//       // @TODO: Build a bar Chart
//       d3.json(plotData).then(function(data){
//         var values = data.samples.sample_values.slice(0,10);
//         var labels = data.samples.otu_ids.slice(0,10);
//         var display = data.samples.otu_labels.slice(0,10);
  
//         var bar_chart = [{
//           values: values,
//           lables: labels,
//           hovertext: display,
//           type: "bar"
//         }];
//         Plotly.newPlot('bar',bar_chart);
//       });
//     });
//   };
  
//       // HINT: You will need to use slice() to grab the top 10 sample_values,
//       // otu_ids, and labels (10 each).
  
//   function init() {
//     console.log('hello');
//     // Grab a reference to the dropdown select element
//     var selector = d3.select("#selDataset");
  
//     // Use the list of sample names to populate the select options
//     d3.json("./data/samples.json").then((sampleNames) => {
//       sampleNames.forEach((sample) => {
//         selector
//           .append("option")
//           .text(sample)
//           .property("value", sample);
//       });
  
//       // Use the first sample from the list to build the initial plots
//       const firstSample = sampleNames[0];
//       buildCharts(firstSample);
//       buildMetadata(firstSample);
//     });
//   }
  
//   function optionChanged(newSample) {
//     // Fetch new data each time a new sample is selected
//     buildCharts(newSample);
//     buildMetadata(newSample);
//   }
  
//   // Initialize the dashboard
//   init();