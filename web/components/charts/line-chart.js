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
    const {canvas_id, title, data} = this.input;

    console.log('Data', data);
    const [labels, values] = data.reduce(([l, v], [date, val]) => {
      l.push(date);
      v.push(val.total);
      
      return [l, v];
    }, [[], []]);

    new Chart(canvas_id, {
      type: 'line', 
      data: {
        labels,
        datasets: [{data: values}],
      },
      options: {
        title: {
          display: true,
          value: title,
        },
      },
    });
  }
}

customElements.define('line-chart', LineChart);