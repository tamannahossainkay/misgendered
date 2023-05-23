$(document).ready(function() {
  
  // Function to filter the data based on dropdown selections and display results
  function filterAndDisplayResults() {
    var selectedValue1 = $('#declaration-type-menu').val();
    var selectedValue2 = $('#pronoun-menu').val();
    var selectedValue3 = $('#declaration-number-menu').val();
    var selectedValue4 = $('#template-menu').val();
    
    var filteredData = data.filter(function(item) {
      return (
        item.declaration_type === selectedValue1 &&
        item.pronoun === selectedValue2 &&
        item.declaration_number === selectedValue3 &&
        item.template === selectedValue4
      );
    });
    
    // Clear previous results
    $('#results').empty();
    
    // Display filtered results
    filteredData.forEach(function(item) {
      $('#results').append(item.example);
    });
console.log(filteredData[0]); // Check the filtered row data
  }
  
      
  // Event handlers for dropdown changes
  $('#declaration-type-menu, #pronoun-menu, #template-menu, #declaration-number-menu').on('change', function() {
    filterAndDisplayResults();
  });
  
  // Load the CSV file and process it
  fetch('example.csv')
    .then(function(response) {
      return response.text();
    })
    .then(function(csvData) {
      // Parse the CSV data
      Papa.parse(csvData, {
        header: true,
        complete: function(results) {
          // Store the parsed data in the "data" array
          data = results.data;
          
          // Initial filtering and displaying of results
          filterAndDisplayResults();
        }
      });
    });
});
