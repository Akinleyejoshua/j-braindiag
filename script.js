const input = document.querySelector("input");
const button = document.querySelector("button");
const img = document.querySelector(".img-preview");
const result = document.querySelector(".result");
const predict = document.querySelector(".predict");
const preview = document.querySelector(".preview");
tf.ENV.set("WEBGL_PACK", false);

var model, prediction, tensor, value;

classes = [
  "No Brain Tumor Present in the Scan",
  "Brain Tumor is Present in the Scan",
];

input.onchange = (event) => {
  img.src = URL.createObjectURL(event.target.files[0]);
  img.className = img.className.replace("danger", "");
};

predict.onclick = () => {
  result.innerHTML = "Please Wait: Diagnosing Scan";
  preview.classList.add("scanning");
  img.classList.remove("danger");
  img.classList.remove("save");

  async function processModel() {
    model = await tf.loadLayersModel("./model-js-3/model.json");
    tensor = tf.browser
      .fromPixels(img)
      .resizeBilinear([224, 224])
      .reshape([1, 224, 224, 3]);
    prediction = model.predict(tensor);
    value = Math.round(prediction.dataSync()[1]);
    result.innerHTML = classes[value];
    console.log(prediction.dataSync());
    preview.classList.remove("scanning");
    result.innerHTML = classes[value];
    if (value === 1) {
      img.classList.add("danger");
    } else {
      img.classList.add("save");
    }
  }

  setTimeout(processModel, 1000);
};
