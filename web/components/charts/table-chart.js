import {formatTitleAsId} from '../../utils.js';

export default class TableChart extends HTMLElement {
  edited_cells = {};

  editable_columns = {};

  columns = {};

  title = '';

  data = [];

  paginated_data = [];

  page_size = 10;

  current_page = 1;

  total_pages = 1;

  constructor() {
    super();
  }

  connectedCallback() {
    this.editable_columns = this.input.editable_columns || {};
    this.columns = this.input.columns;
    this.title = this.input.title;
    this.data = this.input.data;

    this.innerHTML = `
      <div id="table-body">
      </div>
    `;

    this.querySelector('#table-body').addEventListener('change', (event) => {
      if (event.target.tagName === 'SELECT' || event.target.tagName === 'INPUT') {
        const id = event.target.id;
        const value = event.target.value;
        console.log(`Value of ${id} changed to ${value}`);
        this.edited_cells[id] = value;
      }
    });

    this.querySelector('#table-body').addEventListener('click', async (e) => {
      if (e.target.tagName === 'BUTTON') {
        const data = await this.input.onSubmit(e, this.edited_cells)

        this.data = data.unknown_transactions;
        this.setPagination();
        this.paginate();
      }
    });

    this.setPagination();
    this.paginate();
  }

  renderTable() {
    const { paginated_data, columns, editable_columns, title } = this;

    const is_editable = Object.keys(editable_columns).length;

    const table = document.createElement('table');
    table.setAttribute('id', `table-${title.toLowerCase().replace(' ', '-')}`);
    table.setAttribute('class', 'table table-striped table-bordered');
    table.innerHTML = `
      <thead>
        <tr>
          ${Object.keys(columns).map(key => `<th>${columns[key]}</th>`).join('')}
          ${is_editable ? '<th>Submit</th>' : ''}
        </tr>
      </thead>
      <tbody>
        ${paginated_data.map((row) => {
      const row_columns = Object.keys(columns).map((key) => {
        let cell = '';
        if (row[key]) {
          cell = `<td>${row[key]}</td>`;
        } else if (editable_columns[key]) {
          const { type, options } = editable_columns[key];
          const cell_id = `${key}-${row.ledger_id}`;
          if (type === 'select') {
            cell = `
              <td>
                <select class="form-control" id="${cell_id}">
                  <option value="">Select</option>
                  ${options.map(option => `<option value="${option}">${option}</option>`).join('')}
                </select>
              </td>
            `;
          } else if (type === 'text') {
            cell = `
              <td>
                <input class="form-control" type="text" id="${cell_id}" value="${this.edited_cells[cell_id] || ''}" />
              </td>
            `;
          }
        }
        return cell;
      });
      return `
            <tr>
              ${row_columns.join('')}
              ${is_editable ? `<td><button class="btn btn-primary" id="submit-${row.ledger_id}">Submit</button></td>` : ''}
            </tr>
          `;
    }).join('')}
      </tbody>
    `;
    const table_container = this.querySelector('#table-body');
    table_container.innerHTML = '';
    table_container.appendChild(table);
  }

  setPagination() {
    // Should append the pagination buttons to the table-body element
    this.total_pages = Math.ceil(this.data.length / this.page_size);
    const id = formatTitleAsId(this.title);
    if(!this.querySelector(`#prev-page-${id}`) && !this.querySelector(`#next-page-${id}`)) {
      const pagination = document.createElement('div');
      pagination.setAttribute('id', `pagination-${id}`);
      pagination.innerHTML = `
        <button class="btn btn-secondary" id="prev-page-${id}">Previous</button>
        <button class="btn btn-primary" id="next-page-${id}">Next</button>
      `;
      this.querySelector('#table-body').parentElement.appendChild(pagination);
    }

    this.querySelector(`#prev-page-${id}`).addEventListener('click', this.prevPage.bind(this));
    this.querySelector(`#next-page-${id}`).addEventListener('click', this.nextPage.bind(this));
  }

  nextPage(e) {
    e.stopPropagation();
    e.preventDefault();

    if (this.current_page < this.total_pages) {
      this.current_page += 1;
      this.paginate();
    }
  }

  prevPage(e) {
    e.stopPropagation();
    e.preventDefault();
    if (this.current_page > 1) {
      this.current_page -= 1;
      this.paginate();
    }
  }

  paginate() {
    this.paginated_data = this.data.slice((this.current_page - 1) * this.page_size, this.current_page * this.page_size);
    this.renderTable();
  }
}

customElements.define('table-chart', TableChart);