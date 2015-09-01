(function() {

    var wrapFunction = function(fn, context, params) {
        return function() {
            fn.apply(context, params);
        };
    };

    module.exports.wrapFunction = wrapFunction;

})();