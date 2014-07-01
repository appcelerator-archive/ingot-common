var fs = require('fs'),
	path = require('path');

/**
 * Returns a array of all Ingot modules that match the given type.
 * @param String type - The module type (service, plugin, etc)
 * @returns Array - The list of module paths that were found
 */
exports.findModules = function findModules(type) {
	var mods = [],
		paths = module.paths;

	module.parent && module.parent.paths && module.parent.paths.forEach(function (p) {
		paths.indexOf(p) === -1 && paths.push(p);
	});

	paths.forEach(function (dir) {
		fs.existsSync(dir) && fs.readdirSync(dir).forEach(function (name) {
			var pkgJson = path.join(dir, name, 'package.json');
			if (fs.existsSync(pkgJson)) {
				var json = require(pkgJson);
				if (json.ingot && json.ingot.type === type) {
					mods.push(path.join(dir, name));
				}
			}
		});
	});

	return mods;
};

/**
 * Prints an error or exception to the specified log function or stderr.
 * @param {Exception|String} err - An exception or error string
 * @param {String} [prefix] - A string to prepend to each line of output
 * @param {Function} [logger] - A function to call when printing the formatted line
 */
exports.printError = function printError(err, prefix, logger) {
	var _logger = logger || console.error;
	if (typeof prefix === 'function') {
		_logger = prefix;
		prefix = null;
	}
	var _prefix = prefix ? String(prefix).trim() : 'error:';
	(err.message || err.toString()).split('\n').forEach(function (line) {
		_logger(prefix + ' ' + line);
	});
};