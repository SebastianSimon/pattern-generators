import fixValues from "../lib/fixValues.mjs";

const optionFields = {
    inputUUID: {
      label: "Input UUID",
      nodeName: "INPUT",
      type: "text",
      value: "ffffffffffffffffffffffffffffff00"
    },
    sideLength: {
      label: "Side length of pentagons",
      nodeName: "INPUT",
      type: "number",
      min: 1,
      max: 1000,
      step: 1,
      value: 50
    }
  },
  lengthObj = (length) => Object.freeze({
    length
  }),
  {
    drawSide
  } = {
    drawSide(){
      this.ctx.lineTo(this.pentagon.sideLength, 0);
      this.ctx.translate(this.pentagon.sideLength, 0);
      this.ctx.rotate(-this.pentagon.angle);
    }
  },
  sidesAmount = lengthObj(5);

export default {
  "UUIDs": {
    title: "Generates colorful pentagons and hexadecimal digits based on a UUID",
    description: "Generates five pentagons and hexadecimal digits in the middle based on a UUID, which is easy to visually distinguish.",
    options: optionFields,
    generator(ctx, { ...options }){
      options = fixValues(options, optionFields);
      
      const uuidPattern = /^[0-9a-z]{32}$/,
        nonUUIDPattern = /[^0-9a-z]/g,
        sixHexPattern = /.{6}/g,
        defaultUUID = `${"f".repeat(30)}${"0".repeat(2)}`,
        pentagon = ((sideLength) => Object.freeze({
          height: sideLength * (Math.cos(0.1 * Math.PI) + Math.cos(0.3 * Math.PI)),
          sideToCenter: (sideLength / 2) * Math.tan(0.3 * Math.PI),
          angle: 0.4 * Math.PI,
          sides: Array.from(sidesAmount).fill(),
          sideLength
        }))(options.sideLength),
        radius = pentagon.sideToCenter + pentagon.height,
        width = 2 * (radius + 1),
        height = 2 * (radius + 1),
        drawingContext = {
          pentagon,
          ctx
        };
      let inputUUID = options.inputUUID.toLowerCase().replace(nonUUIDPattern, "");
      
      Object.assign(ctx.canvas, Object.freeze({
        width,
        height
      }));
      
      if(!uuidPattern.test(inputUUID)){
        inputUUID = defaultUUID;
      }
      
      const centerText = inputUUID.slice(-2);

      ctx.translate((width - pentagon.sideLength) / 2, 1 + pentagon.height);
      inputUUID.match(sixHexPattern).forEach((color) => {
        ctx.fillStyle = `#${color}`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        pentagon.sides.forEach(drawSide, drawingContext);
        ctx.closePath();
        ctx.fill();
        ctx.translate(pentagon.sideLength / 2, pentagon.sideToCenter);
        ctx.rotate(pentagon.angle);
        ctx.translate(-pentagon.sideLength / 2, -pentagon.sideToCenter);
      });
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#000000";
      ctx.font = `${pentagon.sideLength}px monospace`;
      ctx.fillText(centerText, (width - ctx.measureText(centerText).width) / 2, (height + pentagon.sideToCenter) / 2);
      
      return options;
    }
  }
};
