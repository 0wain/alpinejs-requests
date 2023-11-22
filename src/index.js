const Plugin = function (Alpine) {
    Alpine.directive('post', (el, { expression }, { evaluate, cleanup }) => {
        // Support for just a route or an object of data
        let data = evalExpression(expression, evaluate);


        // Listen for the click event
        el.addEventListener('click', () => {
            processRequest({
                el,
                ...data
            });
        })

        cleanup(() => observer.disconnect())
    })
    Alpine.magic('post', (el, { evaluate }) => expression =>{
        let data = evalExpression(expression, evaluate);
        processRequest({
            el,
            ...data
        });
    })

    function processRequest({el, route, headers, body}) {
        // Make the request
        fetch(route, {
            // Maybe allow this to be dynamic in the future?
            method: "POST",
            headers,
            body
        }).then((response) => {
            // Trigger the @posted event.
            el.dispatchEvent(new CustomEvent('posted', {
                state:'success',
                response
            }))
        }).catch((error) => {
            console.warn(error);
            el.dispatchEvent(new CustomEvent('posted', {
                state: 'error',
                error
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
