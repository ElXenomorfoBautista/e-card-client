import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Temporal - El usuario lo configurará
export const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWxldGVkIjpmYWxzZSwiZGVsZXRlZE9uIjoiMjAyNS0xMC0yNVQwMjo0NDoxNy4yMTFaIiwiZGVsZXRlZEJ5IjpudWxsLCJjcmVhdGVkT24iOiIyMDI1LTEwLTI1VDAyOjQ0OjE3LjIwNloiLCJtb2RpZmllZE9uIjoiMjAyNS0xMC0yNVQwNDoxMjowMS4zNDlaIiwiY3JlYXRlZEJ5IjoxLCJtb2RpZmllZEJ5IjoxLCJpZCI6MiwiZmlyc3ROYW1lIjoiSnVhbiIsImxhc3ROYW1lIjoiUMOpcmV6IiwibWlkZGxlTmFtZSI6bnVsbCwidXNlcm5hbWUiOiJqdWFuX2Zhcm1hY2lhIiwiZW1haWwiOiJqdWFuQGZhcm1hY2lhc2FuanVhbi5jb20iLCJwaG9uZSI6IjgxMTIzNDU2NzgiLCJkZWZhdWx0VGVuYW50IjoyLCJsYXN0TG9naW4iOiIyMDI1LTEwLTI1VDA0OjEyOjAxLjM0OFoiLCJpbWFnZVBhdGgiOm51bGwsInFyUGF0aCI6bnVsbCwidXNlclRlbmFudElkIjoyLCJwZXJtaXNzaW9ucyI6WyJWaWV3T3duVXNlciIsIlZpZXdBbnlVc2VyIiwiVmlld1RlbmFudFVzZXIiLCJDcmVhdGVBbnlVc2VyIiwiQ3JlYXRlVGVuYW50VXNlciIsIlVwZGF0ZU93blVzZXIiLCJVcGRhdGVUZW5hbnRVc2VyIiwiVXBkYXRlQW55VXNlciIsIkRlbGV0ZVRlbmFudFVzZXIiLCJEZWxldGVBbnlVc2VyIiwiVmlld1RlbmFudCIsIkNyZWF0ZVRlbmFudCIsIlVwZGF0ZVRlbmFudCIsIkRlbGV0ZVRlbmFudCIsIlZpZXdSb2xlIiwiQ3JlYXRlUm9sZSIsIlVwZGF0ZVJvbGUiLCJEZWxldGVSb2xlIiwiVmlld0F1ZGl0IiwiQ3JlYXRlQXVkaXQiLCJVcGRhdGVBdWRpdCIsIkRlbGV0ZUF1ZGl0IiwiQ3JlYXRlQ2FyZCIsIlZpZXdPd25DYXJkIiwiVmlld1RlbmFudENhcmQiLCJWaWV3QW55Q2FyZCIsIlVwZGF0ZU93bkNhcmQiLCJVcGRhdGVUZW5hbnRDYXJkIiwiVXBkYXRlQW55Q2FyZCIsIkRlbGV0ZU93bkNhcmQiLCJEZWxldGVUZW5hbnRDYXJkIiwiRGVsZXRlQW55Q2FyZCIsIkR1cGxpY2F0ZUNhcmQiLCJWaWV3Q2FyZFN0YXRzIiwiVmlld0NhcmRBbmFseXRpY3MiLCJFeHBvcnRDYXJkRGF0YSIsIk1hbmFnZUNhcmRTdHlsZXMiXSwicm9sZSI6IjEiLCJ0ZW5hbnQiOnsiZGVsZXRlZCI6ZmFsc2UsImRlbGV0ZWRPbiI6IjIwMjUtMTAtMjVUMDI6NDM6MTIuOTc1WiIsImRlbGV0ZWRCeSI6bnVsbCwiY3JlYXRlZE9uIjoiMjAyNS0xMC0yNVQwMjo0MzoxMi45NjRaIiwibW9kaWZpZWRPbiI6IjIwMjUtMTAtMjVUMDI6NDM6MTIuOTY0WiIsImNyZWF0ZWRCeSI6MSwibW9kaWZpZWRCeSI6MSwiaWQiOjIsIm5hbWUiOiJGYXJtYWNpYSBTYW4gSnVhbiIsInR5cGUiOiJmYXJtYWNpYSIsImFkZHJlc3MxIjpudWxsLCJhZGRyZXNzMiI6bnVsbCwiYWRkcmVzczMiOm51bGwsImFkZHJlc3M0IjpudWxsLCJjaXR5IjoiTW9udGVycmV5Iiwic3RhdGUiOiJOdWV2byBMZcOzbiIsInppcCI6bnVsbCwiY291bnRyeSI6Ik3DqXhpY28iLCJzdGF0dXMiOiJhY3RpdmUiLCJ0ZW5hbnRzVHlwZUlkIjoxfSwiaWF0IjoxNzYxMzY5ODQyLCJleHAiOjE3NjIyNjk4NDIsImlzcyI6ImxiX2FwaSJ9.1b8oLANe5TUjVt0MX_39RyAQBQFaKi_9Tc3eZMEkpUI'; // ⚠️ CAMBIAR ESTO

export interface CreateCardRequest {
  title: string;
  profession?: string;
  description?: string;
  logoUrl?: string;
  styles: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    fontFamily: string;
    fontSize: string;
    layoutTemplate: string;
    borderRadius: string;
    backgroundImageUrl?: string;
  };
  contactInfo: Array<{
    contactType: 'phone' | 'email' | 'address' | 'website';
    label: string;
    value: string;
    isPrimary: boolean;
    displayOrder: number;
  }>;
  socialLinks: Array<{
    socialNetworkTypeId: number;
    value: string;
    displayOrder: number;
  }>;
  businessHours: Array<{
    dayOfWeek: number;
    openTime?: string;
    closeTime?: string;
    isClosed: boolean;
    notes?: string;
  }>;
}

export interface SocialNetworkType {
  id: number;
  name: string;
  iconClass: string;
  urlPattern: string;
  placeholder: string;
  inputType: string;
}

@Injectable({
  providedIn: 'root'
})
export class CardCreatorService {
  
  private readonly API_URL = 'http://localhost:3000';
  
  // Lista estática de redes sociales
  readonly socialNetworks: SocialNetworkType[] = [
    {
      id: 1,
      name: 'WhatsApp',
      iconClass: 'pi pi-whatsapp',
      urlPattern: 'https://wa.me/{value}',
      placeholder: 'Número con código de país (ej: 5218112345678)',
      inputType: 'tel'
    },
    {
      id: 2,
      name: 'Facebook',
      iconClass: 'pi pi-facebook',
      urlPattern: 'https://facebook.com/{value}',
      placeholder: 'Usuario de Facebook',
      inputType: 'text'
    },
    {
      id: 3,
      name: 'Instagram',
      iconClass: 'pi pi-instagram',
      urlPattern: 'https://instagram.com/{value}',
      placeholder: 'Usuario de Instagram',
      inputType: 'text'
    },
    {
      id: 4,
      name: 'TikTok',
      iconClass: 'pi pi-video',
      urlPattern: 'https://tiktok.com/@{value}',
      placeholder: 'Usuario de TikTok',
      inputType: 'text'
    },
    {
      id: 5,
      name: 'LinkedIn',
      iconClass: 'pi pi-linkedin',
      urlPattern: 'https://linkedin.com/in/{value}',
      placeholder: 'Usuario de LinkedIn',
      inputType: 'text'
    },
    {
      id: 6,
      name: 'Twitter/X',
      iconClass: 'pi pi-twitter',
      urlPattern: 'https://twitter.com/{value}',
      placeholder: 'Usuario de Twitter/X',
      inputType: 'text'
    },
    {
      id: 7,
      name: 'YouTube',
      iconClass: 'pi pi-youtube',
      urlPattern: 'https://youtube.com/@{value}',
      placeholder: 'Canal de YouTube',
      inputType: 'text'
    },
    {
      id: 8,
      name: 'Email',
      iconClass: 'pi pi-envelope',
      urlPattern: 'mailto:{value}',
      placeholder: 'Correo electrónico',
      inputType: 'email'
    },
    {
      id: 9,
      name: 'Telegram',
      iconClass: 'pi pi-send',
      urlPattern: 'https://t.me/{value}',
      placeholder: 'Usuario de Telegram',
      inputType: 'text'
    },
    {
      id: 10,
      name: 'Pinterest',
      iconClass: 'pi pi-pinterest',
      urlPattern: 'https://pinterest.com/{value}',
      placeholder: 'Usuario de Pinterest',
      inputType: 'text'
    },
    {
      id: 11,
      name: 'GitHub',
      iconClass: 'pi pi-github',
      urlPattern: 'https://github.com/{value}',
      placeholder: 'Usuario de GitHub',
      inputType: 'text'
    }
  ];

  constructor(private http: HttpClient) {}

  /**
   * Obtener headers con Bearer Token
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BEARER_TOKEN}`
    });
  }

  /**
   * Crear nueva tarjeta
   */
  createCard(cardData: CreateCardRequest): Observable<any> {
    return this.http.post(
      `${this.API_URL}/cards`,
      cardData,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Obtener red social por ID
   */
  getSocialNetworkById(id: number): SocialNetworkType | undefined {
    return this.socialNetworks.find(sn => sn.id === id);
  }

  /**
   * Verificar si un slug está disponible
   */
  checkSlugAvailability(slug: string): Observable<any> {
    return this.http.get(
      `${this.API_URL}/public/cards/exists/${slug}`
    );
  }
}