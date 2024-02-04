
import cards from './cards.js';
import { interpolate, fetcher, formatTitleAsId } from './utils.js';

class BudgetApp {
  state = {};

  cards = cards;

  constructor() {
    this.state = {
      granularity: 'month',
      start_date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      view: 'home',
    };

    const start_date = document.getElementById('start-date-pick');
    const end_date = document.getElementById('end-date-pick');

    start_date.value = this.state.start_date;
    end_date.value = this.state.end_date;

    start_date.addEventListener('change', (e) => {
      e.stopPropagation();
      e.preventDefault();

      this.state.start_date = e.target.value;
    });
    end_date.addEventListener('change', (e) => {
      e.stopPropagation();
      e.preventDefault();

      this.state.end_date = e.target.value;
    });
    document.getElementById('date-submit').addEventListener('click', async (e) => {
      e.stopPropagation();
      e.preventDefault();

      for(const card of this.cards) {
        if(!card.visible) {
          return;
        }
        const el_id = `${card.component}-${formatTitleAsId(card.title)}`;
        const el = document.getElementById(`${card.component}-${formatTitleAsId(card.title)}`);
        el.input = {
          ...card,
          template_title: card.title,
          title: interpolate(card.title, this.state),
          id: el_id,
        };
        el.setAttribute('data-start-date', this.state.start_date);
        el.setAttribute('data-end-date', this.state.end_date);
      }
    });

    document.querySelector('app-wrapper').addEventListener('toggle-view', (e) => {
      if(this.state.view === e.detail.view) {
        // Don't do anything if we're already on the view
        return;
      }
      this.state.view = e.detail.view;
      this.toggleView();
    });
  }

  async init() {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const view = params.get('view');
    if(view) {
      this.state.view = view;
      this.toggleView();
      return;
    }

    const dashboard = document.getElementById('dashboard');
    for(const card of this.cards) {
      if(!card.visible) {
        return;
      }

      const card_el = document.createElement(card.component);
      card_el.classList.add('card');
      const el_id = `${card.component}-${formatTitleAsId(card.title)}`;
      card_el.input = {
        id: el_id,
        template_title: card.title,
        title: interpolate(card.title, this.state),
        ...card,
      }
      card_el.setAttribute('id', el_id);
      card_el.setAttribute('data-start-date', this.state.start_date);
      card_el.setAttribute('data-end-date', this.state.end_date);

      dashboard.appendChild(card_el);
    }
  }

  async toggleView() {
    const {view} = this.state;

    // Clear any view params from the URL
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.delete('view');
    url.search = params.toString();
    window.history.replaceState({}, '', url.toString());

    const dashboard = document.getElementById('dashboard');
    dashboard.innerHTML = '';

    if(view === 'home') {
      this.init();
    } else if(view === 'classify' || view === 'connect' || view === 'goals') {
      const card = this.cards.find(card => card.view === view);
      const card_el = document.createElement(card.component);
      card_el.input = {
        title: card.title,
        request: card.request,
      };
      dashboard.appendChild(card_el);
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const app = new BudgetApp();
  app.init();
});
