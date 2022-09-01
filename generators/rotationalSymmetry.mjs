import fixValues from "../lib/fixValues.mjs";

const optionFields = {
    size: {
      label: "Size",
      nodeName: "INPUT",
      type: "number",
      min: 1,
      max: 2048,
      step: 1,
      value: 256
    },
    rotationOrder: {
      label: "Order of rotational symmetry",
      nodeName: "INPUT",
      type: "number",
      min: 1,
      max: 60,
      step: 1,
      value: 5
    }
  },
  lengthObj = (length) => Object.freeze({
    length
  }),
  randomPointFromCircle = (x, y, r) => {
    const theta = 2 * Math.PI * Math.random();
    
    return {
      x: r * Math.cos(theta) + x,
      y: r * Math.sin(theta) + y
    };
  },
  numSets = 2,
  trianglesAmount = lengthObj(12);

export default {
  "Rotational Symmetry": {
    title: "Generates colorful shapes, rotationally symmetric",
    description: "Randomly generates colorful tiny triangles, arranged in a rotationally symmetric way. This is reminiscent of <a href=\"https://www.google.com/search?q=identicons&amp;tbm=isch\">identicons</a>.",
    options: optionFields,
    generator(ctx, { ...options }){
      options = fixValues(options, optionFields);
      
      const {
          size,
          rotationOrder
        } = options,
        width = size,
        height = size,
        minSide = Math.min(width, height),
        triangleSets = Array.from(lengthObj(numSets), () => ({
          randColor: `#${Math.floor((256 ** 3) * Math.random()).toString(16).padStart(6, "0")}`,
          triangles: Array.from(trianglesAmount, () => new Array(3).fill([
            width / 2 + (Math.random() - 0.5) * (minSide / 4),
            height / 4 + (Math.random() - 0.5) * (minSide / 4) + Math.max(0, (height - width) / 4),
            minSide / 32
          ]).map((args) => randomPointFromCircle(...args)))
        }));
      
      Object.assign(ctx.canvas, Object.freeze({
        width,
        height
      }));
      
      triangleSets.forEach(({ triangles, randColor }) => {
        let rotation = rotationOrder;
        
        Object.assign(ctx, Object.freeze({
          fillStyle: randColor,
          strokeStyle: randColor
        }));
        
        while(rotation--){
          triangles.forEach(([ { x: firstX, y: firstY }, ...otherPoints ]) => {
            ctx.beginPath();
            ctx.moveTo(firstX, firstY);
            otherPoints.forEach(({ x, y }) => ctx.lineTo(x, y));
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
          });
          ctx.translate(width / 2, height / 2);
          ctx.rotate(Math.PI * 2 / rotationOrder);
          ctx.translate(-width / 2, -height / 2);
        }
        
        ctx.translate(width / 2, height / 2);
        ctx.rotate(Math.PI * 2 / (rotationOrder * 2));
        ctx.translate(-width / 2, -height / 2);
      });
      
      return options;
    }
  }
};
