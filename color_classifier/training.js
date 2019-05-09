let data;
let r,g,b;
let xs, ys;
let model;
let options;
let lossP;
let labelP;

let rSlider , gSlider , bSlider;
let rgbDivf;
let rgbDivg;
let rgbDivh;




 let labelList=  [
   'red-ish',
   'green-ish',
   'blue-ish',
   'orange-ish',
   'yellow-ish',
   'pink-ish',
   'purple-ish',
   'brown-ish',
   'grey-ish'
 ]








 function pickSlider()

 {
   rSlider = createSlider(0, 255, 100);
   rSlider.position(20,500);
   gSlider = createSlider(0, 255, 0);
   gSlider.position(20,550);
   bSlider = createSlider(0, 255, 255);
   bSlider.position(20,600);
   background(rSlider,gSlider,bSlider);

   console.log(rSlider,gSlider,bSlider);


 }






function preload()
{
  data = loadJSON('colorData.json');

}

function setup()
{
  //console.log(data.entries.length);
  // labelP= createP('');
  // lossP= createP('loss');


  textSize(15);
  noStroke();


  createCanvas(400,400).parent('#root');
  rgbDivf= createDiv().parent('#root').class('white');
  rgbDivg=  createDiv().parent('#root').class('white');
  rgbDivh= createDiv().parent('#root').class('white');

  bodyElement=document.body;
  pickSlider();
  ready=true;


  rgbDivf.html("");
  rgbDivg.html("");
  // rgbDivh.html('red');








  let colors= [];
  let labels = [];
  for(let record of data.entries)
  {
    let col = [record.r/255 , record.g/255, record.b/255];
    colors.push(col);
    labels.push(labelList.indexOf(record.label));
  }
  //console.log(colors);
   xs= tf.tensor2d(colors);

  //console.log(xs.shape);

  let labelsTensor = tf.tensor1d(labels, 'int32');
  labelsTensor.print();

   ys  = tf.oneHot(labelsTensor, 9);

  labelsTensor.dispose();

  //console.log(xs.shape);
  //console.log(ys.shape);

  xs.print();
  ys.print();

  model = tf.sequential();
  let hidden = tf.layers.dense(
    {

      units: 16,
      activation: 'sigmoid',
      inputDim: 3

    }
  );

  let output = tf.layers.dense(
    {
      units: 9,
      activation: 'softmax'
    }
  );
  //console.log(labels);



  // Create an optimizer
  //  "meanSquaredError" --> "categoticalCross"
  // compile the model
  model.add(hidden);
  model.add(output);



  const lr = 0.2;
  const optimizer = tf.train.sgd(lr);

  model.compile(
    {
      optimizer: optimizer,
      loss : 'categoricalCrossentropy'

    }
  );
// model fit



train().then(results =>
{
//console.log(results.history.loss);
});


}

  async function train()
{
  const options=
  {
    epochs:70,
    validationSplit:0.1,
    shuffle:true,
    callbacks:{
      onTrainBegin:() => console.log('training start'),
      onTrainEnd:() => console.log('training complete'),
      onBatchEnd: tf.nextFrame,
      onEpochEnd: (num,logs) =>
      {
       tf.nextFrame();
        //console.log('Epoch:' + num);
        rgbDivg.html('loss:'+logs.loss);

      }
    }



  }
  return await model.fit(xs, ys, options)

}

function updateBodyBG(){
  bodyElement.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 10.0)`;
}


function  draw()
{
  text('red', rSlider.x * 2 + rSlider.width, 35);
  text('green', gSlider.x * 2 + gSlider.width, 65);
  text('blue', bSlider.x * 2 + bSlider.width, 95);


   r = rSlider.value();
   g = gSlider.value();
  b = bSlider.value();
  console.log(r,g,b);

  background(r, g, b);
  updateBodyBG();


  tf.tidy(() => {

  const xs = tf.tensor2d(
    [
      [r/255,g/255,b/255]
    ]
  );

  let results= model.predict(xs);
  let index = results.argMax(1).dataSync()[0];
  //console.log(index);
  let label = labelList[index];
  rgbDivf.html(`LABEL:${label}`);
});


  //index.print();








  //stroke(255);
  //strokeWeight(4);
  //line ( frameCount % width , 0 ,frameCount % width, height);
}
