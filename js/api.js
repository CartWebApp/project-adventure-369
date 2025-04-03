const api = 'AIzaSyDjycqu5K7H7VvbkmlAemZhkdfMfYNX5TM';

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api}`
const headers = {
  'Content-Type': 'application/json'
};

const body = JSON.stringify({
  contents: [
    {
      parts: [
        {
          text: "Generate an image of the color cyan and return the binary for the file."
        }
      ]
    }
  ]
});

fetch(url, {
  method: 'POST',
  headers: headers,
  body: body
})
  .then(response => response.json())
  // .then(data => console.log(data.content.parts[0]))
  .then(data => console.log(data.candidates[0].content.parts[0].text))
  .catch (error => console.error('Error:', error));
  