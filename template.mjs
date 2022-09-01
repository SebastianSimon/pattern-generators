import fixValues from "../lib/fixValues.mjs";
import hexToArray from "../lib/hexToArray.mjs";

const optionFields = {
    width: {
      label: "Width",
      nodeName: "INPUT",
      type: "number",
      min: 1,
      max: 2048,
      step: 1,
      value: 256
    },
    height: {
      label: "Height",
      nodeName: "INPUT",
      type: "number",
      min: 1,
      max: 2048,
      step: 1,
      value: 256
    }
  },
  hexToArrayOpaque = hexToArray(0xff);

export default {
  "Name": {
    title: "",
    description: "",
    options: optionFields,
    generator(ctx, { ...options }){
      options = fixValues(options, optionFields);
      
      const {
          width,
          height
        } = options,
        bitmap = new Uint8ClampedArray([]);
      
      Object.assign(ctx.canvas, Object.freeze({
        width,
        height
      }));
      
      // …
      
      ctx.putImageData(new ImageData(bitmap, width), 0, 0);
      
      return options;
    }
  }
};
