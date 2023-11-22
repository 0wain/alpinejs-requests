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
        processRequest({
          el,
          method: type.method,
          ...data
        });
      });
      cleanup(() => observer.disconnect());
    });
    Alpine.magic(type.directive, (el, { evaluate }) => (expression) => {
      let data = evalExpression(expression, evaluate);
      processRequest({ el, ...data });
    });
  });
  function processRequest({ el, method, route, headers, body }) {
    console.log({ el, method, route, headers, body });
    fetch(route, {
      method: method ?? "POST",
      headers,
      body
    }).then((response2) => {
      el.dispatchEvent(new CustomEvent("request", {
        detail: {
          state: "success",
          response: response2
        }
      }));
      el.dispatchEvent(new CustomEvent((method ?? "post").toLowerCase(), {
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
      el.dispatchEvent(new CustomEvent((method ?? "post").toLowerCase(), {
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
export {
  module_default as default
};
