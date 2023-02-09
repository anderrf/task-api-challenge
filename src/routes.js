import { buildRoutePath } from './utils/build-route-path.js';
import { randomUUID } from 'node:crypto';
import { Task } from './models/task.js';
import { Database } from './database.js';

const database = new Database();

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {
            let task = Task.createTaskFromData(request.body);
            database.insert('tasks', task);
            return response
                .setHeader('Content-type', 'application/json')
                .writeHead(201)
                .end(JSON.stringify(task));
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {
            const {search} = request.query;
            const tasks = database.select(
                'tasks',
                (search ? {title: search, description: search} : undefined)
            );
            return response
                .setHeader('Content-type', 'application/json')
                .writeHead(200)
                .end(JSON.stringify([...tasks]));
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (request, response) => {
            const {id} = request.params;
            let taskFromBody = request.body;
            let taskFromDatabase = database.select('tasks', {id})?.[0];
            if(!taskFromDatabase){
                return response
                    .setHeader('Content-type', 'application/json')
                    .writeHead(404)
                    .end("Task not found!");
            }
            let taskToUpdate = Task.createTaskFromData(taskFromDatabase);
            taskToUpdate.updateTask(taskFromBody);
            database.update('tasks', id, taskToUpdate);
            return response
                .setHeader('Content-type', 'application/json')
                .writeHead(200)
                .end(JSON.stringify(taskToUpdate));
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (request, response) => {
            const {id} = request.params;
            let taskToBeDeleted = database.select('tasks', {id})?.[0];
            if(!taskToBeDeleted){
                return response
                    .setHeader('Content-type', 'application/json')
                    .writeHead(404)
                    .end("Task not found!");
            }
            database.delete('tasks', id);
            return response
                .setHeader('Content-type', 'application/json')
                .writeHead(204)
                .end(JSON.stringify(taskToBeDeleted));
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (request, response) => {
            const {id} = request.params;
            let taskFromDatabase = database.select('tasks', {id})?.[0];
            if(!taskFromDatabase){
                return response
                    .setHeader('Content-type', 'application/json')
                    .writeHead(404)
                    .end("Task not found!");
            }
            let taskToComplete = Task.createTaskFromData(taskFromDatabase);
            taskToComplete.markAsCompleted();
            database.update('tasks', id, taskToComplete);
            return response
                .setHeader('Content-type', 'application/json')
                .writeHead(200)
                .end(JSON.stringify(taskToComplete));
        }
    }
];