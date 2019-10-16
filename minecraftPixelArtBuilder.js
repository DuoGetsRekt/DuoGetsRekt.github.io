let blockImages = {};

//Pre-loads every image beforehand such that performance is improved later.
function loadImages() {

  let blocks = ['black_concrete', 'black_terracotta', 'netherrack', 'nether_wart_block', 'red_concrete_powder', 'dark_oak_log', 'green_terracotta', 'brown_concrete', 'melon_top', 'orange_concrete', 'green_concrete', 'green_wool', 'green_concrete_powder', 'oak_log', 'orange_concrete_powder', 'lime_concrete', 'lime_concrete', 'lime_concrete_powder', 'hay_block_top', 'yellow_concrete', 'lime_wool', 'lime_concrete', 'lime_concrete_powder', 'melon_top', 'yellow_concrete', 'black_wool', 'gravel', 'spruce_planks', 'pink_terracotta', 'red_concrete_powder', 'cyan_terracotta', 'coarse_dirt', 'bricks', 'light_gray_terracotta', 'red_concrete_powder', 'brown_concrete_powder', 'dark_prismarine', 'acacia_log', 'acacia_planks', 'acacia_planks', 'dark_prismarine', 'lime_terracotta', 'lime_terracotta', 'oak_planks', 'yellow_concrete_powder', 'slime_block', 'slime_block', 'lime_wool', 'melon_top', 'yellow_concrete', 'blue_concrete', 'mycelium_top', 'mycelium_top', 'pink_terracotta', 'red_concrete_powder', 'lapis_block', 'blue_terracotta', 'magenta_terracotta', 'magenta_terracotta', 'magenta_concrete', 'cyan_concrete', 'cracked_stone_bricks', 'andesite', 'granite', 'jungle_planks', 'dark_prismarine', 'green_concrete', 'green_concrete_powder', 'hay_block_top', 'birch_planks', 'slime_block', 'slime_block', 'slime_block', 'slime_block', 'yellow_concrete_powder', 'blue_concrete', 'blue_wool', 'magenta_concrete', 'magenta_concrete', 'pink_concrete', 'blue_wool', 'blue_concrete_powder', 'purple_concrete', 'magenta_concrete_powder', 'magenta_concrete_powder', 'light_blue_concrete', 'blue_concrete_powder', 'purpur_block', 'pink_concrete', 'pink_wool', 'cyan_concrete_powder', 'cobblestone', 'clay', 'birch_log', 'diorite', 'prismarine_bricks', 'prismarine_bricks', 'prismarine_bricks', 'end_stone', 'end_stone', 'blue_concrete', 'blue_concrete', 'purple_concrete', 'purple_concrete_powder', 'pink_concrete', 'blue_concrete_powder', 'blue_concrete_powder', 'purple_concrete', 'purple_wool', 'pink_concrete', 'light_blue_concrete', 'light_blue_wool', 'lapis_block', 'purpur_block', 'pink_concrete', 'light_blue_concrete_powder', 'light_blue_concrete_powder', 'blue_ice', 'packed_ice', 'white_concrete', 'light_blue_concrete_powder', 'light_blue_concrete_powder', 'light_blue_concrete_powder', 'packed_ice', 'bone_block_side'];

  for (let block of blocks) {
    blockImages[block] = new Image();
    blockImages[block].src = block + ".png";
    blockImages[block].onload = function() {
      console.log("Loaded " + block + ".png");
    }
  }
}



let imageWidth, imageHeight;

//retrieves the base values necessary for image dimension calculation
function getUserInputValues() {

  let verticalBlockResolution = document.getElementById("verticalBlockCountTextBox").value;
  let previewImage = new Image()
  previewImage.onload = function() {

    imageWidth = this.width;
    imageHeight = this.height;

    getCoordinateColorData(previewImage, imageWidth, imageHeight, getRatio(imageWidth, verticalBlockResolution));

  }
  previewImage.src = determineImageToSampleFrom();

}

//Returns the proportion of the amount of pixels vertical to every vertical block, used later for scaling
function getRatio(imageHeight, verticalBlockResolution) {

  return Math.floor(imageHeight / verticalBlockResolution);

}

//Takes sample colour data from the image so that there is a renderable grid of colours that can later be assigned minecraft block values.
function getCoordinateColorData(previewImage, imageWidth, imageHeight, ratio) {

  const canvas = document.getElementById('displayBaseImage');
  const context = canvas.getContext('2d');
  canvas.width = imageWidth;
  canvas.height = imageHeight;
  context.drawImage(previewImage, 0, 0);

  var colorDataSet = [];

  //Jumps to incremented points in the y axis every time the x axis repeats a full iteration
  for (let y = 0; y < imageHeight; y += ratio) {

    //Jumps to incremented points in the x axis every iteration
    for (let x = 0; x < imageWidth; x += ratio) {

      let colorDataSetInstance = {

        redValue: (context.getImageData(x, y, 1, 1).data[0]),
        blueValue: (context.getImageData(x, y, 1, 1).data[1]),
        greenValue: (context.getImageData(x, y, 1, 1).data[2])

        //Shrinks the co-odinate set to increments of 1 so that scaling is made easier for the map later.
        xIndex: x / ratio,
        yIndex: y / ratio,
        minecraftBlockAssigned: ""

      }
      colorDataSet.push(colorDataSetInstance);
      console.log("xIndex " + colorDataSetInstance.xIndex + " yIndex " + colorDataSetInstance.yIndex);
    }

  }
  displayPixelArt(colorDataSet, ratio)

}


//calculates where to render the block image and what block image to render
function displayPixelArt(colorDataSet, ratio) {

  let blockBoundaryData = fetchBlockLowerBoundaries();

  w = Math.floor(imageWidth / ratio) * 16;
  h = Math.floor(imageHeight / ratio) * 16;

  const canvas = document.getElementById('displayMinecraftBlockConstruction');
  const context = canvas.getContext('2d');
  canvas.width = w;
  canvas.height = h;


  context.fillStyle = '#ff69ff';
  context.fillRect(0, 0, w, h);

  //used as an index for the pixels that are to be rendered
  for (let i = 0; i < colorDataSet.length; i++) {

    //Used as the index for all of the possible block values
    for (let j = 0; j < 125; j++) {

      //Checks whether the block fits in the individual constraints, nested ifs were used such that the conditions can actually all be seen.
      if (colorDataSet[i].redValue >= blockBoundaryData.redValue[j] && colorDataSet[i].redValue < blockBoundaryData.redValue[j] + 55 && colorDataSet.blockValue !== "") {

        if (colorDataSet[i].greenValue >= blockBoundaryData.greenValue[j] && colorDataSet[i].greenValue < blockBoundaryData.greenValue[j] + 55) {

          if (colorDataSet[i].blueValue >= blockBoundaryData.blueValue[j] && colorDataSet[i].blueValue < blockBoundaryData.blueValue[j] + 55) {

            colorDataSet[i].minecraftBlockAssigned = blockBoundaryData.blockName[j];
            console.log("bv: " + colorDataSet[i].minecraftBlockAssigned + " xindex " + colorDataSet[i].xIndex + " yIndex " + colorDataSet[i].yIndex);

          }

        }

      }

      //context.drawImage(blockImages[j], (colorDataSet.xIndex * 16) - 16, (colorDataSet.yIndex * 16) - 16);

    }

    context.drawImage(blockImages[colorDataSet[i].minecraftBlockAssigned],  0, 0, 16, 16, (colorDataSet[i].xIndex * 16) - 16, (colorDataSet[i].yIndex * 16) - 16, 16, 16);
    console.log(colorDataSet[i]);

  }

}



//retrieves the status of the interface dropdown menu so the correct file name is fetched.
function determineImageToSampleFrom() {

    return document.getElementById("imageSelector").value;

}



//Fetches the complete set of lower bounds for color values, this determines how pixels are classified
function fetchBlockLowerBoundaries() {

  let blockBoundaryData = {

    blockName: ['black_concrete', 'black_terracotta', 'netherrack', 'nether_wart_block', 'red_concrete_powder', 'dark_oak_log', 'green_terracotta', 'brown_concrete', 'melon_top', 'orange_concrete', 'green_concrete', 'green_wool', 'green_concrete_powder', 'oak_log', 'orange_concrete_powder', 'lime_concrete', 'lime_concrete', 'lime_concrete_powder', 'hay_block_top', 'yellow_concrete', 'lime_wool', 'lime_concrete', 'lime_concrete_powder', 'melon_top', 'yellow_concrete', 'black_wool', 'gravel', 'spruce_planks', 'pink_terracotta', 'red_concrete_powder', 'cyan_terracotta', 'coarse_dirt', 'bricks', 'light_gray_terracotta', 'red_concrete_powder', 'brown_concrete_powder', 'dark_prismarine', 'acacia_log', 'acacia_planks', 'acacia_planks', 'dark_prismarine', 'lime_terracotta', 'lime_terracotta', 'oak_planks', 'yellow_concrete_powder', 'slime_block', 'slime_block', 'lime_wool', 'melon_top', 'yellow_concrete', 'blue_concrete', 'mycelium_top', 'mycelium_top', 'pink_terracotta', 'red_concrete_powder', 'lapis_block', 'blue_terracotta', 'magenta_terracotta', 'magenta_terracotta', 'magenta_concrete', 'cyan_concrete', 'cracked_stone_bricks', 'andesite', 'granite', 'jungle_planks', 'dark_prismarine', 'green_concrete', 'green_concrete_powder', 'hay_block_top', 'birch_planks', 'slime_block', 'slime_block', 'slime_block', 'slime_block', 'yellow_concrete_powder', 'blue_concrete', 'blue_wool', 'magenta_concrete', 'magenta_concrete', 'pink_concrete', 'blue_wool', 'blue_concrete_powder', 'purple_concrete', 'magenta_concrete_powder', 'magenta_concrete_powder', 'light_blue_concrete', 'blue_concrete_powder', 'purpur_block', 'pink_concrete', 'pink_wool', 'cyan_concrete_powder', 'cobblestone', 'clay', 'birch_log', 'diorite', 'prismarine_bricks', 'prismarine_bricks', 'prismarine_bricks', 'end_stone', 'end_stone', 'blue_concrete', 'blue_concrete', 'purple_concrete', 'purple_concrete_powder', 'pink_concrete', 'blue_concrete_powder', 'blue_concrete_powder', 'purple_concrete', 'purple_wool', 'pink_concrete', 'light_blue_concrete', 'light_blue_wool', 'lapis_block', 'purpur_block', 'pink_concrete', 'light_blue_concrete_powder', 'light_blue_concrete_powder', 'blue_ice', 'packed_ice', 'white_concrete', 'light_blue_concrete_powder', 'light_blue_concrete_powder', 'light_blue_concrete_powder', 'packed_ice', 'bone_block_side'],

    redValue: [0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231],

    greenValue: [0, 0, 0, 0, 0, 56, 56, 56, 56, 56, 111, 111, 111, 111, 111, 166, 166, 166, 166, 166, 231, 231, 231, 231, 231, 0, 0, 0, 0, 0, 56, 56, 56, 56, 56, 111, 111, 111, 111, 111, 166, 166, 166, 166, 166, 231, 231, 231, 231, 231, 0, 0, 0, 0, 0, 56, 56, 56, 56, 56, 111, 111, 111, 111, 111, 166, 166, 166, 166, 166, 231, 231, 231, 231, 231, 0, 0, 0, 0, 0, 56, 56, 56, 56, 56, 111, 111, 111, 111, 111, 166, 166, 166, 166, 166, 231, 231, 231, 231, 231, 0, 0, 0, 0, 0, 56, 56, 56, 56, 56, 111, 111, 111, 111, 111, 166, 166, 166, 166, 166, 231, 231, 231, 231, 231],

    blueValue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231]

  };

  return blockBoundaryData;

}

/*
let chunk = 16;

let imageWidth, imageHeight;

function getUserInputValues() {
*/
  /*Retrieves the vertical block resolution value entered by the user, this value determines
  how many blocks vertical the image will be scaled to during processing.*/
/*  var verticalBlockResolution = document.getElementById("verticalBlockCountTextBox").value;

  //Creates a new image object, and assigns width and height variables upon loading.
  var sampleImage = new Image();
  sampleImage.onload = function() {

    imageWidth = this.width;
    imageHeight = this.height;

    /*Checks if the ratio between scaled block resolution and image ratio is 2:1 or more,
    this is to ensure that the output pixel art has higher quality image accuracy due to
    color blending*/
/*    if (verticalBlockResolution == 0) {

      verticalBlockResolution = 60;

    }


    if (getBlockToImageResolutionRatio(verticalBlockResolution, imageHeight) < 2) {

      alert("ERROR: The block resolution you have entered is too large for this image, the maximum possible value is limited to " + getMaximumResolution(imageHeight))

    } else {

      //Uses the parameters provided to produce a color map.
      createImageColorMap(verticalBlockResolution, imageHeight, imageWidth, sampleImage);

    }

  }

  sampleImage.src = document.getElementById("image-select").value;

}


function getBlockToImageResolutionRatio(verticalBlockResolution, imageHeight) {

 return Math.floor(imageHeight / verticalBlockResolution);

}

function getMaximumResolution(imageHeight) {

  return (imageHeight / 2);

}

function calculateRatio(imageWidth, imageHeight) {

  return imageWidth / imageHeight;

}

function createImageColorMap(verticalBlockResolution, imageHeight, imageWidth, sampleImage) {
  var ratio = getBlockToImageResolutionRatio(verticalBlockResolution, imageHeight)

  //creates the canvas for the original image.
  const canvas = document.getElementById('displayBaseImage');
  const context = canvas.getContext('2d');
  canvas.width = imageWidth;
  canvas.height = imageHeight;
  context.drawImage(sampleImage, 0, 0);

  /*The pixel data set and the co-ordinate dataset will be used to match co-ordinate points
  to blocks and also blend some points together for better colour accuracy.*/
/*  var pixelDataSet = [];

  /*The double for loop jumps to regualrly intervalled co-ordinates on the image and takes
  the colour and co-ordinate data from that given point*/
/*  var maximumProgress = (imageWidth / (ratio / 2)) * (imageHeight / ratio);
  var currentProgress = 0;

  for (var y = 0; y < imageHeight - 1; y += chunk) {

    for (var x = 0; x < imageWidth - 1; x += chunk) {

    //  pixelDataSet.push();

      //// TEMP:
      var pixelDataSetInstance = {

        xCoordinate: x,
        yCoordinate: y,
        redValue: (context.getImageData(x, y, 1, 1).data[0]), //(Math.round(Math.random() * 255)),
        blueValue: (context.getImageData(x, y, 1, 1).data[2]), //(Math.round(Math.random() * 255)),
        greenValue: (context.getImageData(x, y, 1, 1).data[1]) // (Math.round(Math.random() * 255))

      }
      pixelDataSet.push(pixelDataSetInstance);

      currentProgress++;

    //  progressBar.setPercent(calculatePercentage());

    }

  }

  if (document.getElementById("induceHorizontalBlendingCheckbox").checked) {

    pixelDataSet = blendColorData(pixelDataSet)

  }
  matchColorPointsToMinecraftBlocks(pixelDataSet, calculateRatio(imageWidth, imageHeight), verticalBlockResolution);

}

function blendColorData(pixelDataSet) {

  for (var i = 1; i < pixelDataSet.length - 1; i += 2) {

    var averageBlend = 0;
    for (var e = -1; e <= 1; e++) {

      averageBlend = averageBlend + pixelDataSet[i + e].redValue;

    }
    pixelDataSet[i].redValue = Math.round(averageBlend / 3);

    averageBlend = 0;
    for (var e = -1; e <= 1; e++) {

      averageBlend = averageBlend + pixelDataSet[i + e].blueValue;

    }
    pixelDataSet[i].blueValue = Math.round(averageBlend / 3);

    averageBlend = 0;
    for (var e = -1; e <= 1; e++) {

      averageBlend = averageBlend + pixelDataSet[i + e].greenValue;

    }
    pixelDataSet[i].greenValue = Math.round(averageBlend / 3);

  }

  return pixelDataSet;
}

function calculatePercentage(currentProgress, maximumProgress) {

  if (maximumProgress != 0) {

    return (currentProgress / maximumProgress) * 100;

  }

  return 0;

}

function matchColorPointsToMinecraftBlocks(pixelDataSet, ratio, verticalBlockResolution) {

  var newDataSet = calculateCoordinatePoints(pixelDataSet, ratio, verticalBlockResolution);
  var blockBoundaryData = getBlockBoundaryData();



    for (let i = 0; i < newDataSet.length; i++) {

      for (let b = 0; b < 125; b++) {

        if (pixelDataSet[i].redValue >= blockBoundaryData.redValue[b] && pixelDataSet[i].redValue < (blockBoundaryData.redValue[b] + 55) && pixelDataSet[i].blueValue >= blockBoundaryData.blueValue[b] && pixelDataSet[i].blueValue < (blockBoundaryData.blueValue[b] + 55) && pixelDataSet[i].greenValue >= blockBoundaryData.greenValue[b] && pixelDataSet[i].greenValue < (blockBoundaryData.greenValue[b] + 55)) {

          newDataSet[i].blockValue = blockBoundaryData.blockName[b];

        }

        if (newDataSet[i].blockValue == "" && i > 0) {

          newDataSet[i].blockValue = newDataSet[i - 1].blockValue;

        }

    /*  if (b == 5) {
        for (let y = 0; y < newDataSet.length; y++) {
          if (newDataSet[y].blockValue == "") {
            console.log("R: " + pixelDataSet[y].redValue + " G: " + pixelDataSet[y].greenValue + " B: " + pixelDataSet[y].blueValue);
          }
        }
      } */

/*      }

    }




/*  constructBlockCanvas(ratio, newDataSet, verticalBlockResolution);

}

let blockImages = {};

function loadImages() {

  let blockFiles = ['black_concrete', 'black_terracotta', 'netherrack', 'nether_wart_block', 'red_concrete_powder', 'dark_oak_log', 'green_terracotta', 'brown_concrete', 'melon_top', 'orange_concrete', 'green_concrete', 'green_wool', 'green_concrete_powder', 'oak_log', 'orange_concrete_powder', 'lime_concrete', 'lime_concrete', 'lime_concrete_powder', 'hay_block_top', 'yellow_concrete', 'lime_wool', 'lime_concrete', 'lime_concrete_powder', 'melon_top', 'yellow_concrete', 'black_wool', 'gravel', 'spruce_planks', 'pink_terracotta', 'red_concrete_powder', 'cyan_terracotta', 'coarse_dirt', 'bricks', 'light_gray_terracotta', 'red_concrete_powder', 'brown_concrete_powder', 'dark_prismarine', 'acacia_log', 'acacia_planks', 'acacia_planks', 'dark_prismarine', 'lime_terracotta', 'lime_terracotta', 'oak_planks', 'yellow_concrete_powder', 'slime_block', 'slime_block', 'lime_wool', 'melon_top', 'yellow_concrete', 'blue_concrete', 'mycelium_top', 'mycelium_top', 'pink_terracotta', 'red_concrete_powder', 'lapis_block', 'blue_terracotta', 'magenta_terracotta', 'magenta_terracotta', 'magenta_concrete', 'cyan_concrete', 'cracked_stone_bricks', 'andesite', 'granite', 'jungle_planks', 'dark_prismarine', 'green_concrete', 'green_concrete_powder', 'hay_block_top', 'birch_planks', 'slime_block', 'slime_block', 'slime_block', 'slime_block', 'yellow_concrete_powder', 'blue_concrete', 'blue_wool', 'magenta_concrete', 'magenta_concrete', 'pink_concrete', 'blue_wool', 'blue_concrete_powder', 'purple_concrete', 'magenta_concrete_powder', 'magenta_concrete_powder', 'light_blue_concrete', 'blue_concrete_powder', 'purpur_block', 'pink_concrete', 'pink_wool', 'cyan_concrete_powder', 'cobblestone', 'clay', 'birch_log', 'diorite', 'prismarine_bricks', 'prismarine_bricks', 'prismarine_bricks', 'end_stone', 'end_stone', 'blue_concrete', 'blue_concrete', 'purple_concrete', 'purple_concrete_powder', 'pink_concrete', 'blue_concrete_powder', 'blue_concrete_powder', 'purple_concrete', 'purple_wool', 'pink_concrete', 'light_blue_concrete', 'light_blue_wool', 'lapis_block', 'purpur_block', 'pink_concrete', 'light_blue_concrete_powder', 'light_blue_concrete_powder', 'blue_ice', 'packed_ice', 'white_concrete', 'light_blue_concrete_powder', 'light_blue_concrete_powder', 'light_blue_concrete_powder', 'packed_ice', 'bone_block_side'];

  for (let block of blockFiles) {
    blockImages[block] = new Image();
    blockImages[block].src = block + ".png";
    blockImages[block].onload = function() {
      console.log("Loaded " + block + ".png");
    }
  }

}


function getBlockBoundaryData() {

  var blockBoundaryData = {

    blockName: ['black_concrete', 'black_terracotta', 'netherrack', 'nether_wart_block', 'red_concrete_powder', 'dark_oak_log', 'green_terracotta', 'brown_concrete', 'melon_top', 'orange_concrete', 'green_concrete', 'green_wool', 'green_concrete_powder', 'oak_log', 'orange_concrete_powder', 'lime_concrete', 'lime_concrete', 'lime_concrete_powder', 'hay_block_top', 'yellow_concrete', 'lime_wool', 'lime_concrete', 'lime_concrete_powder', 'melon_top', 'yellow_concrete', 'black_wool', 'gravel', 'spruce_planks', 'pink_terracotta', 'red_concrete_powder', 'cyan_terracotta', 'coarse_dirt', 'bricks', 'light_gray_terracotta', 'red_concrete_powder', 'brown_concrete_powder', 'dark_prismarine', 'acacia_log', 'acacia_planks', 'acacia_planks', 'dark_prismarine', 'lime_terracotta', 'lime_terracotta', 'oak_planks', 'yellow_concrete_powder', 'slime_block', 'slime_block', 'lime_wool', 'melon_top', 'yellow_concrete', 'blue_concrete', 'mycelium_top', 'mycelium_top', 'pink_terracotta', 'red_concrete_powder', 'lapis_block', 'blue_terracotta', 'magenta_terracotta', 'magenta_terracotta', 'magenta_concrete', 'cyan_concrete', 'cracked_stone_bricks', 'andesite', 'granite', 'jungle_planks', 'dark_prismarine', 'green_concrete', 'green_concrete_powder', 'hay_block_top', 'birch_planks', 'slime_block', 'slime_block', 'slime_block', 'slime_block', 'yellow_concrete_powder', 'blue_concrete', 'blue_wool', 'magenta_concrete', 'magenta_concrete', 'pink_concrete', 'blue_wool', 'blue_concrete_powder', 'purple_concrete', 'magenta_concrete_powder', 'magenta_concrete_powder', 'light_blue_concrete', 'blue_concrete_powder', 'purpur_block', 'pink_concrete', 'pink_wool', 'cyan_concrete_powder', 'cobblestone', 'clay', 'birch_log', 'diorite', 'prismarine_bricks', 'prismarine_bricks', 'prismarine_bricks', 'end_stone', 'end_stone', 'blue_concrete', 'blue_concrete', 'purple_concrete', 'purple_concrete_powder', 'pink_concrete', 'blue_concrete_powder', 'blue_concrete_powder', 'purple_concrete', 'purple_wool', 'pink_concrete', 'light_blue_concrete', 'light_blue_wool', 'lapis_block', 'purpur_block', 'pink_concrete', 'light_blue_concrete_powder', 'light_blue_concrete_powder', 'blue_ice', 'packed_ice', 'white_concrete', 'light_blue_concrete_powder', 'light_blue_concrete_powder', 'light_blue_concrete_powder', 'packed_ice', 'bone_block_side'],

    redValue: [0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231, 0, 56, 111, 166, 231],

    greenValue: [0, 0, 0, 0, 0, 56, 56, 56, 56, 56, 111, 111, 111, 111, 111, 166, 166, 166, 166, 166, 231, 231, 231, 231, 231, 0, 0, 0, 0, 0, 56, 56, 56, 56, 56, 111, 111, 111, 111, 111, 166, 166, 166, 166, 166, 231, 231, 231, 231, 231, 0, 0, 0, 0, 0, 56, 56, 56, 56, 56, 111, 111, 111, 111, 111, 166, 166, 166, 166, 166, 231, 231, 231, 231, 231, 0, 0, 0, 0, 0, 56, 56, 56, 56, 56, 111, 111, 111, 111, 111, 166, 166, 166, 166, 166, 231, 231, 231, 231, 231, 0, 0, 0, 0, 0, 56, 56, 56, 56, 56, 111, 111, 111, 111, 111, 166, 166, 166, 166, 166, 231, 231, 231, 231, 231],

    blueValue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 111, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 166, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231, 231]

  };
  return blockBoundaryData;
}

function calculateCoordinatePoints(pixelDataSet, ratio, verticalBlockResolution) {

  var currentCalculatedXValue = -16;
  var currentCalculatedYValue = 0;
  var lastYValue = 0;
  var newDataSet = []

  var testObject = getDebuggingValues();

  for (var i = 1; i < pixelDataSet.length - 1; i++) {

    console.log((verticalBlockResolution * ratio * 16 * testObject.strechValue) + testObject.shiftValue);

    currentCalculatedXValue += chunk;
    if (currentCalculatedXValue > imageWidth) {
        //(verticalBlockResolution * ratio * 16 * testObject.strechValue) + testObject.shiftValue) {

      currentCalculatedYValue += chunk;
      currentCalculatedXValue = 0;

    }

    let newDataSetInstance = {

      blockValue: "",
      x: currentCalculatedXValue,
      y: currentCalculatedYValue

    }
    newDataSet.push(newDataSetInstance);

    lastYValue = currentCalculatedYValue;

  }

  return newDataSet;

}

function constructBlockCanvas(ratio, newDataSet, verticalBlockResolution) {



  w = Math.round(verticalBlockResolution * chunk * 16) * 2;
  h = ((verticalBlockResolution * 16) - 16) * 2;

  const canvas = document.getElementById('displayMinecraftBlockConstruction');

  canvas.width = w;
  canvas.height = h;


  const context = canvas.getContext('2d');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, w, h);

  for (let i = 0; i < newDataSet.length; i++) {

      if ((newDataSet[i].blockValue).length > 0) {

        let x = (ratio * i) % imageWidth;
        let y = Math.floor(i * chunk / imageHeight) * chunk;

        context.drawImage(blockImages[newDataSet[i].blockValue],  0, 0, 16, 16, x, y, chunk, chunk); //doesn't actually create block img

      }

    }


}

function getDebuggingValues() {

  let debuggingObject = {

      strechValue: 1,
      shiftValue: 0

  }

  if (document.getElementById("debuggingStretchTest").value !== undefined) {

    debuggingObject.stretchValue = document.getElementById("debuggingStretchTest").value;

  }
  if (document.getElementById("debuggingShifttest").value !== undefined) {

    debuggingObject.shiftValue = document.getElementById("debuggingShifttest").value;

  }

  return debuggingObject;

}

//WORK ON LATER
/*function verticalBlend(pixelDataSet, averageBlend) {
  var iSim = i;
  while (iSim >= 0 && pixelDataSet[iSim].xCoordinate != pixelDataSet[i].xCoordinate || i == iSim) {
    iSim--;
  }
  averageBlend = averageBlend + pixelDataSet[iSim].redValue;
  iSim = i;
  while (iSim < pixelDataSet - 1 && pixelDataSet[iSim].xCoordinate != pixelDataSet[i].xCoordinate || i == iSim) {
    iSim++;
  }
  averageBlend = averageBlend + pixelDataSet[iSim].redValue;
}*/
