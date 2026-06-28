import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { ExtractedAccountData } from '@/lib/ocr';

export const ocrService = {
  extractFromImage(base64Image: string, mimeType = 'image/jpeg') {
    return apiClient.post<ExtractedAccountData>(ENDPOINTS.OCR.EXTRACT, {
      image: base64Image,
      mimeType,
    });
  },

  snapExtract(base64Image: string, mimeType = 'image/jpeg') {
    return apiClient.post<ExtractedAccountData>(ENDPOINTS.PAYMENTS.SNAP_EXTRACT, {
      image: base64Image,
      mimeType,
    });
  },
};
