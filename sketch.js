
let USrowData;
let CHIrowData;
let INrowData;
let totalPopulation;
let colors;
let areas = {};

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
    let data = {
        usa: extractData(USrowData),
        china: extractData(CHIrowData),
        india: extractData(INrowData)
    };
    console.log(data.china);

    colors = {
        china: [255, 0, 0],
        india: [0, 255, 0],
        usa: [0, 0, 255]
    };
    let CHIMaxPop = data.china[data.china.length - 1];
    let USAMaxPop = data.usa[data.usa.length - 1];
    let INDiMaxPop = data.india[data.india.length - 1];
    totalPopulation = CHIMaxPop + USAMaxPop + INDiMaxPop
    console.log(totalPopulation);


    let totalArea = width * height;
  
}

function draw(){

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