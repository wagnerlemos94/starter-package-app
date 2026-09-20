export const ACCESS_TOKEN_EXPIRED = 'AccessTokenExpired' as const;

export function calculateAccessTokenExpiresAt(
  expiresInToken: number,
  now = Date.now(),
): number | null {
  if (!Number.isFinite(expiresInToken) || expiresInToken <= 0) {
    return null;
  }

  return now + expiresInToken;
}

export function isAccessTokenExpired(
  expiresAt: unknown,
  now = Date.now(),
): boolean {
  return typeof expiresAt !== 'number'
    || !Number.isFinite(expiresAt)
    || expiresAt <= now;
}

export function getSafeCallbackUrl(value: string | string[] | undefined): string {
  const callbackUrl = Array.isArray(value) ? value[0] : value;

  if (!callbackUrl || !callbackUrl.startsWith('/') || callbackUrl.startsWith('//')) {
    return '/';
  }

  return callbackUrl;
}
