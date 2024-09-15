import { interpolate, fetcher, currency } from "../../utils.js";

export default class LedgerOverview extends HTMLElement {
  static observedAttributes = ['data-start-date', 'data-end-date'];

  start_date = null;
  end_date = null;

  constructor() {
    super();
  }

  connectedCallback() {
    const {title, request} = this.input;

    this.start_date = this.getAttribute('data-start-date');
    this.end_date = this.getAttribute('data-end-date');

    const dates = { start_date: this.start_date, end_date: this.end_date }

    fetcher(interpolate(request, dates))
      .then((res) => !!res ? res.json() : {})
      .then(({data}) => this.setInnerHtml(interpolate(title, dates), data));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-start-date') {
      this.start_date = newValue;
    } else if (name === 'data-end-date') {
      this.end_date = newValue;
    }

    if(this.start_date == null || this.end_date == null) {
      return;
    }

    const { template_title, request } = this.input || {};
    fetcher(interpolate(request, { start_date: this.start_date, end_date: this.end_date }))
      .then((res) => !!res ? res.json() : {})
      .then(({ data }) => this.setInnerHtml(
        interpolate(template_title, {
          start_date: this.start_date,
          end_date: this.end_date,
        }), 
        data,
      ));
  }

  setInnerHtml(title, data) {  
    this.innerHTML = `
      <h3 class="card-header">${title}</h3>
      <div class="card-body">
        ${Object.keys(data).length ? this.createCategoryElement(data, currency).outerHTML : '<no-data></no-data>'}
      </div>
    `;
  }

  createCategoryElement(data, currency) {
    const categoryElement = document.createElement('div');
    categoryElement.classList.add('category');

    const incomeParagraph = document.createElement('p');
    incomeParagraph.textContent = `Income: ${currency.format(data.income)}`;
    categoryElement.appendChild(incomeParagraph);

    const expensesParagraph = document.createElement('p');
    expensesParagraph.textContent = `Expenses: ${currency.format(data.expenses)}`;
    categoryElement.appendChild(expensesParagraph);

    const totalParagraph = document.createElement('p');
    totalParagraph.textContent = `Total: ${currency.format(data.income - data.expenses)}`;
    categoryElement.appendChild(totalParagraph);

    return categoryElement;
  }
}

customElements.define('ledger-overview', LedgerOverview);
