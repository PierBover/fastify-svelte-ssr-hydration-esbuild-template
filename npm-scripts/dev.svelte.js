import path from 'path';
import rimraf from 'rimraf';
import chokidar from 'chokidar';
import esbuild from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
import {globPlugin} from 'esbuild-plugin-glob';

import {
	createAllHydrationScripts,
	createAllRouteWrapperComponents,
	createRouteWrapperComponent,
	createHydrationScript,
	onDeleteRouteComponent
} from './svelte.utils.js';

const LOG = process.env.LOG === 'true';
const logLevel = LOG ? 'info' : 'warning';

const buildPathClient = 'src/static/build/components';
const buildPathSsr = 'src/ssr';

rimraf.sync(buildPathClient);
rimraf.sync(buildPathSsr);

const chokidarWatcher = chokidar.watch('src/components/routes/*.svelte', {
	ignored: /(^|[\/\\])\../,
	ignoreInitial: true
});

createAllRouteWrapperComponents();
createAllHydrationScripts();

// We need Chokidar in case we add or delete components to the routes folder
chokidarWatcher
.on('add', (addedPath) => {
	createRouteWrapperComponent(path.basename(addedPath));
	createHydrationScript(path.basename(addedPath));
})
.on('unlink', (deletedPath) => {
	onDeleteRouteComponent(path.basename(deletedPath));
});

// CLIENT HYDRATION SCRIPTS

esbuild.build({
	entryPoints: ['.client-hydration-scripts/*.js'],
	bundle: true,
	outdir: buildPathClient,
	plugins: [
		globPlugin(),
		sveltePlugin({
			compilerOptions: {
				css: false,
				hydratable: true
			}
		})
	],
	minify: false,
	incremental: true,
	watch: {
		onRebuild(error, result) {
			if (error) console.error('SVELTE CLIENT watch build failed:', error)
		}
	},
	logLevel
});

// SSR NODE MODULES

esbuild.build({
	entryPoints: ['.route-wrappers-components/*.svelte'],
	bundle: true,
	outdir: buildPathSsr,
	platform: 'node',
	format: 'esm',
	plugins: [
		globPlugin(),
		sveltePlugin({
			compilerOptions: {
				css: false,
				generate: 'ssr'
			}
		})
	],
	minify: false,
	incremental: true,
	watch: {
		onRebuild(error, result) {
			if (error) console.error('SVELTE SSR watch build failed:', error)
		}
	},
	logLevel
});