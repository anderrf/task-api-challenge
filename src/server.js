import http from 'node:http';
import { json } from './middlewares/json.js';
import { routes } from './routes.js';

const server = http.createServer(async(request, response) => {
    await json(request, response);
    const {method, url} = request;
    const route = routes.find(route => {
        return route.method === method && route.path === url
    });
    if(route){
        return route.handler(request, response);
    }
    return response
        .writeHead(404)
        .setHeader('Content-type', 'application/json')
        .end();
});
server.listen(3333);