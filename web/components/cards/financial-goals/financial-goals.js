import { fetcher } from "../../../utils.js";
import {confirm} from '../../confirmation.js';

// Components
import './components/goal-list.js';
import './components/add-goal-form.js';

/*
  The goal of this component is to recreate Digit to a degree.
  As a user, I should be able to: 
    create financial goals, 
    track my progress,
    delete goals, 
    edit goals, 
    see my progress over time, 
    associate transactions with the goal (based on classifier?)


*/

export default class FinancialGoals extends HTMLElement {
  state = {
    goals: [],
    goal_types: [],
    view: 'list',
  };

  bound = {
    handleView: this.handleView.bind(this),
    openAddGoalForm: this.openAddGoalForm.bind(this),
    handleAddGoal: this.handleAddGoal.bind(this),
    handleCancelGoal: this.handleCancelGoal.bind(this),
    handleGoalAction: this.handleGoalAction.bind(this),
    handleEditGoal: this.handleEditGoal.bind(this),
  }

  constructor() {
    super();
  }

  connectedCallback() {
    const {title, request} = this.input;
    this.innerHTML = `
      <div class="card">
        <h1 class="card-header">${title}</h1>
        <div class="class-body" id="financial-goals-body">
        </div>
      </div>
    `;

    const goals = document.getElementById('financial-goals-body');
    fetcher(request)
      .then(res => (res ? res.json() : {}))
      .then(({data = {}}) => {
        this.state.goals = data.goals;
        this.state.goal_types = data.goal_types;
        this.handleView(this.state.view);
      })        
      .catch(err => {
        console.error(err);
        goals.innerHTML = `
          <no-data>There was an error loading your goals.</no-data>
        `;
      });

    
  }

  disconnectedCallback() {
    this.handleAddGoalEventListeners(true);
    this.handleListGoalsEventListeners(true);
  }

  openAddGoalForm(update_goal) {
    const goals = document.getElementById('financial-goals-body');
    const form = document.createElement('add-goal-form');
    form.input = {
      request: this.input.request,
      goal_types: this.state.goal_types,
      existing_goal: update_goal,
    };
    goals.innerHTML = '';
    goals.appendChild(form);
    this.handleAddGoalEventListeners();
  }

  handleEditGoal(e) {
    const {goal} = e.detail;
    console.log('GOAL WAS UPDATED: ', goal);
    this.state.goals = this.state.goals.map(g => g.goal_id.toString() === goal.goal_id.toString() ? goal : g);
    this.handleView('list');
  }

  async handleDeleteGoal(goal_id) {
    const response = await fetcher(`/goals/${goal_id}`, 'DELETE');
    if(!response.ok) {
      console.error('Failed to delete the goal');
      return;
    }

    this.state.goals = this.state.goals.filter(g => g.goal_id.toString() !== goal_id.toString());
    this.handleView('list');
  }

  async handleGoalAction(e) {
    const {goal, action} = e.detail;
    if(action === 'delete') {
      // confirm the deletion
      const confirmed = await confirm({description: `You're about to delete the ${goal.goal_name} goal.`});
      if(!confirmed) {
        return;
      }
      this.handleDeleteGoal(goal.goal_id);
    } else {
      this.openAddGoalForm(goal);
    }
  }

  handleAddGoalEventListeners(drop = false) {
    const form = document.querySelector('add-goal-form');
    if(drop) {
      form?.removeEventListener('added-goal', this.bound.handleAddGoal);
      form?.removeEventListener('cancel-add-goal', this.bound.handleCancelGoal);
      form?.removeEventListener('edited-goal', this.bound.handleEditGoal);
      return;
    }
    // these are custom events emitted from the add-goal-form component
    form?.addEventListener('added-goal', this.bound.handleAddGoal);
    form?.addEventListener('cancel-add-goal', this.bound.handleCancelGoal);
    form?.addEventListener('edited-goal', this.bound.handleEditGoal)
  }

  handleListGoalsEventListeners(drop = false) {
    const add_goal_btn = document.getElementById('add-goal');
    const goal_list = document.getElementById('goal-list');
    if(drop) {
      add_goal_btn?.removeEventListener?.('click', this.bound.openAddGoalForm);
      goal_list?.removeEventListener?.('goal-action', this.bound.handleGoalAction);
      return;
    }
    add_goal_btn.addEventListener('click', this.bound.openAddGoalForm);
    goal_list.addEventListener('goal-action', this.bound.handleGoalAction);
  }

  handleAddGoal(e) {
    const { goal } = e.detail;
    this.state.goals.push(goal);
    this.handleView('list');
  }

  handleCancelGoal() {
    console.log('cancel goal');
    this.handleView('list');
  }

  handleListView() {
    this.handleAddGoalEventListeners(true);
    
    const goals = document.getElementById('financial-goals-body');
    goals.classList.add('d-flex', 'flex-column');
    const add_goal_btn = document.createElement('button');
    add_goal_btn.setAttribute('id', 'add-goal');
    add_goal_btn.classList.add('btn', 'btn-primary', 'm-2');
    add_goal_btn.innerHTML = 'Add Goal';

    
    if (!this.state.goals?.length) {
      const no_data = document.createElement('no-data');
      no_data.innerHTML = `Please add a goal to get started.`;
      goals.innerHTML = '';
      goals.appendChild(no_data);
      goals.appendChild(add_goal_btn);
    } else {
      const goal_list = document.createElement('goal-list');
      goal_list.setAttribute('id', 'goal-list');
      goal_list.input = {
        goals: this.state.goals,
        goal_types: this.state.goal_types,
      };
      goals.innerHTML = ``;
      goals.appendChild(goal_list);
      goals.appendChild(add_goal_btn);
    }
    this.handleListGoalsEventListeners();
  }

  handleView(view) {
    switch(view) {
      case 'list':
        this.handleListView();
        break;
      case 'add':
        this.openAddGoalForm();
        break;
      default:
        this.handleListView();
    }
  }
};

customElements.define('financial-goals', FinancialGoals);