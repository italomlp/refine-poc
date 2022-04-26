/* eslint-disable no-underscore-dangle */
import { DataProvider } from '@pankod/refine-core';
import { stringify } from 'query-string';

import { http as httpClient } from '@/interfaces/http';

const BASE_URL = 'http://localhost:8000';

const SimpleRestDataProvider = (apiUrl: string): DataProvider => ({
  getApiUrl: () => apiUrl,
  create: async ({ resource, variables }) => {
    const url = `${apiUrl}/${resource}/`;

    const { data } = await httpClient.post(url, variables);

    return {
      data,
    };
  },
  createMany: async ({ resource, variables }) => {
    const response = await Promise.all(
      variables.map(async param => {
        const { data } = await httpClient.post(`${apiUrl}/${resource}/`, param);
        return data;
      })
    );

    return { data: response };
  },
  deleteOne: async ({ resource, id }) => {
    const url = `${apiUrl}/${resource}/${id}/`;

    const { data } = await httpClient.delete(url);

    return {
      data,
    };
  },
  deleteMany: async ({ resource, ids }) => {
    const response = await Promise.all(
      ids.map(async id => {
        const { data } = await httpClient.delete(
          `${apiUrl}/${resource}/${id}/`
        );
        return data;
      })
    );
    return { data: response };
  },
  update: async ({ resource, id, variables }) => {
    const url = `${apiUrl}/${resource}/${id}/`;

    const { data } = await httpClient.patch(url, variables);

    return {
      data,
    };
  },
  updateMany: async ({ resource, ids, variables }) => {
    const response = await Promise.all(
      ids.map(async id => {
        const { data } = await httpClient.patch(
          `${apiUrl}/${resource}/${id}/`,
          variables
        );
        return data;
      })
    );

    return { data: response };
  },
  getOne: async ({ resource, id }) => {
    const url = `${apiUrl}/${resource}/${id}/`;

    const { data } = await httpClient.get(url);

    return {
      data,
    };
  },
  getMany: async ({ resource, ids }) => {
    const { data } = await httpClient.get(
      `${apiUrl}/${resource}/?${stringify({ id: ids })}`
    );

    return {
      data,
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getList: async ({ resource, pagination, filters, sort }) => {
    const url = `${apiUrl}/${resource}/`;

    if (resource === 'roles') {
      return {
        data: [
          { id: 1, name: 'Admin' },
          { id: 2, name: 'Editor' },
          { id: 3, name: 'Mocked' },
        ],
        total: 3,
      };
    }

    const { data, headers } = await httpClient.get(`${url}`);

    const total = +headers['x-total-count'];

    return {
      data,
      total,
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  custom: async ({ url, method, filters, sort, payload, query, headers }) => {
    let requestUrl = url.startsWith('http') ? `${url}` : `${apiUrl}/${url}`;

    if (query) {
      requestUrl = `${requestUrl}?${stringify(query)}`;
    }

    if (headers) {
      httpClient.defaults.headers = {
        ...httpClient.defaults.headers,
        ...headers,
      };
    }

    let axiosResponse;
    switch (method) {
      case 'put':
      case 'post':
      case 'patch':
        axiosResponse = await httpClient[method](requestUrl, payload);
        break;
      case 'delete':
        axiosResponse = await httpClient.delete(requestUrl);
        break;
      default:
        axiosResponse = await httpClient.get(requestUrl);
        break;
    }

    const { data } = axiosResponse;

    return Promise.resolve({ data });
  },
});

export const appDataProvider = SimpleRestDataProvider(BASE_URL);
