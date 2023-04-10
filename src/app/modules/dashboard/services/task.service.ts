import { retry, catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tasksUrl } from 'src/app/core/services/http/urls';
import { Response } from 'src/app/shared/models/response.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  constructor(
    private http: HttpClient
  ) { }

  getTasks( request?: any ): Observable<Response> {
    console.error('getTasks ', request );
    return this.http.get<Response>(`${tasksUrl}`,{ params: request})
      .pipe(
        tap((res: any) => {
          return res;
        }, (error) => {
          return error;
        }),
        retry(1)
      );
  }

  deleteTask(id: string | number | any): Observable<any> {
    return this.http.delete<any>(`${tasksUrl}${id}/`)
      .pipe(
        retry(1)
      );
  }


  createTask(data: any): Observable<any> {
    return this.http.post<any>(`${tasksUrl}`, data)
      .pipe(
        tap(
          (res: any) => {
            return res;
          }, (error) => {
            return error;
          }
        ),
        retry(1)
      );
  }

  updateTask(data: any, id: string | number | any): Observable<any> {
    return this.http.put<any>(`${tasksUrl}${id}/`, data)
      .pipe(
        tap(
          (res: any) => {
            return res;
          }, (error: any) => {
            return error;
          }
        ),
        retry(1)
      );
  }

  getTask( id: string | number | any ):  Observable<any> {
    return this.http.get<any>(`${tasksUrl}${id}/`)
    .pipe(
      tap(
        (res: any) => {
          return res;
        }, (error: any) => {
          return error;
        }
      ),
      retry(1)
    )
  } 

}