
  function toggleUploadOptions() {
    const options = document.getElementById("imageUpload");
    options.style.display = options.style.display === "flex" ? "none" : "flex";
}

function openCamera() {
  let cameraInput = document.createElement("input");
  cameraInput.type = "file";
  cameraInput.accept = "image/*";
  cameraInput.capture = "environment"; // Opens rear camera on mobile devices
  cameraInput.style.display = "none";

cameraInput.addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Show preview
  const reader = new FileReader();
  reader.onload = function(e) {
    const imagePreview = document.getElementById("imagePreview");
    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Captured Image" class="preview-image">`;
  };
  reader.readAsDataURL(file);

  // Send to server
  const formData = new FormData();
  formData.append("image", file);

  document.getElementById("answerBox").innerHTML = "<p>🔍 Analyzing image...</p>";

  fetch("/analyze-image", {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      const answerBox = document.getElementById("answerBox");
      if (data.plant_name) {
        answerBox.innerHTML = `<p>🌿 <strong>Plant Identified:</strong> ${data.plant_name}</p>`;
      } else {
        answerBox.innerHTML = `<p>❌ No plant identified. Please try a clearer image.</p>`;
      }
    })
    .catch(error => {
      console.error("Error:", error);
      document.getElementById("answerBox").innerHTML = "<p>❌ Error analyzing the image.</p>";
    });
});


  document.body.appendChild(cameraInput);
  cameraInput.click();
}


function openStorage() {
    alert("Storage upload option clicked! Implement file picker here.");
}

// Hide the upload options when clicking outside
document.addEventListener("click", function(event) {
    const container = document.querySelector(".input-container");
    if (!container.contains(event.target)) {
        document.getElementById("imageUpload").style.display = "none";
    }
});


document.getElementById("wait").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        askQuestion();
    } else {
        // Clear image preview when typing starts
        document.getElementById("imagePreview").innerHTML = "";
        document.getElementById("imagePreview").style.display = "none";
    }
});

function askQuestion() {
    let question = document.getElementById("wait").value.trim();
    if (!question) {
        alert("Please enter a question.");
        return;
    }

    document.getElementById("answerBox").innerHTML = "<p>Fetching answer...</p>";

    fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question })
    })
    .then(response => response.json())
    .then(data => {
        showSpeechButtons();
        document.getElementById("answerBox").innerHTML = data.answer;
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("answerBox").innerHTML = "<p>Failed to get response.</p>";
    });

    document.getElementById("wait").value = "";
}


// ✅ Handle Image Upload
document.getElementById("imageUpload").addEventListener("change", function (event) {
    let file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById("imagePreview").innerHTML = `<img src="${e.target.result}" alt="Uploaded Image">`;
        document.getElementById("imagePreview").style.display = "block";
    };
    reader.readAsDataURL(file);

    let formData = new FormData();
    formData.append("image", file);

    document.getElementById("answerBox").innerHTML = "<p>🔍 Analyzing image...</p>";

 fetch("/analyze-image", {
        method: "POST",
        body: formData,
        headers: {
           "Authorization": "Bearer 2b10UJhFQMXNClo0grqgVCO"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            document.getElementById("answerBox").innerHTML = `<p>❌ Error: ${data.error}</p>`;
        } else {
            // More detailed results
            showSpeechButtons();
            document.getElementById("answerBox").innerHTML = `
            <h3>🌿 Identification Result:</h3>
            <p><strong>📌 Scientific Name:</strong> ${data.scientific_name}</p>
            <p><strong>🌱 Common Name:</strong> ${data.common_name || "Not available"}</p>
            <p><strong>🏡 Family:</strong> ${data.family_name || "Not available"}</p>
            <p><strong>📊 Confidence Score:</strong> ${data.confidence}%</p>
        `;
        
        }
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("answerBox").innerHTML = "<p>❌ Failed to analyze image.</p>";
    });
});




document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "592b6e51a22d45ec341a6331fff7316a";  // Replace with your actual API key
    const locationInput = document.getElementById("locationInput");
    const weatherDisplay = document.getElementById("weatherDisplay");
    const weatherContainer = document.getElementById("weatherContainer");

    async function fetchWeather() {
        let location = locationInput.value.trim();

        if (location.length < 3) {
            weatherDisplay.innerHTML = ""; // Clear display if input is empty
            return;
        }

        try {
            let response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
            );
            let data = await response.json();

            if (data.cod === 200) {
                let temperature = data.main.temp;
                let description = data.weather[0].description;
                let iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

                // Replace input field with weather info
                weatherContainer.innerHTML = `
                    <div class="weather-box">
                        <span class="location-symbol">📍</span>
                        <span>${location} - ${temperature}°C, ${description}</span>
                        <img src="${iconUrl}" alt="Weather Icon">
                    </div>
                `;
            } else {
                weatherDisplay.innerHTML = "<span>Location not found</span>";
            }
        } catch (error) {
            console.error("Weather API Error:", error);
            weatherDisplay.innerHTML = "<span>Error fetching weather data</span>";
        }
    }

    // Run weather fetch when user presses "Enter"
    locationInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            fetchWeather();
        }
    });
});



document.getElementById("join").addEventListener("click", function() {
    document.getElementById("loginModal").style.display = "flex";
});

document.addEventListener("DOMContentLoaded", function () {
    const inputs = document.querySelectorAll(".form-control");
    const joinButton = document.querySelector(".btn-outline-primary");
    let clickedFields = new Set();

    inputs.forEach(input => {
        input.addEventListener("click", function () {
            clickedFields.add(input);
        });
    });

    joinButton.addEventListener("click", function (event) {
        event.preventDefault();
        
        if (clickedFields.size === inputs.length) {
            document.querySelector(".login-box").remove();
            showThankYouCard();
        }
         else {
            alert("Please fill all input fields before joining.");
        }
    });
});



document.getElementById("submitForm").addEventListener("click", function() {
    const form = document.getElementById("loginForm");
    document.getElementById("hey").innerHTML = "Hey " +document.getElementById("user-name").value || "Guest";
    if (form.checkValidity()) {
        form.reset();
        document.getElementById("loginModal").style.opacity = "1";
        document.getElementById("loginModal").style.transition = "opacity 0.5s ease";
        document.getElementById("loginModal").style.opacity = "0";
        setTimeout(() => {
            document.getElementById("loginModal").style.display = "none";
        }, 500);
        showThankYouCard();
    } else {
        form.reportValidity();
    }
});

function showThankYouCard() {
    const card = document.getElementById("thankYouCard");
    card.style.display = "block";
   
    
    
    setTimeout(() => {
        card.style.display = "none";
        document.getElementById("join").style.display = "none";     
        document.getElementById("hey").style.display = "block";
        

    }, 2000); // Display for at least 4 seconds

}


// Close login modal if clicking outside with smooth transition
window.addEventListener("click", function(event) {
    const modal = document.getElementById("loginModal");
    if (event.target === modal) {
       
        setTimeout(() => {
            document.getElementById("loginModal").style.display="none";
        }, 10);
    }
});

// Start by displaying the top 5 news

let newsCount = 5; // Start by displaying the top 5 news
const newsContainer = document.getElementById("news-list");

function fetchAgricultureNews(offset = 0, limit = 5) {
    fetch(`/get_agriculture_news?offset=${offset}&limit=${limit}`)
        .then(response => response.json())
        .then(data => {
            displayNews(data);
        })
        .catch(error => console.error('Error fetching news:', error));
}

function displayNews(news) {
    news.forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');
        
        newsItem.innerHTML = `
            <div class="news-text">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <a href="${item.url}" target="_blank">Read More</a>
            </div>
            <div class="news-image">
                <img src="${item.image}" alt="News Image" />
            </div>
        `;
        
        newsContainer.appendChild(newsItem);
    });
}

function loadMoreNews() {
    newsCount += 5; // Load more news in increments of 5
    fetchAgricultureNews(newsCount - 5, newsCount); // Fetch the next set of news
}

// Initially load the first batch of news
fetchAgricultureNews();



function loadGoogleTranslateScript() {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);

}

function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        { pageLanguage: 'en', includedLanguages: 'en,hi', layout: google.translate.TranslateElement.InlineLayout.SIMPLE },
        'google_translate_element'
    );
}

function updateTranslateText() {
    let googleSpan = document.querySelector(".goog-te-gadget-simple span");
    if (!googleSpan) return;

    let currentLang = document.documentElement.lang || "en"; // Detects page language
    let headElement = document.getElementById("head-id"); // Selects the target element
    if (currentLang === "hi") {
        googleSpan.innerHTML = 'Select Your Language ';
        if (headElement) headElement.style.marginTop = "40px";
    } else {
        googleSpan.innerHTML = 'अपनी भाषा चुनें ';
        if (headElement) headElement.style.marginTop = "0px";
    }
}


function changeGoogleTranslateText() {
    let interval = setInterval(() => {
        let googleSpan = document.querySelector(".goog-te-gadget-simple span");
        if (googleSpan) {
            updateTranslateText(); // Set initial text
            clearInterval(interval);
        }
    }, 500);
}

function observeLanguageChange() {
    const observer = new MutationObserver(() => {
        updateTranslateText();
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
}

document.addEventListener("DOMContentLoaded", function () {
    loadGoogleTranslateScript();
    setTimeout(() => {
        changeGoogleTranslateText();
        observeLanguageChange();
    }, 500);
});


// Fetch Schemes on Page Load
window.onload = function() {
    fetch('/get_schemes')
        .then(response => response.json())
        .then(data => {
            const schemesContainer = document.getElementById("schemesContainer");
            if (data.length > 0) {
                schemesContainer.innerHTML = data.map(scheme => `
                    <div class="scheme-card">
                        <h2><a href="${scheme.link}" target="_blank">${scheme.title}</a></h2>
                        ${scheme.img_src ? `<img src="${scheme.img_src}" alt="${scheme.title}">` : ''}
                    </div>
                `).join('');
            } else {
                schemesContainer.innerHTML = "<p>No schemes found. Please try again later.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching schemes:", error);
            document.getElementById("schemesContainer").innerHTML = "<p>Failed to load schemes.</p>";
        });
};

// Handle Price Form Submission
document.getElementById("priceForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    fetch("/get_prices", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        const priceResults = document.getElementById("priceResults");

        if (data.prices && data.prices.length > 0) {
        let html = `<h2>Market Prices</h2>
        <div class="table-responsive">
        <table class="table">`;
        html += `<tr><th>District</th><th>Market</th><th>Commodity</th><th>Variety</th><th>Max Price</th><th>Avg Price</th><th>Min Price</th></tr>`;
        
            data.prices.forEach(price => {
                html += `
                    <tr>
                        <td>${price.district}</td>
                        <td>${price.market}</td>
                        <td>${price.commodity}</td>
                        <td>${price.variety}</td>
                        <td>${price.max_price}</td>
                        <td>${price.avg_price}</td>
                        <td>${price.min_price}</td>
                    </tr>
                `;
            });

            html += `</table></div>`;
            priceResults.innerHTML = html;
        } else {
            priceResults.innerHTML = `<p>${data.message}</p>`;
        }
    })
    .catch(error => {
        console.error("Error fetching prices:", error);
        document.getElementById("priceResults").innerHTML = "<p>Failed to fetch prices.</p>";
    });
});



function pricebutton(){
    document.getElementById("priceResults").style.display = 'none';
    document.getElementById("backButton").style.display = 'none';   
    document.getElementById("priceForm").reset();
}

function showback(){
    if(document.getElementById("priceinput").value.length>0 && document.getElementById("priceinput2").value.length>0){
        setTimeout(() => {
            document.getElementById("backButton").style.display='block';
            document.getElementById("priceResults").style.display="block";
        }, 500);
    }
    else{

    }
}





function showTool(tool) {
    const toolContent = document.getElementById('tool-content');
    document.getElementById('backButton').style.display = "block";
    document.getElementById('tool-buttons').style.display = 'none'; // Hide all buttons
    
    let toolHtml = '';
    if (tool === 'seedRate') {
        toolHtml = `
            <h3>Seed Rate Calculator</h3><br>
            <label class="form-control-label">Field Area (in acres):</label>
            <input type="number" class="input--field" id="seedFieldArea" placeholder="Enter area">
            <label class="form-control-label">Seeds per Acre:</label>
            <input type="number" class="input--field" id="seedPerAcre" placeholder="Seeds per acre"><br><br>
            <button onclick="calculateSeedRate()" id="join">Calculate</button>
            <p id="seedRateResult"></p>
        `;
    } else if(tool === 'fertilizer') {
        toolHtml = `
            <h3>Fertilizer Requirement Calculator</h3>
            <label class="form-control-label">Select Crop Type:</label>
            <select style=" background: none;border: 1px solid white;padding: 10px 20px;color: white;font-size: 16px;border-radius: 5px;" id="cropType">
                <option style="color: black;" value="wheat">Wheat</option>
                <option style="color: black;" value="rice">Rice</option>
                <option style="color: black;" value="maize">Maize</option>
            </select><br><br>
            <label class="form-control-label">Nitrogen (kg/acre):</label>
            <input type="number" class="input--field" id="fertilizerNitrogen" placeholder="Enter nitrogen"><br>
            <label class="form-control-label">Phosphorus (kg/acre):</label>
            <input type="number" class="input--field" id="fertilizerPhosphorus" placeholder="Enter phosphorus"><br>
            <label class="form-control-label">Potassium (kg/acre):</label>
            <input type="number" class="input--field" id="fertilizerPotassium" placeholder="Enter potassium"><br>
            <label class="form-control-label">Farm Area (in acres):</label>
            <input type="number" class="input--field" id="farmArea" placeholder="Enter farm area"><br><br>
            <button onclick="calculateFertilizer()" id="join">Calculate</button>
            <p id="fertilizerResult"></p>
        `;
    } else if (tool === 'soilPh') {
        toolHtml = `
            <h3>Soil pH Calculator</h3><br>
            <label class="form-control-label">Enter Soil pH:</label>
            <input type="number" class="input--field" id="soilPhValue" step="0.1" placeholder="Enter pH"><br><br>
            <button onclick="calculateSoilPh()" id="join">Check</button>
            <p id="soilPhResult"></p>
        `;
    } else if (tool === 'irrigation') {
        toolHtml = `
            <h3>Irrigation Requirement Calculator</h3><br>
            <label class="form-control-label">Field Area (in acres):</label>
            <input type="number" class="input--field" id="irrigationFieldArea" placeholder="Enter area">
            <label class="form-control-label">Water Requirement (liters/acre):</label>
            <input type="number" class="input--field" id="waterRequirement" placeholder="Water per acre"><br><br>
            <button onclick="calculateIrrigation()" id="join">Calculate</button>
            <p id="irrigationResult"></p>
        `;
    } else if (tool === 'cropYield') {
        toolHtml = `
            <h3>Crop Yield Estimator</h3><br>
            <label class="form-control-label">Field Area (in acres):</label>
            <input type="number" class="input--field" id="yieldFieldArea" placeholder="Enter area">
            <label class="form-control-label">Expected Yield per Acre (kg):</label>
            <input type="number" class="input--field" id="yieldPerAcre" placeholder="Yield per acre"><br><br>
            <button onclick="calculateCropYield()" id="join">Estimate</button>
            <p id="cropYieldResult"></p>
        `;
    } else if (tool === 'dripIrrigation') {
        toolHtml = `
            <h3>Drip Irrigation Calculator</h3>
            <label>Field Area (sq. meters):</label>
            <input type="number" class="input--field" id="fieldArea" placeholder="Enter field area"><br>
            <label>Number of Drip Emitters:</label>
            <input type="number" class="input--field" id="numDrips" placeholder="Enter number of drip emitters"><br>   
            <label>Water Flow Rate per Drip (Liters/hour):</label>
            <input type="number" class="input--field" id="flowRate" placeholder="Enter flow rate"><br>
            <label>Operating Hours per Day:</label>
            <input type="number" class="input--field" id="operatingHours" placeholder="Enter operating hours"><br><br>
            <button onclick="calculateDripIrrigation()" id="join">Calculate</button>
            <p id="dripIrrigationResult"></p>
        `;
    } else if (tool === 'rainHarvest') {
        toolHtml = `
            <h3>Rainwater Harvesting Calculator</h3>
            <label>Roof Area (sq. meters):</label>
            <input type="number" class="input--field" id="roofArea" placeholder="Enter roof area"><br>
            <label>Annual Rainfall (mm):</label>
            <input type="number" class="input--field" id="annualRainfall" placeholder="Enter annual rainfall"><br>
            <label>Runoff Coefficient (0-1):</label>
            <input type="number" class="input--field" id="runoffCoeff" placeholder="Enter runoff coefficient"><br><br>
            <button onclick="calculateRainHarvest()" id="join">Calculate</button>
            <p id="rainHarvestResult"></p>
        `;
    } else if (tool === 'evapotranspiration') {
        toolHtml = `
            <h3>Evapotranspiration Calculator</h3>
            <label>Temperature (°C):</label>
            <input type="number" class="input--field" id="temperature" placeholder="Enter temperature"><br>
            <label>Relative Humidity (%):</label>
            <input type="number" class="input--field" id="humidity" placeholder="Enter humidity"><br>
            <label>Wind Speed (m/s):</label>
            <input type="number" class="input--field" id="windSpeed" placeholder="Enter wind speed"><br><br>
            <button onclick="calculateEvapotranspiration()" id="join">Calculate</button>
            <p id="evapotranspirationResult"></p>
        `;
    }else if (tool === "frostPrediction") {
        toolHtml = `
            <h3>Frost Prediction Calculator</h3>
            <label>Temperature (°C):</label>
            <input type="number" class="input--field" id="frostTemp" placeholder="Enter temperature">
            <label>Dew Point (°C):</label>
            <input type="number" class="input--field" id="dewPoint" placeholder="Enter dew point">
            <button id="join" onclick="calculateFrostRisk()">Calculate</button>
            <p id="frostPredictionResult"></p>
        `;
    } else if (tool === "heatStress") {
        toolHtml = `
            <h3>Heat Stress Index Calculator</h3>
            <label>Temperature (°C):</label>
            <input type="number" class="input--field" id="heatTemp" placeholder="Enter temperature">
            <label>Humidity (%):</label>
            <input type="number" class="input--field" id="humidity" placeholder="Enter humidity">
            <button id="join" onclick="calculateHeatStress()">Calculate</button>
            <p id="heatStressResult"></p>
        `;
    } else if (tool === "gdd") {
        toolHtml = `
            <h3>Growing Degree Days (GDD) Calculator</h3>
            <label>Max Temperature (°C):</label>
            <input type="number" class="input--field" id="maxTemp" placeholder="Enter max temperature"><br>
            <label>Min Temperature (°C):</label>
            <input type="number" class="input--field" id="minTemp" placeholder="Enter min temperature"><br>
            <label>Base Temperature (°C):</label>
            <input type="number" class="input--field" id="baseTemp" placeholder="Enter base temperature"><br><br>
            <button id="join" onclick="calculateGDD()">Calculate</button>
            <p id="gddResult"></p>
        `;
    } else if (tool === "harvestTiming") {
        toolHtml = `
            <h3>Harvest Timing Calculator</h3>
            <label>Planting Date:</label>
            <input type="date" class="input--field" id="plantingDate">
            <label>Select Crop:</label>
            <select id="cropType" style=" margin:5px; background: none;border: 1px solid white;padding: 10px 20px;color: white;font-size: 16px;border-radius: 5px;" onchange="toggleCustomCrop()"><br><br>
                <option style="color: black;" value="wheat" data-days="120">Wheat (120 days)</option>
                <option style="color: black;" value="rice" data-days="150">Rice (150 days)</option>
                <option style="color: black;" value="maize" data-days="90">Maize (90 days)</option>
                <option style="color: black;" value="other">Other</option>
            </select>
            <div id="customCropFields" style="display: none;">
                <label>Crop Name:</label>
                <input class="input--field" type="text" id="customCropName" placeholder="Enter crop name">
                <label>Days to Maturity:</label>
                <input class="input--field" type="number" id="customMaturityDays" placeholder="Enter days to maturity"><br><br>
            </div>
            <button id="join" onclick="calculateHarvestTiming()">Calculate</button>
            <p id="harvestTimingResult"></p>
        `;
    } else if (tool === "costCultivation") {
        toolHtml = `
            <h3>Cost of Cultivation Calculator</h3>
            <label>Land Preparation Cost (₹):</label>
            <input type="number" class="input--field" id="landCost" placeholder="Enter cost"><br>
            <label>Seed Cost (₹):</label>
            <input type="number" class="input--field" id="seedCost" placeholder="Enter cost"><br>
            <label>Fertilizer Cost (₹):</label>
            <input type="number" class="input--field" id="fertilizerCost" placeholder="Enter cost"><br>
            <label>Labor Cost (₹):</label>
            <input type="number" class="input--field" id="laborCost" placeholder="Enter cost"><br><br>
            <button id="join" onclick="calculateCostCultivation()">Calculate</button>
            <p id="costCultivationResult"></p>
        `;
    }else if (tool === "loanEMI") {
        toolHtml = `
            <h3>Loan EMI Calculator</h3>
            <label>Loan Amount (₹):</label>
            <input type="number" class="input--field" id="loanAmount" placeholder="Enter loan amount"><br>
            <label>Annual Interest Rate (%):</label>
            <input type="number" class="input--field" id="interestRate" placeholder="Enter interest rate"><br>
            <label>Loan Tenure (years):</label>
            <input type="number" class="input--field" id="loanTenure" placeholder="Enter tenure"><br><br>
            <button id="join" onclick="calculateLoanEMI()">Calculate</button>
            <p id="loanEMIResult"></p>
        `;
    } else if (tool === "feedRequirement") {
        toolHtml = `
            <h3>Feed Requirement Calculator</h3>
            <label>Number of Animals:</label>
            <input type="number" class="input--field" id="numAnimals" placeholder="Enter number of animals">
            <label>Feed per Animal (kg/day):</label>
            <input type="number" class="input--field" id="feedPerAnimal" placeholder="Enter feed per animal">
            <button id="join" onclick="calculateFeedRequirement()">Calculate</button>
            <p id="feedRequirementResult"></p>
        `;
    } else if (tool === "farmEquipmentCost") {
        toolHtml = `
            <h3>Farm Equipment Cost Calculator</h3>
            <label>Equipment Price (₹):</label>
            <input type="number" class="input--field" id="equipmentPrice" placeholder="Enter equipment price"><br>
            <label>Annual Maintenance Cost (₹):</label>
            <input type="number" class="input--field" id="maintenanceCost" placeholder="Enter maintenance cost"><br>
            <label>Years of Use:</label>
            <input type="number" class="input--field" id="yearsOfUse" placeholder="Enter years of use"><br><br>
            <button id="join" onclick="calculateFarmEquipmentCost()">Calculate</button>
            <p id="farmEquipmentCostResult"></p>
        `;
    } else if (tool === "tractorFuelEfficiency") {
        toolHtml = `
            <h3>Tractor Fuel Efficiency Calculator</h3>
            <label>Fuel Consumption (Liters/hour):</label>
            <input type="number" class="input--field" id="fuelConsumption" placeholder="Enter fuel consumption"><br>
            <label>Hours of Operation per Day:</label>
            <input type="number" class="input--field" id="hoursOperation" placeholder="Enter hours per day"><br><br>
            <button id="join" onclick="calculateTractorFuelEfficiency()">Calculate</button>
            <p id="tractorFuelEfficiencyResult"></p>
        `;
    }
    
    toolContent.innerHTML = toolHtml;
}


function goBack() {
    document.getElementById('tool-buttons').style.display = 'block'; // Show tool buttons
    document.getElementById('backButton').style.display = 'none'; // Hide back button
    document.getElementById('tool-content').innerHTML = ''; // Clear tool content
}

function calculateSeedRate() {
    const area = parseFloat(document.getElementById('seedFieldArea').value);
    const seedsPerAcre = parseFloat(document.getElementById('seedPerAcre').value);
    const result = area * seedsPerAcre;
    document.getElementById('seedRateResult').innerText = `Total Seeds Needed: ${result} kg`;
}
function calculateFertilizer() {
    const cropType = document.getElementById('cropType').value;
    const soilN = parseFloat(document.getElementById('fertilizerNitrogen').value);
    const soilP = parseFloat(document.getElementById('fertilizerPhosphorus').value);
    const soilK = parseFloat(document.getElementById('fertilizerPotassium').value);
    const farmArea = parseFloat(document.getElementById('farmArea').value);

    if (isNaN(soilN) || isNaN(soilP) || isNaN(soilK) || isNaN(farmArea)) {
        document.getElementById('fertilizerResult').innerHTML = "<p style='color: red;'>Please enter all values correctly.</p>";
        return;
    }

    let requiredN, requiredP, requiredK;

    if (cropType === 'wheat') {
        requiredN = Math.max(100 - soilN, 0);
        requiredP = Math.max(60 - soilP, 0);
        requiredK = Math.max(40 - soilK, 0);
    } else if (cropType === 'rice') {
        requiredN = Math.max(120 - soilN, 0);
        requiredP = Math.max(50 - soilP, 0);
        requiredK = Math.max(40 - soilK, 0);
    } else if (cropType === 'maize') {
        requiredN = Math.max(150 - soilN, 0);
        requiredP = Math.max(70 - soilP, 0);
        requiredK = Math.max(50 - soilK, 0);
    }

    const totalN = requiredN * farmArea;
    const totalP = requiredP * farmArea;
    const totalK = requiredK * farmArea;

    document.getElementById('fertilizerResult').innerHTML = `
        <h3>Recommended Fertilizer for ${farmArea} acres:</h3>
        <p>Nitrogen (N): <b>${totalN} kg</b></p>
        <p>Phosphorus (P): <b>${totalP} kg</b></p>
        <p>Potassium (K): <b>${totalK} kg</b></p>
    `;
}


function calculateSoilPh() {
    const ph = parseFloat(document.getElementById('soilPhValue').value);
    let recommendation = ph < 7 ? 'Soil is acidic, consider adding lime.' : ph > 7 ? 'Soil is alkaline, add sulfur or compost.' : 'Soil is neutral, ideal for most crops.';
    document.getElementById('soilPhResult').innerText = recommendation;
}

function calculateIrrigation() {
    const area = parseFloat(document.getElementById('irrigationFieldArea').value);
    const water = parseFloat(document.getElementById('waterRequirement').value);
    const result = area * water;
    document.getElementById('irrigationResult').innerText = `Total Water Needed: ${result} liters`;
}

function calculateCropYield() {
    const area = parseFloat(document.getElementById('yieldFieldArea').value);
    const yieldPerAcre = parseFloat(document.getElementById('yieldPerAcre').value);
    const result = area * yieldPerAcre;
    document.getElementById('cropYieldResult').innerText = `Estimated Yield: ${result} kg`;
}

function calculateDripIrrigation() { 
    let fieldArea = parseFloat(document.getElementById('fieldArea').value);
    let numDrips = parseFloat(document.getElementById('numDrips').value);
    let flowRate = parseFloat(document.getElementById('flowRate').value);
    let operatingHours = parseFloat(document.getElementById('operatingHours').value);
    
    let totalWaterRequired = numDrips * flowRate * operatingHours;
    let timeRequired = totalWaterRequired / (numDrips * flowRate);
    
    document.getElementById('dripIrrigationResult').innerText = `Total Water Required: ${totalWaterRequired} Liters, Time Needed: ${timeRequired.toFixed(2)} hours`;
}

function calculateRainHarvest() { 
    let roofArea = parseFloat(document.getElementById('roofArea').value);
    let annualRainfall = parseFloat(document.getElementById('annualRainfall').value);
    let runoffCoeff = parseFloat(document.getElementById('runoffCoeff').value);
    
    let waterCollected = (roofArea * annualRainfall * runoffCoeff * 0.001).toFixed(2);
    document.getElementById('rainHarvestResult').innerText = `Total Water Collected: ${waterCollected} KL/year`;
}

function calculateEvapotranspiration() { 
    let temperature = parseFloat(document.getElementById('temperature').value);
    let humidity = parseFloat(document.getElementById('humidity').value);
    let windSpeed = parseFloat(document.getElementById('windSpeed').value);
    
    let evapotranspiration = (0.0023 * (temperature + 17.8) * (temperature - humidity) * windSpeed).toFixed(2);
    document.getElementById('evapotranspirationResult').innerText = `Evapotranspiration Rate: ${evapotranspiration} mm/day`;
}




function calculateFrostRisk() {
    let temp = parseFloat(document.getElementById("frostTemp").value);
    let dewPoint = parseFloat(document.getElementById("dewPoint").value);
    let frostRisk = temp - dewPoint < 2 ? "High risk of frost" : "Low risk of frost";
    document.getElementById("frostPredictionResult").innerText = frostRisk;
}

function calculateHeatStress() {
    let temp = parseFloat(document.getElementById("heatTemp").value);
    let humidity = parseFloat(document.getElementById("humidity").value);
    let heatIndex = temp + (humidity * 0.1);
    document.getElementById("heatStressResult").innerText = `Heat Stress Index: ${heatIndex.toFixed(2)}`;
}

function calculateGDD() {
    let maxTemp = parseFloat(document.getElementById("maxTemp").value);
    let minTemp = parseFloat(document.getElementById("minTemp").value);
    let baseTemp = parseFloat(document.getElementById("baseTemp").value);
    let gdd = Math.max(((maxTemp + minTemp) / 2) - baseTemp, 0);
    document.getElementById("gddResult").innerText = `Growing Degree Days: ${gdd.toFixed(2)}°C`;
}
function toggleCustomCrop() {
    let cropType = document.getElementById("cropType").value;
    let customFields = document.getElementById("customCropFields");
    if (cropType === "other") {
        customFields.style.display = "block";
    } else {
        customFields.style.display = "none";
    }
}

function calculateHarvestTiming() {
    let plantingDate = new Date(document.getElementById("plantingDate").value);
    let cropType = document.getElementById("cropType").value;
    let maturityDays;
    
    if (cropType === "other") {
        maturityDays = parseInt(document.getElementById("customMaturityDays").value);
    } else {
        let selectedOption = document.querySelector(`#cropType option[value="${cropType}"]`);
        maturityDays = parseInt(selectedOption.getAttribute("data-days"));
    }
    
    let harvestDate = new Date(plantingDate);
    harvestDate.setDate(plantingDate.getDate() + maturityDays);
    document.getElementById("harvestTimingResult").innerText = `Harvest Date: ${harvestDate.toDateString()}`;
}


function calculateCostCultivation() {
    let landCost = parseFloat(document.getElementById("landCost").value);
    let seedCost = parseFloat(document.getElementById("seedCost").value);
    let fertilizerCost = parseFloat(document.getElementById("fertilizerCost").value);
    let laborCost = parseFloat(document.getElementById("laborCost").value);
    let totalCost = landCost + seedCost + fertilizerCost + laborCost;
    document.getElementById("costCultivationResult").innerText = `Total Cost of Cultivation: ₹${totalCost.toFixed(2)}`;
}




function calculateLoanEMI() {
    let loanAmount = parseFloat(document.getElementById("loanAmount").value);
    let annualInterest = parseFloat(document.getElementById("interestRate").value) / 100 / 12;
    let loanTenure = parseFloat(document.getElementById("loanTenure").value) * 12;
    let emi = (loanAmount * annualInterest * Math.pow(1 + annualInterest, loanTenure)) / (Math.pow(1 + annualInterest, loanTenure) - 1);
    document.getElementById("loanEMIResult").innerText = `Monthly EMI: ₹${emi.toFixed(2)}`;
}

function calculateFeedRequirement() {
    let numAnimals = parseInt(document.getElementById("numAnimals").value);
    let feedPerAnimal = parseFloat(document.getElementById("feedPerAnimal").value);
    let totalFeed = numAnimals * feedPerAnimal;
    document.getElementById("feedRequirementResult").innerText = `Total Feed Required: ${totalFeed} kg/day`;
}

function calculateFarmEquipmentCost() {
    let equipmentPrice = parseFloat(document.getElementById("equipmentPrice").value);
    let maintenanceCost = parseFloat(document.getElementById("maintenanceCost").value);
    let yearsOfUse = parseInt(document.getElementById("yearsOfUse").value);
    let totalCost = equipmentPrice + (maintenanceCost * yearsOfUse);
    document.getElementById("farmEquipmentCostResult").innerText = `Total Equipment Cost over ${yearsOfUse} years: ₹${totalCost.toFixed(2)}`;
}

function calculateTractorFuelEfficiency() {
    let fuelConsumption = parseFloat(document.getElementById("fuelConsumption").value);
    let hoursOperation = parseFloat(document.getElementById("hoursOperation").value);
    let totalFuelUsed = fuelConsumption * hoursOperation;
    document.getElementById("tractorFuelEfficiencyResult").innerText = `Total Fuel Used per Day: ${totalFuelUsed} Liters`;
}














if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    alert("Your browser does not support Speech Recognition. Please use Google Chrome.");
}
// Add a voice assistant button in your HTML
// Place this next to the input field
const voiceButton = document.createElement("button");
voiceButton.innerHTML = "🗣️";
voiceButton.id = "voiceButton";
voiceButton.className = "waitlist-btn2";
voiceButton.style.borderRadius="50%";
voiceButton.style.cursor='pointer';

document.querySelector(".input-container").appendChild(voiceButton);

// Voice recognition setup
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;

voiceButton.addEventListener("click", () => {
    recognition.start();
    document.getElementById("answerBox").innerHTML = "🎙️ Listening...";
});

recognition.onresult = (event) => {
    showSpeechButtons();
    const transcript = event.results[0][0].transcript;
    document.getElementById("wait").value = transcript;
    document.getElementById("answerBox").innerHTML = "📝 You said: " + transcript;

    // Automatically trigger the Mistral API call
    askQuestion();
};

recognition.onerror = (event) => {
    document.getElementById("answerBox").innerHTML = "❌ Error: " + event.error;
};



let isSpeaking = false;

function toggleSpeech(lang, buttonId) {
    const button = document.getElementById(buttonId);
    if (isSpeaking) {
        speechSynthesis.cancel(); // Stop speech
        button.innerHTML = lang === 'en-US' ? '🔊 English' : '🔊 Hindi';
        isSpeaking = false;
    } else {
        const answerText = document.getElementById("answerBox").innerText;
        if (!answerText.trim()) {
            alert("No text to speak!");
            return;
        }

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(answerText);
            utterance.lang = lang;
            utterance.rate = 1;
            utterance.pitch = 1;

            speechSynthesis.speak(utterance);
            button.innerHTML = '❌ Stop';
            isSpeaking = true;

            // Reset button when speech ends
            utterance.onend = () => {
                button.innerHTML = lang === 'en-US' ? '🔊 English' : '🔊 Hindi';
                isSpeaking = false;
            };
        } else {
            alert('Text-to-speech is not supported in this browser.');
        }
    }
}

// Function to show buttons only when a question is asked
function showSpeechButtons() {
    const buttonContainer = document.getElementById("speechButtonsContainer");
    buttonContainer.style.display = "block";
}










document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".heading-btn");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.getAttribute("data-target");
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
});




function refreshPage() {
    location.reload(); // Reloads the current page
}







// Show Popup
document.getElementById("join").addEventListener("click", function () {
    document.getElementsByClassName("popup-container").style.display = "flex";
});

// Open Specific Popup
function openPopup(id) {
    document.getElementById("rolePopup").style.display = "none";
    document.getElementById(id).style.display = "flex";
}

// Close Popup
function closePopup(id) {
    document.getElementById(id).style.display = "none";
}
