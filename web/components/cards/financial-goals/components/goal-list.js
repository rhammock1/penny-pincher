import { currency } from "../../../../utils.js";

export default class GoalList extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const {goals} = this.input;

    this.updateInnerHTML(goals);
  }

  updateInnerHTML(goals) {
    console.log('goals', goals);
    this.innerHTML = `
      <div class="goal-list">
        <ul>
          ${goals.map((goal) => {
            const {name, goal_amount, target_date, goal_type} = goal;
            return `
              <li>
                <div class="goal-details">
                  <h2 class="list-title">${name}</h2>
                  <span>${currency.format(goal_amount / 100)}</span>
                </div>
                <small class="t-muted">${goal_type}</small>
                <small class="t-muted">${target_date}</small>
              </li>
            `;
          })}
        </ul>
    `;
  }
}

customElements.define('goal-list', GoalList);
