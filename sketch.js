
let USrowData;
let CHIrowData;
let INrowData;
let totalPopulation;
let colors = {
    china: 255,
    india: 150,
    usa: 50
};
let areas = {};
let data={};
let USAMaxPop;
let CHIMaxPop;
let INDiMaxPop;
let origin= {};

function preload() {
    USrowData = loadJSON( "/Us_pop.txt");
    CHIrowData = loadJSON( "/India_pop.txt");
    INrowData = loadJSON( "/China_pop.txt");
}

function setup(){
    createCanvas(1200, 1200);
    colorMode(HSB);
    background(0,0,0);
    noStroke();
    
    frameRate(30)
    let totalArea = width * height;
    origin = {
        usa: width / 2,
        china: width / 2,
        india: width / 2
      };
    data = {
        usa: extractData(USrowData),
        china: extractData(CHIrowData),
        india: extractData(INrowData)
    };
    // console.log(data.china);

 

    USAMaxPop = data.usa[data.usa.length - 1];
    CHIMaxPop = data.china[data.china.length - 1];
    INDiMaxPop = data.india[data.india.length - 1];

    totalPopulation = CHIMaxPop + USAMaxPop + INDiMaxPop

    areas.usa = (USAMaxPop / totalPopulation) * totalArea;
    areas.china = (CHIMaxPop / totalPopulation) * totalArea;
    areas.india = (INDiMaxPop / totalPopulation) * totalArea;
    // console.log(areas);
    // console.log(totalArea);
    ellipseMode("center");
    
    // Doubler tableaux data
    data = {
        usa: doubleTable(data.usa),
        china: doubleTable(data.china),
        india: doubleTable(data.india)
    };
   
}

function draw(){ 
    
    background(0, 0, 0);

     // Country-specific variables

    drawData("usa");
    drawData("china");
    drawData("india");
 
 
     
    // Generate a random shape using Perlin noise

   
   
    
    // let index = frameCount % data.usa.length;
    // console.log(index);
    // let element = data.usa[index]
    // let proportion = element / USAMaxPop;
    // let size = sqrt(proportion * areas.usa)
    // ellipse(index+width/2, index+width/2, size, size)

    // fill(colors.china, 100,100,0.5);
    // let index2 = frameCount % data.china.length;
    // console.log(index2);
    // let element2 = data.china[index2]
    // let proportion2= element2 / CHIMaxPop;
    // let size2 = sqrt(proportion2 * areas.china)
    // rect(index2, index2, size2, size2)

}

function extractData(country){
    let countryData = country[1].map(item => item.value);
    cleanData = countryData.reverse().slice(0, -1);
    return cleanData;
}

function windowResized(){
    createCanvas(1200, 1200);
    colorMode(HSB);
    background(0,0,0);
}
function calculCountryParams(country){
    let index = (frameCount % data[country].length);
    let maxPop = data[country][data[country].length - 1];
    let area = areas[country];
    let proportion = data[country][index] / maxPop;
    let size = sqrt(proportion * area);
    return params ={
        index: index,
        maxPop: maxPop,
        size : size
    }
}

function drawData(country){
    params = calculCountryParams(country);
    fill(colors[country], 100,100, 0.5);
    // console.log(params.index);
    ellipse((params.index+origin[country]), params.index+origin[country], params.size, params.size)
}
function mouseClicked() {
    origin.usa = random(width);
    origin.china = random(width);
    origin.india = random(width);
  }
function doubleTable(table) {
    let result = [table[0]];
    for (let i = 0; i < table.length - 1; i++) {
      let avg = (table[i] + table[i + 1]) / 2;
      result.push(avg, table[i + 1]);
    }
    return result;
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