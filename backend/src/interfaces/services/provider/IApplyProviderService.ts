import type { ProviderApplicationDto } from "../../../dtos/provider/ProviderApplication.dto";

export interface IApplyProviderService {
  execute(data: ProviderApplicationDto): Promise<void>;
}
