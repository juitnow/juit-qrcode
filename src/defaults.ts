import type { QRCodeOptions } from './index'

/** Shared defaults (exported here to avoid import loops) */
export const QR_CODE_DEFAULTS = {
  ecLevel: 'M',
  url: false,
  scale: 1,
  margin: 1,
} as const satisfies Required<QRCodeOptions>
