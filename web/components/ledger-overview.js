import { interpolate, currency } from "../utils.js";

export default class LedgerOverview extends HTMLElement {
  static observedAttributes = ['data-start-date', 'data-end-date'];

  start_date = null;
  end_date = null;

  constructor() {
    super();
  }

  async connectedCallback() {
    const {title, data} = this.input;

    this.start_date = this.getAttribute('data-start-date');
    this.end_date = this.getAttribute('data-end-date');

    this.setInnerHtml(title, data);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-start-date') {
      this.start_date = newValue;
    } else if (name === 'data-end-date') {
      this.end_date = newValue;
    }

    const { template_title, data } = this.input;
    this.setInnerHtml(interpolate(template_title, {
      start_date: this.start_date,
      end_date: this.end_date,
    }), data);
  }

  setInnerHtml(title, data) {  
    this.innerHTML = `
      <h1>${title}</h1>
      ${this.createCategoryElement(data, currency).outerHTML}
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
