// attempting to implement server-side rendering. need to let server know the **valid routes**.

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { matchPath, StaticRouter } from 'react-router-dom';
import App from '../client/src/components/App';
import routes from '../client/src/components/routes';

const router = (req, res, next) => {
	const activeRoute = routes.match((route) => matchPath(req.url, route)) || null;
	// ensures that the url is valid
	if (!activeRoute) {
		const err = new Error('file not found');
		next(err);
	}
	// can't pass a react component to res.send(). The browser will not recognize it.
	const markup = ReactDOMServer.renderToString(
		<StaticRouter location={req.url} content={{}}>
			<App />
		</StaticRouter>
	);
	// if all else succeeds replace the contents of our main div element with the proper interpreted component
	return res.send(`
	<!DOCTYPE html>
	<html lang="en">	
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="theme-color" content="#000000" />
			<meta name="description" content="Web site created using create-react-app" />
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css"
				integrity="sha512-8bHTC73gkZ7rZ7vpqUQThUDhqcNFyYi2xgDgPDHc+GXVGHXq+xPjynxIopALmOPqzo9JZj0k6OqqewdGO3EsrQ=="
				crossorigin="anonymous" referrerpolicy="no-referrer" />
			<title>Chatterly</title>
			<script src='/clientbundle.js' defer></script>
		</head>
		
		<body id="app">
			<div id="root">${markup}</div>
		</body>
	</html>
	`);
};

export default router;
