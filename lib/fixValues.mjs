const inputPattern = /INPUT/iu,
  fixableTypes = {
    "INPUT:number"(value, optionField){
      value = value || optionField.value;
      
      if(Object.hasOwn(optionField, "step") && optionField.step !== "any"){
        value = Math.round(value / optionField.step) * optionField.step;
      }
      
      if(Object.hasOwn(optionField, "min")){
        value = Math.max(optionField.min, value);
      }
      
      if(Object.hasOwn(optionField, "max")){
        value = Math.min(optionField.max, value);
      }
      
      return value;
    }
  };

export default ({ ...options }, { ...optionFields }) => Object.fromEntries(Object.entries(options)
  .map(([ name, value ]) => {
    const optionField = optionFields[name],
      fixableType = optionField.nodeName.toUpperCase() + (inputPattern.test(optionField.nodeName)
        ? `:${optionField.type.toLowerCase()}`
        : ""),
      fixType = fixableTypes[fixableType];
    
    if(fixType){
      value = fixType(value, optionField);
    }
    
    return [
      name,
      value
    ];
  }));
