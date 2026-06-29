import type { User } from './models';

/** AmstaPay account number — supports legacy BluPay field from API. */
export function getAccountNumber(user?: User | null): string | undefined {
  if (!user) return undefined;
  const u = user as User & { amstaAccountNumber?: string };
  return u.amstaAccountNumber || u.blupayAccountNumber || u.accountNumber;
}
