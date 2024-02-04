export default class FinancialGoals extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const {title, request} = this.input;
    this.innerHTML = `
      <div class="card">
        <h1>${title}</h1>
        <div id="financial-goals-body">
        </div>
      </div>
    `;

    const goals = document.getElementById('financial-goals-body');
    fetcher(request)
      .then(res => (res ? res.json() : {}))
      .then(({data = []}) => {
        if(!data.length) {
          goals.innerHTML = `
            <no-data>Please add a goal to get started.</no-data>
            <button id="add-goal">Add Goal</button>
          `;
          return;
        }
      })
      .catch(err => {
        console.error(err);
        goals.innerHTML = `
          <no-data>There was an error loading your goals.</no-data>
        `;
      });
  }
};

customElements.define('financial-goals', FinancialGoals);