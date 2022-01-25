import fs from 'fs';
import rimraf from 'rimraf';

const routesPath = 'src/components/routes';
const wrappersPath = '.route-wrappers-components';
const hydrationScriptsPath = '.client-hydration-scripts';

export function createAllRouteWrapperComponents () {

	console.log('Creating wrapper components...');

	if (fs.existsSync(wrappersPath)) rimraf.sync(wrappersPath);
	fs.mkdirSync(wrappersPath);

	const filenames = fs.readdirSync(routesPath).filter(filename => filename.includes('.svelte'));

	filenames.forEach((filename) => createRouteWrapperComponent(filename));
}

export function createRouteWrapperComponent (filename) {

	console.log('Creating wrapper component for', filename);

	const fileContents = `
		<script>
			import {setContext} from 'svelte';
			import Route from '../src/components/routes/${filename}';
			export let routeData;
			setContext('routeData', routeData);
		</script>
		<Route/>
	`;

	fs.writeFileSync(`${wrappersPath}/${filename}`, fileContents, 'utf8');
}

export function createAllHydrationScripts () {

	console.log('Creating all hydration scripts...');

	if (fs.existsSync(hydrationScriptsPath)) rimraf.sync(hydrationScriptsPath);
	fs.mkdirSync(hydrationScriptsPath);

	const filenames = fs.readdirSync(wrappersPath).filter(filename => filename.includes('.svelte'));

	filenames.forEach((filename) => createHydrationScript(filename));
}

export function createHydrationScript (filename) {

	console.log('Creating hydration script for', filename);

	const fileContents = `
		import Route from '../${wrappersPath}/${filename}';
		const routeData = JSON.parse(document.getElementById('hydration-data-json').text);

		new Route({
			target: document.body,
			hydrate: true,
			props: {routeData}
		});
	`;

	const componentName = filename.replace('.svelte', '');

	fs.writeFileSync(`${hydrationScriptsPath}/${componentName}.js`, fileContents, 'utf8');
}

export function onDeleteRouteComponent (filename) {
	const componentName = filename.replace('.svelte', '');
	fs.unlinkSync(`${wrappersPath}/${filename}`);
	fs.unlinkSync(`${hydrationScriptsPath}/${componentName}.js`);
}