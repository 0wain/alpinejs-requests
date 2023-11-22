const Plugin = function (Alpine) {
    const methods = [
        {
            directive: 'request'
        },
        {
            directive: 'post',
            method: 'POST'
        },
        {
            directive: 'get',
            method: 'GET'
        },
    ]

    // Regiter all the aliases
    methods.forEach((type) => {
        Alpine.directive(type.directive, (el, { expression }, { evaluate, cleanup }) => {
            let data = evalExpression(expression, evaluate);

            el.addEventListener('click', () => {
                processRequest({
                    el,
                    method: type.method,
                    ...data
                });
            })
            cleanup(() => observer.disconnect())
        })
        Alpine.magic(type.directive, (el, { evaluate }) => expression =>{
            let data = evalExpression(expression, evaluate);
            processRequest({el, ...data});
        })
    });


    function processRequest({el, method, route, headers, body}) {
        console.log({el, method, route, headers, body});
        // Make the request
        fetch(route, {
            method: method ?? "POST",
            headers,
            body
        }).then((response) => {
            // Trigger the @request event.
            el.dispatchEvent(new CustomEvent('request', {
                detail: {
                    state:'success',
                    response
                }
            }))
            // Trigger the @ event.
            el.dispatchEvent(new CustomEvent((method ?? 'post').toLowerCase(), {
                detail: {
                    state:'success',
                    response
                }
            }))
        }).catch((error) => {
            console.warn(error);
            // Trigger the @request event.
            el.dispatchEvent(new CustomEvent('request', {
                detail: {
                    state:'error',
                    response
                }
            }))
            // Trigger the @ event.
            el.dispatchEvent(new CustomEvent((method ?? 'post').toLowerCase(), {
                detail: {
                    state:'error',
                    response
                }
            }))
        })
    }

    // Used to convert input string to object
    function evalExpression(expression, evaluate) {
        let data = {}

        if (!(typeof expression === 'string')) {
            data = expression;
        } else if (expression.startsWith('{')) {
            data = evaluate(expression);
        } else {
            data.route = expression;
        }

        return data;
    }
}

export default  Plugin
