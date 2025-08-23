// =============================
// Tabs
// =============================
function showTab(tab) {
  if (tab === "chatbot" && !registered) {
    alert("Please register first!");
    return;
  }
  document.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
  document.querySelectorAll(".tab").forEach(el => el.classList.remove("active"));

  if (tab === "welcome") {
    document.getElementById("welcome-section").classList.remove("hidden");
    document.getElementById("welcome-tab").classList.add("active");
  } else if (tab === "register") {
    document.getElementById("register-section").classList.remove("hidden");
    document.getElementById("register-tab").classList.add("active");
  } else if (tab === "chatbot") {
    document.getElementById("chatbot-section").classList.remove("hidden");
    document.getElementById("chatbot-tab").classList.add("active");
  }
}

// =============================
// Registration (with backend)
// =============================
let registered = false;
document.getElementById("register-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const studentId = document.getElementById("studentId").value.trim();

  if (!name || !email || !studentId) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, studentId })
    });

    const data = await response.json();

    if (response.ok) {
      registered = true;
      alert(`Welcome, ${data.name}! You are now registered.`);
      document.getElementById("chatbot-tab").classList.remove("disabled");
      showTab("chatbot");
      startChat();
    } else {
      alert(data.message || "Registration failed.");
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Backend not reachable. Make sure your server is running.");
  }
});

// =============================
// Chatbot Logic
// =============================
const chatContainer = document.getElementById("chat-container");
const inputArea = document.getElementById("input-area");

const questions = [
  { text: "Do you have a fever above 100.4°F (38°C)?", key: "fever" },
  { text: "Are you experiencing difficulty breathing?", key: "breathing" },
  { text: "Do you have severe chest pain?", key: "chestPain" },
  { text: "Are you feeling nauseous or vomiting?", key: "nausea" },
  { text: "Do you have a persistent headache?", key: "headache" }
];

let currentQuestion = 0;
let answers = {};

function addMessage(content, type = "bot") {
  const msg = document.createElement("div");
  msg.classList.add("message", type === "bot" ? "bot-message" : "user-message");
  msg.textContent = content;
  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function startChat() {
  chatContainer.innerHTML = "";
  inputArea.classList.remove("hidden");
  currentQuestion = 0;
  answers = {};
  addMessage("👋 Hello! I’ll ask you some yes/no questions about your symptoms.");
  setTimeout(() => askQuestion(), 1000);
}

function askQuestion() {
  if (currentQuestion < questions.length) {
    addMessage(questions[currentQuestion].text, "bot");
  } else {
    showResult();
  }
}

function handleAnswer(answer) {
  const q = questions[currentQuestion];
  answers[q.key] = answer;
  addMessage(answer ? "Yes" : "No", "user");
  currentQuestion++;
  setTimeout(() => askQuestion(), 800);
}

// =============================
// Show chatbot result (with backend)
// =============================
async function showResult() {
  inputArea.classList.add("hidden");

  try {
    const response = await fetch("http://localhost:5000/api/symptom-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers })
    });

    const data = await response.json();

    const resultCard = document.createElement("div");
    resultCard.classList.add("result-card");

    // If backend sends `result` use that, else fallback
    resultCard.textContent = data.result || "⚠️ Unable to fetch recommendation.";
    chatContainer.appendChild(resultCard);
    chatContainer.scrollTop = chatContainer.scrollHeight;

  } catch (err) {
    console.error(err);

    // fallback: frontend-only logic if backend is unavailable
    const hasUrgent = answers.breathing || answers.chestPain;
    const hasModerate = answers.fever || answers.nausea;

    let result = "";
    let cssClass = "";

    if (hasUrgent) {
      result = "🚨 Seek Urgent Medical Help immediately.";
      cssClass = "urgent";
    } else if (hasModerate) {
      result = "🏥 Please visit the Campus Clinic for further evaluation.";
      cssClass = "clinic";
    } else {
      result = "🏠 Your symptoms seem mild. Rest and take care at home.";
      cssClass = "rest";
    }

    const resultCard = document.createElement("div");
    resultCard.classList.add("result-card", cssClass);
    resultCard.textContent = result;
    chatContainer.appendChild(resultCard);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}
