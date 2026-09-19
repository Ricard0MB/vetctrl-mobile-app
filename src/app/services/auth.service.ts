import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiBaseUrl = 'https://vetctrl.onrender.com/api/index.php';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('vetctrl_user');
    if (saved) {
      this.currentUserSubject.next(JSON.parse(saved));
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}?resource=auth&action=login`, { username, password })
      .pipe(
        tap((response: any) => {
          if (response && response.success && response.data) {
            // Guardar token Y usuario
            localStorage.setItem('vetctrl_token', response.data.token);
            localStorage.setItem('vetctrl_user', JSON.stringify(response.data.user));
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  register(data: {username: string, email: string, password: string, confirm_password: string}): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}?resource=auth&action=register`, data)
      .pipe(
        tap((response: any) => {
          if (response && response.success && response.data) {
            localStorage.setItem('vetctrl_token', response.data.token);
            localStorage.setItem('vetctrl_user', JSON.stringify(response.data.user));
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  logout() {
    const token = this.getToken();
    if (token) {
      // Notificar al backend (opcional, no bloqueante)
      this.http.post(`${this.apiBaseUrl}?resource=auth&action=logout`, {}, {
        headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token })
      }).subscribe({ next: () => {}, error: () => {} });
    }
    localStorage.removeItem('vetctrl_token');
    localStorage.removeItem('vetctrl_user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('vetctrl_token');
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null && this.getToken() !== null;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? 'Bearer ' + token : ''
    });
  }
}