export default class Confirmation extends HTMLElement {
  modal = null;

  constructor() {
    super();
  }

  connectedCallback() {
    const {title = 'Are you sure?', description = '', show, onConfirm} = this.input;
    this.innerHTML = `
      <div class="modal fade" id="confirmation-modal" tabindex="-1" aria-labelledby="confirmation_modal_label" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="confirmation_modal_lable">${title}</h1>
              <button type="button" class="btn-close" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ${description}
            </div>
            <div class="modal-footer">
              <button id="confirmation-cancel" type="button" class="btn btn-secondary">Cancel</button>
              <button id="confirmation-confirm" type="button" class="btn btn-primary">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const modalEl = document.getElementById('confirmation-modal');
    this.modal = new bootstrap.Modal(modalEl);
    document.getElementById('confirmation-cancel').addEventListener('click', () => {
      this.modal.hide();
      onConfirm(false);
    });
    document.getElementById('confirmation-confirm').addEventListener('click', () => {
      this.modal.hide()
      onConfirm(true);
    });

    if(show) {
      this.modal.show();
    }
  }
}

export function confirm({title, description}) {
  return new Promise((resolve, reject) => {
    const app_body = document.getElementById('app-body');
    const confirmation = document.createElement('confirm-modal');
    confirmation.input = {
      title, 
      description, 
      show: true,
      onConfirm: (confirmed) => resolve(confirmed),
    };
    app_body.prepend(confirmation);

    // const modalEl = document.getElementById('confirmation-modal');
    // console.log('bootstrap', bootstrap);
    // // this.modal = new bootstrap.Modal(modalEl);
    // // this.modal.show();
  });
}

customElements.define('confirm-modal', Confirmation);
