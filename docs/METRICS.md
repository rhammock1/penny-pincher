# Measured Metrics

## Current Metrics
 - All Time Earning/Spending
 - Current Month Earning/Spending
 - Date Range Earning/Spending
 - All Account Balances
 - All Time Spending by Category (Pie Chart)
 - Spending by Date Range (Pie Chart, Line Chart)
 - All Transactions (Table)

## Cards
<!-- FIXME: Change the name of the class and move its location -->
Card properties support interpolation with the state stored in the [BudgetApp](../web/scripts.js) class. Interpolation occurs when a string value is wrapped in double braces `{{start_date}}`. The value inside the braces is the name of a property in the state object. The value of the property will be inserted into the string and replace the braces and everything inside it.
### Card properties
  - `title <string>` - Title of the card
  - `request <string>` - Endpoint to request data from
  - `visible <bool>` - Whether or not to show the card
  - `date_selector <bool>` - Whether or not to be updated when the date changes
  - `component <string>` - Name of the HTML element to use for the card. If a custom element is used, it must be registered in the [components](../web/components/index.js) folder.
  - `graphs <array>` - Array of graphs to show
    - `type <string>` - Type of graph to show
      - `pie` - Pie chart
      - `line` - Line chart
      - `table` - Table
      - `bar` - Bar chart (eventually)
    - `visible <bool>` - Whether or not to show the graph
    - `canvas_height <int>` - Height of the canvas
    - `canvas_width <int>` - Width of the canvas
    - `radius <int>` - Radius of the pie chart
    - `format <function>` - Function to format the data for the graph
      - `data <array|object>` - Data returned from the request. Can be an array or object depending on the request.

## Adding a new metric
  1. Add a new object to the array in cards.js
  2. If a new element is needed, add it to the components folder. Don't forget to import it in the index.js file
  3. If a new endpoint is needed, add it to the server
  4. If a graph is shown, don't forget to include a `format` function to format the data for the graph