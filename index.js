"use strict";

var Color = require('color');

module.exports = function (tasks, stylecow) {

    tasks.addTask({
        forBrowsersLowerThan: {
            explorer: 9.0
        },
        filter: {
            type: 'Declaration',
            name: ['background', 'background-image']
        },
        fn: function (declaration) {
            var fn = declaration.get({
                type: 'Function',
                name: 'linear-gradient'
            });

            if (fn) {
                let filter = getFilter(fn.toArray());

                if (filter) {
                    addMsFilter(declaration.getParent('Block'), filter);
                }
            }
        }
    });

    function addMsFilter (block, filter) {
        var declaration = block.getChild({
                type: 'Declaration',
                name: 'filter',
                vendor: 'ms'
            });

        if (!declaration) {
            return block.pushCode('-ms-filter: ' + filter, 'Declaration', 'createMsFilter');
        }

        if (declaration.is({string: '-ms-filter: none;'})) {
            return declaration
                .get({
                    type: 'Keyword',
                    name: 'none'
                })
                .replaceWith((new stylecow.String()).setName(filter));
        }

        var string = declaration.get('String');

        if (string.name) {
            string.name += ',' + filter;
        } else {
            string.name = filter;
        }
    }
};

function getFilter (params) {
    var direction, reverse;

    switch (params.shift()) {
        case 'top':
        case 'to bottom':
        case '90deg':
            direction = 'vertical';
            reverse = false;
            break;

        case 'bottom':
        case 'to top':
        case '-90deg':
            direction = 'vertical';
            reverse = true;
            break;

        case 'left':
        case 'to right':
        case '180deg':
        case '-180deg':
            direction = 'horizontal';
            reverse = false;
            break;

        case 'right':
        case 'to left':
        case '0deg':
        case '360deg':
            direction = 'vertical';
            reverse = true;
            break;

        default:
            return;
    }

    if (direction && params.length === 2) {
        params[0] = Color(params[0].toString()).hexString();
        params[1] = Color(params[1].toString()).hexString();

        if (reverse) {
            params.reverse();
        }

        if (direction === 'horizontal') {
            return 'progid:DXImageTransform.Microsoft.gradient(startColorStr="' + params[0] + '", endColorStr="' + params[1] + '", GradientType=1)';
        }

        return 'progid:DXImageTransform.Microsoft.gradient(startColorStr="' + params[0] + '", endColorStr="' + params[1] + '")';
    }
}
