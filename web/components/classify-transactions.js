import { fetcher } from '../utils.js';

export default class ClassifyTransactions extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const {title, request } = this.input;
    this.innerHTML = `
      <div class="card">
        <h1>${title}</h1>
        <div id="classify-body">
        </div>
      </div>
    `;

    const response = await fetcher(request);

    const { data } = await response?.json() || {};
    const {unknown_transactions, classifier_types} = data;

    const table = document.createElement('table-chart');
    table.input = {
      data: unknown_transactions,
      title: 'Unknown Transactions',
      columns: {
        description: 'Description',
        classifier_type: 'classifier Type',
        classifier: 'Classifier',
        classifier_descriptor: 'Classifier Descriptor',
      },
      editable_columns: {
        classifier_type: {
          type: 'select',
          options: classifier_types,
        },
        classifier: {
          type: 'text',
        },
        classifier_descriptor: {
          type: 'text',
        },
      },
      onSubmit: this.onSubmit.bind(this),
    };
    this.querySelector('#classify-body').appendChild(table);
  }

  async onSubmit (event, edited_cells) {
    const id = event.target.id;
    console.log(`Button ${id} clicked`);
    console.log('this.edited_cells', edited_cells);
    // Submit all edited cells, assuming the row (classifier and classifier_descriptor) is complete
    const classifiers_to_insert = Object.keys(edited_cells).reduce((acc, key) => {
      const [column, ledger_id] = key.split('-');
      if (!acc[ledger_id]) {
        acc[ledger_id] = {};
      }
      // Ledger_id isn't actually important, but it's a good way to keep track of which row we're editing
      acc[ledger_id][column] = edited_cells[key];
      return acc;
    }, {});
    // ensure that every object in new_classifiers has 3 keys
    Object.keys(classifiers_to_insert).forEach((key) => {
      const { classifier_type, classifier, classifier_descriptor } = classifiers_to_insert[key];

      if (!classifier_type || !classifier || !classifier_descriptor) {
        delete classifiers_to_insert[key];
      } else {
        // valid classifier. Remove its entries from edited_cells
        delete edited_cells[`classifier_type-${key}`];
        delete edited_cells[`classifier-${key}`];
        delete edited_cells[`classifier_descriptor-${key}`];
      }
    });
    if (Object.keys(classifiers_to_insert).length === 0) {
      console.log('No new classifiers to submit');
      return;
    }
    const response = await fetcher(this.input.request, 'POST', { classifiers_to_insert: Object.values(classifiers_to_insert) });
    if (!response.ok) {
      console.error('Failed to classify transaction');
    }
    const { data } = await response.json();
    return data;
  }
}

customElements.define('classify-transactions', ClassifyTransactions);
