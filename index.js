var color = require('stylecow-color');

module.exports = {
	disable: {
		explorer: 9.0
	},
	Declaration: {
		background: fixer,
		"background-image": fixer
	}
};

function fixer (declaration) {
	var fn = declaration.search('Function', 'linear-gradient');

	if (fn.length === 1) {
		var filter = getFilter(fn[0].content);

		if (filter) {
			declaration.ancestor('Rule').addOldMsFilter(filter);
		}
	}
}

function getFilter (params) {
	var direction, reverse;

	switch (params.shift()) {
		case 'to bottom':
		case '90deg':
			direction = 'vertical';
			reverse = false;
			break;

		case 'to top':
		case '-90deg':
			direction = 'vertical';
			reverse = true;
			break;

		case 'to right':
		case '180deg':
		case '-180deg':
			direction = 'horizontal';
			reverse = false;
			break;

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
		params[0] = color.RGBA_HEX(color.toRGBA(params[0]));
		params[1] = color.RGBA_HEX(color.toRGBA(params[1]));

		if (reverse) {
			params.reverse();
		}

		if (direction === 'horizontal') {
			return 'progid:DXImageTransform.Microsoft.gradient(startColorStr="#' + params[0] + '", endColorStr="#' + params[1] + '", GradientType=1)';
		}

		return 'progid:DXImageTransform.Microsoft.gradient(startColorStr="#' + params[0] + '", endColorStr="#' + params[1] + '")';
	}
}
