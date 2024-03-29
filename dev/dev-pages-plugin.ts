import { readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'path';
import type { ViteDevServer } from 'vite';
import { fileURLToPath } from 'node:url';

const dev = dirname(fileURLToPath(import.meta.url));

const indexFile = await readFile(resolve(dev, 'index.html'), 'utf8');
const pageFile = await readFile(resolve(dev, 'page.html'), 'utf8');

function toDashCase(camelCase: string): string {
  return camelCase
    .split(/(?=[A-Z])/)
    .map((item) => item.toLowerCase())
    .join('-');
}

function removeTrailinsSlash(path: string): string {
  return path.replace(/\/$/, '');
}

export default () => ({
  name: 'dev-pages-plugin',
  configureServer(server: ViteDevServer) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url || req.url.includes('kitchen-sink')) {
        next();
        return;
      }

      const components = (await readdir(resolve(dev, 'pages')))
        .filter((file) => file.endsWith('.tsx'))
        .map((file) => file.replace('.tsx', ''));

      const path = removeTrailinsSlash(req.url.split('/index.html')[0]);

      if (path === '/dev') {
        // Generate the index page
        const listing = `
          <ul id="listing">
            ${components
              .map((component) => `<li><a href="/dev/${toDashCase(component)}/">${component}</a></li>`)
              .join('')}
          </ul>`;
        const indexFileResult = indexFile.replace(/<ul id="listing">.*<\/ul>/u, listing);
        const result = await server.transformIndexHtml(String(req.url), indexFileResult);
        res.end(result);
        return;
      } else if (/^\/dev\/[a-z-]+$/u.test(path)) {
        // Generate a component dev page
        const component = components.find((component) => toDashCase(component) === path.split('/').pop());
        const pageFileResult = pageFile.replaceAll(/{component}/g, component!);
        const result = await server.transformIndexHtml(String(req.url), pageFileResult);
        res.end(result);
        return;
      }
      next();
    });
  },
});
