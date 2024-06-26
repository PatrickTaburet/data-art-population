
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

function preload() {
    USrowData = loadJSON( "/Us_pop.txt");
    CHIrowData = loadJSON( "/India_pop.txt");
    INrowData = loadJSON( "/China_pop.txt");
}

function setup(){
    createCanvas(700, 700);
    colorMode(HSB);
    background(0,0,0);
    noStroke();
    
    frameRate(30)
    let totalArea = width * height;

    data = {
        usa: extractData(USrowData),
        china: extractData(CHIrowData),
        india: extractData(INrowData)
    };
    console.log(data.china);

 

    USAMaxPop = data.usa[data.usa.length - 1];
    CHIMaxPop = data.china[data.china.length - 1];
    INDiMaxPop = data.india[data.india.length - 1];

    totalPopulation = CHIMaxPop + USAMaxPop + INDiMaxPop

    areas.usa = (USAMaxPop / totalPopulation) * totalArea;
    areas.china = (CHIMaxPop / totalPopulation) * totalArea;
    areas.india = (INDiMaxPop / totalPopulation) * totalArea;
    // console.log(areas);
    // console.log(totalArea);
    
   
  
}

function draw(){
    background(0, 0, 0);
    fill(colors.usa, 100,100);
    let index = frameCount % data.usa.length;
    console.log(index);
    let element = data.usa[index]
    let proportion = element / USAMaxPop;
    let size = sqrt(proportion * areas.usa)
    rect(index, index, size, size)

    fill(colors.china, 100,100);
    let index2 = frameCount % data.china.length;
    console.log(index2);
    let element2 = data.china[index2]
    let proportion2= element2 / CHIMaxPop;
    let size2 = sqrt(proportion2 * areas.china)
    rect(index2, index2, size2, size2)

}

function extractData(country){
    let countryData = country[1].map(item => item.value);
    cleanData = countryData.reverse().slice(0, -1);
    return cleanData;
}

function windowResized(){
    createCanvas(700, 700);
    colorMode(HSB);
    background(0,0,0);
}