import fixValues from "../lib/fixValues.mjs";

const optionFields = {
    width: {
      label: "Width",
      nodeName: "INPUT",
      type: "number",
      min: 1,
      max: 2048,
      step: 1,
      value: 512
    },
    color1: {
      label: "Color 1",
      nodeName: "INPUT",
      type: "color",
      value: "#ff8833"
    },
    height: {
      label: "Height",
      nodeName: "INPUT",
      type: "number",
      min: 1,
      max: 2048,
      step: 1,
      value: 512
    },
    color2: {
      label: "Color 2",
      nodeName: "INPUT",
      type: "color",
      value: "#ffff66"
    },
    maxAmplitude: {
      label: "Maximum amplitude",
      nodeName: "INPUT",
      type: "number",
      step: "any",
      value: 12
    }
  },
  lengthObject = (length) => Object.freeze({
      length
    }),
  sumReducer = (sum, value) => sum + value,
  wrapCurve = (ctx, randCurve, x, y) => randCurve.forEach((a, i) => ctx.lineTo(Math.cos(i * Math.PI / 45) * (a + 36) + x, Math.sin(i * Math.PI / 45) * (a + 36) + y));

export default {
  "M. C. Escher Mosaic": {
    title: "Generates a pattern based on mosaic pictures by M. C. Escher",
    description: "Generates a pattern based on <a href=\"https://www.google.com/search?q=M.+C.+Escher+mosaic&amp;tbm=isch\">mosaic pictures by M. C. Escher</a>.",
    options: optionFields,
    generator(ctx, { ...options }){
      options = fixValues(options, optionFields);
      
      const {
          color1,
          color2,
          width,
          height,
          maxAmplitude
        } = options,
        [
          cCount,
          randCurveSamples
        ] = [
            10,
            90
          ].map(lengthObject),
        sf = Array.from(cCount, () => ({
          s: Math.random(),
          randomAmplitude: Math.random() * maxAmplitude
        })),
        randCurve = Array.from(randCurveSamples, (_, i) => sf.map(({ s, randomAmplitude }) => Math.sin(i * s) * randomAmplitude)
          .reduce(sumReducer, 0));
      
      Object.assign(ctx.canvas, Object.freeze({
        width,
        height
      }));
      
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);
      
      for(let y = -31.5; y < height + 48.5; y += 32){
        for(let x = -31.5; x < width + 48.5; x += 32){
          ctx.strokeStyle = [
            color1,
            color2
          ][Math.abs(((x - 0.5) / 32) + ((y - 0.5) / 32)) % 2];
          ctx.fillStyle = ctx.strokeStyle;
          ctx.beginPath();
          wrapCurve(ctx, randCurve, x, y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }
      
      return options;
    }
  }
};
