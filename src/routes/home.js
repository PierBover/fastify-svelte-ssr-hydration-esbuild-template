import Home from '../ssr/Home.js';

const route = {
	method: 'GET',
	url: '/',
	config: {
		view: Home,
		pageCode: 'Home'
	},
	handler (request, reply) {
		reply.renderView({
			message: 'Hello world!'
		});
	}
}

export default async function (app) {
	app.route(route);
};