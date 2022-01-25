import About from '../ssr/About.js';

const route = {
	method: 'GET',
	url: '/about',
	config: {
		view: About,
		pageCode: 'About'
	},
	handler (request, reply) {
		reply.renderView();
	}
}

export default async function (app) {
	app.route(route);
};