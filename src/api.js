function parseApiBody(response) {
  let body = response && response.data ? response.data.body : response;
  if (typeof body === 'string') {
    body = JSON.parse(body);
  }
  return body || {};
}

function metadataUrl(apiRootEndpoint, userId) {
  return apiRootEndpoint + '/users/' + userId + '/metadata/itempref';
}

function orgQuery(organizationId) {
  return [{ key: 'organization_id', value: String(organizationId) }];
}

function parseJson(value) {
  if (typeof value !== 'string') {
    return value;
  }
  let text = value.trim();
  if (!text || (text.charAt(0) !== '{' && text.charAt(0) !== '[' && text.charAt(0) !== '"')) {
    return value;
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    return value;
  }
}

function readSavedKeys(body) {
  let source = body || {};
  let data = source;

  if (source.metadata) {
    data = source.metadata.data || source.metadata.JSONString || source.metadata;
  } else if (source.data) {
    data = source.data.JSONString || source.data;
  }

  data = parseJson(data);
  if (data && data.JSONString) {
    data = parseJson(data.JSONString);
  }
  if (data && data.data && data.columns === undefined && !data.length) {
    data = parseJson(data.data);
  }
  if (data && data.columns !== undefined) {
    data = parseJson(data.columns);
  }

  if (typeof data === 'string') {
    return data.split(',').map(function (part) {
      return part.trim();
    }).filter(function (part) {
      return part;
    });
  }

  if (data && typeof data.length === 'number') {
    return Array.prototype.map.call(data, function (key) {
      return String(key);
    });
  }

  if (data && typeof data === 'object') {
    let keys = Object.keys(data);
    let numeric = keys.length > 0 && keys.every(function (key) {
      return String(Number(key)) === String(key);
    });
    if (numeric) {
      keys.sort(function (a, b) {
        return Number(a) - Number(b);
      });
      return keys.map(function (key) {
        return String(data[key]);
      });
    }
  }

  return null;
}

export function loadColumnPrefs(apiRootEndpoint, organizationId, userId) {
  return window.ZFAPPS.request({
    url: metadataUrl(apiRootEndpoint, userId),
    method: 'GET',
    connection_link_name: 'get_items',
    url_query: orgQuery(organizationId)
  }).then(function (response) {
    let body = parseApiBody(response);
    let keys = readSavedKeys(body);
    console.log('column pref GET response', response);
    console.log('column pref GET parsed body', body);
    console.log('column pref GET keys used for the table', keys);
    return keys;
  });
}

export function saveColumnPrefs(apiRootEndpoint, organizationId, userId, keys) {
  let payload = JSON.stringify({ columns: keys });
  console.log('column pref PUT keys sent', keys);
  console.log('column pref PUT JSONString', payload);

  return window.ZFAPPS.request({
    url: metadataUrl(apiRootEndpoint, userId),
    method: 'PUT',
    connection_link_name: 'get_items',
    url_query: orgQuery(organizationId),
    body: {
      mode: 'formdata',
      formdata: [
        {
          key: 'JSONString',
          value: payload
        }
      ]
    }
  }).then(function (response) {
    console.log('column pref PUT response', response);
    console.log('column pref PUT parsed body', parseApiBody(response));
    return response;
  });
}

export function searchItems(apiRootEndpoint, organizationId, filters, currentPage) {
  let query = [
    { key: 'page', value: String(currentPage) },
    { key: 'per_page', value: '25' },
    { key: 'sort_column', value: 'created_time' },
    { key: 'sort_order', value: 'D' },
    { key: 'organization_id', value: String(organizationId) }
  ];

  Object.keys(filters).forEach(function (name) {
    if (filters[name]) {
      query.push({ key: name, value: filters[name] });
    }
  });

  return window.ZFAPPS.request({
    url: apiRootEndpoint + '/items',
    method: 'GET',
    connection_link_name: 'get_items',
    url_query: query
  }).then(function (response) {
    let body = parseApiBody(response);
    return {
      items: body.items || [],
      hasMore: Boolean(body.page_context && body.page_context.has_more_page)
    };
  });
}

export function addItemsToInvoice(lineItems) {
  return window.ZFAPPS.set('invoice.line_items', lineItems);
}
