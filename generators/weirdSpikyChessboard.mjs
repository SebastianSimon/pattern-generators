import fixValues from "../lib/fixValues.mjs";

const optionFields = {
    width: {
      label: "Width",
      nodeName: "INPUT",
      type: "number",
      min: 1,
      max: 2048,
      step: 1,
      value: 1024
    },
    height: {
      label: "Height",
      nodeName: "INPUT",
      type: "number",
      min: 1,
      max: 2048,
      step: 1,
      value: 1024
    },
    xOffset: {
      label: "Horizontal offset",
      nodeName: "INPUT",
      type: "number",
      step: 1,
      value: 0
    },
    yOffset: {
      label: "Vertical offset",
      nodeName: "INPUT",
      type: "number",
      step: 1,
      value: 0
    },
    redScale: {
      label: "Red factor",
      nodeName: "INPUT",
      type: "number",
      step: "any",
      min: 0,
      value: 0.125
    },
    redYOffset: {
      label: "Use vertical offset for red",
      title: "Check this to use (y MOD (x XOR y)) instead of (x MOD (x XOR y)) for the red channel",
      nodeName: "INPUT",
      type: "checkbox",
      checked: true
    },
    greenScale: {
      label: "Green factor",
      nodeName: "INPUT",
      type: "number",
      step: "any",
      min: 0,
      value: 0.125
    },
    greenYOffset: {
      label: "Use vertical offset for green",
      title: "Check this to use (y MOD (x XOR y)) instead of (x MOD (x XOR y)) for the green channel",
      nodeName: "INPUT",
      type: "checkbox",
      checked: false
    },
    blueScale: {
      label: "Blue factor",
      nodeName: "INPUT",
      type: "number",
      step: "any",
      min: 0,
      value: 0.5
    },
    blueYOffset: {
      label: "Use vertical offset for blue",
      title: "Check this to use (y MOD (x XOR y)) instead of (x MOD (x XOR y)) for the blue channel",
      nodeName: "INPUT",
      type: "checkbox",
      checked: true
    }
  };

export default {
  "Weird Spiky Chessboard": {
    title: "Generates a weird-looking spiky chessboard pattern",
    description: "For each pixel (x, y), this calculates something like (x MOD (x XOR y)) or (y MOD (x XOR y)), scaled differently in each color channel. The result is something that looks like a chessboard-based fractal.",
    options: optionFields,
    generator(ctx, { ...options }){
      options = fixValues(options, optionFields);
      
      const {
          width,
          height,
          xOffset,
          yOffset,
          redScale,
          redYOffset,
          greenScale,
          greenYOffset,
          blueScale,
          blueYOffset
        } = options,
        bitmap = new Uint8ClampedArray(width * height * 4);
      let byte = 0;
      
      Object.assign(ctx.canvas, Object.freeze({
        width,
        height
      }));
      
      for(let y = 0; y < height; ++y){
        for(let x = 0; x < width; ++x){
          const xPlus = x + xOffset,
            yPlus = y + yOffset,
            xor = xPlus ^ yPlus;
          
          bitmap[byte++] = ((redYOffset
            ? yPlus
            : xPlus) % xor) * redScale;
          bitmap[byte++] = ((greenYOffset
            ? yPlus
            : xPlus) % xor) * greenScale;
          bitmap[byte++] = ((blueYOffset
            ? yPlus
            : xPlus) % xor) * blueScale;
          bitmap[byte++] = 0xFF;
        }
      }
      
      ctx.putImageData(new ImageData(bitmap, width), 0, 0);
      
      return options;
    }
  }
};
