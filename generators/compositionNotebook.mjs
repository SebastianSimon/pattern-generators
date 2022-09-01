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
      value: 300
    },
    height: {
      label: "Height",
      nodeName: "INPUT",
      type: "number",
      min: 1,
      max: 2048,
      step: 1,
      value: 300
    },
    color1: {
      label: "Color 1",
      nodeName: "INPUT",
      type: "color",
      value: "#000000"
    },
    density: {
      label: "Density of Color 2",
      nodeName: "INPUT",
      type: "number",
      step: "any",
      min: 0,
      max: 0.5,
      value: "0.02"
    },
    color2: {
      label: "Color 2",
      nodeName: "INPUT",
      type: "color",
      value: "#ffffff"
    },
    growth: {
      label: "Growth of Color 2",
      nodeName: "INPUT",
      type: "number",
      step: "any",
      min: 0,
      max: 0.999,
      value: "0.985"
    }
  },
  hexToArrayOpaque = hexToArray(0xff),
  sumWhites = (whites, pixel) => whites + pixel,
  {
    mapToColor
  } = {
    mapToColor(value){
      return this[value];
    }
  };

export default {
  "Composition Notebook": {
    title: "Generates a pattern that looks like the cover of a composition notebook",
    description: "Generates a pattern that looks like the cover of a <a href=\"https://google.com/search?q=composition+notebook&amp;tbm=isch\">composition notebook</a>.",
    options: optionFields,
    generator(ctx, { ...options }){
      options = fixValues(options, optionFields);
      
      const color1Index = 0,
        color2Index = 1,
        {
          width,
          height,
          color1,
          color2,
          density,
          growth
        } = options,
        colors = [
          hexToArrayOpaque(color1),
          hexToArrayOpaque(color2)
        ],
        isolatedUncolored = [],
        pixelMap = new Array(width * height).fill(color1Index),
        randomPoints = width * height * density;
      
      Object.assign(ctx.canvas, Object.freeze({
        width,
        height
      }));
      
      for(let i = 0; i < randomPoints; i++){
        const dot = {
          x: Math.floor(Math.random() * (width - 1)),
          y: Math.floor(Math.random() * (height - 1))
        };
        
        while(Math.random() < growth){
          if(dot.x >= 0 && dot.x < width && dot.y >= 0 && dot.y < height){
            pixelMap[width * dot.y + dot.x] = color2Index;
          }
          
          dot[(Math.random() < 0.5
            ? "x"
            : "y")] += (Math.random() < 0.5
              ? -1
              : 1);
        }
      }
      
      for(let y = 1; y < height - 1; ++y){
        for(let x = 1; x < width - 1; ++x){
          const offset = y * width + x;
          
          if(!pixelMap[offset]){
            const coloredNeighbors = [
                pixelMap[offset - width],
                pixelMap[offset + 1],
                pixelMap[offset + width],
                pixelMap[offset - 1]
              ].reduce(sumWhites, 0);
            
            if(coloredNeighbors === 4 || coloredNeighbors === 3 && Math.random() < 0.3){
              isolatedUncolored.push(offset);
            }
          }
        }
      }
      
      isolatedUncolored.forEach((offset) => pixelMap[offset] = color2Index);
      ctx.putImageData(new ImageData(new Uint8ClampedArray(pixelMap.flatMap(mapToColor, colors)), width), 0, 0);
      
      return options;
    }
  }
};
