import { Collaborator } from "./collaborator.model";

export class Task {
    
    id?: number;
    description?: string;
    collaborator_id?: number;
    state?: string;
    priority?: string;
    startDate?: string;
    endDate?: string;
    notes?: string;
    collaborator?: Collaborator;
    deleted_at?: string;
    created_at?: string;
    updated_at?: string;

    constructor( json: any ) {
      this.id = json?.id;
      this.description = json?.description;
      this.collaborator_id = json?.collaborator_id;
      this.state = json?.state;
      this.priority = json?.priority;
      this.startDate =  json?.startDate;
      this.endDate = json?.endDate;
      this.notes =  json?.notes;
      this.collaborator = json?.collaborator;
      this.deleted_at = json?.deleted_at;
      this.created_at = json?.created_at;
      this.updated_at = json?.updated_at;
    }
  }