import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  excluded: Array<string>;

  constructor(
    //private auth: AuthService,
    private router: Router) {
    this.excluded = ['api-token-auth/', 'register'];
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    for (const excludedUrl of this.excluded) {
      if (request.url.includes(excludedUrl)) {
        return next.handle(request);
      }
    }

    let req = null;
    req = request.clone({
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'Authorization': `token ${this.auth.getToken()}`
      }),
    });



    const result = next.handle(req).pipe(map((event: HttpEvent<any>) => {
      return event;
    }), catchError((error: HttpErrorResponse) => {
      console.log('Error Interceptor', error);
      if (error.status === 401) {
        console.error(error);
      }
      return throwError(error);

    }));

    return result;
  }
}
