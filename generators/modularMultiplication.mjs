import fixValues from "../lib/fixValues.mjs";

const optionFields = {
    exponent: {
      label: "Width or Height, 2 to the power of",
      nodeName: "INPUT",
      type: "number",
      value: 8,
      step: 1,
      min: 0,
      max: 11
    }
  };

export default {
  "Modular Multiplication": {
    title: "Generates a pattern based on modular multiplication",
    description: "Generates a pattern based on modular multiplication. Basically, the brightness of each pixel (x, y) is determined by (x · y) MOD m, where m is the maximum brightness.",
    options: optionFields,
    generator(ctx, { ...options }){
      options = fixValues(options, optionFields);
      
      const {
          exponent
        } = options,
        powerOfTwo = 2 ** exponent,
        brightnessFactor = 2 ** (8 - exponent),
        width = powerOfTwo,
        height = powerOfTwo,
        alphaValue = 0xff,
        pixelMap = [];
      
      Object.assign(ctx.canvas, Object.freeze({
        width,
        height
      }));
      
      for(let y = 0; y < height; ++y){
        for(let x = 0; x < width; ++x){
          pixelMap.push(...new Array(3).fill(brightnessFactor * ((x * y) % powerOfTwo)), alphaValue);
        }
      }
      
      ctx.putImageData(new ImageData(new Uint8ClampedArray(pixelMap), width), 0, 0);
      
      return options;
    }
  }
};
