import fs from 'fs';
import crypto from 'crypto';
import {join} from 'path';
import sass from 'sass';

const componentsPath = 'src/components';

export function writeComponentsFile () {
	console.log('Updating _components.scss');
	const files = getComponentsScssFiles(componentsPath);
	const fileContents = files.map(file => `@import "${file}";\n`).join('');
	fs.writeFileSync('src/scss/_components.scss', fileContents, 'utf8');
}

export function getComponentsScssFiles (dirPath, filePaths = [], prefix = '../components/') {

	fs.readdirSync(dirPath).forEach((filename) => {
		const fullPath = join(dirPath, filename);
		const isDirectory = fs.statSync(fullPath).isDirectory();

		if (isDirectory) {
			const subFiles = getComponentsScssFiles(fullPath, [], prefix + filename + '/');
			filePaths = filePaths.concat(...subFiles);
		} else if (filename.includes('.scss')) {
			filePaths.push(prefix + filename);
		}
	});

	return filePaths;
}

export function compileScss (production) {
	console.log('Compiling SCSS...');

	if (!fs.existsSync('src/static/build')) fs.mkdirSync('src/static/build');

	const result = sass.compile('src/scss/index.scss', {
		style: production ? 'compressed' : 'expanded'
	});

	const css = result.css.toString();

	if (production) {
		const hashSum = crypto.createHash('sha256');
		hashSum.update(css);
		const hex = hashSum.digest('hex');
		console.log(hex);
		fs.writeFileSync(`src/static/build/styles-${hex}.css`, css, 'utf8');
	} else {
		fs.writeFileSync('src/static/build/styles.css', css, 'utf8');
	}
}