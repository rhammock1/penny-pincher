// Function to get the index of the closest data point
function getClosestDataPointIndex(width, mouseX, data_length) {
  let closestIndex = 0;
  let minDistance = Math.abs(mouseX - 30 - (width / (data_length - 1)) * 0);

  for (let i = 1; i < data_length; i++) {
    const distance = Math.abs(mouseX - 30 - (width / (data_length - 1)) * i);

    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = i;
    }
  }

  return closestIndex;
}

export default class LineChart extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const {canvas_id, data} = this.input;

    const canvas = document.getElementById(canvas_id);
    const context = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;

    // Handle mousemove event for hover effect
    canvas.addEventListener('mousemove', (event) => {
      const mouseX = event.clientX - canvas.getBoundingClientRect().left;
      const closestIndex = getClosestDataPointIndex(width, mouseX, this.input.data.length);

      console.log('CLOSEST INDEX: ', closestIndex, data);

      // Clear the previous hover effect
      context.clearRect(0, 0, width, height);

      // Redraw the graph with the hover effect
      this.drawLineChart(context, width, height, data, closestIndex);
    });

    this.drawLineChart(context, width, height, data);
  }

  drawLineChart(context, width, height, data, hoverIndex) {
    context.clearRect(0, 0, width, height);

    // Find the maximum total for scaling
    const maxTotal = Math.max(...data.map(point => point.value));

    // Calculate the scaling factor
    const scaleFactor = (height - 50) / maxTotal;

    // Draw the line chart
    context.beginPath();
    data.forEach((point, index) => {
      const x = ((width / (data.length - 1)) * index);
      const y = (height - 20) - point.value * scaleFactor;


      context[index === 0 ? 'moveTo' : 'lineTo'](x, y);
      context.stroke();

      context.beginPath();
      context.arc(x, y, 4, 0, 2 * Math.PI);
      context.fillStyle = index === hoverIndex ? '#FF5733' : '#4CAF50';
      context.fill();
      context.stroke();
      
      // Add labels
      if (hoverIndex === index) {
        context.fillStyle = '#000000';
        context.fillText(
          `$${point.value} - ${point.label}`,
          // If x is less than half the width, draw the label to the right of the line
          x < width / 2 ? x + 10 : x - 10,
          y + 10,
        );
      }
    });
    context.stroke();
  }
}

customElements.define('line-chart', LineChart);