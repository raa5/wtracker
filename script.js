document.addEventListener("DOMContentLoaded", () => {
  // Initialize dataPoints array with stored data from localStorage
  const storedData = localStorage.getItem("weightData");
  const dataPoints = storedData ? JSON.parse(storedData) : [];

  // Event listener for adding weight
  document.getElementById("datePicker").addEventListener("change", updateChart);
  document.getElementById("timePicker").addEventListener("input", updateChart);
  document.getElementById("weightInput").addEventListener("input", updateChart);

  // Load the initial chart
  plotWeightTrend();

  // Function to update the chart
  function updateChart() {
    const dateInput = document.getElementById("datePicker");
    const timeInput = document.getElementById("timePicker");
    const weightInput = document.getElementById("weightInput");

    const date = dateInput.value;
    const time = timeInput.value;
    const weight = parseFloat(weightInput.value);

    if (!date || !time || isNaN(weight)) {
      return;
    }

    const dateTime = new Date(`${date}T${time}`);
    const formattedDate = `${dateTime.getFullYear()}-${(dateTime.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dateTime
      .getDate()
      .toString()
      .padStart(2, "0")} ${dateTime
      .getHours()
      .toString()
      .padStart(2, "0")}:${dateTime.getMinutes().toString().padStart(2, "0")}`;

    // Check if there is an existing data point for the selected date and time
    const existingDataPointIndex = dataPoints.findIndex(
      (point) => point.dateTime === formattedDate
    );

    if (existingDataPointIndex !== -1) {
      // Update the existing data point
      dataPoints[existingDataPointIndex].weight = weight;
    } else {
      // Add a new data point
      dataPoints.push({ dateTime: formattedDate, weight });
    }

    // Update localStorage with the new dataPoints
    localStorage.setItem("weightData", JSON.stringify(dataPoints));

    // Update the plot
    plotWeightTrend();
  }

  // Function to plot the weight trend using Plotly
  function plotWeightTrend() {
    // Sort the data points by date and time
    const sortedDataPoints = dataPoints.sort(
      (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
    );

    const trace = {
      x: sortedDataPoints.map((point) => point.dateTime),
      y: sortedDataPoints.map((point) => point.weight),
      mode: "lines+markers",
      type: "scatter",
      name: "Weight Trend",
    };

    const layout = {
      title: "Weight Trend",
      xaxis: { title: "Date and Time" },
      yaxis: { title: "Weight (kg)" },
    };

    Plotly.newPlot("weightChart", [trace], layout);
  }

  // Function to open the history page
  window.openHistoryPage = () => {
    window.location.href = "history.html";
  };
});
