let USrowData;
let CHIrowData;
let INrowData;

let colors = {};
let origin = {};
let countries = [];
let origins = []; 
let directions = [];
let divFactorSlider;
let numCopySlider;
let deformationSlider;
let sizeFactorSlider;
let angleDivSlider;
let opacitySlider;
let colorsButton;
let colorRangeSlider;
let filterSlider;
let glitchMode = false;
let noiseMode = false;
let glitchButton;
let noiseButton;
let blendModes=[];
let opacityValue;
let blendModeValue;
let divSlider;
let chinaColor;
let usaColor;
let indiaColor;

function preload() {
    USrowData = loadJSON("/data/Us_pop.txt");
    CHIrowData = loadJSON("/data/India_pop.txt");
    INrowData = loadJSON("/data/China_pop.txt");
}

function setup() {
    createCanvas(1200, 1200);
    colorMode(HSB);
    background(0, 0, 0);
    noStroke();
    frameRate(30);

    blendModes = [BLEND, DIFFERENCE, EXCLUSION, SCREEN, REPLACE, HARD_LIGHT, ADD, REMOVE];
    divFactorSlider = select(".divFactorSlider");
    numCopySlider = select(".numCopySlider");
    deformationSlider = select(".deformationSlider");
    sizeFactorSlider = select(".sizeFactorSlider");
    angleDivSlider = select(".angleDivSlider");
    opacitySlider = select(".opacitySlider");
    colorsButton = select(".colorsButton");
    colorRangeSlider = select(".colorRangeSlider");
    filterSlider = select(".filterSlider");
    glitchButton = select(".glitchButton");
    noiseButton = select(".noiseButton");
    divSlider = select(".divSlider");

    chinaColor = select(".chinaColor");
    usaColor= select(".usaColor");
    indiaColor= select(".indiaColor");

    glitchButton.mousePressed(()=>glitchMode = !glitchMode);
    colorsButton.mousePressed(changeColors);
    noiseButton.mousePressed(()=>noiseMode = !noiseMode);
    
    changeColors();
    colors = {
        china: colors.china,
        india: colors.india,
        usa: colors.usa,
    };
    let dataManager = new DataManager(USrowData, CHIrowData, INrowData);
    dataManager.calculateAreas();

    let usa = new Country('usa', dataManager);
    let china = new Country('china', dataManager);
    let india = new Country('india', dataManager);
    countries = [usa, china, india];
  
    initializeOrigins();
    initializeDirections();
}

function draw() {
    background(0, 0, 0);

    // GLitch mode settings
    if(!glitchMode){
        blendMode(BLEND); 
    }
    opacityValue = glitchMode ? 1 : opacitySlider.value();
    blendModeValue = glitchMode ? 1 : filterSlider.value();
    
    blendMode(blendModes[blendModeValue % blendModes.length]);
   
    // Drawing
    let divFactor = divFactorSlider.value();
    for (let i = 0; i < divFactor; i++) {
        countries.forEach((country, index) => {
            let originIndex = index * divFactor + i;
            let directionIndex = index * divFactor + i;
            if (originIndex < origins.length && directionIndex < directions.length) {
                country.drawData(origins[originIndex], directions[directionIndex]);
            }
    });
    } 
}

function windowResized() {
    createCanvas(1200, 1200);
    colorMode(HSB);
    background(0, 0, 0);
}

function mouseClicked() {
    initializeOrigins(true);
    initializeDirections(true);
}

function changeColors() {
    colors.usa = random(360) + colorRangeSlider.value();
    colors.china = random(360)+ colorRangeSlider.value();
    colors.india = random(360)+ colorRangeSlider.value();

    let chinaHue =  colors.china % 360;
    let usaHue = colors.usa % 360;
    let indiaHue = colors.india % 360;

    let chinaColorHSB = color(chinaHue, 100, 100);
    let usaColorHSB = color(usaHue % 360, 100, 100);
    let indiaColorHSB = color(indiaHue % 360, 100, 100);


    // Hexadécimal conversion
    let chinaHex = '#' + hex(chinaColorHSB.levels[0], 2) + hex(chinaColorHSB.levels[1], 2) + hex(chinaColorHSB.levels[2], 2);
    let usaHex = '#' + hex(usaColorHSB.levels[0], 2) + hex(usaColorHSB.levels[1], 2) + hex(usaColorHSB.levels[2], 2);
    let indiaHex = '#' + hex(indiaColorHSB.levels[0], 2) + hex(indiaColorHSB.levels[1], 2) + hex(indiaColorHSB.levels[2], 2);

    chinaColor.style("color", chinaHex);
    usaColor.style("color", usaHex);
    indiaColor.style("color", indiaHex);
}

// Random origins
function initializeOrigins(randomize = false) {
    let divFactor = divFactorSlider.value();
    origins = [];
    if (divFactor === 1 && !randomize) {
        countries.forEach(() => {
            origins.push({ x: width / 2, y: height / 2 });
        });
    } else {
        for (let i = 0; i < divFactor; i++) {
            countries.forEach(() => {
                origins.push({ x: random(width), y: random(height) });
            });
        }
    }
}

// Random directions
function initializeDirections(randomize = false) {
    directions = [];
    let divFactor = divFactorSlider.value();
    if (divFactor === 1 && !randomize) {
        countries.forEach(() => {
            directions.push({ x: 0, y: 0 });
            });

    } else {
        for (let i = 0; i < divFactor; i++) {
            countries.forEach(() => {
                let angle = random(TWO_PI);  
                directions.push({
                    x: cos(angle),  
                    y: sin(angle) 
                });
            });
        }
    }
}

class DataManager {
    constructor(USData, CHIData, INData) {
        this.USData = this.extractData(USData);
        this.CHIData = this.extractData(CHIData);
        this.INData = this.extractData(INData);
        
        this.data = {
            usa: this.doubleTable(this.USData),
            china: this.doubleTable(this.CHIData),
            india: this.doubleTable(this.INData)
        };
        
        this.USAMaxPop = this.USData[this.USData.length - 1];
        this.CHIMaxPop = this.CHIData[this.CHIData.length - 1];
        this.INDiMaxPop = this.INData[this.INData.length - 1];
        
        this.totalPopulation = this.CHIMaxPop + this.USAMaxPop + this.INDiMaxPop;
        this.totalArea = width * height;
        
        this.areas = {};
    }
    
    extractData(countryData) {
        let country = countryData[1].map(item => item.value);
        return country.reverse().slice(0, -1);
    }
    
    doubleTable(table) {
        let result = [table[0]];
        for (let i = 0; i < table.length - 1; i++) {
            let avg = (table[i] + table[i + 1]) / 2;
            result.push(avg, table[i + 1]);
        }
        return result;
    }
    
    calculateAreas() {
        this.areas.usa = (this.USAMaxPop / this.totalPopulation) * this.totalArea;
        this.areas.china = (this.CHIMaxPop / this.totalPopulation) * this.totalArea;
        this.areas.india = (this.INDiMaxPop / this.totalPopulation) * this.totalArea;
    }
}

class Country {
    constructor(name, dataManager) {
        this.name = name;
        this.dataManager = dataManager;
        this.data = dataManager.data[name];
        this.maxPop = this.data[this.data.length - 1];
        this.area = dataManager.areas[name];
        this.index = 0;
    }

    calculateParams() {
        this.index = frameCount % this.data.length;
        let proportion = this.data[this.index] / this.maxPop;
        let size = sqrt(proportion * this.area);
        return { size: size, index: this.index };
    }

    drawData(origin, direction) {
   
        let params = this.calculateParams();
        fill(colors[this.name], 100, 100, opacityValue);
        let x = params.index * direction.x + origin.x;
        let y = params.index *direction.y + origin.y;
        let size = params.size/divFactorSlider.value();
        if (x - size / 2 < 0) {
            x = size / 2;
        } else if (x + size / 2 > width) {
            x = width - size / 2;
        }
        if (y - size / 2 < 0) {
            y = size / 2;
        } else if (y + size / 2 > height) {
            y = height - size / 2;
        }
      
        // Kaleidoscopic effect with geometric deformation
        let numCopies = numCopySlider.value(); 
        let angleStep = TWO_PI / numCopies;  // Angle between each copy
        let deformationScale = deformationSlider.value(); 
        push();
        translate(x, y);
        for (let i = 0; i < numCopies; i++) { 
            push();
            rotate(i * angleStep);  // Rotate each copy

            let sizeFactor = sizeFactorSlider.value(); 

            // Deform the ellipse into a more complex shape
            beginShape();
            for (let angle = 0; angle < TWO_PI; angle += PI / angleDivSlider.value()) {
                let offsets = this.calculateOffsets(angle, deformationScale, sizeFactor, size);
                vertex(offsets.offsetX, offsets.offsetY);
            }
            endShape(CLOSE);
            pop();
        }
        pop();

    }
    calculateOffsets(angle, deformationScale, sizeFactor, size) {
        let offsetX, offsetY;
        let divValue = divSlider.value();
        if (noiseMode) {
            let noiseScale = 0.1;
            let noiseVal = noise(cos(angle) * noiseScale, sin(angle) * noiseScale, frameCount * noiseScale) * 23;
    
            offsetX = size / 2 * cos(angle) + noiseVal * (1 + deformationScale * sin(divValue * angle + frameCount * 0.05)) * sizeFactor;
            offsetY = size / 2 * sin(angle) + noiseVal * (1 + deformationScale * sin(divValue * angle + frameCount * 0.05)) * sizeFactor;
        } else {
            offsetX = size / 2 * cos(angle) * (1 + deformationScale * sin(divValue * angle + frameCount * 0.05)) * sizeFactor;
            offsetY = size / 2 * sin(angle) * (1 + deformationScale * sin(divValue * angle + frameCount * 0.05)) * sizeFactor;
        }
        return { offsetX, offsetY };
    }

}


// TEST PERLIN NOISE SHAPE


 //sin variables
//  let amplitude = 2;
//  let offset =0.05;
 
//  // Perlin noise variables
//  let noiseScale = 0.01;
//  let noiseOffset = sin(frameCount * 0.02) * amplitude + offset;
     
   
//  let points = [];
//  let maxPoints = 100;

//  for (let i = 0; i < maxPoints; i++) {
//      let angle = i * TWO_PI / maxPoints;
    
//      let radius = size * noise(noiseOffset + i * noiseScale);
//      let x = width / 2 + radius * cos(angle);
//      let y = height / 2 + radius * sin(angle);
//      points.push(createVector(x, y));
//      //noiseOffset += sin(frameCount * 0.01) * amplitude + offset;
//      noiseOffset += 0.05;
//  }
//  console.log(points);
//  //Interpoler les points supplémentaires pour une transition douce
//  let interpolationSteps = 100; // Ajustez ce nombre pour une transition plus ou moins douce
//  for (let i = 0; i < interpolationSteps; i++) {
//      let t = i / interpolationSteps;
//      let x = lerp(points[points.length - 1].x, points[0].x, t);
//      let y = lerp(points[points.length - 1].y, points[0].y, t);
//      points.push(createVector(x, y));
//  }
//  console.log(points);
//  // Draw the shape
//  fill(colors[country], 100, 100);
//  beginShape();
//  for (let p of points) {
//      vertex(p.x, p.y);
//  }

//  endShape(CLOSE);