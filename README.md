# Task API Challenge

**Project developed in JavaScript an Node.JS**<br>
**API for creating, altering, fetching and deleting tasks**

### Technologies
* JavaScript 5
* Node.js v18
* `node:http` package
* `fetch` API
* `fs` module
* `csv` npm package (`parser` and `stringify` sub-packages)

### Contracts
```
Task{
    id: string //UUID;
    title: string;
    description: string;
    completed_at: Date;
    created_at: Date;
    updated_at: Date;
}
```
```
//Object to be sent in POST and PUT endpoints, required fields for creating and updating Task
{
    title: string;
    description: string;
}
```

### Routes
* GET - `/tasks?search=<search>`
    * Receives `search` string parameter from query string parameter
    * Returns `Task[]`
* GET - `/tasks/:id`
    * Receives UUID from route parameter
    * Returns `Task` object
* POST - `/tasks`
    * Receives object containing required fields for saving `Task` from body
    * Returns `Task` object
* PUT - `/tasks/:id`
    * Receives `UUID` from `id` route parameter
    * Receives `Task`, or an object containing its required fields from body
    * Returns `Task` object
* PATCH - `/tasks/:id/complete`
    * Receives `UUID` from `id` route parameter
    * Returns `Task` object
* DELETE - `/tasks/:id`
    * Receives `UUID` from `id` route parameter
    * No content in return
* POST - `/tasks/test-csv`
    * Returns `Task[]`
* GET - `tasks/csv/download?search=search`
    * Receives `search` string parameter from query string parameter
    * Returns `text/csv` buffer, downloads .csv file

### Learned in this project
* Use of `csv` package and its sub-packages
* File download by sending buffer with the correct `content-type` and `content-disposition` headers
* Treatment of promises and pipes in JavaScript