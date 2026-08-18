export interface ProviderApplicationDto {
  brandName: string;
  email: string;
  phone: string;
  primaryCategory: string;
  companyName?: string;
  websiteUrl?: string;
  gstNumber?: string;
  licenseNumber?: string;
  socialLinks?: string[];
  profileImage?: string;
  description?: string;
  hasAcceptedTerms: boolean;
}
