function hasRandomUuid(): boolean {
  return typeof globalThis.crypto?.randomUUID === 'function';
}

function getRandomHex(bytes: number): string {
  const length = Math.max(1, Math.floor(bytes));
  const buffer = new Uint8Array(length);

  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(buffer);
  } else {
    for (let index = 0; index < buffer.length; index += 1) {
      buffer[index] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(buffer, value => value.toString(16).padStart(2, '0')).join('');
}

export function createClientId(prefix = 'id'): string {
  const normalizedPrefix = prefix.trim().length > 0 ? prefix.trim() : 'id';

  if (hasRandomUuid()) {
    return `${normalizedPrefix}-${globalThis.crypto.randomUUID()}`;
  }

  const timestamp = Date.now().toString(36);
  const randomSuffix = getRandomHex(10);
  return `${normalizedPrefix}-${timestamp}-${randomSuffix}`;
}
