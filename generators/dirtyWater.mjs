import fixValues from "../lib/fixValues.mjs";

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
    background: {
      label: "Background color",
      nodeName: "INPUT",
      type: "color",
      value: "#141150"
    },
    numOfLines: {
      label: "Number of line segments",
      nodeName: "INPUT",
      type: "number",
      min: 0,
      max: 10000,
      step: 1,
      value: 280
    },
    lineElongation: {
      label: "Line elongation probability",
      title: "Probability for a line segment to get a pixel longer, each pixel (as long as pixels are on-canvas)",
      nodeName: "INPUT",
      type: "number",
      min: 0,
      max: 1,
      step: "any",
      value: 0.997
    },
    horizontalElongation: {
      label: "Horizontal probability",
      title: "Probability of a line segment elongating horizontally, rather than vertically",
      nodeName: "INPUT",
      type: "number",
      min: 0,
      max: 1,
      step: "any",
      value: 0.3
    },
    descent: {
      label: "Downward descent probability",
      title: "Probability that line segments elongate in the bottom right direction; 1.0 means always, 0.0 means never (upper left direction), 0.5 doesn’t prefer any specific direction",
      nodeName: "INPUT",
      type: "number",
      min: 0,
      max: 1,
      step: "any",
      value: 0.9
    }
  };

export default {
  "Dirty Water": {
    title: "Generates a dirty water pattern",
    description: "Generates something that looks like water made dirty by randomly drawn lines.",
    options: optionFields,
    generator(ctx, { ...options }){
      options = fixValues(options, optionFields);
      
      const linePalette = Object.freeze([
          "#132583",
          "#324eb6",
          "#6384d2"
        ]),
        {
          width,
          height,
          numOfLines,
          background,
          ...probabilities
        } = options;
      
      Object.assign(ctx.canvas, Object.freeze({
        width,
        height
      }));
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      Array.from({
        length: numOfLines
      }, () => ({
        x: Math.floor(Math.random() * (width - 1)),
        y: Math.floor(Math.random() * (height - 1))
      }))
        .forEach((dot) => {
          ctx.fillStyle = linePalette[Math.floor(Math.random() * linePalette.length)];
          
          while(Math.random() < probabilities.lineElongation){
            if(dot.x >= 0 && dot.x < width && dot.y >= 0 && dot.y < height){
              ctx.fillRect(dot.x, dot.y, 1, 1);
            }
            else{
              break;
            }
            
            dot[(Math.random() < probabilities.horizontalElongation
              ? "x"
              : "y")] += (Math.random() < probabilities.descent
                ? 1
                : -1);
          }
        });
      
      return options;
    }
  }
};
