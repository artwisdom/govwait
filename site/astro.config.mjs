import { defineConfig } from 'astro/config';
import config from './site.config.json' with { type: 'json' };

export default defineConfig({
  site: process.env.SITE_URL || config.SITE_URL,
  trailingSlash: 'always',
  build: { format: 'directory' },
});
