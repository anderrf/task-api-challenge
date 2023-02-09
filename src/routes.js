import { buildRoutePath } from './utils/build-route-path.js';
import { randomUUID } from 'node:crypto';
import { Task } from './models/task.js';

const allTasks = [];

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {
            let task = Task.createTaskFromData(request.body);
            allTasks.push(task);
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
            return response
                .setHeader('Content-type', 'application/json')
                .writeHead(200)
                .end(JSON.stringify([...allTasks]));
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (request, response) => {
            const {id} = request.params;
            let rowIndex = allTasks.findIndex(task => {
                return task.id === id;
            });
            if(rowIndex > -1){
                let taskToUpdate = Task.createTaskFromData(allTasks[rowIndex]);
                taskToUpdate.updateTask(request.body);
                allTasks[rowIndex] = taskToUpdate;
                return response
                    .setHeader('Content-type', 'application/json')
                    .writeHead(200)
                    .end(JSON.stringify(taskToUpdate));
            }
            return response
                .setHeader('Content-type', 'application/json')
                .writeHead(404)
                .end("Task not found!");
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (request, response) => {
            const {id} = request.params;
            let rowIndex = allTasks.findIndex(task => {
                return task.id === id;
            });
            if(rowIndex > -1){
                let deletedTask = allTasks.splice(rowIndex, 1);
                return response
                    .setHeader('Content-type', 'application/json')
                    .writeHead(204)
                    .end(JSON.stringify(deletedTask));
            }
            return response
                .setHeader('Content-type', 'application/json')
                .writeHead(404)
                .end("Task not found!");
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (request, response) => {
            const {id} = request.params;
            let rowIndex = allTasks.findIndex(task => {
                return task.id === id;
            });
            if(rowIndex > -1){
                let completedTask = Task.createTaskFromData(allTasks[rowIndex]);
                completedTask.markAsCompleted();
                allTasks[rowIndex] = completedTask;
                return response
                    .setHeader('Content-type', 'application/json')
                    .writeHead(200)
                    .end(JSON.stringify(completedTask));
            }
            return response
                .setHeader('Content-type', 'application/json')
                .writeHead(404)
                .end("Task not found!");
        }
    }
];