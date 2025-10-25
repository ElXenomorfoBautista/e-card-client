import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CardCreatorService, CreateCardRequest } from '../../services/card-creator';

interface Step {
  label: string;
  icon: string;
}

@Component({
  standalone: false,
  selector: 'app-card-creator',
  templateUrl: './card-creator.html',
  styleUrls: ['./card-creator.scss'],
  providers: [MessageService]
})
export class CardCreatorComponent implements OnInit {

  // Steps del wizard
  steps: Step[] = [
    { label: 'Información Básica', icon: 'pi pi-user' },
    { label: 'Diseño y Colores', icon: 'pi pi-palette' },
    { label: 'Contacto', icon: 'pi pi-phone' },
    { label: 'Redes Sociales', icon: 'pi pi-share-alt' },
    { label: 'Horarios', icon: 'pi pi-clock' }
  ];

  activeIndex: number = 0;
  
  // Formularios por paso
  basicInfoForm!: FormGroup;
  designForm!: FormGroup;
  contactForm!: FormGroup;
  socialForm!: FormGroup;
  scheduleForm!: FormGroup;

  // Loading state
  loading: boolean = false;
  creating: boolean = false;

  // Días de la semana
  daysOfWeek = [
    { label: 'Domingo', value: 0 },
    { label: 'Lunes', value: 1 },
    { label: 'Martes', value: 2 },
    { label: 'Miércoles', value: 3 },
    { label: 'Jueves', value: 4 },
    { label: 'Viernes', value: 5 },
    { label: 'Sábado', value: 6 }
  ];

  constructor(
    private fb: FormBuilder,
    public cardService: CardCreatorService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  /**
   * Inicializar todos los formularios
   */
  initForms(): void {
    // PASO 1: Información Básica
    this.basicInfoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      profession: [''],
      description: ['', Validators.maxLength(500)],
      logoUrl: ['', Validators.pattern('https?://.+')]
    });

    // PASO 2: Diseño y Colores
    this.designForm = this.fb.group({
      primaryColor: ['#0066cc', Validators.required],
      secondaryColor: ['#00cc66', Validators.required],
      backgroundColor: ['#ffffff', Validators.required],
      textColor: ['#1e293b', Validators.required],
      accentColor: ['#ff6600', Validators.required],
      fontFamily: ['Poppins'],
      fontSize: ['medium'],
      borderRadius: ['medium'],
      backgroundImageUrl: ['', Validators.pattern('https?://.+')]
    });

    // PASO 3: Información de Contacto
    this.contactForm = this.fb.group({
      contacts: this.fb.array([])
    });
    this.addContact(); // Agregar uno por defecto

    // PASO 4: Redes Sociales
    this.socialForm = this.fb.group({
      socials: this.fb.array([])
    });
    this.addSocial(); // Agregar una por defecto

    // PASO 5: Horarios
    this.scheduleForm = this.fb.group({
      schedules: this.fb.array([])
    });
    this.initSchedules();
  }

  // ===================================================
  // PASO 3: CONTACTOS
  // ===================================================
  get contacts(): FormArray {
    return this.contactForm.get('contacts') as FormArray;
  }

  addContact(): void {
    const contactGroup = this.fb.group({
      contactType: ['phone', Validators.required],
      label: ['', Validators.required],
      value: ['', Validators.required],
      isPrimary: [false],
      displayOrder: [this.contacts.length + 1]
    });
    this.contacts.push(contactGroup);
  }

  removeContact(index: number): void {
    if (this.contacts.length > 1) {
      this.contacts.removeAt(index);
    } else {
      this.showWarning('Debe haber al menos un contacto');
    }
  }

  // ===================================================
  // PASO 4: REDES SOCIALES
  // ===================================================
  get socials(): FormArray {
    return this.socialForm.get('socials') as FormArray;
  }

  addSocial(): void {
    const socialGroup = this.fb.group({
      socialNetworkTypeId: [1, Validators.required],
      value: ['', Validators.required],
      displayOrder: [this.socials.length + 1]
    });
    this.socials.push(socialGroup);
  }

  removeSocial(index: number): void {
    this.socials.removeAt(index);
  }

  getSocialNetwork(id: number) {
    return this.cardService.getSocialNetworkById(id);
  }

  // ===================================================
  // PASO 5: HORARIOS
  // ===================================================
  get schedules(): FormArray {
    return this.scheduleForm.get('schedules') as FormArray;
  }

  initSchedules(): void {
    this.daysOfWeek.forEach(day => {
      const scheduleGroup = this.fb.group({
        dayOfWeek: [day.value],
        dayName: [day.label],
        openTime: ['09:00'],
        closeTime: ['18:00'],
        isClosed: [day.value === 0], // Domingo cerrado por defecto
        notes: ['']
      });
      this.schedules.push(scheduleGroup);
    });
  }

  // ===================================================
  // NAVEGACIÓN ENTRE PASOS
  // ===================================================
nextStep(): void {
    // 1. Revisa si el paso es válido
    if (this.isCurrentStepValid()) {
      // 2. Si es válido, avanza
      if (this.activeIndex < this.steps.length - 1) {
        this.activeIndex++;
      }
    } else {
      // 3. Si NO es válido, AHORA es cuando mostramos los errores
      //    y marcamos los campos.
      switch (this.activeIndex) {
        case 0:
          this.showError('Por favor completa la información básica correctamente');
          this.basicInfoForm.markAllAsTouched();
          break;
        case 1:
          this.showError('Por favor selecciona los colores del diseño');
          this.designForm.markAllAsTouched();
          break;
        case 2:
          this.showError('Debes agregar al menos un método de contacto');
          this.contactForm.markAllAsTouched();
          break;
        // case 3 y 4 no necesitan esto aquí
      }
    }
  }

  prevStep(): void {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  goToStep(index: number): void {
    // Solo permitir ir a pasos anteriores o al siguiente si el actual es válido
    if (index < this.activeIndex || (index === this.activeIndex + 1 && this.isCurrentStepValid())) {
      this.activeIndex = index;
    }
  }

/**
   * Revisa la validez del paso actual (SIN efectos secundarios)
   * Es seguro llamarla desde el template.
   */
  isCurrentStepValid(): boolean {
    switch (this.activeIndex) {
      case 0:
        return this.basicInfoForm.valid;
      case 1:
        return this.designForm.valid;
      case 2:
        return this.contactForm.valid && this.contacts.length > 0;
      case 3:
        return true; // Redes sociales son opcionales
      case 4:
        return this.scheduleForm.valid;
      default:
        return false;
    }
  }

  /**
   * Verificar si se puede avanzar
   */
  canProceed(): boolean {
    return this.isCurrentStepValid();
  }

  // ===================================================
  // CREAR TARJETA
  // ===================================================
  createCard(): void {
    if (!this.validateAllForms()) {
      this.showError('Por favor completa todos los pasos correctamente');
      return;
    }

    this.creating = true;

    const cardData: CreateCardRequest = {
      ...this.basicInfoForm.value,
      styles: {
        ...this.designForm.value,
        layoutTemplate: 'modern'
      },
      contactInfo: this.contacts.value,
      socialLinks: this.socials.value.filter((s: any) => s.value.trim() !== ''),
      businessHours: this.schedules.value
    };

    console.log('📤 Enviando tarjeta:', cardData);

    this.cardService.createCard(cardData).subscribe({
      next: (response) => {
        console.log('✅ Tarjeta creada:', response);
        this.showSuccess('¡Tarjeta creada exitosamente!');
        
        // Redirigir a la vista de la tarjeta
        setTimeout(() => {
          this.router.navigate(['/t', response.slug]);
        }, 1500);
      },
      error: (error) => {
        console.error('❌ Error al crear tarjeta:', error);
        this.showError(error.error?.message || 'Error al crear la tarjeta');
        this.creating = false;
      }
    });
  }

  /**
   * Validar todos los formularios
   */
  validateAllForms(): boolean {
    return (
      this.basicInfoForm.valid &&
      this.designForm.valid &&
      this.contactForm.valid &&
      this.socialForm.valid &&
      this.scheduleForm.valid
    );
  }

  // ===================================================
  // UTILIDADES
  // ===================================================
  showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: message,
      life: 3000
    });
  }

  showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 4000
    });
  }

  showWarning(message: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: message,
      life: 3000
    });
  }

  /**
   * Obtener icono según tipo de contacto
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
   * Reset form
   */
  resetForm(): void {
    this.activeIndex = 0;
    this.initForms();
    this.showSuccess('Formulario reiniciado');
  }
}