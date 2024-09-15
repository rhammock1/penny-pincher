export default class AppWrapper extends HTMLElement {
  constructor() {
    super();

    // Shadow dom
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
      <style>
        .cursor-pointer {
          cursor: pointer;
        }
      </style>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="d-flex" id="home-button"><h1 class="cursor-pointer">Penny Pincher<h1></div>
        <div class="d-flex flex-column">
          <div class="btn-link cursor-pointer" id="goals-button">Financial Goals</div>
          <div class="btn-link cursor-pointer" id="connect-button">Connect Services</div>
          <div class="btn-link cursor-pointer" id="classify-button">Classify</div>
          <!-- <div class="header_menu_item" id="upload-button">Upload Transactions</div> -->
        </div>
      </div>
      <slot></slot>
      <footer class="mt-auto w-100 text-center" id="footer">
        &copy; ${new Date().getFullYear()} smokeybear.dev
      </footer>
    `;
  }

  connectedCallback() {
    this.shadowRoot.getElementById('classify-button')?.addEventListener('click', (e) => this.toggleView(e, 'classify'));
    this.shadowRoot.getElementById('connect-button')?.addEventListener('click', (e) => this.toggleView(e, 'connect'));
    this.shadowRoot.getElementById('home-button')?.addEventListener('click', (e) => this.toggleView(e, 'home'));
    this.shadowRoot.getElementById('goals-button')?.addEventListener('click', (e) => this.toggleView(e, 'goals'));
  }

  disconnectedCallback() {
    this.shadowRoot.getElementById('classify-button')?.removeEventListener('click', this.toggleView);
    this.shadowRoot.getElementById('connect-button')?.removeEventListener('click', this.toggleView);
    this.shadowRoot.getElementById('home-button')?.removeEventListener('click', this.toggleView);
    this.shadowRoot.getElementById('goals-button')?.removeEventListener('click', this.toggleView);
  }

  toggleView(e, view) {
    e.stopPropagation();
    e.preventDefault();

    this.dispatchEvent(new CustomEvent('toggle-view', {detail: {view}}));
  }
}

customElements.define('app-wrapper', AppWrapper);
