import dataProvider from '@pankod/refine-simple-rest';

import { http } from '@/interfaces/http';

const BASE_URL = 'https://api.fake-rest.refine.dev';

export const appDataProvider = dataProvider(BASE_URL, http);
