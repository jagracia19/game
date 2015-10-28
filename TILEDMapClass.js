

var TILEDMapClass = Class.extend({

    // This is where we store the full parsed
    // JSON of the map.json file.
    currMapData: null,
    tileSets: [],

    // This is where we store the width and
    // height of the map in tiles. This is
    // in the 'width' and 'height' fields
    // of map.json, respectively.
    // The values 100 here are just set
    // so these fields are initialized to
    // something, rather than null.
    numXTiles: 100,
    numYTiles: 100,

    // The size of each individual map
    // tile, in pixels. This is in the
    // 'tilewidth' and 'tileheight' fields
    // of map.json, respectively.
    // The values 64 here are just set
    // so these fields are initialized to
    // something, rather than null.
    tileSize: {
        "x": 64,
        "y": 64
    },

    // The size of the entire map,
    // in pixels. This is calculated
    // based on the 'numXTiles', 'numYTiles',
    // and 'tileSize' parameters.
    // The values 64 here are just set
    // so these fields are initialized to
    // something, rather than null.
    pixelSize: {
        "x": 64,
        "y": 64
    },

    // Counter to keep track of how many tile
    // images we have successfully loaded.
    imgLoadCount: 0,

    // Boolean flag we set once our map atlas
    // has finished loading.
    fullyLoaded: false,
    
	//-----------------------------------------
    // Load the json file at the url 'map' into
    // memory. This is similar to the requests
    // we've done in the past using
    // XMLHttpRequests.
    load: function (map) {

        // Perform an XMLHttpRequest to grab the
        // JSON file at url 'map'.
        xhrGet(map, function(data)  {
            // Once the XMLHttpRequest loads, call the
            // parseMapJSON method.
            gMap.parseMapJSON(data.responseText);
        });
    },

    //---------------------------
    parseMapJSON: function (mapJSON) {
        // Call JSON.parse on 'mapJSON' and store
        // the resulting map data
        this.currMapData = JSON.parse(mapJSON);
        var map = this.currMapData;

        // Set the above properties of our TILEDMap based
        // on the various properties in 'currMapData'.        
        this.numXTiles = map.width;
        this.numYTiles = map.height;
        this.tileSize.x = map.tilewidth;
        this.tileSize.y = map.tileheight;
        this.pixelSize.x = this.numXTiles * this.tileSize.x;
        this.pixelSize.y = this.numYTiles * this.tileSize.y;
        
        // Loop through 'map.tilesets', an Array, loading each
        // of the provided tilesets as Images. Increment the
        // above 'imgLoadCount' field of 'TILEDMap' as each
        // tileset is loading. Once all the tilesets are
        // loaded, set the 'fullyLoaded' flag to true.
        //
        // The 'src' value to load each new Image from is in
        // the 'image' property of the 'tilesets'.                
        for (var i = 0; i < map.tilesets.length; i++) {
            var img = new Image();
            img.onload = function() {}
                gMap.imgLoadCount++;                
                if (gMap.imgLoadCount === map.tilesets.length)
                    gMap.fullyLoaded = true;
            });
            img.src = "../data/" + map.tilesets[i].image.replace(/^.*[\\\/]/, '');

            var ts = {
                "firstgid": map.tilesets[i].firstgid,
                "image": img,
                "imageheight": map.tilesets[i].imageheight,
                "imagewidth": map.tilesets[i].imagewidth,
                "name": map.tilesets[i].name,
                "numXTiles": Math.floor(map.tilesets[i].imagewidth / this.tileSize.x),
                "numYTiles": Math.floor(map.tilesets[i].imageheight / this.tileSize.y)

            };
            this.tileSets.push(ts);
        }        
    },

    //---------------------------
    getTilePacket: function (tileIndex) {
        // Usage: getTilePacket(167) should return the pkt object which
        // contains the atlas image and x, y index for the tile.
        var pkt = {
            "img": null,
            "px": 0,
            "py": 0
        };

        var i = 0;
        for (i = this.tileSets.length - 1; i >= 0; i--) {
            if (this.tileSets[i].firstgid <= titleIndex) 
                break;
        }

        var ts = this.tileSets[i];
        pkt.img = ts.image;
        var localIdx = titleIndex - ts.firstgid;
        var lTileX = Math.floor(localIdx % ts.numXTiles);
        var lTileY = Math.floor(localIdx / ts.numXTiles);
        pkt.px = (lTileX * this.tileSize.x);
        pkt.py = (lTileY * this.tileSize.y);

        return pkt;
    },

    //---------------------------
    draw: function (ctx) {
        if (!this.fullyLoaded) return;

        var map = this.currMapData;
        for (var layerIdx = 0; layerIdx < map.layers.length; layerIdx++) {
            if (map.layers[layerIdx].type != "tilelayer") continue;

            var dat = map.layers[layerIdx].data;
            for (var tileIdx = 0; tileIdx < data.length; tileIdx++) {
                var tID = data[tileIdx];
                if (tID === 0) continue;

                var tPKT = getTilePacket(tID); 

                var worldX = Math.floor(tileIdx % this.numXTiles) * this.tileSize.x;               
                var worldY = Math.floor(tileIdx % this.numYTiles) * this.tileSize.y;

                ctx.drawImage(tPKT.img, tPKT.px, tPKT.py,
                    this.tileSize.x, this.tileSize.y,
                    worldX, worldY,
                    this.tileSize.x, this.tileSize.y);
            }
        }
    }

});

// We define a single global instance of our
// map for the rest of our game code to access.
var gMap = new TILEDMapClass();

