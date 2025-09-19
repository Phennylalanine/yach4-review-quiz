window.addEventListener("DOMContentLoaded", () => {
  const milestoneContainer = document.getElementById("milestoneContainer");

  const quizData = [
    { key: "weathersSlevel", multiplier: 0.3 },
    { key: "daySlevel", multiplier: 0.3 },
    { key: "timeSlevel", multiplier: 0.3 },
    { key: "weatherMlevel", multiplier: 0.5 },
    { key: "dayMlevel", multiplier: 0.5 },
    { key: "timeMlevel", multiplier: 0.5 },
    { key: "TypingLevel_Level1", multiplier: 0.1 },
  ];

  // Define milestones in order
  const milestones = [
    { level: 5, choices: ["imageA.png"] },
    { level: 10, choices: ["imageB.png", "imageC.png"] },
    { level: 20, choices: ["imageD.png", "imageE.png"] },
  ];

  // Calculate weighted overall level
  const overallLevel = quizData.reduce((sum, { key, multiplier }) => {
    const value = parseInt(localStorage.getItem(key)) || 0;
    return sum + value * multiplier;
  }, 0);

  // Helper: render a small image for past milestones
  function renderSmallImage(src) {
    const img = document.createElement("img");
    img.src = src;
    img.style.maxWidth = "80px";
    img.style.margin = "5px";
    milestoneContainer.appendChild(img);
  }

  // Helper: render large image for current milestone
  function renderLargeImage(src) {
    milestoneContainer.innerHTML = ""; // reset
    milestones.forEach(m => {
      const choice = localStorage.getItem(`milestone_${m.level}`);
      if (choice) renderSmallImage(choice);
    });

    const img = document.createElement("img");
    img.src = src;
    img.style.maxWidth = "200px";
    img.style.margin = "10px";
    milestoneContainer.appendChild(img);
  }

  // Helper: show choices for a milestone
  function renderChoices(level, images) {
    milestoneContainer.innerHTML = ""; // reset
    milestones.forEach(m => {
      const choice = localStorage.getItem(`milestone_${m.level}`);
      if (choice) renderSmallImage(choice);
    });

    images.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      img.style.maxWidth = "200px";
      img.style.cursor = "pointer";
      img.style.margin = "10px";
      img.addEventListener("click", () => {
        localStorage.setItem(`milestone_${level}`, src);
        renderLargeImage(src); // after choosing, show it as large image
      });
      milestoneContainer.appendChild(img);
    });
  }

  // Main milestone logic
  for (const m of milestones) {
    if (overallLevel >= m.level) {
      const savedChoice = localStorage.getItem(`milestone_${m.level}`);
      if (savedChoice) {
        // Already chosen → show it small and continue
        renderSmallImage(savedChoice);
      } else {
        // Choice not yet made → stop and let them pick now
        renderChoices(m.level, m.choices);
        break;
      }
    } else {
      // Haven’t reached this milestone yet → stop
      break;
    }
  }

  // Update each span with class "levelValue"
  document.querySelectorAll(".levelValue").forEach((span) => {
    const key = span.getAttribute("data-key");
    const levelValue = parseInt(localStorage.getItem(key)) || 0;
    span.textContent = `(Level: ${levelValue})`;
  });
});
