import type { ProviderStatus } from "../../shared/enums/ProviderStatus";

export interface IAdminProvider {
  id: string;
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
  status: ProviderStatus;
  createdAt: Date;
  updatedAt: Date;
}
