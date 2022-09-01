export default (alpha) => (hex) => Array.from(new Uint8ClampedArray(Uint32Array.of(parseInt(hex.slice(1), 16) * 0x100 + alpha).buffer).reverse());
