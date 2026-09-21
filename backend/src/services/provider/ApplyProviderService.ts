import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { ProviderStatus } from "../../shared/enums/ProviderStatus";
import { AppError } from "../../shared/errors/AppError";

import type { ProviderApplicationDto } from "../../dtos/provider/ProviderApplication.dto";
import type { IProviderRepository } from "../../interfaces/repositories/provider/IProviderRepository";
import type { IApplyProviderService } from "../../interfaces/services/provider/IApplyProviderService";


@injectable()
export class ApplyProviderService implements IApplyProviderService {
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly _providerRepository: IProviderRepository,
  ) {}

  async execute(data: ProviderApplicationDto): Promise<void> {
    const existingProvider = await this._providerRepository.findByEmail(data.email);

    if (existingProvider) {
      throw new AppError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }

    await this._providerRepository.create({
      brandName: data.brandName,
      email: data.email,
      phone: data.phone,
      primaryCategory: data.primaryCategory,
      companyName: data.companyName,
      websiteUrl: data.websiteUrl,
      gstNumber: data.gstNumber,
      licenseNumber: data.licenseNumber,
      socialLinks: data.socialLinks,
      profileImage: data.profileImage,
      description: data.description,
      hasAcceptedTerms: data.hasAcceptedTerms,

      status: ProviderStatus.PENDING,
      commerceEnabled: false,
      isCommerceFrozen: false,
    });
  }
}
