
let USdata;
let CHIdata;
let INdata;

function preload() {
    USdata = loadJSON( "/Us_pop.txt");
    CHIdata = loadJSON( "/India_pop.txt");
    INdata = loadJSON( "/China_pop.txt");
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB);
    background(0,0,0);
    console.log(extractData(USdata));
    console.log(extractData(CHIdata));
    console.log(extractData(INdata));
   
}

function draw(){

}

function extractData(country){
    let countryData = country[1].map(item => item.value);
    cleanData = countryData.reverse().slice(0, -1);
    return cleanData;
}

function windowResized(){
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB);
    background(0,0,0);
}