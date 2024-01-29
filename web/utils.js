export function interpolate(str, state) {
  return str.replace(/\{\{([^}]+)\}\}/g, (m, key) => Object.keys(state).includes(key) ? state[key] : m);
}

export function getTemplateFromRequest(request_url) {
  // EX: We need to get this '/spending/date?start_date={{start_date}}&end_date={{end_date}}'
  // From this '/spending/date?start_date=2021-01-01&end_date=2021-01-31'
  const [endpoint, query] = request_url.split('?');
  if(query?.length) {
    const template = query.split('&').reduce((acc, curr) => {
      const [key] = curr.split('=');
      acc = acc || `${endpoint}?`;

      acc += `${acc.endsWith('?') ? `${key}={{${key}}}` : `&${key}={{${key}}}`}`;
  
      return acc;
    }, '');
  
    return template;
  } else {
    return endpoint;
  }
}

/**
 * @description Make a request to the server.
 * @param {string} path 
 * @param {string} method 
 * @param {object} body 
 * @returns response
 */
export async function request(path, method = 'GET', body = {}) {
  const response = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: method === 'GET' ? undefined : JSON.stringify(body),
  });
  return response;
}

export function formatTitleAsId(title) {
  return title.replaceAll(' ', '').toLowerCase();
}

export function setLoading(element_id, loading) {
  const el = document.getElementById(element_id);
  if (loading) {
    el.classList.add('loading');
  } else {
    el.classList.remove('loading');
  }
}

export const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
