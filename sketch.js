let USrowData;
let CHIrowData;
let INrowData;

let colors = {
    china: 255,
    india: 150,
    usa: 50
};
let origin = {};
let countries = [];
let origins = []; 

let divFactor = 12;
function preload() {
    USrowData = loadJSON("/Us_pop.txt");
    CHIrowData = loadJSON("/India_pop.txt");
    INrowData = loadJSON("/China_pop.txt");
}

function setup() {
    createCanvas(1200, 1200);
    colorMode(HSB);
    background(0, 0, 0);
    noStroke();
    frameRate(30);
    
    // origin = {
    //     usa: width / 2,
    //     china: width / 2,
    //     india: width / 2
    // };

    let dataManager = new DataManager(USrowData, CHIrowData, INrowData);
    dataManager.calculateAreas();

    let usa = new Country('usa', dataManager);
    let china = new Country('china', dataManager);
    let india = new Country('india', dataManager);
    countries = [usa, china, india];
  
    initializeOrigins();
}

function draw() {
    background(0, 0, 0);
    for (let i = 0; i < divFactor; i++) {
      countries.forEach((country, index) => {
        country.drawData(origins[index * divFactor + i]);
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
}

function initializeOrigins(randomize = false) {
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

    drawData(origin) {
   
      let params = this.calculateParams();
      fill(colors[this.name], 100, 100, 0.5);
      let x = params.index + origin.x;
      let y = params.index + origin.y;
      let size = params.size/divFactor;
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
      ellipse(x, y, size, size);
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