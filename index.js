var color = require('stylecow-color');

module.exports = function (stylecow) {

	stylecow.addTask({
		forBrowsersLowerThan: {
			explorer: 9.0
		},
		filter: {
			type: 'Declaration',
			name: ['background', 'background-image']
		},
		fn: function (declaration) {
			var fn = declaration.searchFirst({type: 'Function', name: 'linear-gradient'});

			if (fn) {
				var filter = getFilter(fn.toArray());

				if (filter) {
					stylecow.utils.addMsFilter(declaration.parent({type: 'Block'}), filter);
				}
			}
		}
	});
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
