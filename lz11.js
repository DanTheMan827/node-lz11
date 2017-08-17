/*!
  Copyright 2017, Daniel Radtke (DanTheMan827)

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted, provided that the above
  copyright notice and this permission notice appear in all copies.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
/*!
  Based on the work by mtheall located at
  https://github.com/mtheall/decompress/
*/

/**
 * Decompresses a LZ11 compressed buffer
 * @name   decompress
 * @param  {Buffer} inputBuffer          LZ11 compressed buffer
 * @param  {Integer} maxDecompressedSize The maximum size for the output buffer
 * @return {Buffer}                      The decompressed data buffer
 */
function lz11Decompress (inputBuffer, maxDecompressedSize) {
  return new Promise(function (resolve, reject) {
    var readOffset = 0
    var writeOffset = 0
    var size = inputBuffer.readUIntLE(0x1, 0x3)

    if (maxDecompressedSize && maxDecompressedSize > size) {
      reject('The decompressed size would exceed the maximum size specified.')
      return
    }
    var src = inputBuffer.slice(4)

    var dst = Buffer.alloc(size)

    while (size > 0) {
      // read in the flags data
      // from bit 7 to bit 0, following blocks:
      //     0: raw byte
      //     1: compressed block
      var flags = src[readOffset++]
      for (var i = 0; i < 8 && size > 0; i++, flags = flags << 1) {
        if (flags & 0x80) { // compressed blocks
          var len = 0  // length
          var disp = 0 // displacement
          switch (src[readOffset] >> 4) {
            case 0: // extended block
              len = src[readOffset++] << 4
              len = len | (src[readOffset] >> 4)
              len = len + 0x11
              break
            case 1: // extra extended block
              len = (src[readOffset++] & 0x0f) << 12
              len = len | src[readOffset++] << 4
              len = len | (src[readOffset] >> 4)
              len = len + 0x111
              break
            default: // normal block
              len = (src[readOffset] >> 4) + 1
          }

          disp = (src[readOffset++] & 0x0f) << 8
          disp = disp | src[readOffset++]

          size -= len

          // for len, copy data from the displacement
          // to the current buffer position
          for (var _ = 0; _ < len; _++) {
            dst[writeOffset++] = dst[writeOffset - disp - 2]
          }
        } else { // uncompressed block
          dst[writeOffset++] = src[readOffset++]
          size--
        }
      }
    }
    resolve(dst)
  })
}

exports.decompress = lz11Decompress
module.exports = exports
