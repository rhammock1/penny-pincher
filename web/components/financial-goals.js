export default class FinancialGoals extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="card">
        <h1>Financial Goals</h1>
        <div id="financial-goals-body">
        </div>
      </div>
    `
  }
};

customElements.define('financial-goals', FinancialGoals);