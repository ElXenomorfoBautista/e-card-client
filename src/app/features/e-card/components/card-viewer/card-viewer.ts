import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Card } from '../../models/card.model';
import { CardService } from '../../services/card';

@Component({
  standalone: false,
  selector: 'app-card-viewer',
  templateUrl: './card-viewer.html',
  styleUrls: ['./card-viewer.scss']
})
export class CardViewerComponent implements OnInit, OnDestroy {
  
  // Estado
  card: Card | null = null;
  loading = true;
  error: string | null = null;
  slug: string = '';

  // Para limpiar subscripciones
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cardService: CardService
  ) {}

  ngOnInit(): void {
    // Obtener el slug de la URL
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.slug = params['slug'];
        if (this.slug) {
          this.loadCard();
        }
      });
  }

  /**
   * Cargar los datos de la tarjeta
   */
  loadCard(): void {
    this.loading = true;
    this.error = null;

    this.cardService.getPublicCardBySlug(this.slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (card) => {
          this.card = card;
          this.loading = false;
          console.log('✅ Tarjeta cargada:', card);
          
          // Actualizar título de la página
          document.title = `${card.title} | E-Card`;
        },
        error: (err) => {
          this.error = err.message || 'No se pudo cargar la tarjeta';
          this.loading = false;
          console.error('❌ Error al cargar tarjeta:', err);
        }
      });
  }

  /**
   * Obtener icono según el tipo de contacto
   */
  getContactIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'phone': 'pi pi-phone',
      'email': 'pi pi-envelope',
      'address': 'pi pi-map-marker',
      'website': 'pi pi-globe'
    };
    return icons[type] || 'pi pi-info-circle';
  }

  /**
   * Abrir enlace de red social
   */
  openSocialLink(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Copiar contacto al portapapeles
   */
  copyToClipboard(value: string): void {
    navigator.clipboard.writeText(value).then(() => {
      console.log('✅ Copiado al portapapeles:', value);
      // TODO: Agregar toast de PrimeNG para confirmación visual
      alert('¡Copiado al portapapeles!');
    }).catch(err => {
      console.error('❌ Error al copiar:', err);
    });
  }

  /**
   * Obtener iniciales del nombre para avatar placeholder
   */
  getInitials(): string {
    if (!this.card) return '?';
    
    const words = this.card.title.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return this.card.title.substring(0, 2).toUpperCase();
  }

  /**
   * Generar gradiente de fondo basado en los colores de la tarjeta
   */
  getGradientBackground(): string {
    if (!this.card) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    const primary = this.card.styles.primaryColor || '#667eea';
    const secondary = this.card.styles.accentColor || this.card.styles.secondaryColor || '#764ba2';
    
    return `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`;
  }

  /**
   * Verificar si es el día de hoy
   */
  isToday(dayOfWeek: number): boolean {
    const today = new Date().getDay();
    return today === dayOfWeek;
  }

  /**
   * Formatear hora (de 24h a formato más legible)
   */
  formatTime(time: string): string {
    if (!time) return '';
    
    try {
      const [hours, minutes] = time.split(':');
      const h = parseInt(hours, 10);
      const m = parseInt(minutes, 10);
      
      // Formato 12 horas
      const period = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 || 12;
      
      return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
    } catch {
      return time;
    }
  }

  /**
   * Compartir tarjeta usando Web Share API
   */
  shareCard(): void {
    if (!this.card) return;
    
    const shareData = {
      title: this.card.title,
      text: this.card.description || `Visita mi tarjeta digital`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('✅ Compartido exitosamente'))
        .catch((err) => console.error('❌ Error al compartir:', err));
    } else {
      // Fallback: copiar URL al portapapeles
      this.copyToClipboard(window.location.href);
    }
  }

  /**
   * Volver al inicio
   */
  goHome(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
}