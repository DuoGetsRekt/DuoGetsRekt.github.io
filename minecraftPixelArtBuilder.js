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
  if (verticalBlockResolution >= 10 && verticalBlockResolution <= 200) {

    let previewImage = new Image()

    //console.log("bi: " + blockImages[]);

    previewImage.onload = function() {

      imageWidth = this.width;
      imageHeight = this.height;

      getCoordinateColorData(previewImage, imageWidth, imageHeight, getRatio(imageWidth, verticalBlockResolution));

    }
    previewImage.src = determineImageToSampleFrom();

  } else {

    console.log("ERROR: Vertical Block Resolution is out of bounds.")

  }

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
        greenValue: (context.getImageData(x, y, 1, 1).data[1]),
        blueValue: (context.getImageData(x, y, 1, 1).data[2]),
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


  context.fillStyle = '#ffffff';
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

            //'fixes' the weird color gap bug, by masking them with the pixel adjacent.
            if (colorDataSet[i].minecraftBlockAssigned === "" && i > 0) {

              colorDataSet[i].minecraftBlockAssigned = colorDataSet[i - 1].minecraftBlockAssigned;

            }

            console.log("bv: " + colorDataSet[i].minecraftBlockAssigned + " xIndex " + colorDataSet[i].xIndex + " yIndex " + colorDataSet[i].yIndex);
            context.drawImage(blockImages[blockBoundaryData.blockName[j]],  0, 0, 16, 16, (colorDataSet[i].xIndex * 16) - 16, (colorDataSet[i].yIndex * 16) - 16, 16, 16);

          }

        }

      }

    }

    console.log(colorDataSet[i]);

  }

}

//retrieves the status of the interface dropdown menu so the correct file name is fetched.
function determineImageToSampleFrom() {

  console.log(document.getElementById("imageSelector").value);

  if (document.getElementById("imageSelector").value !== null) {

    return document.getElementById("imageSelector").value;

  } else {

    return "endgame-poster.jpg";

  }

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
