var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// builds/module.js
__export(exports, {
  default: () => module_default
});

// src/index.js
var Plugin = function(Alpine) {
  const methods = [
    {
      directive: "request"
    },
    {
      directive: "post",
      method: "POST"
    },
    {
      directive: "get",
      method: "GET"
    }
  ];
  methods.forEach((type) => {
    Alpine.directive(type.directive, (el, { expression }, { evaluate, cleanup }) => {
      let data = evalExpression(expression, evaluate);
      el.addEventListener("click", () => {
        processRequest(__spreadValues({
          el,
          method: type.method
        }, data));
      });
      cleanup(() => observer.disconnect());
    });
    Alpine.magic(type.directive, (el, { evaluate }) => (expression) => {
      let data = evalExpression(expression, evaluate);
      processRequest(__spreadValues({ el }, data));
    });
  });
  function processRequest({ el, method, route, headers, body }) {
    console.log({ el, method, route, headers, body });
    fetch(route, {
      method: method != null ? method : "POST",
      headers,
      body
    }).then((response2) => {
      el.dispatchEvent(new CustomEvent("request", {
        detail: {
          state: "success",
          response: response2
        }
      }));
      el.dispatchEvent(new CustomEvent((method != null ? method : "post").toLowerCase(), {
        detail: {
          state: "success",
          response: response2
        }
      }));
    }).catch((error) => {
      console.warn(error);
      el.dispatchEvent(new CustomEvent("request", {
        detail: {
          state: "error",
          response
        }
      }));
      el.dispatchEvent(new CustomEvent((method != null ? method : "post").toLowerCase(), {
        detail: {
          state: "error",
          response
        }
      }));
    });
  }
  function evalExpression(expression, evaluate) {
    let data = {};
    if (!(typeof expression === "string")) {
      data = expression;
    } else if (expression.startsWith("{")) {
      data = evaluate(expression);
    } else {
      data.route = expression;
    }
    return data;
  }
};
var src_default = Plugin;

// builds/module.js
var module_default = src_default;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
