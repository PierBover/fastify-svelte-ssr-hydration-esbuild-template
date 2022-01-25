import chokidar from 'chokidar';
import rimraf from 'rimraf';

import {
	writeComponentsFile,
	compileScss
} from './css.utils.js'

rimraf.sync('src/static/build/*.css');

writeComponentsFile();
compileScss();

const watcher = chokidar.watch(
	[
		'src/components/**/*.scss',
		'src/scss/**/.scss'
	],
	{
		ignoreInitial: true,
		persistent: true
	}
);

watcher.on('all', () => {
	writeComponentsFile();
	compileScss();
});