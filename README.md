# Vaadin React components

React wrappers for Vaadin components.

## Development has moved to vaadin/web-components

From **Vaadin 25.4** onwards the React components are developed and released as part of the
web components monorepo, in the [vaadin/web-components](https://github.com/vaadin/web-components)
repository:

* `@vaadin/react-components`: [`packages/react-components/`](https://github.com/vaadin/web-components/tree/main/packages/react-components)
* `@vaadin/react-components-pro`: [`packages/react-components-pro/`](https://github.com/vaadin/web-components/tree/main/packages/react-components-pro)
* the wrapper generator, build, tests and dev pages: [`react/`](https://github.com/vaadin/web-components/tree/main/react)

The packages keep their names and follow the web components version numbering, so a new
`@vaadin/react-components` is published with every web components release. The sources were
ported without their git history, so `git log` and `git blame` for the earlier versions stay here.

**Please open issues and pull requests for Vaadin 25.4 and later in
[vaadin/web-components](https://github.com/vaadin/web-components/issues).** This tracker stays open
for the versions listed below.

## Branches for earlier Vaadin versions

Vaadin 25.3 and earlier are still served from this repository. Each branch is released with the
matching web components version:

* `25.3` for Vaadin 25.3, the latest stable line
* `25.0`, `25.1`, `25.2` for Vaadin 25.0 to 25.2
* `24.4` to `24.10` for Vaadin 24.4 to 24.10
* `2.0` to `2.3`, published as `@hilla/react-components` 2.x, for Vaadin 24.0 to 24.3
* `1.3` to `1.6`, published as `@hilla/react-components` 1.x, for Vaadin 23.3 to 23.6, for example `1.6` for Vaadin 23.6

`main` holds the last 25.4 pre-release built here and is no longer released.

## Using Local React Components in a Vaadin Project

When developing React components locally, you may want to test your changes in a Vaadin application. To configure an application to import React components from a local repository, add this Vite plugin to the app's `vite.config.ts`:

```ts
function useLocalReactComponents(nodeModules: string): PluginOption {
  return {
    name: 'use-local-react-components',
    enforce: 'pre',
    config(config) {
      config.server ??= {};
      config.server.fs ??= {};
      config.server.fs.allow ??= [];
      config.server.fs.allow.push(nodeModules);
      config.server.watch ??= {};
      config.server.watch.ignored = [`!${nodeModules}/**`];
      config.optimizeDeps ??= {};
      config.optimizeDeps.exclude = [
        ...(config.optimizeDeps.exclude ?? []),
        '@vaadin/react-components',
        '@vaadin/react-components-pro',
      ];
    },
    resolveId(id) {
      if (/^(@vaadin|@polymer)/.test(id)) {
        return this.resolve(path.join(nodeModules, id));
      }
    },
  };
}

const customConfig: UserConfigFn = (env) => ({
  plugins: [useLocalReactComponents('/path/to/react-components/node_modules')],
});

export default overrideVaadinConfig(customConfig);
```
