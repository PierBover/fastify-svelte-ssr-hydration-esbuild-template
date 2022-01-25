import {dirname, join} from 'path';
import {fileURLToPath} from 'url'

import Fastify from 'fastify';
import autoLoadPlugin from 'fastify-autoload';
import staticPlugin from 'fastify-static';
import renderView from './decorators/render-view.js';


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 5555;

const app = Fastify({
	logger: true,
	ignoreTrailingSlash: true
});

app.register(autoLoadPlugin, {
	dir: join(__dirname, 'routes'),
	forceESM: true
});

app.register(staticPlugin, {
	root: join(__dirname, 'static')
});

app.decorateReply('renderView', renderView);

const start = async () => {
	try {
		await app.listen(PORT, HOST);
	} catch (err) {
		app.log.error(err)
		process.exit(1)
	}
}

start();