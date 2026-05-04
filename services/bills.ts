import { apiRequest } from './api';

export const buyAirtime = async (
  payload: { network: string; phoneNumber: string; amount: number },
  token: string
) => {
  const endpoints = ['/bills/airtime', '/airtime/purchase', '/airtime'];
  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      return await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      }, token);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Airtime purchase failed');
};

export const verifyAccount = async (
  accountNumber: string,
  token: string
): Promise<{ accountName: string; bankName: string }> => {
  try {
    const data = await apiRequest(
      '/accounts/verify',
      {
        method: 'POST',
        body: JSON.stringify({ accountNumber }),
      },
      token
    );

    return {
      accountName: data.accountName || data.account_name || data.name || '',
      bankName: data.bankName || data.bank_name || data.bank || '',
    };
  } catch (error) {
    console.error('Account verification failed:', error);
    return { accountName: '', bankName: '' };
  }
};

export const sendViaQR = async (qrData: any, amount: number, token: string) => {
  return apiRequest(
    '/payments/send',
    {
      method: 'POST',
      body: JSON.stringify({ qrData, amount }),
    },
    token
  );
};

export const receiveViaQR = async (qrData: any, token: string) => {
  return apiRequest(
    '/payments/receive',
    {
      method: 'POST',
      body: JSON.stringify({ qrData }),
    },
    token
  );
};
