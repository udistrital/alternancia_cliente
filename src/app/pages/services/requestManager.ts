import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorManager } from './errorManager';

/**
 * This class manage the http connections with internal REST services. Use the response format {
 *  Code: 'xxxxx',
 *  Body: 'Some Data' (this element is returned if the request is success)
 *  ...
 * }
 */
@Injectable({
  providedIn: 'root',
})
export class RequestManager {
  httpOptions: any;
  accessToken: string;

  constructor(private http: HttpClient, private errManager: HttpErrorManager) {
    this.accessToken = localStorage.getItem('access_token');
    this.httpOptions =  { headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken?this.accessToken:localStorage.getItem('access_token')}`,
      })
    }
  }



  /**
   * Perform a GET http request
   *
   * @param path service's path from environment end-point
   * @param endpoint service's end-point
   * @param params (an Key, Value object with que query params for the request)
   * @returns Observable<any>
   */
  get(path, endpoint) {

    return this.http.get<any>(`${path}${endpoint}`, this.httpOptions).pipe(
      map(
        (res: any) => {
          if (res.hasOwnProperty('Body')) {
            return res.Body;
          } else {
            return res;
          }
        },
      ),
      catchError(this.errManager.handleError.bind(this)),
    );
  }

  /**
   * Perform a POST http request
   * 
   * @param path service's path from environment end-point
   * @param endpoint service's end-point
   * @param element data to send as JSON
   * @returns Observable<any>
   */
  post(path, endpoint, element) {
    return this.http.post<any>(`${path}${endpoint}`, element, this.httpOptions).pipe(
      catchError(this.errManager.handleError),
    );
  }

  /**
   * Perform a PUT http request
   *
   * @param path service's path from environment end-point
   * @param endpoint service's end-point
   * @param element data to send as JSON, With the id to UPDATE
   * @returns Observable<any>
   */
  put(path, endpoint, element, id) {
    return this.http.put<any>(`${path}${endpoint}/${id}`, element,  this.httpOptions).pipe(
      catchError(this.errManager.handleError),
    );
  }

  /**
   * Perform a DELETE http request
   *
   * @param path service's path from environment end-point
   * @param endpoint service's end-point
   * @param id element's id for remove
   * @returns Observable<any>
   */
  delete(path, endpoint, id) {
    return this.http.delete<any>(`${path}${endpoint}/${id}`, this.httpOptions).pipe(
      catchError(this.errManager.handleError),
    );
  }
};
