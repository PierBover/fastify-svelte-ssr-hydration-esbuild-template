import rimraf from 'rimraf';

import {
	createAllHydrationScripts,
	createAllRouteWrapperComponents
} from './svelte.utils.js';

import {
	writeComponentsFile,
	compileScss
} from './css.utils.js'

rimraf.sync('src/static/build');

// CSS
writeComponentsFile();
compileScss(true);

// SVELTE SSR
createAllRouteWrapperComponents();

// SVELTE HYDRATION
createAllHydrationScripts();