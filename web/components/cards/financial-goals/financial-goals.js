import { fetcher } from "../../../utils.js";

// Components
// import './goal-list.js';
// import './add-goal-form.js';

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
    fetcher(request)
      .then(res => (res ? res.json() : {}))
      .then(({data = []}) => {
        if(!data.length) {
          goals.innerHTML = `
            <no-data>Please add a goal to get started.</no-data>
              <button id="add-goal">Add Goal</button>
          `;
        } else {
          const goal_list = document.createElement('goal-list');
          goal_list.input = {
            data,
          };
          goals.innerHTML = ``;
          goals.appendChild(goal_list);
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
            data,
          };
          goals.innerHTML = '';
          goals.appendChild(form);
        })
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