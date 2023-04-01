import { Task } from "./task.model";

export class Response {
    data?: Task[] | Task;
    constructor( json?: any ){
        this.data = json?.data;
    }
}