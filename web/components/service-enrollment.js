export default class ServiceEnrollment extends HTMLElement {
  constructor() {
    super();
    console.log('constructor');
  }

  connectedCallback() {
    console.log('connectedCallback');
    const { title, data: available_services } = this.input;
    this.innerHTML = `
      <div class="card">
        <h1>${title}</h1>
        <div id="available-services-body">
        </div>
      </div>
    `;

    const services_list = document.querySelector('#available-services-body');
    for(const service of available_services) {

      const service_item = document.createElement('div');
      service_item.id = `${service}-item`;
      service_item.classList.add('container_body_item');

      service_item.textContent = `${service}`;
      service_item.addEventListener('click', this.handleServiceClick.bind(this, service));

      services_list.appendChild(service_item);
    }
  }

  handleServiceClick(service) {
    const redirectUrl = encodeURIComponent(`${window.location.href}?view=connect`);
    window.location.href = `/enrollment/${service}?redirect=${redirectUrl}`;
  }
}

customElements.define('service-enrollment', ServiceEnrollment);
