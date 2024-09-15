import { fetcher } from "../../utils.js";

export default class ServiceEnrollment extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const { title, request } = this.input;
    this.innerHTML = `
      <div class="card">
        <h1 class="card-header">${title}</h1>
        <div class="card-body d-flex flex-column" id="available-services-body">
        </div>
      </div>
    `;

    fetcher(request)
      .then(res => res.json())
      .then(({data}) => this.generateEnrollmentCard(data));
  }

  generateEnrollmentCard(available_services) {
    const services_list = document.querySelector('#available-services-body');
    for (const service of available_services) {

      const service_item = document.createElement('div');
      service_item.id = `${service}-item`;
      service_item.classList.add('btn', 'btn-primary', 'm-2');

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
