import { randomUUID } from 'node:crypto';
import { ErrorMessages } from '../consts/error-messages.js';

export class Task{
    id;
    title;
    description;
    completed_at;
    created_at;
    updated_at;

    constructor(taskData){
        let currentDate = new Date();
        if(taskData){
            this.id = taskData.id ? taskData.id : randomUUID();
            this.title = taskData.title;
            this.description = taskData.description;
            this.created_at = taskData.created_at ? taskData.created_at : currentDate;
            this.completed_at = taskData.completed_at ? taskData.completed_at : null;
            this.updated_at = taskData.updated_at ? taskData.updated_at : currentDate;
        }
        else{
            this.id = randomUUID();
            this.created_at = currentDate;
            this.completed_at = null;
            this.updateTask = currentDate;
        }
    }

    static createTaskFromData(taskData){
        return new Task(taskData);
    }

    markAsCompleted(){
        let currentDate = new Date();
        this.completed_at = currentDate;
        this.updated_at = currentDate;
    }

    updateTask(updatedData){
        let currentDate = new Date();
        this.title = updatedData.title ? updatedData.title : this.title ?? '';
        this.description = updatedData.description ? updatedData.description : this.description ?? '';
        this.completed_at = updatedData.completed_at ? updatedData.completed_at : this.completed_at ?? null;
        this.updated_at = currentDate;
    }

    static checkIfTitleAndDescriptionAreValid(task){
        if(typeof(task?.title) !== 'string' && typeof(task?.description) !== 'string'){
            return false;
        }
        return !!task?.title?.length && !!task?.description?.length
    }

    static checkErrorsForTitleAndDescriptionFields(task){
        let errors = [];
        if(typeof(task?.title) !== 'string' || !task?.title?.length){
            errors.push(ErrorMessages.TITLE_NOT_VALID);
        }
        if(typeof(task?.description) !== 'string' || !task?.description?.length){
            errors.push(ErrorMessages.DESCRIPTION_NOT_VALID);
        }
        return errors;
    }
}