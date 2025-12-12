/**
 * ✅ CITIZEN SERVICE
 *
 * Handles all citizen-specific API calls:
 * - Digital Address services
 * - Emergency services
 * - Nearby services
 * - Reports
 * - Notifications
 * - Licenses
 * - Service applications
 */

import { ApiService } from './api';
import { API_ENDPOINTS } from '../config/constants';

/**
 * DIGITAL ADDRESS SERVICE
 */
export const DigitalAddressService = {
  getAddresses: async () => {
    const response = await ApiService.get(API_ENDPOINTS.DIGITAL.ADDRESSES);
    return response.data;
  },

  registerAddress: async (data: any) => {
    const response = await ApiService.post(API_ENDPOINTS.DIGITAL.REGISTER, data);
    return response.data;
  },

  verifyAddress: async (addressId: string) => {
    const response = await ApiService.post(`${API_ENDPOINTS.DIGITAL.VERIFY}/${addressId}`);
    return response.data;
  },

  requestLandlordCertificate: async (data: any) => {
    const response = await ApiService.post(API_ENDPOINTS.DIGITAL.LANDLORD_CERT, data);
    return response.data;
  },
};

/**
 * EMERGENCY SERVICE
 */
export const EmergencyService = {
  getContacts: async () => {
    const response = await ApiService.get(API_ENDPOINTS.EMERGENCY.CONTACTS);
    return response.data;
  },

  reportEmergency: async (data: any) => {
    const response = await ApiService.post(API_ENDPOINTS.EMERGENCY.REPORT, data);
    return response.data;
  },
};

/**
 * NEARBY SERVICES
 */
export const NearbyService = {
  getHospitals: async (lat: number, lng: number, radius?: number) => {
    const response = await ApiService.get(API_ENDPOINTS.NEARBY.HOSPITALS, {
      params: { lat, lng, radius },
    });
    return response.data;
  },

  getDoctors: async (lat: number, lng: number, radius?: number) => {
    const response = await ApiService.get(API_ENDPOINTS.NEARBY.DOCTORS, {
      params: { lat, lng, radius },
    });
    return response.data;
  },

  getPharmacies: async (lat: number, lng: number, radius?: number) => {
    const response = await ApiService.get(API_ENDPOINTS.NEARBY.PHARMACIES, {
      params: { lat, lng, radius },
    });
    return response.data;
  },

  getBanks: async (lat: number, lng: number, radius?: number) => {
    const response = await ApiService.get(API_ENDPOINTS.NEARBY.BANKS, {
      params: { lat, lng, radius },
    });
    return response.data;
  },
};

/**
 * REPORTS SERVICE
 */
export const ReportsService = {
  getReports: async (page?: number, limit?: number) => {
    const response = await ApiService.get(API_ENDPOINTS.REPORTS.LIST, {
      params: { page, limit },
    });
    return response.data;
  },

  createReport: async (data: any) => {
    const formData = new FormData();

    // Append text fields
    Object.keys(data).forEach((key) => {
      if (key !== 'images') {
        formData.append(key, data[key]);
      }
    });

    // Append images
    if (data.images && data.images.length > 0) {
      data.images.forEach((image: any, index: number) => {
        formData.append('images', {
          uri: image.uri,
          type: 'image/jpeg',
          name: `report-${index}.jpg`,
        } as any);
      });
    }

    const response = await ApiService.post(API_ENDPOINTS.REPORTS.CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getReportDetails: async (reportId: string) => {
    const url = API_ENDPOINTS.REPORTS.DETAILS.replace(':id', reportId);
    const response = await ApiService.get(url);
    return response.data;
  },

  updateReport: async (reportId: string, data: any) => {
    const url = API_ENDPOINTS.REPORTS.UPDATE.replace(':id', reportId);
    const response = await ApiService.put(url, data);
    return response.data;
  },

  deleteReport: async (reportId: string) => {
    const url = API_ENDPOINTS.REPORTS.DELETE.replace(':id', reportId);
    const response = await ApiService.delete(url);
    return response.data;
  },
};

/**
 * NOTIFICATIONS SERVICE
 */
export const NotificationsService = {
  getNotifications: async (page?: number, limit?: number) => {
    const response = await ApiService.get(API_ENDPOINTS.NOTIFICATIONS.LIST, {
      params: { page, limit },
    });
    return response.data;
  },

  markAsRead: async (notificationId: string) => {
    const url = API_ENDPOINTS.NOTIFICATIONS.MARK_READ.replace(':id', notificationId);
    const response = await ApiService.put(url);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await ApiService.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    return response.data;
  },
};

/**
 * SERVICES (Government Services)
 */
export const ServicesService = {
  getServices: async () => {
    const response = await ApiService.get(API_ENDPOINTS.SERVICES.LIST);
    return response.data;
  },

  applyForService: async (data: any) => {
    const response = await ApiService.post(API_ENDPOINTS.SERVICES.APPLY, data);
    return response.data;
  },

  trackApplication: async (applicationId: string) => {
    const url = API_ENDPOINTS.SERVICES.TRACK.replace(':id', applicationId);
    const response = await ApiService.get(url);
    return response.data;
  },
};

/**
 * LICENSES SERVICE
 */
export const LicensesService = {
  getLicenses: async () => {
    const response = await ApiService.get(API_ENDPOINTS.LICENSES.LIST);
    return response.data;
  },

  renewLicense: async (licenseId: string) => {
    const url = API_ENDPOINTS.LICENSES.RENEW.replace(':id', licenseId);
    const response = await ApiService.post(url);
    return response.data;
  },

  downloadLicense: async (licenseId: string) => {
    const url = API_ENDPOINTS.LICENSES.DOWNLOAD.replace(':id', licenseId);
    const response = await ApiService.get(url, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default {
  DigitalAddressService,
  EmergencyService,
  NearbyService,
  ReportsService,
  NotificationsService,
  ServicesService,
  LicensesService,
};
