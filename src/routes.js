import { buildRoutePath } from './utils/build-route-path.js';
import { Task } from './models/task.js';
import { Database } from './database.js';
import { ErrorMessages } from './consts/error-messages.js';
import { importCsvFromFakeFile, saveImportedTasks } from './utils/convert-csv.js';

const database = new Database();

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {
            let taskFromBody = request.body;
            if(!Task.checkIfTitleAndDescriptionAreValid(taskFromBody)){
                return response
                    .setHeader('Content-type', 'text/plain')
                    .writeHead(400)
                    .end(ErrorMessages.TITLE_AND_DESCRIPTION_NOT_VALID);
            }
            let taskToCreate = Task.createTaskFromData(taskFromBody);
            database.insert('tasks', taskToCreate);
            return response
                .setHeader('Content-type', 'application/json')
                .writeHead(201)
                .end(JSON.stringify(taskToCreate));
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
            let taskFromBody = request.body;
            if(!Task.checkIfTitleAndDescriptionAreValid(taskFromBody)){
                return response
                    .setHeader('Content-type', 'text/plain')
                    .writeHead(400)
                    .end(ErrorMessages.TITLE_AND_DESCRIPTION_NOT_VALID);
            }
            const {id} = request.params;
            let taskFromDatabase = database.select('tasks', {id})?.[0];
            if(!taskFromDatabase){
                return response
                    .setHeader('Content-type', 'text/plain')
                    .writeHead(404)
                    .end(ErrorMessages.TASK_NOT_FOUND);
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
                    .setHeader('Content-type', 'text/plain')
                    .writeHead(404)
                    .end(ErrorMessages.TASK_NOT_FOUND);
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
                    .setHeader('Content-type', 'text/plain')
                    .writeHead(404)
                    .end(ErrorMessages.TASK_NOT_FOUND);
            }
            let taskToComplete = Task.createTaskFromData(taskFromDatabase);
            taskToComplete.markAsCompleted();
            database.update('tasks', id, taskToComplete);
            return response
                .setHeader('Content-type', 'application/json')
                .writeHead(200)
                .end(JSON.stringify(taskToComplete));
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks/test-csv'),
        handler: async(request, response) => {
            let tasks = [];
            let errors = [];
            return await importCsvFromFakeFile()
                .then(parser => {
                    parser
                        .on('data', (data) => {
                            let [title, description] = data;
                            tasks.push({title, description});
                        })
                        .on('error', (err) => {
                            errors.push(err.message);
                        })
                        .on('end', () => {
                            if(!errors.length){
                                if(!tasks.length){
                                    return response
                                        .setHeader('Content-type', 'application/json')
                                        .writeHead(204)
                                        .end(JSON.stringify([]));
                                }
                                let taskPromises = saveImportedTasks(tasks);
                                Promise.all(taskPromises)
                                    .then(async(data) => {
                                        let bodies = [];
                                        for await(const res of data){
                                            let body = await (res.body.getReader().read().then(data => Buffer.from(data.value).toLocaleString()));
                                            bodies.push(JSON.parse(body));
                                        }
                                        if(data.some(res => res.status >= 400)){
                                            return response
                                                .setHeader('Content-type', 'application/json')
                                                .writeHead(400)
                                                .end(JSON.stringify(bodies));
                                        }
                                        else{
                                            return response
                                                .setHeader('Content-type', 'application/json')
                                                .writeHead(201)
                                                .end(JSON.stringify(bodies));
                                        }
                                    })
                                    .catch(error => {
                                        return response
                                            .setHeader('Content-type', 'application/json')
                                            .writeHead(400)
                                            .end(JSON.stringify(error));
                                    });
                            }
                            else{
                                return response
                                    .setHeader('Content-type', 'application/json')
                                    .writeHead(400)
                                    .end(errors);
                            }
                        });
                })
                .catch(err => {
                    return response
                                .setHeader('Content-type', 'application/json')
                                .writeHead(400)
                                .end(err);
                });
        }
    }
];