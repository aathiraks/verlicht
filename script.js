// Select slider and app container
const slider = document.getElementById("timeSlider");
const app = document.getElementById("app");
const timeLabel = document.getElementById("timeLabel");

// Add event listener to slider
slider.addEventListener("input", (e) => {
    const time = parseFloat(e.target.value);
    updateBackground(time);
    updateTimeLabel(time);
});

// Function to update background based on time
function updateBackground(time) {
    let color;
    if (time >= 6 && time < 12) {
        // Morning: Bright, blue-enriched light
        color = "rgb(200, 220, 255)"; // Light blue
    } else if (time >= 12 && time < 18) {
        // Daytime: Neutral white light
        color = "rgb(255, 255, 240)"; // Neutral white
    } else if (time >= 18 && time < 21) {
        // Evening: Warm, amber light
        color = "rgb(255, 220, 180)"; // Amber
    } else {
        // Night: Dim, red/amber light
        color = "rgb(180, 100, 100)"; // Soft red
    }
    app.style.backgroundColor = color;
}

// Function to update time label
function updateTimeLabel(time) {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    timeLabel.textContent = `Current Time: ${formattedTime}`;
}
