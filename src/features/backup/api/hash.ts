import * as Crypto from 'expo-crypto';

import type { HashFn } from '../lib/format';

/** SHA-256 as lowercase hex (the checksum of a backup file). */
export const sha256Hex: HashFn = (text) => Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text);
