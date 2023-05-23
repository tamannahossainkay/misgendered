$(document).ready(function() {
  // Define chart variable
  let chart = null;

  // Function to load data from CSV file
  function loadDataFromCSV(callback) {
    // Replace 'data.csv' with the actual path to your CSV file
    fetch('results.csv')
      .then(response => response.text())
      .then(data => {
        // Parse CSV data
        const rows = data.split('\n');
        const headers = rows[0].split(',');
        const dataset = [];
        for (let i = 1; i < rows.length; i++) {
          const values = rows[i].split(',');
          const row = {};
          for (let j = 0; j < headers.length; j++) {
            row[headers[j]] = values[j];
          }
          dataset.push(row);
        }
        callback(dataset);
      });
  }

  function filterAndVisualizeData(dataset) {
    const templateMenu = document.getElementById('template-menu');
    const pronounMenu = document.getElementById('pronoun-menu');
    const declarationTypeMenu = document.getElementById('declaration-type-menu');
    const declarationNumberMenu = document.getElementById('declaration-number-menu');
    const modelMenu = document.getElementById('model-menu');

    // Event listener for dropdown menu changes
    templateMenu.addEventListener('change', updateVisualization);
    pronounMenu.addEventListener('change', updateVisualization);
    declarationTypeMenu.addEventListener('change', updateVisualization);
    declarationNumberMenu.addEventListener('change', updateVisualization);
    modelMenu.addEventListener('change', updateVisualization);

    // Initial visualization
    updateVisualization();

    // Function to update the visualization based on the selected values
    function updateVisualization() {
      const selectedTemplate = templateMenu.value;
      const selectedPronoun = pronounMenu.value;
      const selectedDeclarationType = declarationTypeMenu.value;
      const selectedDeclarationNumber = declarationNumberMenu.value;
      const selectedModel = modelMenu.value;

      // Filter the dataset based on the selected values
      const filteredData = dataset.filter(row => {
        return (
          row.template === selectedTemplate &&
          row.pronoun === selectedPronoun &&
          row.declaration_type === selectedDeclarationType &&
          row.declaration_number === selectedDeclarationNumber &&
          row.model === selectedModel
        );
      });

      console.log(filteredData[0]); // Check the filtered row data

      if (filteredData.length > 0) {
        const chartData = filteredData[0];

            // Clear previous results
    $('#accuracy').empty();
    
    // Display filtered results
    filteredData.forEach(function(item) {
      $('#accuracy').append(chartData.accuracy);
    });

        // Clear existing chart if any
        d3.select('#chart').html('');

// Clear existing chart if any
d3.select('#chart').html('');

// Create SVG container for the chart
const margin = { top: 20, right: 20, bottom: 40, left: 40 }; // Increased bottom margin for x-axis label
const width = 400 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

const svg = d3.select('#chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Define the data values
const dataValues = [
  chartData.unisex_accuracy,
  chartData.female_accuracy,
  chartData.male_accuracy,
];

// Define the labels for the x-axis
const labels = ['Unisex', 'Female', 'Male'];

// Create the x-scale
const xScale = d3.scaleBand()
  .domain(labels)
  .range([0, width])
  .padding(0.1);

// Create the y-scale
const yScale = d3.scaleLinear()
  .domain([0, d3.max(dataValues)])
  .range([height, 0]);

// Create the x-axis
svg.append('g')
  .attr('transform', 'translate(0,' + height + ')')
  .call(d3.axisBottom(xScale));

// Create the x-axis label
svg.append('text')
  .attr('x', width / 2)
  .attr('y', height + margin.bottom - 10) // Adjusted y position for x-axis label
  .attr('fill', 'black')
  .attr('text-anchor', 'middle')
  .text('Gender Association of Name');

// Create the y-axis
svg.append('g')
  .call(d3.axisLeft(yScale));

// Create the y-axis label
svg.append('text')
  .attr('transform', 'rotate(-90)')
  .attr('x', -height / 2)
  .attr('y', -margin.left + 10)
  .attr('fill', 'black')
  .attr('text-anchor', 'middle')
  .text('Accuracy');

// Create the bars
svg.selectAll('.bar')
  .data(dataValues)
  .enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('x', (d, i) => xScale(labels[i]))
  .attr('y', d => yScale(d))
  .attr('width', xScale.bandwidth())
  .attr('height', d => height - yScale(d))
  .attr('fill', '#ffdef3');

// Add labels to the bars
svg.selectAll('.label')
  .data(dataValues)
  .enter()
  .append('text')
  .attr('class', 'label')
  .attr('x', (d, i) => xScale(labels[i]) + xScale.bandwidth() / 2)
  .attr('y', d => yScale(d) - 5)
  .attr('text-anchor', 'middle')
  .text(d => d);


      }
    }
  }

  // Call the loadDataFromCSV function and pass the filterAndVisualizeData function as the callback
  loadDataFromCSV(filterAndVisualizeData);
});