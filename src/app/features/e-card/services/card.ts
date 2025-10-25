import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  
  // URL base de tu API
  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Obtener tarjeta pública por slug
   */
  getPublicCardBySlug(slug: string): Observable<Card> {
    const url = `${this.API_URL}/public/cards/${slug}`;
    
    return this.http.get<Card>(url).pipe(
      tap(card => console.log('✅ Card loaded:', card)),
      catchError(this.handleError)
    );
  }

  /**
   * Verificar si una tarjeta existe
   */
  checkCardExists(slug: string): Observable<{ exists: boolean; slug: string; isActive?: boolean }> {
    const url = `${this.API_URL}/public/cards/exists/${slug}`;
    
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo de errores
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 404:
          errorMessage = 'Tarjeta no encontrada';
          break;
        case 500:
          errorMessage = 'Error del servidor';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    console.error('❌ Error en CardService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}