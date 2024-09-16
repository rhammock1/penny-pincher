import {fetcher} from '../../../../utils.js';

function formatDateToYYYYMMDD(d) {
  const date = new Date(d);
  if(!date) {
    throw new Error('failed to parse date');
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export class AddGoalForm extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const {goal_types, existing_goal} = this.input;

    console.log('existing goal: ', existing_goal);

    console.log('goal types', goal_types);
    this.innerHTML = `
      ${existing_goal ? '<h4 class="mt-2 ml-2">Edit Goal</h4>' : ''}
      <form class="m-2" id="add-goal-form">
        <div class="form-group">
          <label for="goal-name">Goal Name</label>
          <input class="form-control" type="text" id="goal-name" name="name" required>
        </div>
        <div class="form-group">
          <label for="goal-amount">Goal Amount</label>
          <input class="form-control" type="number" id="goal-amount" name="goal_amount" required>
        </div>
        <div class="form-group">
          <label for="target-date">Goal Date</label>
          <input class="form-control" type="date" id="target-date" name="target_date">
        </div>
        <div class="form-group">
          <label for="goal-type">Goal Type</label>
          <select class="form-control" id="goal-type" name="goal_type">
            <option value="">Select a goal type</option>
            ${goal_types?.map(({classifier_type: type}) => `<option value="${type}">${type}</option>`).join('')}
          </select>
        </div>
        <button class="btn btn-secondary" id="cancel-add-goal" type="button">Cancel</button>
        <button class="btn btn-primary" id="submit-add-goal" type="submit">Submit</button>
      </form>
    `;

    if(existing_goal) {
      document.getElementById('goal-name').value = existing_goal.name;
      document.getElementById('goal-amount').value = Math.round(existing_goal.goal_amount / 100).toFixed(2);
      document.getElementById('target-date').value = formatDateToYYYYMMDD(existing_goal.target_date);
      document.getElementById('goal-type').value = existing_goal.goal_type;
    }

    const form = document.getElementById('add-goal-form');
    form.addEventListener('submit', this.handleSubmit.bind(this));

    const cancel_btn = document.getElementById('cancel-add-goal');
    cancel_btn.addEventListener('click', this.handleCancel.bind(this));
  }

  handleCancel(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('cancel-add-goal', {detail: 'cancel'}));
  }

  async handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    const goal_name = document.getElementById('goal-name').value;
    const goal_amount = document.getElementById('goal-amount').value;
    const goal_date = document.getElementById('target-date').value;
    const goal_type = document.getElementById('goal-type').value;

    const goal = {
      goal_name,
      goal_amount,
      goal_date,
      goal_type,
    };

    const endpoint = `${this.input.request}${this.input.existing_goal ? `/${this.input.existing_goal.goal_id}` : ''}`;
    const response = await fetcher(endpoint, this.input.existing_goal ? 'PATCH' : 'POST', {goal: {...goal, goal_id: this.input.existing_goal?.goal_id}});

    if(response.ok) {
      const event = this.input.existing_goal ? 'edited-goal' : 'added-goal'
      this.dispatchEvent(new CustomEvent(event, {detail: {goal: {...goal, goal_id: this.input.existing_goal?.goal_id}}}));
    }
  }
}

customElements.define('add-goal-form', AddGoalForm);