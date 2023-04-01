export class Collaborator {

    id?: number;
    name?: string;
    lastName?: string;
    address?: string;
    email?: string;
    phone?: string;
    location?: string;
    country?: string;
    ruc?: string;
    deleted_at?: string;
    created_at?: string;
    updated_at?: string;

    constructor( json?: any ){
        this.id = json?.id;
        this.name = json?.name;
        this.lastName = json?.lastName; 
        this.address =  json?.address;
        this.email = json?.email; 
        this.phone = json?.phone;
        this.location = json?.location; 
        this.country = json?.country;
        this.ruc = json?.ruc;
        this.deleted_at = json?.deleted_at;
        this.created_at = json?.created_at;
        this.updated_at = json?.updated_at;
    }
}