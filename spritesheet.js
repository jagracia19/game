

// We keep a global dictionary of loaded sprite-sheets,
// which are each an instance of our SpriteSheetClass
// below.
//
// This dictionary is indexed by the URL path that the
// atlas is located at. For example, calling:
//
// gSpriteSheets['grits_effects.png'] 
//
// would return the SpriteSheetClass object associated
// to that URL, assuming that it exists.
var gSpriteSheets = {};

//-----------------------------------------
SpriteSheetClass = Class.extend({

    // We store in the SpriteSheetClass:
    //
    // The Image object that we created for our atlas.
	img: null,

    // The URL path that we grabbed our atlas from.
	url: "",

    // An array of all the sprites in our atlas.
	sprites: new Array(),

	//-----------------------------------------
	init: function () {},

	//-----------------------------------------
    // Load the atlas at the path 'imgName' into memory.
	load: function (imgName) {
		// Store the URL of the spritesheet we want.
        this.url = imgName;
        
        // Create a new image whose source is at 'imgName'.
		var img = new Image();
		img.src = imgName;

        // Store the Image object in the img parameter.
		this.img = img;

        // Store this SpriteSheetClass in our global
        // dictionary gSpriteSheets defined above.
		gSpriteSheets[imgName] = this;
	},

	//-----------------------------------------
	// Define a sprite for this atlas
	defSprite: function (name, x, y, w, h, cx, cy) {
        // We create a new object with:
        //
        // The name of the sprite as a string
        //
        // The x and y coordinates of the sprite in the atlas.
        //
        // The width and height of the sprite in the atlas.
        //
        // The x and y coordinates of the center of the sprite in the atlas.
        // This is so we don't have to do the calculations each time we need this.
        // This might seem minimal, but it adds up!
		var spt = {
			"id": name,
			"x": x,
			"y": y,
			"w": w,
			"h": h,
			"cx": cx === null ? 0 : cx,
			"cy": cy === null ? 0 : cy
		};

        // We push this new object into
        // our array of sprite objects,
        // at the end of the array.
		this.sprites.push(spt);
	},

	//-----------------------------------------
    getStats: function (name) {
        for (var i = 0; i < this.sprites.length; i++) 
            if (this.sprites[i].id == name) 
                return this.sprites[i];
        return null;
    }

    //-----------------------------------------
    // Parse the JSON file passed in as 'atlasJSON'
    // that is associated to this atlas.
	parseAtlasDefinition: function (atlasJSON) {
        // Parse the input 'atlasJSON' using the
        // JSON.parse method and store it in a
        // variable.
        var parsed = JSON.parse(atlasJSON);
		
        // For each sprite in the parsed JSON,
        // 'chaingun.png', chaingun_impact.png',
        // etc.:
        //
        // 1) Calculate the center (x,y) offsets
        //    from the 'width' and 'height'
        //    values listed in the JSON.
        //    Note that these are an offset
        //    FROM the 'width' and 'height',
        //    so they will be negative!
        //
        // 2) Pass the sprite name, the (x,y)
        //    coordinates, the width and height,
        //    and the center (x,y) offsets
        //    you just calculated to the above
        //    'defSprite' method of our
        //    'SpriteSheetClass'.
        //
        for (var key in parsed.frames) {
            var sprite = parsed.frames[key];
            
            // Define the center of the sprite as an offset
            var cx = -sprite.frame.w * 0.5;
            var cy = -sprite.frame.h * 0.5;

            // If sprite is trimmed, then we nedd to update the offset center
            if (sprite.trimmed) {
                cx = sprite.sproteSourceSize.x - (sprite.sourceSize.w * 0.5);
                cy = sprite.sproteSourceSize.y - (sprite.sourceSize.h * 0.5);
            }

            // Define the sprite for this sheet
            this.defSprite(ket, sprite.frame.x, sprite.frame.y, 
                sprite.frame.w, sprite.frame.h, cx, cy);
        }

        
	}

});

function drawSprite(spritename, posX, posY) {
    for (var sheetName in gSpriteSheets) {
        var sheet = gSpriteSheets[sheetName];
        var sprite = sheet.getStats(spritename);
        if (sprite == null) continue;        
        __drawSpriteInternal(sprite, sheet, posX, posY);        
        return;
    }
}

function __drawSpriteInternal(spt, sheet, posX, posY) {
    if (spt == null || sheet == null) return;

    var hlf = {
        x: spt.cx,
        y: spt.cy
    };

    ctx.drawImage(sheet.img,
        spt.x, spt.y, spt.w, spt.h, 
        posX+ hlf.x, posY + hlf.y,
        spt.w, spt.h);
}
