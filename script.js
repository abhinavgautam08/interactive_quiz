const questions = [
  {
    question: "You added script.js correctly, but document.getElementById('btn') returns null. Most likely reason is:",
    options: [
      "CSS file is missing",
      "Button id is incorrect OR script loads before button exists",
      "HTML cannot use ids",
      "JavaScript does not support DOM"
    ],
    correctAnswer: 1
  },
  {
    question: "Which JavaScript method selects the element with id contact?",
    options: [
      "document.getElementById('contact')",
      "document.getElementsByClassName('contact')",
      "document.querySelectorAll('#contact')",
      "document.getElementByName('contact')"
    ],
    correctAnswer: 0
  },
  {
    question: "Which tag is used to insert an image?",
    options: [
      "<image>",
      "<img>",
      "<src>",
      "<picture>"
    ],
    correctAnswer: 1
  },
  {
    question: "Which property is commonly toggled to hide/show an element?",
    options: [
      "element.textContent",
      "element.style.display",
      "element.value",
      "element.innerHTML = null"
    ],
    correctAnswer: 1
  }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = null;

// DOM Elements
const introContainer = document.getElementById('intro-container');
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

const questionText = document.getElementById('question-text');
const optionsStack = document.getElementById('options-stack');
const questionProgress = document.getElementById('question-progress');
const scoreDisplay = document.getElementById('score-display');
const progressBar = document.getElementById('progress-bar');
const finalScore = document.getElementById('final-score');
const resultMessage = document.getElementById('result-message');

function init() {
  startBtn.addEventListener('click', startQuiz);
  nextBtn.addEventListener('click', handleNext);
  restartBtn.addEventListener('click', restartQuiz);
}
function startQuiz() {
  introContainer.classList.add('hidden');
  quizContainer.classList.remove('hidden');
  resultContainer.classList.add('hidden');
  currentQuestionIndex = 0;
  score = 0;
  updateScoreDisplay();
  loadQuestion();
}
function loadQuestion() {
  selectedOptionIndex = null;
  const currentQ = questions[currentQuestionIndex];
  // Update progress text and bar
  questionProgress.innerHTML = `Question ${(currentQuestionIndex + 1).toString().padStart(2, '0')} <span class="text-on-surface-variant/40">/ ${questions.length.toString().padStart(2, '0')}</span> <span class="text-tertiary text-xs ml-2 font-black">(100 pts)</span>`;
  progressBar.style.width = `${((currentQuestionIndex) / questions.length) * 100}%`;
  // Update question text
  questionText.textContent = currentQ.question;
  // Clear and regenerate options
  optionsStack.innerHTML = '';
  currentQ.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn w-full group relative flex items-center text-left p-5 rounded-xl transition-all duration-300 bg-surface-container-low hover:bg-secondary-fixed/30 border border-transparent cursor-pointer';
    btn.innerHTML = `
      <div class="option-indicator w-6 h-6 rounded-full border-2 border-outline-variant group-hover:border-secondary transition-colors flex items-center justify-center">
        <div class="inner-dot w-2 h-2 rounded-full hidden"></div>
      </div>
      <span class="ml-4 font-body text-base font-medium text-on-surface-variant group-hover:text-on-surface">${opt}</span>
      <span class="absolute right-5 opacity-0 group-hover:opacity-100 transition-opacity">
        <span class="material-symbols-outlined text-primary">arrow_forward_ios</span>
      </span>
    `;
    btn.onclick = () => selectOption(index, btn);
    optionsStack.appendChild(btn);
  });
  // Reset the Next button state
  nextBtn.disabled = true;
  nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
  nextBtn.classList.remove('hover:bg-primary-container', 'active:scale-95', 'cursor-pointer');
  if (currentQuestionIndex === questions.length - 1) {
    nextBtn.textContent = 'SUBMIT QUIZ';
  } else {
    nextBtn.textContent = 'NEXT QUESTION';
  }
}
function selectOption(index, selectedBtn) {
  selectedOptionIndex = index;
  // Reset all options to default state
  const allOptions = optionsStack.querySelectorAll('.option-btn');
  allOptions.forEach(btn => {
    btn.className = 'option-btn w-full group relative flex items-center text-left p-5 rounded-xl transition-all duration-300 bg-surface-container-low hover:bg-secondary-fixed/30 border border-transparent cursor-pointer';
    const indicator = btn.querySelector('.option-indicator');
    indicator.className = 'option-indicator w-6 h-6 rounded-full border-2 border-outline-variant group-hover:border-secondary transition-colors flex items-center justify-center';
    
    const dot = btn.querySelector('.inner-dot');
    dot.classList.add('hidden');
    dot.classList.remove('bg-on-primary', 'bg-error', 'bg-secondary');
    const textSpan = btn.querySelector('span.ml-4');
    textSpan.classList.remove('font-semibold', 'text-on-surface');
    textSpan.classList.add('font-medium', 'text-on-surface-variant');
  });
  // Highlight selected option
  selectedBtn.className = 'option-btn w-full group relative flex items-center text-left p-5 rounded-xl transition-all duration-300 bg-primary/5 border border-primary/20 shadow-sm cursor-pointer';
  const indicator = selectedBtn.querySelector('.option-indicator');
  indicator.className = 'option-indicator w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center bg-primary transition-colors';
  const dot = selectedBtn.querySelector('.inner-dot');
  dot.classList.remove('hidden');
  dot.classList.add('bg-on-primary');
  const textSpan = selectedBtn.querySelector('span.ml-4');
  textSpan.classList.remove('font-medium', 'text-on-surface-variant');
    textSpan.classList.add('font-semibold', 'text-on-surface');
    // Enable Next button
  nextBtn.disabled = false;
  nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  nextBtn.classList.add('hover:bg-primary-container', 'active:scale-95', 'cursor-pointer');
}
function handleNext() {
  if (selectedOptionIndex === null) return;
  const currentQ = questions[currentQuestionIndex];
  if (selectedOptionIndex === currentQ.correctAnswer) {
    score += 100;
  }
  // Instantly update score after answering
  updateScoreDisplay();
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}
function updateScoreDisplay() {
  scoreDisplay.textContent = `${score} pts`;
}
function showResults() {
  quizContainer.classList.add('hidden');
  resultContainer.classList.remove('hidden');
  progressBar.style.width = '100%';
  const maxScore = questions.length * 100;
  finalScore.textContent = `${score} / ${maxScore}`;
  const percentage = score / maxScore; 
  const resultIcon = resultContainer.querySelector('.material-symbols-outlined');
  const iconContainer = resultContainer.querySelector('.w-24');
  
  if (percentage === 1) {
    resultMessage.textContent = "Excellent!";
    resultIcon.textContent = "workspace_premium";
    iconContainer.className = "w-24 h-24 mx-auto bg-gradient-to-br from-secondary to-secondary-container rounded-full flex items-center justify-center mb-6 shadow-xl shadow-secondary/25";
  } else if (percentage >= 0.5) {
    resultMessage.textContent = "Good job!";
    resultIcon.textContent = "thumb_up";
    iconContainer.className = "w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center mb-6 shadow-xl shadow-primary/25";
  } else {
    resultMessage.textContent = "Try Again!";
    resultIcon.textContent = "sentiment_dissatisfied";
    iconContainer.className = "w-24 h-24 mx-auto bg-gradient-to-br from-error to-error-container rounded-full flex items-center justify-center mb-6 shadow-xl shadow-error/25";
  }
}
function restartQuiz() {
  startQuiz();
}
// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
