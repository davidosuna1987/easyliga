import { ApiLicenseResponse } from '@/types/api/license'
import {
  LicenseStoreRequest,
  LicenseUpdateRequest,
  mapApiLicenseStoreRequestToFormData,
  mapApiLicenseUpdateRequestToFormData,
  mapLicenseStoreRequestToApiLicenseStoreRequest,
  mapLicenseUpdateRequestToApiLicenseUpdateRequest,
} from '@/domain/license'

const PREFIX = 'licenses'

export default class LicenseService {
  store(data: LicenseStoreRequest) {
    return useApi<ApiLicenseResponse>(`${PREFIX}`, {
      method: 'POST',
      body: mapApiLicenseStoreRequestToFormData(
        mapLicenseStoreRequestToApiLicenseStoreRequest(data),
      ),
    })
  }

  update(licenseId: number, data: LicenseUpdateRequest) {
    return useApi<ApiLicenseResponse>(`${PREFIX}/${licenseId}`, {
      method: 'POST',
      body: mapApiLicenseUpdateRequestToFormData(
        mapLicenseUpdateRequestToApiLicenseUpdateRequest(data),
      ),
    })
  }

  destroy(licenseId: number) {
    return useApi<ApiLicenseResponse>(`${PREFIX}/${licenseId}`, {
      method: 'DELETE',
    })
  }
}
