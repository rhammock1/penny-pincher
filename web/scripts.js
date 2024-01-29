
import cards from './cards.js';
import { interpolate, request, formatTitleAsId } from './utils.js';

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

      const success = await this.getCardsData(true);
      success.forEach(({ response, card_id }) => {
        this.setCardData(response, card_id);
      });
    });

    document.querySelector('app-wrapper').addEventListener('toggle-view', (e) => {
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

    const successful_requests = await this.getCardsData();

    const dashboard = document.getElementById('dashboard');
    for (const res of successful_requests) {
      const {response, card_id} = res;
      const card = this.cards.find(card => formatTitleAsId(card.title) === card_id);
      const cardElement = document.createElement(card.component);
      const title = interpolate(card.title, this.state);
      cardElement.classList.add('card');
      const element_id = `${card.component}-${formatTitleAsId(card.title)}`
      cardElement.setAttribute('id', element_id);
      
      
      cardElement.input = {
        id: element_id,
        data: response,
        title,
        template_title: card.title,
        graphs: card.graphs,
      };

      dashboard.appendChild(cardElement);
    }
  }

  /**
   * @description Gets data for all cards based on the cards request property and the current state.
   * @param {boolean} date_change_only - If true, only cards that are affected by a date change will be updated.
   * @returns {Promise<Array<{response: object, ok: boolean, card_id: string}>>} - An array of objects containing successful responses
   */
  async getCardsData(date_change_only = false) {
    const requests = {};
    let responses = [];
    try {
      for(const card of this.cards) {
        if(!card.visible) {
          // Skip hidden cards
          continue;
        }
        requests[formatTitleAsId(card.title)] = interpolate(card.request, this.state);
      }

      responses = await Promise.all(Object.keys(requests).map(async (key) => {
        const response = await request(requests[key]);
        if(!response.ok) {
          console.error(`[${requests[key]}] Error fetching data:`, response);
          return {
            response: [],
            ok: false,
            card_id: key,
          };
        }
        const {data} = await response.json();
        return {
          response: data,
          ok: response.ok,
          card_id: key,
        };
      }));

      const erroredRequests = responses.filter(res => !res.ok);
      if (erroredRequests.length) {
        console.error('Error fetching data:', JSON.stringify(erroredRequests));
      }

    } catch (e) {
      console.error('Error parsing data:', e);
    }

    return responses.filter(res => res.ok);
  }

  setCardData(data, card_id) {
    const card = this.cards.find(card => formatTitleAsId(card.title) === card_id);

    const cardElement = document.getElementById(`${card.component}-${card_id}`);
    if(card.date_selector) {;
      cardElement.setAttribute('data-start-date', this.state.start_date);
      cardElement.setAttribute('data-end-date', this.state.end_date);
    }
  
    cardElement.input = {
      data: typeof card.format === 'function' ? card.format(data) : data,
      title: interpolate(card.title, this.state),
      template_title: card.title,
    };
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
    } else if(view === 'classify') {
      const classify_card = this.cards.find(card => card.title === 'Classify Transactions');
      const response = await request(classify_card.request);
      if (!response.ok) {
        console.error(`[${classify_card.request}] Error fetching data:`, response);
        return;
      }
      const { data } = await response.json();
      const classify = document.createElement(classify_card.component);
      classify.input = {
        title: classify_card.title,
        classifier_types: data?.classifier_types,
        unknown_transactions: data?.unknown_transactions,
        post_url: classify_card.request,
      };

      dashboard.appendChild(classify);
    } else if(view === 'connect') {
      const connect_card = this.cards.find(card => card.title === 'Connect Accounts');
      console.log('CONNECT CARD', connect_card);
      const connect = document.createElement(connect_card.component);
      const response = await request(connect_card.request);
      if (!response.ok) {
        console.error(`[${connect_card.request}] Error fetching data:`, response);
        return;
      }
      const { data } = await response.json();
      connect.input = {
        title: connect_card.title,
        data,
      };

      console.log('CONNECT', connect, data);

      dashboard.appendChild(connect);
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const app = new BudgetApp();
  app.init();
});
