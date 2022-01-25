import glob from 'glob';

const production = process.env.NODE_ENV === 'production';

let assets = production ? glob.sync('src/static/**/*.{js,css}') : [];

function getPageAssets (pageCode) {

	if (production) {

		const core = assets.find(path => path.includes('core'));
		const vendor = assets.find(path => path.includes('vendor'));

		return {
			css: assets.find(path => path.includes('.css')).replace('src/static', ''),
			js: assets.find(path => path.includes(pageCode)).replace('src/static', ''),
			core: core ? core.replace('src/static', '') : null,
			vendor: vendor ? vendor.replace('src/static', '') : null
		}
	} else {
		return {
			js: `/build/components/${pageCode}.js`,
			css: `/build/styles.css`
		}
	}
}

export default function (data = {}) {

	const {view, pageCode} = this.context.config;

	try {
		const {html, head} = view.render({
			routeData: data
		});

		const pageAssets = getPageAssets(pageCode);

		console.log(pageAssets);

		const response = `
			<!DOCTYPE html>
			<html>
				<head>
					${head}
					<script id="hydration-data-json" type="application/json">${JSON.stringify(data)}</script>
					<link rel="stylesheet" href="${pageAssets.css}" />
				</head>
				<body>
					${html}
					${pageAssets.vendor && `<script src="${pageAssets.vendor}"></script>`}
					${pageAssets.core && `<script src="${pageAssets.core}"></script>`}
					<script src="${pageAssets.js}"></script>
				</body>
			</html>
		`;

		this.header('content-type', 'text/html; charset=UTF-8');
		this.send(response);

	} catch (error) {
		console.log('SSR RENDERING ERROR');
		console.log(data);
		console.log(error.toString());
		throw error;
	}
}