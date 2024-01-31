import { formatTitleAsId, fetcher, currency } from "../utils.js";

export default class AccountBalances extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const {title, request} = this.input;

    const response = await fetcher(request);

    const { data } = await response?.json() || {};

    this.innerHTML = `
      <h1 id=${formatTitleAsId(title)}>${title}</h1>
      ${data.length ? this.renderAccountBalances(data, currency).outerHTML : '<no-data></no-data>'}
    `;
  }

  renderAccountBalances(data, currency) {
    const el = document.createElement('div');
    el.classList.add('container');
    const accounts = data.map((account) => {
      const acc_el = document.createElement('div');
      acc_el.classList.add('account');

      const lastUpdated = new Date(account.last_updated).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      acc_el.innerHTML = `
        <div class="account-details">
          <h2 class="list-title">${account.x_name}</h2>
          <span>${currency.format(account.balance)}</span>
        </div>
        <small class="t-muted">Last Updated: ${lastUpdated}</small>
      `;
      return acc_el.outerHTML;
    });
    el.innerHTML = `
      ${accounts.join('')}
    `;
    return el;
  }
}

customElements.define('account-balances', AccountBalances);
