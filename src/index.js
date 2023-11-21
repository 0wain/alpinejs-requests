const Plugin = function (Alpine) {
    Alpine.directive('plugin', (el, obj, { evaluateLater, effect, cleanup }) => {
        let { value, expression, modifiers } = obj;
        let evaluate = evaluateLater(expression);

        cleanup(() => observer.disconnect())
    })
    Alpine.magic('magic',() => { return 'magic' })
}

export default  Plugin
