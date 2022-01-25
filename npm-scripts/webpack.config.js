import fs from 'fs';
import {join, resolve} from 'path';

const filenames = fs.readdirSync('.client-hydration-scripts').filter(filename => filename.includes('.js'));
const entries = {};

filenames.forEach(filename => {
	entries[filename] = resolve(`.client-hydration-scripts/${filename}`);
});

export default {
	devtool: false,
	entry: entries,
	resolve: {
		alias: {
			svelte: resolve('node_modules', 'svelte')
		}
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					chunks: "all",
					minChunks: 2,
					minSize: 0,
					name: "core"
				},
				vendor: {
					test: /node_modules/,
					chunks: "all",
					name: "vendor",
					priority: 10,
					enforce: true,
					minSize: 0,
					minChunks: 2
				}
			}
		}
	},
	mode: 'production',
	output: {
		path: resolve('src/static/build/components'),
		filename: '[name]-[fullhash].js',
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						compilerOptions: {
							css: false,
							hydratable: true
						}
					}
				}
			}
		]
	},
	plugins: []
}