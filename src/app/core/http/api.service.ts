import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiErrorHandler } from './api-error.handler';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly errorHandler = inject(ApiErrorHandler);

  get<T>(path: string, params?: HttpParams | Record<string, string | number | boolean>): Observable<T> {
    return this.http.get<T>(this.url(path), { params: params as HttpParams }).pipe(
      catchError(this.handleError())
    );
  }

  post<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.post<T>(this.url(path), body).pipe(
      catchError(this.handleError())
    );
  }

  put<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.put<T>(this.url(path), body).pipe(
      catchError(this.handleError())
    );
  }

  patch<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.patch<T>(this.url(path), body).pipe(
      catchError(this.handleError())
    );
  }

  delete<T = void>(path: string): Observable<T> {
    return this.http.delete<T>(this.url(path)).pipe(
      catchError(this.handleError())
    );
  }

  private url(path: string): string {
    return `${environment.apiUrl}${path}`;
  }

  private handleError() {
    return (error: HttpErrorResponse): Observable<never> => {
      this.errorHandler.handle(error);
      return throwError(() => error);
    };
  }
}
