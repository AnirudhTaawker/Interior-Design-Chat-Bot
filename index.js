const API_KEY = process.env.OPENAI_API_KEY; //apikey stored in env.js
const url = 'https://api.openai.com/v1/images/generations'; //endpoint

const basePrompt = "The view of a room from the inside. Realistic"; //hard-coded base prompt
let initialPrompt = ''; //user's prompt
let feedbackPrompt = ''; //user's feedback prompt

document.getElementById('submit-btn').addEventListener('click', () => {
  initialPrompt = document.getElementById('instruction').value;
  const combinedPrompt = `${basePrompt} ${initialPrompt}`;
  generateImages(combinedPrompt);
});

function generateImages(prompt) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      prompt: prompt,
      n: 3, //generates two images
      size: '256x256',
      response_format: 'b64_json'
    })
  };

  fetch(url, requestOptions)
    .then(response => response.json())
    .then(data => {
      const image1Data = data.data[0].b64_json;
      const image2Data = data.data[1].b64_json;
      const image3Data =data.data[2].b64_json;
      
      document.getElementById('output-img1').src = `data:image/png;base64,${image1Data}`;
      document.getElementById('output-img2').src = `data:image/png;base64,${image2Data}`;
      document.getElementById('output-img3').src = `data:image/png;base64,${image3Data}`;
      document.getElementById('feedback-container').style.display = 'flex'; //display feedback container
    })
    .catch(error => console.error(error));
}

document.getElementById('feedback-btn').addEventListener('click', () => {
  feedbackPrompt = document.getElementById('feedback').value; //user's feedback after initial generation
  const combinedPrompt = `${basePrompt} ${initialPrompt}. ${feedbackPrompt}`; //combining base, initial and feedback prompts to generate new set of images
  generateImages(combinedPrompt); //generating a second round of images based on user feedback
});
