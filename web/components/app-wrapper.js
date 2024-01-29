export default class AppWrapper extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Shadow dom
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .header_title {
          margin: 0;
        }

        .header_menu {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header_menu_item {
          margin-left: 10px;
        }

        footer {
          display: flex;
          width: 100%;
          justify-content: center;
        }
      </style>
      <div class="header">
        <div class="header_title" id="home-button">Budget</div>
        <div class="header_menu">
          <div class="header_menu_item" id="connect-button">Connect Services</div>
          <div class="header_menu_item" id="classify-button">Classify</div>
          <!-- <div class="header_menu_item" id="upload-button">Upload Transactions</div> -->
        </div>
      </div>
      <slot></slot>
      <footer id="footer">
      </footer>
    `;

    this.shadowRoot.getElementById('footer').innerHTML = `&copy; ${new Date().getFullYear()} smokeybear.dev`;

    this.shadowRoot.getElementById('classify-button')?.addEventListener('click', (e) => this.toggleView(e, 'classify'));
    this.shadowRoot.getElementById('connect-button')?.addEventListener('click', (e) => this.toggleView(e, 'connect'));
    this.shadowRoot.getElementById('home-button')?.addEventListener('click', (e) => this.toggleView(e, 'home'));
  }

  toggleView(e, view) {
    e.stopPropagation();
    e.preventDefault();

    this.dispatchEvent(new CustomEvent('toggle-view', {detail: {view}}));
  }
}

customElements.define('app-wrapper', AppWrapper);
