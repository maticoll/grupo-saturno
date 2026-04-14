import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import alpinejs from '@astrojs/alpinejs';

export default defineConfig({
  site: 'https://gruposaturno.com.uy',
  output: 'static',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({ i18n: { defaultLocale: 'es', locales: { es: 'es-UY', en: 'en', zh: 'zh-CN' } } }),
    alpinejs({ entrypoint: '/src/entrypoints/alpine.ts' }),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'zh'],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
