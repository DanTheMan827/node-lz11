[![npm][npm]][npm-url]
[![deps][deps]][deps-url]

# lz11
Decompresses a LZ11 compressed buffer

# API
<a name="decompress"></a>

## decompress ⇒ <code>Promise.&lt;Buffer&gt;</code>
Decompresses a LZ11 compressed buffer

**Kind**: global variable  
**Returns**: <code>Promise.&lt;Buffer&gt;</code> - A promise that resolves to the decompressed data buffer  

| Param | Type | Description |
| --- | --- | --- |
| inputBuffer | <code>Buffer</code> | LZ11 compressed buffer |
| maxDecompressedSize | <code>Integer</code> | The maximum size for the output buffer |


# Credit
Based on the work by mtheall located at
https://github.com/mtheall/decompress/

[npm]: https://img.shields.io/npm/v/lz11.svg
[npm-url]: https://npmjs.com/package/lz11

[deps]: https://david-dm.org/dantheman827/lz11.svg
[deps-url]: https://david-dm.org/dantheman827/lz11
