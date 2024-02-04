export default class NoData extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <div class="no-data">
        <slot>No Data</slot>
      </div>
    `;
  }
}

customElements.define('no-data', NoData);
