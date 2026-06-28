import type { Router } from 'expo-router';
import { Alert } from 'react-native';

export function mapNetwork(id: string): string {
  const map: Record<string, string> = {
    mtn: 'MTN',
    airtel: 'AIRTEL',
    glo: 'GLO',
    '9mobile': '9MOBILE',
  };
  return map[id.toLowerCase()] || id.toUpperCase();
}

export function mapDisco(id: string): string {
  const map: Record<string, string> = {
    ikeja: 'IKEDC',
    eedc: 'EKEDC',
    phed: 'PHCN',
    kedco: 'ABUJA_DISCO',
    ibedc: 'LAGOS_DISCO',
  };
  return map[id.toLowerCase()] || id.toUpperCase();
}

export function extractTransactionId(result: unknown): string | undefined {
  if (!result || typeof result !== 'object') return undefined;
  const r = result as Record<string, unknown>;
  const data = r.data as Record<string, unknown> | undefined;
  const tx = (r.transaction ?? data?.transaction) as { _id?: string } | undefined;
  const bill = (r.bill ?? data?.bill) as { _id?: string } | undefined;
  return (
    tx?._id ||
    (r.transactionId as string | undefined) ||
    (data?.transactionId as string | undefined) ||
    bill?._id
  );
}

export function handleBillSuccess(
  router: Router,
  result: unknown,
  fallbackMessage = 'Payment completed successfully.',
) {
  const transactionId = extractTransactionId(result);
  if (transactionId) {
    router.replace({
      pathname: '/receipt/[transactionId]',
      params: { transactionId },
    });
    return;
  }
  Alert.alert('Success', fallbackMessage, [{ text: 'OK', onPress: () => router.back() }]);
}

export function handleBillError(error: unknown, label = 'Payment Failed') {
  const message = error instanceof Error ? error.message : 'Unable to complete payment right now.';
  Alert.alert(label, message);
}
