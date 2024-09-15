import {fetcher} from '../../../../utils.js';

export class AddGoalForm extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const {goal_types} = this.input;

    console.log('goal types', goal_types);
    this.innerHTML = `
      <form class="m-2" id="add-goal-form">
        <div class="form-group">
          <label for="goal-name">Goal Name</label>
          <input class="form-control" type="text" id="goal-name" name="name" required>
          <label for="short-name">Short Name</label>
          <input class="form-control" type="text" id="short-name" name="short_name" required>
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
    const short_name = document.getElementById('short-name').value;
    const goal_type = document.getElementById('goal-type').value;

    const goal = {
      goal_name,
      goal_amount,
      goal_date,
      short_name,
      goal_type,
    };

    const response = await fetcher(this.input.request, 'POST', goal);

    if(response.ok) {
      this.dispatchEvent(new CustomEvent('added-goal', {detail: goal}));
    }
  }
}

customElements.define('add-goal-form', AddGoalForm);