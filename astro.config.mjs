// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { remarkReadingTime } from './astro-plugins/remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.algogrit.com',
  integrations: [mdx(), sitemap(), react()],

  vite: {
    plugins: [tailwindcss()],
  },
    markdown: {
    remarkPlugins: [remarkReadingTime],
  },
});
