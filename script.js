// Replace with your Nutritionix API credentials
const APP_ID = "16f0d258";
const API_KEY = "60268c548a09674edbdd8651e6aa0aed";










// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
} else {
  console.error('Speech recognition not supported in this browser');
}











// Function to get nutrition data
async function fetchNutritionData(foodInput) {
  const url = "https://trackapi.nutritionix.com/v2/natural/nutrients";


  // JSON object
  const headers = {
    "Content-Type": "application/json",
    "x-app-id": APP_ID,
    "x-app-key": API_KEY
  };


  
  const body = JSON.stringify({
    query: foodInput
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Format nutrition data for display
    let nutritionText = `Nutritional Information for: ${foodInput}\n\n`;
    data.foods.forEach(food => {
      nutritionText += `Food: ${food.food_name}\n`;
      nutritionText += `Calories: ${food.nf_calories}\n`;
      nutritionText += `Protein: ${food.nf_protein}g\n`;
      nutritionText += `Carbs: ${food.nf_total_carbohydrate}g\n`;
      nutritionText += `Fat: ${food.nf_total_fat}g\n\n`;
    });

    // Display in textarea
    const outputArea = document.getElementById("output");
    outputArea.value = nutritionText;

    console.log("Nutritional Information:");
    data.foods.forEach(food => {
      console.log(`\nFood: ${food.food_name}`);
      console.log(`Calories: ${food.nf_calories}`);
      console.log(`Protein: ${food.nf_protein}g`);
      console.log(`Carbs: ${food.nf_total_carbohydrate}g`);
      console.log(`Fat: ${food.nf_total_fat}g`);
    });

  } catch (error) {
    console.error("Error fetching nutrition data:", error.message);
    const outputArea = document.getElementById("output");
    outputArea.value = `Error: ${error.message}`;
  }
}









// Microphone button functionality
document.getElementById("button").addEventListener('click', function() {
  if (!recognition) {
    alert('Speech recognition is not supported in your browser');
    return;
  }

  // Clear previous results
  const outputArea = document.getElementById("output");
  outputArea.value = "Listening... Speak now!";
  
  recognition.start();
});

















// Speech recognition event handlers
if (recognition) {
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    const foodInput = document.getElementById("foodInput");
    
    // Update input field with speech transcript
    foodInput.value = transcript;
    
    // Update textarea to show speech input
    const outputArea = document.getElementById("output");
    outputArea.value = `Speech Input: "${transcript}"\n\nFetching nutrition data...`;
    
    // Automatically fetch nutrition data for speech input
    fetchNutritionData(transcript);
  };

  recognition.onerror = function(event) {
    console.error('Speech recognition error:', event.error);
    const outputArea = document.getElementById("output");
    outputArea.value = `Speech recognition error: ${event.error}`;
  };

  recognition.onend = function() {
    console.log('Speech recognition ended');
  };
}






















// Form submission for text input
document.getElementById("myForm").addEventListener("submit", function(event) {
  event.preventDefault(); // prevent page reload

  const food = document.getElementById("foodInput").value;
  if (!food.trim()) {
    alert('Please enter a food item or use the microphone');
    return;
  }

  console.log("You ate:", food);

  // Update textarea to show text input
  const outputArea = document.getElementById("output");
  outputArea.value = `Text Input: "${food}"\n\nFetching nutrition data...`;

  fetchNutritionData(food);
});
