import { currency } from "../../utils.js";

export default class PieChart extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const {canvas_id, title, data} = this.input;

    const [labels, values] = Object.entries(data).reduce(([l, v], [key, value]) => {
      l.push(key);
      v.push(value.total);
      return [l, v];
    }, [[], []]);

    new Chart(canvas_id, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{data: values}]
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

customElements.define('pie-chart', PieChart);
