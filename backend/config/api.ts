import type { Core } from '@strapi/strapi';

const config: Core.Config.Api = {
  rest: {
    defaultLimit: 1000,
    maxLimit: -1,
  },
};

export default config;
