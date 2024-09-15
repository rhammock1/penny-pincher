import { currency, fetcher } from "../../../../utils.js";

export default class GoalList extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const {goals} = this.input;

    this.updateInnerHTML(goals);
  }

  handleEditGoal(goal_id) {
    console.log('EDIT GOAL UNIMPLEMENTED ', goal_id);
  }
  
  handleDeleteGoal(goal_id) {
    console.log('DELETE GOAL UNIMPLEMENTED ', goal_id);
  }

  updateInnerHTML(goals) {
    console.log('goals', goals);
    this.innerHTML = `
      <ul class="list-group">
        ${goals.map((goal) => {
          const {name, goal_amount, target_date, goal_type, goal_id} = goal;
          return `
            <li class="list-group-item border-top-0 border-left-0 border-right-0 border-bottom d-flex flex-column align-items-between">
              <div class="d-flex flex-column justify-content-center align-items-start">
                <div class="d-flex align-items-center">
                  ${name}
                  <span class="badge m-1 badge-primary badge-pill">${currency.format(goal_amount / 100)}</span>
                </div>
                <small class="t-muted">Goal type: ${goal_type}</small>
                <small class="t-muted">${target_date ? `Save by date: ${new Date(target_date).toDateString()}` : ''}</small>
              </div>
              <div class="btn-group">
                <button onclick="handleEditGoal(${goal_id})" class="btn btn-secondary">Edit</button>
                <button onclick="handleDeleteGoal(${goal_id})" class="btn btn-danger">Delete</button>
              </div>
            </li>
          `;
        }).join('')}
      </ul>
    `;

    // Gross
    window.handleEditGoal = this.handleEditGoal;
    window.handleDeleteGoal = this.handleDeleteGoal;
  }
}

customElements.define('goal-list', GoalList);
