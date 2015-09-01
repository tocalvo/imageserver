(function() {
	var gm = require("gm").subClass({ imageMagick: true });


	function resizeWidth ( originFilePath, storePath, callback, data ){
		console.log('hop');
		gm( originFilePath )
			.resize( data.width )
			.noProfile()
			.strip()
			.write( storePath, callback );
	}

	function resizeHeight ( originFilePath, storePath, callback, data ){
		
		gm( originFilePath )
				.resize( null, data.height )
				.noProfile()
				.strip()
				.write( storePath, callback );
	}


	function fit ( originFilePath, storePath, callback, data ){
		gm( originFilePath )
				.resize( data.width, data.height, '!' )
				.noProfile()
				.strip()
				.write( storePath, callback );
	}

	function resizeWidthCrop ( originFilePath, storePath, callback, data ){
		gm( originFilePath )
				.resize( data.width )
				.gravity( data.gravity || 'Center')
				.crop( data.width, data.height )
				.noProfile()
				.strip()
				.write( storePath, callback );
	}

	function resizeHeightCrop ( originFilePath, storePath, callback, data ){
		
		gm( originFilePath )
				.resize( null, data.height )
				.gravity( data.gravity || 'Center')
				.crop( data.width, data.height )
				.noProfile()
				.strip()
				.write( storePath, callback );
	}

	function fillResizeWidthCrop ( originFilePath, storePath, callback, data ){
		gm( originFilePath )
				.resize( data.width )
				.gravity('Center')
				.crop( data.width, data.height )
				.background('black')
				.extent( data.width, data.height )
				.noProfile()
				.strip()
				.write( storePath, callback );
	}

	function fillResizeHeightCrop ( originFilePath, storePath, callback, data ){
		
		gm( originFilePath )
				.resize( null, data.height )
				.gravity('Center')
				.crop( data.width, data.height )
				.background('black')
				.extent( data.width, data.height )
				.noProfile()
				.strip()
				.write( storePath, callback );
	}

	function crop ( originFilePath, storePath, callback, data ){
		gm( originFilePath )
			.crop( data.width, data.height, data.x, data.y )
			.noProfile()
			.strip()
			.write( storePath, callback );
	}

	module.exports.resizeWidth = resizeWidth;
	module.exports.resizeHeight = resizeHeight;
	module.exports.fit = fit;
	module.exports.resizeWidthCrop = resizeWidthCrop;
	module.exports.resizeHeightCrop = resizeHeightCrop;
	module.exports.fillResizeWidthCrop = fillResizeWidthCrop;
	module.exports.fillResizeHeightCrop = fillResizeHeightCrop;
	module.exports.crop = crop;
})();