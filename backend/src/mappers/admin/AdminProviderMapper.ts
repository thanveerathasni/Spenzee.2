import type { IAdminProvider } from "../../dtos/admin/AdminProviderDto";
import type { IProvider } from "../../models/Provider.model";

export const AdminProviderMapper = {
  toDto(provider: IProvider): IAdminProvider {
    return {
      id: provider._id!.toString(),
      brandName: provider.brandName,
      email: provider.email,
      phone: provider.phone,
      primaryCategory: provider.primaryCategory,
      companyName: provider.companyName,
      websiteUrl: provider.websiteUrl,
      gstNumber: provider.gstNumber,
      licenseNumber: provider.licenseNumber,
      socialLinks: provider.socialLinks,
      profileImage: provider.profileImage,
      description: provider.description,
      hasAcceptedTerms: provider.hasAcceptedTerms,
      status: provider.status,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
    };
  },

  toDtoList(providers: IProvider[]): IAdminProvider[] {
    return providers.map((provider) => this.toDto(provider));
  },
};
