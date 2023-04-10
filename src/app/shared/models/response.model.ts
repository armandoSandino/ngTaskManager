import { Collaborator } from "./collaborator.model";
import { Task } from "./task.model";

export class Response {
    data?: Task[] | Task | Collaborator[] | Collaborator;
    constructor( json?: any ){
        this.data = json?.data;
    }
}