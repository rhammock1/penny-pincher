import { interpolate, fetcher, formatTitleAsId } from "../../utils.js";

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

    const {template_title, graphs, request, id} = this.input;

    if(this.start_date == null || this.end_date == null) {
      return;
    }

    this.updateInnerHtml(template_title, graphs.length > 1 && graphs.filter(graph => graph.visible).length > 1);

    fetcher(interpolate(request, { start_date: this.start_date, end_date: this.end_date }))
      .then(res => res.json())
      .then(({data}) => this.setDynamicElements(template_title, graphs, data, id));
  }

  updateInnerHtml(template_title, should_show_buttons = false) {
    const id = formatTitleAsId(template_title);

    const buttons = `
      <div class="d-flex justify-content-between">
        <button class="btn btn-primary" id="prev-button-${id}">Previous</button>
        <button class="btn btn-primary" id="next-button-${id}">Next</button>
      </div>
    `;

    this.innerHTML = `
      <div class="card-body">
        <div id="carousel-${id}" class="carousel slide" data-ride="carousel">
          <div id="carousel-inner-${id}" class="carousel-inner">
          
          </div>
          ${should_show_buttons ? buttons : ''}
        </div>
      </div>
    `;
  }

  setDynamicElements(template_title, graphs, data, id) {
    const carousel_inner = document.getElementById(`carousel-inner-${formatTitleAsId(template_title)}`);

    let index = 0;
    for (const graph of graphs) {
      if (!graph.visible) {
        continue;
      }

      // Check for existing graph el
      const existing_graph = document.getElementById(`${graph.type}-${id}-${index}`);
      const graph_el = existing_graph
        ? existing_graph
        : document.createElement(this.graphs[graph.type]);

      graph_el.setAttribute('id', `${graph.type}-${id}-${index}`);

      // Create a child canvas element
      if (graph.type !== 'table') {
        // Check if a canvas already exists
        const el_id = `${graph.type}-${id}-canvas-${index}`;
        const existing_canvas = document.getElementById(el_id);
        if (!existing_canvas) {
          const canvas = document.createElement('canvas');
          canvas.setAttribute('width', 500);
          canvas.setAttribute('height', 500);
          canvas.setAttribute('id', el_id);
          graph_el.appendChild(canvas);
        }
      }

      const formatted_data = graph.format(data);
      graph_el.input = {
        canvas_id: `${graph.type}-${id}-canvas-${index}`,
        data: formatted_data,
        radius: graph.radius,
        // Table-Chart
        title: interpolate(template_title, {
          start_date: this.start_date,
          end_date: this.end_date,
        }),
        columns: graph.columns,
      };

      // If the graph already exists, then the carousel item has also already been created
      if(!existing_graph) {
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) {
          carouselItem.classList.add('active');
        } else {
          carouselItem.classList.add('d-none');
        }
        carouselItem.appendChild(graph_el);

        carousel_inner.appendChild(carouselItem);
      }
      index++;
    }
  }

  connectedCallback() {
    const {
      title,
      template_title,
      graphs,
      request,
      id,
    } = this.input;

    this.start_date = this.getAttribute('data-start-date');
    this.end_date = this.getAttribute('data-end-date');
    
    this.updateInnerHtml(title, template_title, graphs.length > 1 && graphs.filter(graph => graph.visible).length > 1);
    fetcher(interpolate(request, { start_date: this.start_date, end_date: this.end_date }))
      .then(res => res.json())
      .then(({ data }) => {
        this.setDynamicElements(template_title, graphs, data, id);
        if (graphs.length > 1 && graphs.filter(graph => graph.visible).length > 1) {
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
          if (!carousel_inner.querySelector('.active').previousElementSibling) {
            prev_button.classList.add('d-none');
          }
          // Don't show the next button if we're on the last slide
          if (!carousel_inner.querySelector('.active').nextElementSibling) {
            next_button.classList.add('d-none');
          }
        }
      });

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
  }
}

customElements.define('graph-carousel', GraphCarousel);