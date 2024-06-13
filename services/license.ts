import { ApiLicenseResponse } from '@/types/api/license'
import {
  LicenseStoreRequest,
  LicenseUpdateRequest,
  mapApiLicenseStoreRequestToFormData,
  mapApiLicenseUpdateRequestToFormData,
  mapLicenseStoreRequestToApiLicenseStoreRequest,
  mapLicenseUpdateRequestToApiLicenseUpdateRequest,
} from '@/domain/license'

export default class LicenseService {
  store(data: LicenseStoreRequest) {
    return useApi<ApiLicenseResponse>(`licenses`, {
      method: 'POST',
      body: mapApiLicenseStoreRequestToFormData(
        mapLicenseStoreRequestToApiLicenseStoreRequest(data),
      ),
    })
  }

  update(licenseId: number, data: LicenseUpdateRequest) {
    return useApi<ApiLicenseResponse>(`licenses/${licenseId}`, {
      method: 'POST',
      body: mapApiLicenseUpdateRequestToFormData(
        mapLicenseUpdateRequestToApiLicenseUpdateRequest(data),
      ),
    })
  }

  destroy(licenseId: number) {
    return useApi<ApiLicenseResponse>(`licenses/${licenseId}`, {
      method: 'DELETE',
    })
  }
}
