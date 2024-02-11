import { fetcher } from "../../../utils.js";

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

  };

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

    const add_goal_btn = document.createElement('button');
    add_goal_btn.setAttribute('id', 'add-goal');
    add_goal_btn.innerHTML = 'Add Goal';
    fetcher(request)
      .then(res => (res ? res.json() : {}))
      .then(({data = {}}) => {
        if(!data?.goals?.length) {
          const no_data = document.createElement('no-data');
          no_data.innerHTML = `Please add a goal to get started.`;
          goals.innerHTML = '';
          goals.appendChild(no_data);
          goals.appendChild(add_goal_btn);
        } else {
          const goal_list = document.createElement('goal-list');
          goal_list.input = {
            goals: data?.goals,
          };
          goals.innerHTML = ``;
          goals.appendChild(goal_list);
          goals.appendChild(add_goal_btn);
        }
        return data
      })
      .then((data) => {
        const add_goal_btn = document.getElementById('add-goal');
        add_goal_btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          const form = document.createElement('add-goal-form');
          form.input = {
            request,
            goal_types: data.goal_types,
          };
          goals.innerHTML = '';
          goals.appendChild(form);

          form.addEventListener('added-goal', (e) => {
            const { goal } = e.detail;
            this.state.goals.push(goal);
          });
          form.addEventListener('cancel-add-goal', (e) => {
            goals.innerHTML = '';
            if(!data?.goals?.length) {
              const no_data = document.createElement('no-data');
              no_data.innerHTML = `Please add a goal to get started.`;
              goals.appendChild(no_data);
            } else {
              const goal_list = document.createElement('goal-list');
              goal_list.input = {
                goals: data?.goals,
              };
              goals.appendChild(goal_list);
            }
            goals.appendChild(add_goal_btn);
          });
        });
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