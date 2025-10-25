// ============================================
// MODELO DE TARJETA ELECTRÓNICA
// ============================================

export interface CardStyles {
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
}

export interface ContactInfo {
  contactType: 'phone' | 'email' | 'address' | 'website';
  label: string;
  value: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface SocialLink {
  socialNetworkName: string;
  value: string;
  urlPattern: string;
  iconClass: string;
  displayOrder: number;
  generatedUrl: string;
}

export interface BusinessHour {
  dayOfWeek: number; // 0 = Domingo, 6 = Sábado
  dayName: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  notes?: string;
  formattedSchedule: string;
}

export interface Card {
  id: number;
  slug: string;
  title: string;
  profession?: string;
  description?: string;
  logoUrl?: string;
  qrCodeUrl?: string;
  isActive: boolean;
  viewCount: number;
  publicUrl: string;
  ownerName: string;
  tenantName: string;
  styles: CardStyles;
  contactInfo: ContactInfo[];
  socialLinks: SocialLink[];
  businessHours: BusinessHour[];
  createdOn: string;
  modifiedOn: string;
}