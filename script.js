// Simulating login/logout
let isLoggedIn = false;

document.getElementById("loginBtn").onclick = () => {
  isLoggedIn = true;
  toggleAuthButtons();
};

document.getElementById("logoutBtn").onclick = () => {
  isLoggedIn = false;
  toggleAuthButtons();
};

// Toggle login/logout button display
function toggleAuthButtons() {
  document.getElementById("loginBtn").style.display = isLoggedIn ? "none" : "block";
  document.getElementById("logoutBtn").style.display = isLoggedIn ? "block" : "none";
}

function addQuestion() {
  const questionInput = document.getElementById("questionInput");
  const questionLinkInput = document.getElementById("questionLinkInput");

  const questionText = questionInput.value.trim();
  let questionLink = questionLinkInput.value.trim();

  if (questionText === "" || questionLink === "") {
    alert("Please enter both the question and its link.");
    return;
  }

  // Add "https://" if missing from the URL
  if (!/^https?:\/\//i.test(questionLink)) {
    questionLink = "https://" + questionLink;
  }

  const question = {
    text: questionText,
    link: questionLink,
    solved: false
  };

  addQuestionToDOM(question);
  saveQuestionToLocalStorage(question);

  questionInput.value = "";
  questionLinkInput.value = "";
}

function addQuestionToDOM(question) {
  const questionList = document.getElementById("questionList");

  const questionItem = document.createElement("li");
  questionItem.className = "question-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = question.solved;
  checkbox.onclick = () => {
    questionItem.classList.toggle("solved");
    updateQuestionStatusInLocalStorage(question.text, checkbox.checked);
  };

  const questionLink = document.createElement("a");
  questionLink.href = question.link;
  questionLink.target = "_blank";
  questionLink.textContent = question.text;

  questionLink.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "delete-button";
  deleteButton.onclick = () => deleteQuestion(question.text, questionItem);

  questionItem.appendChild(checkbox);
  questionItem.appendChild(questionLink);
  questionItem.appendChild(deleteButton);

  questionList.appendChild(questionItem);
}

function saveQuestionToLocalStorage(question) {
  let questions = JSON.parse(localStorage.getItem("questions")) || [];
  questions.push(question);
  localStorage.setItem("questions", JSON.stringify(questions));
}

function deleteQuestion(questionText, questionElement) {
  let questions = JSON.parse(localStorage.getItem("questions")) || [];
  questions = questions.filter((q) => q.text !== questionText);
  localStorage.setItem("questions", JSON.stringify(questions));
  questionElement.remove();
}

function updateQuestionStatusInLocalStorage(questionText, solvedStatus) {
  let questions = JSON.parse(localStorage.getItem("questions")) || [];
  questions = questions.map((q) => (q.text === questionText ? { ...q, solved: solvedStatus } : q));
  localStorage.setItem("questions", JSON.stringify(questions));
}

// Load existing questions from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
  const questions = JSON.parse(localStorage.getItem("questions")) || [];
  questions.forEach(addQuestionToDOM);
  toggleAuthButtons();
});
