import { currency, fetcher } from "../../../../utils.js";

export default class GoalList extends HTMLElement {
  goals = [];

  constructor() {
    super();
  }

  connectedCallback() {
    const {goals} = this.input;
    this.goals = goals;

    this.showGoalList(goals);
  }

  diconnectedCallback() {
    delete window.handleGoalAction;
  }

  showEditGoalForm(goal) {
    const addGoalForm = document.createElement('add-goal-form');
    addGoalForm.input = {
      goal_types: this.input.goal_types,
      existing_goal: goal,
    };
    this.innerHTML = `
      <h4 class="mt-2 ml-2">Edit Goal</h4>
    `;
    this.appendChild(addGoalForm);
  }

  handleGoalAction(type, goal_id) {
    const goal = this.input.goals.find(goal => goal.goal_id.toString() === goal_id.toString());
    console.log('SELECTED GOAL: ', goal);

    this.dispatchEvent(new CustomEvent('goal-action', {detail: {goal, action: type}}));
  }

  showGoalList(goals) {
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
                <button onclick="handleGoalAction('edit', ${goal_id})" class="btn btn-secondary">Edit</button>
                <button onclick="handleGoalAction('delete', ${goal_id})" class="btn btn-danger">Delete</button>
              </div>
            </li>
          `;
        }).join('')}
      </ul>
    `;

    // Gross
    window.handleGoalAction = this.handleGoalAction.bind(this);
  }
}

customElements.define('goal-list', GoalList);
