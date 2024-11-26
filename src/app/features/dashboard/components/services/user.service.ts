import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {EditUser, User} from '@core/models/user.model';
import {GetPostResponse} from '@core/models/post.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getClientPosts(): Observable<GetPostResponse[]> {
    return this.http.get<GetPostResponse[]>(`/api/adoptions/user`);
  }

  editClient( editUser: any): Observable<User> {
    return this.http.put<User>(`/api/user/edit`, editUser);
  }

  getAuthenticatedUser(): Observable<User> {
    return this.http.get<User>('/api/user/me').pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err);
      })
    );
  }

}
