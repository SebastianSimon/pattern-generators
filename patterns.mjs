Promise.all(JSON.parse(localStorage.getItem("generators") ?? "[]")
  .map((path) => import(path)))
  .then((list) => Object.assign({}, ...list.map(({ default: module }) => module)))
  .then((list) => {
    const domNodes = new Map([
          [ "select", "#generatorSelector select" ],
          [ "addPattern", "#generatorSelector input" ],
          [ "description", "#descriptionContainer" ],
          [ "canvas", "#canvasContainer canvas" ],
          [ "regenerate", "#regenerate" ],
          [ "options", "#optionsContainer" ],
          [ "optionsTemplate", "#optionsFieldset" ]
        ].map(([ key, selector ]) => [
          key,
          document.querySelector(selector)
        ])),
      ctx = domNodes.get("canvas").getContext("2d"),
      generators = Object.freeze({
          list,
          findSelected({ selectedOptions: [ { value: name } ] }){
            const {
              generator,
              description,
              options
            } = this.list[name];
            
            return {
              name,
              generator,
              description,
              options
            };
          }
        }),
      remover = (elem) => elem.remove(),
      sortTextContent = ({ textContent: a }, { textContent: b }) => a.localeCompare(b),
      manageOptions = (container) => ({
        get(){
          return Object.assign({}, ...Array.from(container.querySelectorAll("[name]"), ({ name, type, value, checked, selectedOptions }) => {
            if(type === "radio" && !checked){
              return {};
            }
            
            let usableValue = value;
            
            if(selectedOptions){
              usableValue = Array.from(selectedOptions, ({ value }) => value);
            }
            else if(type === "checkbox"){
              usableValue = checked;
            }
            
            return {
              [name]: usableValue
            };
          }));
        },
        set({ ...options } = {}, generatorName = generators.findSelected(domNodes.get("select")).name){
          Object.entries(options).forEach(([ name, value ]) => {
            const field = container.querySelector(`[name='${name}' s]`);
            
            if(field){
              if(field.matches("select")){
                [
                  ...field.options
                ]
                  .forEach((option) => (option.selected = value.includes(option.value)));
              }
              else if(field.matches("input[type='radio']")){
                field.checked = field.value === value;
              }
              else{
                const property = (field.type === "checkbox"
                  ? "checked"
                  : "value");
                
                field[property] = value;
              }
            }
          });
          localStorage.setItem(`${generatorName} Options`, JSON.stringify(options));
        },
        generate(generator, ctx){
          this.set(generator(ctx, this.get()));
        }
      }),
      showRegenerateButton = () => domNodes.get("regenerate").toggleAttribute("hidden", false),
      populateSelect = (select, generators) => {
        select.append(...Object.entries(generators)
          .map(([ name, { title } ]) => Object.assign(new Option(name), {
            title
          }))
          .sort(sortTextContent));
        select.selectedIndex = 0;
        
        return select;
      },
      populateGenerator = (() => {
        const patterns = Object.freeze({
            radio: /radio/iu,
            input: /INPUT/iu,
            select: /SELECT/iu
          }),
          {
            checkProp,
            describeProp
          } = {
            checkProp(prop){
              return Object.hasOwn(this, prop);
            },
            describeProp(prop){
              return `${prop}: ${this[prop]}`;
            }
          },
          includedPropertiesInTitle = [
            "min",
            "max",
            "step"
          ],
          createLabel = (textContent, title) => {
            const labelElement = Object.assign(document.createElement("label"), {
                textContent
              });
            
            if(title){
              labelElement.title = title;
            }
            
            return labelElement;
          },
          optionsCreator = ([ name, { nodeName, name: _name, label, title, options: { ...options } = {}, ...props } = {} ]) => {
            const isRadio = patterns.radio.test(props.type) && patterns.input.test(nodeName),
              isSelect = patterns.select.test(nodeName),
              isOtherInput = !isRadio && !isSelect,
              propertiesInTitle = includedPropertiesInTitle.filter(checkProp, props),
              result = [];
            
            if(propertiesInTitle.length){
              title = [
                title,
                `[${propertiesInTitle.map(describeProp, props).join("; ")}]`
              ].filter(Boolean).join(" ");
            }
            
            if(isRadio){
              result.push(...Object.entries(options).map(([ value, textContent ]) => {
                const labelElement = createLabel(`${textContent} `, title);
                
                labelElement.append(Object.assign(document.createElement(nodeName || "INPUT"), {
                  name,
                  value,
                  type: "radio",
                  checked: value === props.value
                }));
                
                return labelElement;
              }));
            }
            else if(isSelect){
              const labelElement = createLabel(`${label || name} `, title),
                selectedValues = [
                  props.value
                ].flat();
                
              labelElement.appendChild(Object.assign(document.createElement(nodeName || "SELECT"), props, {
                  name
                }))
                .append(...Object.entries(options).map(([ value, textContent ]) => Object.assign(new Option(textContent, value), {
                  selected: selectedValues.includes(value)
                })));
              result.push(labelElement);
            }
            else if(isOtherInput){
              const labelElement = createLabel(`${label || name} `, title);
              
              labelElement.append(Object.assign(document.createElement(nodeName || "INPUT"), props, {
                name,
                placeholder: props.value || ""
              }));
              result.push(labelElement);
            }
            
            return result;
          };
          
        return ({ name, generator, description, options }, { domNodes, ctx }) => {
          const optionEntries = Object.entries(options);
          
          Array.from(domNodes.get("options").children).forEach(remover);
          
          if(optionEntries.length){
            domNodes.get("options")
              .appendChild(document.importNode(domNodes.get("optionsTemplate").content, true)
              .querySelector("fieldset"))
              .append(...optionEntries.flatMap(optionsCreator));
          }
          
          domNodes.get("description").innerHTML = description;
          showRegenerateButton();
          optionManager.set(JSON.parse(localStorage.getItem(`${name} Options`) || JSON.stringify({})), name);
          optionManager.generate(generator, ctx);
        };
      })(),
      optionManager = manageOptions(domNodes.get("options")),
      {
        selectChangeListener
      } = {
          selectChangeListener(){
            populateGenerator(generators.findSelected(this), {
              domNodes,
              ctx
            });
          }
        },
      insertIntoSelect = (select, generator) => {
        const [
          option
        ] = Object.entries(generator)
            .map(([ name, { title } ]) => Object.assign(new Option(name), {
              title
            }));
        
        select.append(...[
          option,
          ...Array.from(select.options)
            .filter(({ disabled }) => !disabled)
        ]
          .sort(sortTextContent));
        select.selectedIndex = option.index;
        selectChangeListener.call(select);
        
        return option;
      };

    populateSelect(domNodes.get("select"), generators.list)
      .addEventListener("change", selectChangeListener);
    addEventListener("change", ({ target }) => {
      if(domNodes.get("options").contains(target)){
        optionManager.generate(generators.findSelected(domNodes.get("select")).generator, ctx);
      }
    });
    domNodes.get("regenerate").querySelector("input")
      .addEventListener("click", () => optionManager.generate(generators.findSelected(domNodes.get("select")).generator, ctx));
    
    {
      const addGenerator = (path, module) => {
          const storageList = JSON.parse(localStorage.getItem("generators") || "[]"),
            [
              [
                name,
                generator
              ]
            ] = Object.entries(module);
          
          generators.list[name] = generator;
          insertIntoSelect(domNodes.get("select"), module);
          storageList.push(path);
          localStorage.setItem("generators", JSON.stringify(Array.from(new Set(storageList))));
        },
        patternInput = domNodes.get("addPattern").parentElement.appendChild(document.createElement("form")).appendChild(Object.assign(document.createElement("input"), {
            type: "text",
            placeholder: "somePattern",
            title: "Pattern generators must be in the /generators directory and have a .mjs file extension. Enter the file name (extension and path will be completed automatically). Press Enter to add the generator, press Escape to cancel."
          })),
        closeEntry = () => {
          entryMode = false;
          domNodes.get("addPattern").hidden = false;
          patternInput.parentElement.hidden = true;
          patternInput.value = "";
          patternInput.setCustomValidity("");
        };
      let entryMode = false;
      
      patternInput.parentElement.hidden = true;
      domNodes.get("addPattern").addEventListener("click", ({ target }) => {
        entryMode = true;
        target.hidden = true;
        patternInput.parentElement.hidden = false;
        patternInput.focus();
      });
      patternInput.addEventListener("keydown", ({ target, code }) => {
        if(entryMode){
          if(code === "Escape"){
            closeEntry();
          }
          else if(code === "Enter"){
            const path = target.value.replace(/^(?:.*\/)?(?<name>[^/]+?)(?:.mjs)?$/u, "./generators/$<name>.mjs");
            
            if(JSON.parse(localStorage.getItem("generators") || "[]").includes(path)){
              target.setCustomValidity(`Module ${target.value} is already added to the list.`);
            }
            else{
              import(path).then(({ default: module }) => {
                addGenerator(path, module);
                closeEntry();
              }, () => target.setCustomValidity(`Module ${target.value} not found. Make sure the file ./generators/${target.value}.mjs exists.`));
            }
          }
          else{
            target.setCustomValidity("");
          }
        }
      });
      patternInput.parentElement.addEventListener("submit", (event) => event.preventDefault());
    }
  });
