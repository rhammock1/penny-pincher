import { interpolate, formatTitleAsId } from "../utils.js";

export default class GraphCarousel extends HTMLElement {
  static observedAttributes = ['data-start-date', 'data-end-date'];

  graphs = {
    pie: 'pie-chart',
    line: 'line-chart',
    table: 'table-chart',
  };

  start_date = null;
  end_date = null;

  constructor() {
    super();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(name === 'data-start-date') {
      this.start_date = newValue;
    } else if(name === 'data-end-date') {
      this.end_date = newValue;
    }

    
    const {template_title, graphs, data, id} = this.input;
    this.updateInnerHtml(interpolate(template_title, {
      start_date: this.start_date,
      end_date: this.end_date,
    }), template_title, graphs.length > 1 && graphs.filter(graph => graph.visible).length > 1);
    this.setDynamicElements(template_title, graphs, data, id);
  }

  updateInnerHtml(title, template_title, should_show_buttons = false) {
    const id = formatTitleAsId(template_title);
    
    let prev_button;
    let next_button;

    if(document.getElementById(`prev-button-${id}`)) {
      prev_button = document.getElementById(`prev-button-${id}`);
    } else {
      prev_button = document.createElement('button');
      prev_button.setAttribute('id', `prev-button-${id}`);
      prev_button.innerHTML = 'Previous';
    }

    if(document.getElementById(`next-button-${id}`)) {
      next_button = document.getElementById(`next-button-${id}`);
    } else {
      next_button = document.createElement('button');
      next_button.setAttribute('id', `next-button-${id}`);
      next_button.innerHTML = 'Next';
    }

    this.innerHTML = `
      <h1>${title}</h1>
      <div id="carousel-${id}" class="carousel slide" data-ride="carousel">
        <div id="carousel-inner-${id}" class="carousel-inner">
        
        </div>
      </div>
    `;

    const carousel = document.getElementById(`carousel-${id}`);
    if(should_show_buttons) {
      carousel.appendChild(prev_button);
      carousel.appendChild(next_button);
    }
  }

  setDynamicElements(template_title, graphs, data, id) {
    const carousel_inner = document.getElementById(`carousel-inner-${formatTitleAsId(template_title)}`);

    let index = 0;
    for (const graph of graphs) {
      if (!graph.visible) {
        continue;
      }

      const graph_el = document.createElement(this.graphs[graph.type]);
      graph_el.setAttribute('id', `${graph.type}-${id}-${index}`);

      // Create a child canvas element
      if(graph.type !== 'table') {
        // No need for a canvas here
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', graph.canvas_width);
        canvas.setAttribute('height', graph.canvas_height);
        canvas.setAttribute('id', `${graph.type}-${id}-canvas-${index}`);
        graph_el.appendChild(canvas);
      }

      console.log('DATA', data, graph.type);
      const formatted_data = graph.format(data);
      graph_el.input = {
        canvas_id: `${graph.type}-${id}-canvas-${index}`,
        data: formatted_data,
        radius: graph.radius,
        // Table-Chart
        title: id,
        columns: graph.columns,
      };

      const carouselItem = document.createElement('div');
      carouselItem.classList.add('carousel-item');
      if(index === 0) {
        carouselItem.classList.add('active');
      } else {
        carouselItem.classList.add('d-none');
      }
      carouselItem.appendChild(graph_el);

      carousel_inner.appendChild(carouselItem);
      index++;
    }
  }

  connectedCallback() {
    const {
      title,
      template_title,
      graphs,
      data,
      id,
    } = this.input;

    this.start_date = this.getAttribute('data-start-date');
    this.end_date = this.getAttribute('data-end-date');

    this.updateInnerHtml(title, template_title, graphs.length > 1 && graphs.filter(graph => graph.visible).length > 1);

    this.setDynamicElements(template_title, graphs, data, id);

    const title_id = formatTitleAsId(template_title);
    const carousel = document.getElementById(`carousel-${title_id}`);

    carousel.prev = () => {
      const carousel_inner = document.getElementById(`carousel-inner-${title_id}`);
      const active = carousel_inner.querySelector('.active');
      const prev = active.previousElementSibling;

      if(prev) {
        active.classList.remove('active');
        active.classList.add('d-none');
        prev.classList.add('active');
        prev.classList.remove('d-none');

        // Don't show the previous button if we're on the first slide
        if(!prev.previousElementSibling) {
          document.getElementById(`prev-button-${title_id}`).classList.add('d-none');
        }
        document.getElementById(`next-button-${title_id}`).classList.remove('d-none');
      }
    };

    carousel.next = () => {
      const carousel_inner = document.getElementById(`carousel-inner-${title_id}`);
      const active = carousel_inner.querySelector('.active');
      const next = active.nextElementSibling;

      if(next) {
        active.classList.remove('active');
        active.classList.add('d-none');
        next.classList.add('active');
        next.classList.remove('d-none');

        // Don't show the next button if we're on the last slide
        if(!next.nextElementSibling) {
          document.getElementById(`next-button-${title_id}`).classList.add('d-none');
        }
        document.getElementById(`prev-button-${title_id}`).classList.remove('d-none');

      }
    };

    if(graphs.length > 1 && graphs.filter(graph => graph.visible).length > 1) {
      const prev_button = document.getElementById(`prev-button-${title_id}`);
      const next_button = document.getElementById(`next-button-${title_id}`);
      next_button.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();

        carousel.next();
      });

      prev_button.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();

        carousel.prev();
      });

      const carousel_inner = document.getElementById(`carousel-inner-${title_id}`);
      // Don't show the previous button if we're on the first slide
      if(!carousel_inner.querySelector('.active').previousElementSibling) {
        prev_button.classList.add('d-none');
      }
      // Don't show the next button if we're on the last slide
      if(!carousel_inner.querySelector('.active').nextElementSibling) {
        next_button.classList.add('d-none');
      }
    }
  }
}

customElements.define('graph-carousel', GraphCarousel);