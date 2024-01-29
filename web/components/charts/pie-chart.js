import { currency } from "../../utils.js";

export default class PieChart extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const {canvas_id, radius, data} = this.input;

    const canvas = document.getElementById(canvas_id);
    const context = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    this.drawPieChart(context, centerX, centerY, radius, data);
  }

  drawPieChart(context, centerX, centerY, radius, data) {
    const total = data.reduce((acc, entry) => acc + parseFloat(entry.value), 0);
    let startAngle = 0;

    data.forEach((entry, i) => {
      const sliceAngle = (parseFloat(entry.value) / total) * (2 * Math.PI);

      const labelX = centerX + Math.cos(startAngle + sliceAngle / 2) * (radius * 1.5);
      const labelY = centerY + Math.sin(startAngle + sliceAngle / 2) * (radius * 1.5);

      // Calculate the end points of the line
      const lineStartX = centerX + Math.cos(startAngle + sliceAngle / 2) * (radius * 0.9);
      const lineStartY = centerY + Math.sin(startAngle + sliceAngle / 2) * (radius * 0.9);
      const lineEndX = labelX + (labelX > centerX ? 10 : -10);
      const lineEndY = labelY + (labelY > centerY ? 10 : -10);

      context.beginPath();
      context.moveTo(centerX, centerY);
      context.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      context.fillStyle = entry.color || `hsl(${(i * 360) / data.length}, 100%, 35%)`;
      context.fill();

      context.font = '12px Arial';
      context.fillStyle = '#000';
      context.textAlign = labelX > centerX ? 'left' : 'right';
      context.textBaseline = 'middle';
      context.fillText(`${entry.label}: ${currency.format(entry.value)}`, labelX, labelY);

      // Draw the line
      context.beginPath();
      context.moveTo(lineStartX, lineStartY);
      context.lineTo(lineEndX, lineEndY + 5 * -(i + 1));
      context.strokeStyle = '#000';
      context.stroke();

      startAngle += sliceAngle;
    });
  }
}

customElements.define('pie-chart', PieChart);
