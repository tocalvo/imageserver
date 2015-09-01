(function() {
	var exec = require('child_process').exec;

	function convert ( filePath, baseFilePath, callback ){
		exec('ffmpeg -i ' + baseFilePath + ' ' + filePath , callback);
	}

	module.exports.convert = convert;
})();