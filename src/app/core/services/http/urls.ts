import { environment } from 'src/environments/environment';

export const loginUrl = environment.apiURLo;
export const usersUrl =  `${environment.apiURL}users/`;
export const tasksUrl = `${environment.apiURL}tasks/`;
export const collaboratorUrl = `${environment.apiURL}collaborators/`;