/* ==========================================================
   PROJETO INTEGRADOR — CONSUMO CONSCIENTE
   Arquivo: script.js
   Interações: menu, cards, calculadora, checklist e quiz
   ========================================================== */

// MENU MOBILE
const menuToggle = document.getElementById('menuToggle') || document.querySelector('.menu-toggle');
const navLinks = document.getElementById('navLinks') || document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const aberto = navLinks.classList.toggle('open');
        menuToggle.classList.toggle('active', aberto);
        menuToggle.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// CARDS GIRATÓRIOS NO MOBILE
const cards = document.querySelectorAll('.glass-card');

cards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
});

// CALCULADORA DE CONSUMO DE ÁGUA
function calcularAgua() {
    const minutosBanho = document.getElementById('minutosBanho');
    const resultadoAgua = document.getElementById('resultadoAgua');

    if (!minutosBanho || !resultadoAgua) return;

    const minutos = Number(minutosBanho.value);

    if (!minutos || minutos <= 0) {
        resultadoAgua.innerHTML = 'Digite um tempo válido para calcular o consumo.';
        resultadoAgua.style.display = 'block';
        return;
    }

    const litrosPorMinuto = 9;
    const consumo = minutos * litrosPorMinuto;

    resultadoAgua.innerHTML = `
        Seu banho consome aproximadamente <strong>${consumo} litros</strong> de água.<br>
        Reduzir alguns minutos no banho ajuda a economizar água, energia e dinheiro.
    `;
    resultadoAgua.style.display = 'block';
}

const botaoCalcular = document.querySelector('.calculator button');

if (botaoCalcular) {
    botaoCalcular.addEventListener('click', calcularAgua);
}

// CHECKLIST DE HÁBITOS SUSTENTÁVEIS
const checkboxes = document.querySelectorAll('.check-item input[type="checkbox"]');
const progressBar = document.getElementById('progressBar') || document.querySelector('.progress-bar');
const progressText = document.getElementById('progressText');

function atualizarProgresso() {
    if (!checkboxes.length) return;

    const marcados = Array.from(checkboxes).filter(item => item.checked).length;
    const porcentagem = Math.round((marcados / checkboxes.length) * 100);

    if (progressBar) progressBar.style.width = `${porcentagem}%`;
    if (progressText) progressText.textContent = `${porcentagem}% concluído`;
}

checkboxes.forEach(item => {
    item.addEventListener('change', atualizarProgresso);
});

atualizarProgresso();

// QUIZ AMBIENTAL
const quizQuestions = [
    {
        question: 'Qual é uma atitude de consumo consciente?',
        answers: [
            'Comprar sem necessidade',
            'Reutilizar, economizar e descartar corretamente',
            'Jogar lixo eletrônico no lixo comum',
            'Deixar aparelhos ligados o dia inteiro'
        ],
        correct: 1,
        explanation: 'Consumo consciente envolve pensar antes de comprar, evitar desperdícios e descartar corretamente.'
    },
    {
        question: 'Qual é o destino correto para pilhas, baterias e eletrônicos quebrados?',
        answers: [
            'Lixo orgânico',
            'Enterrar no quintal',
            'Pontos de coleta e logística reversa',
            'Qualquer lixeira da rua'
        ],
        correct: 2,
        explanation: 'Esses materiais podem conter substâncias tóxicas e devem ser levados a pontos de coleta específicos.'
    },
    {
        question: 'O que é obsolescência eletrônica?',
        answers: [
            'Quando um aparelho se torna ultrapassado rapidamente',
            'Quando um produto dura para sempre',
            'Quando a reciclagem é feita corretamente',
            'Quando economizamos energia'
        ],
        correct: 0,
        explanation: 'A obsolescência eletrônica faz produtos serem trocados antes do necessário, aumentando o lixo eletrônico.'
    },
    {
        question: 'Qual ação ajuda a economizar água?',
        answers: [
            'Tomar banhos muito longos',
            'Deixar torneiras abertas',
            'Consertar vazamentos e reduzir o tempo do banho',
            'Lavar calçadas todos os dias'
        ],
        correct: 2,
        explanation: 'Reduzir o tempo do banho e consertar vazamentos evita desperdício e reduz gastos.'
    },
    {
        question: 'Por que economizar energia ajuda o planeta?',
        answers: [
            'Porque aumenta o desperdício',
            'Porque reduz impactos ambientais e gastos',
            'Porque impede reciclagem',
            'Porque usa mais recursos naturais'
        ],
        correct: 1,
        explanation: 'Economizar energia diminui gastos e reduz impactos ligados à produção elétrica.'
    }
];

let currentQuestion = 0;
let score = 0;
let trees = 0;
let answered = false;

const quizQuestion = document.getElementById('quizQuestion');
const answersGrid = document.getElementById('answersGrid');
const quizFeedback = document.getElementById('quizFeedback');
const scoreElement = document.getElementById('score');
const treeCountElement = document.getElementById('treeCount');
const forest = document.getElementById('forest');
const restartButton = document.querySelector('.quiz-actions button');

function loadQuestion() {
    if (!quizQuestion || !answersGrid) return;

    answered = false;
    const questionData = quizQuestions[currentQuestion];

    quizQuestion.innerText = `${currentQuestion + 1}. ${questionData.question}`;
    answersGrid.innerHTML = '';

    if (quizFeedback) {
        quizFeedback.style.display = 'none';
        quizFeedback.innerHTML = '';
    }

    questionData.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'answer-btn';
        button.innerText = answer;
        button.addEventListener('click', () => checkAnswer(index, button));
        answersGrid.appendChild(button);
    });
}

function checkAnswer(selectedIndex, selectedButton) {
    if (answered) return;

    answered = true;
    const questionData = quizQuestions[currentQuestion];
    const buttons = document.querySelectorAll('.answer-btn');

    buttons.forEach((button, index) => {
        button.disabled = true;
        if (index === questionData.correct) button.classList.add('correct');
    });

    if (quizFeedback) quizFeedback.style.display = 'block';

    if (selectedIndex === questionData.correct) {
        score += 10;
        trees += 1;
        if (scoreElement) scoreElement.innerText = score;
        if (treeCountElement) treeCountElement.innerText = trees;
        plantTree();
        if (quizFeedback) quizFeedback.innerHTML = `✅ Acertou! +10 pontos. ${questionData.explanation}`;
    } else {
        selectedButton.classList.add('wrong');
        if (quizFeedback) quizFeedback.innerHTML = `❌ Quase! ${questionData.explanation}`;
    }

    setTimeout(() => {
        currentQuestion++;

        if (currentQuestion >= quizQuestions.length) {
            finishQuiz();
            return;
        }

        loadQuestion();
    }, 1500);
}

function plantTree() {
    if (!forest) return;

    const tree = document.createElement('span');
    tree.className = 'tree';
    tree.innerText = ['🌱', '🌿', '🌳'][Math.min(trees - 1, 2)] || '🌳';
    forest.appendChild(tree);
}

function finishQuiz() {
    if (!quizQuestion || !answersGrid || !quizFeedback) return;

    let titulo;

    if (score <= 20) titulo = '📋 Nível 1 • Aprendiz Ambiental';
    else if (score <= 40) titulo = '📊 Nível 2 • Consumo Consciente';
    else titulo = '🌍 Nível 3 • Agente Ambiental';

    quizQuestion.innerHTML = `${titulo}<br><br>Você fez <strong>${score} pontos</strong><br>Plantou <strong>${trees} árvore(s)</strong> 🌳`;
    answersGrid.innerHTML = '';
    quizFeedback.innerHTML = 'Continue praticando atitudes sustentáveis no dia a dia.';
    quizFeedback.style.display = 'block';
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    trees = 0;
    answered = false;

    if (scoreElement) scoreElement.innerText = score;
    if (treeCountElement) treeCountElement.innerText = trees;
    if (forest) forest.innerHTML = '';

    loadQuestion();
}

if (restartButton) {
    restartButton.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', loadQuestion);
