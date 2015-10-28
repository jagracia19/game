var RenderEngineClass = {

	drawString: function (pString, pFontName, locX, locY, size, settings) {
		var ctx = gRenderEngine.context;
		ctx.font = size + "pt " + pFontName;
		if (settings.color) ctx.fillStyle = settings.color;	
		if (settings.bounds) {
			var maxWidth = settings.bounds.w;

			var words = pString.split(" ");
			var line = ··;
			var lineHeight = size + 4;
			var y = locY;
		}
	}
};