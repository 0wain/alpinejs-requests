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

    methods.forEach((type) => {
        Alpine.directive(type.directive, (el, { expression }, { evaluate, cleanup }) => {
            directiveSetup({el, method: type.method, expression, evaluate})
            cleanup(() => observer.disconnect())
        })
        Alpine.magic(type.directive, (el, { evaluate }) => expression =>{
            let data = evalExpression(expression, evaluate);
            processRequest({el, ...data});
        })
    });



    function directiveSetup({el, method, expression, evaluate}) {
        let data = evalExpression(expression, evaluate);

        el.addEventListener('click', () => {
            processRequest({
                el,
                method,
                ...data
            });
        })
    }

    function processRequest({el, method, route, headers, body}) {
        console.log({el, method, route, headers, body});
        // Make the request
        fetch(route, {
            // Maybe allow this to be dynamic in the future?
            method: method ?? "POST",
            headers,
            body
        }).then((response) => {
            // Trigger the @request event.
            el.dispatchEvent(new CustomEvent('request', {
                state:'success',
                response
            }))
            // Trigger the @ event.
            el.dispatchEvent(new CustomEvent((method ?? 'post').toLowerCase(), {
                state:'success',
                response
            }))
        }).catch((error) => {
            console.warn(error);
            // Trigger the @request event.
            el.dispatchEvent(new CustomEvent('request', {
                state:'error',
                response
            }))
            // Trigger the @ event.
            el.dispatchEvent(new CustomEvent((method ?? 'post').toLowerCase(), {
                state:'error',
                response
            }))
        })
    }

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
