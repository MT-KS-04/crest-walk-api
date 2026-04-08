/**
 * @copyright 2026 MK-TS-04
 * @license Apache-2.0
 */

import logger from '../../lib/winston.js';

const MAX_BYTES = 6 * 1024 * 1024; // 6MB

/**
 * Tải ảnh từ URL phía server (tránh CORS trên trình duyệt khi admin dán link ngoài).
 * POST body: { url: string }
 * Response: binary image + Content-Type từ upstream (hoặc octet-stream).
 */
const fetchRemoteImage = async (req, res) => {
  const { url } = req.body;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return res.status(400).json({
        code: 'ValidationError',
        message: 'Chỉ cho phép URL http hoặc https',
      });
    }

    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.endsWith('.local') ||
      hostname.startsWith('169.254.') ||
      hostname === '[::1]'
    ) {
      return res.status(400).json({
        code: 'ValidationError',
        message: 'URL nội bộ không được phép',
      });
    }

    const upstream = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'CrestWalk-ImageProxy/1.0',
        Accept: 'image/*,*/*;q=0.8',
      },
    });

    if (!upstream.ok) {
      return res.status(400).json({
        code: 'ValidationError',
        message: `Không tải được ảnh (mã ${upstream.status})`,
      });
    }

    const arrayBuffer = await upstream.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_BYTES) {
      return res.status(413).json({
        code: 'ValidationError',
        message: 'Ảnh quá lớn (tối đa 6MB)',
      });
    }

    const contentType =
      upstream.headers.get('content-type')?.split(';')[0]?.trim() ||
      'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'private, no-store');
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (err) {
    logger.error('fetchRemoteImage', err);
    return res.status(500).json({
      code: 'ServerError',
      message: err.message || 'Không tải được ảnh từ URL',
    });
  }
};

export default fetchRemoteImage;
