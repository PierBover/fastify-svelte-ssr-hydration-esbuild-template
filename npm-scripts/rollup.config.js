import fs from 'fs';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {terser} from 'rollup-plugin-terser';

const filenames = fs.readdirSync('.client-hydration-scripts').filter(filename => filename.includes('.js'));
const entries = filenames.map(filename => `.client-hydration-scripts/${filename}`);

export default {
	input: entries,
	output: {
		dir: 'src/static/build/components',
		entryFileNames: '[name]-[hash].js',
		chunkFileNames: 'Common-[hash].js'
	},
	plugins: [
		svelte({
			compilerOptions: {
				dev: false,
				hydratable: true,
				css: false
			}
		}),
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		terser()
	]
};