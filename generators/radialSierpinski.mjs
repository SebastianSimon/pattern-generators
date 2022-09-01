import fixValues from "../lib/fixValues.mjs";

const optionFields = {
    formulaRed: {
      nodeName: "SELECT",
      label: "Expression for red channel",
      value: "xx-yy",
      options: {
        "xx-xx": "(x · x) AND (x · x)",
        "xx-xy": "(x · x) AND (x · y)",
        "xx-yy": "(x · x) AND (y · y)",
        "xy-xy": "(x · y) AND (x · y)",
        "xy-yy": "(x · y) AND (y · y)",
        "yy-yy": "(y · y) AND (y · y)"
      }
    },
    formulaGreen: {
      nodeName: "SELECT",
      label: "Expression for green channel",
      value: "xy-yy",
      options: {
        "xx-xx": "(x · x) AND (x · x)",
        "xx-xy": "(x · x) AND (x · y)",
        "xx-yy": "(x · x) AND (y · y)",
        "xy-xy": "(x · y) AND (x · y)",
        "xy-yy": "(x · y) AND (y · y)",
        "yy-yy": "(y · y) AND (y · y)"
      }
    },
    formulaBlue: {
      nodeName: "SELECT",
      label: "Expression for blue channel",
      value: "xx-xy",
      options: {
        "xx-xx": "(x · x) AND (x · x)",
        "xx-xy": "(x · x) AND (x · y)",
        "xx-yy": "(x · x) AND (y · y)",
        "xy-xy": "(x · y) AND (x · y)",
        "xy-yy": "(x · y) AND (y · y)",
        "yy-yy": "(y · y) AND (y · y)"
      }
    }
  };

export default {
  "Radial Sierpinski": {
    title: "Generates a pattern resembling the Sierpinski triangle, but radial",
    description: "For each pixel (x, y) the expression z<sub>1</sub> AND z<sub>2</sub> is calculated, where z<sub>i</sub> is either x · x, x · y, or y · y. Each color channel can use a different expression.",
    options: optionFields,
    generator(ctx, { ...options }){
      options = fixValues(options, optionFields);
      
      const width = 256,
        height = 256,
        bitmap = new Uint8ClampedArray(width * height * 4),
        {
          formulaRed: [
            formulaRed
          ],
          formulaGreen: [
            formulaGreen
          ],
          formulaBlue: [
            formulaBlue
          ]
        } = options,
        [
          red1,
          red2
        ] = formulaRed.split("-"),
        [
          green1,
          green2
        ] = formulaGreen.split("-"),
        [
          blue1,
          blue2
        ] = formulaBlue.split("-");
      let byte = 0;
      
      Object.assign(ctx.canvas, Object.freeze({
        width,
        height
      }));
      
      for(let y = 0; y < height; ++y){
        for(let x = 0; x < width; ++x){
          const expressions = {
            xx: x * x,
            xy: x * y,
            yy: y * y
          };
          
          bitmap[byte++] = expressions[red1] & expressions[red2];
          bitmap[byte++] = expressions[green1] & expressions[green2];
          bitmap[byte++] = expressions[blue1] & expressions[blue2];
          bitmap[byte++] = 0xFF;
        }
      }
      
      ctx.putImageData(new ImageData(bitmap, width), 0, 0);
      
      return options;
    }
  }
};
