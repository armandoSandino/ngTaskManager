import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { collaboratorUrl } from 'src/app/core/services/http/urls';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorService {
  constructor( private http: HttpClient) { }
  
  getCollaboratorsAsyncPipe(): Observable<any> {
    return this.http.get<any>(`${collaboratorUrl}`)
    .pipe(
      tap( (res: any) => {
        return res?.results
      }, (error: any ) => {
        return error;
      }),
      retry(1)
    );
  }

  getCollaborators(): Observable<any> {
    return this.http.get<any>(`${collaboratorUrl}`)
    .pipe(
      tap( ( res: any ) => {
        return res;
      }, ( error: any ) =>{
        return error
      }),
      retry(1)
    );
  }

}
