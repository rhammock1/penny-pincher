export default class NoData extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = '<div>No data</div>';
  }
}

customElements.define('no-data', NoData);
