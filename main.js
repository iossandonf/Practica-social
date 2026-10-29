/* ==========================================================================
   FINANZAS PARA TU FUTURO - CLIENT SCRIPT (VANILLA JS)
   Grupo 11 - Práctica Social UC
   ========================================================================== */

import confetti from 'canvas-confetti';

// ==========================================================================
// 1. WEB AUDIO SYNTHESIZER FOR MODERN SOUND EFFECTS
// ==========================================================================
class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playSuccess() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
    osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(261.63, now); // C4
    osc2.frequency.exponentialRampToValueAtTime(392.00, now + 0.2); // G4

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  }

  playWarning() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.25);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  playClick() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }
}

const sfx = new SoundFX();

// ==========================================================================
// 2. NAVIGATION & TAB SWITCHER
// ==========================================================================
window.switchTab = function(tabId) {
  sfx.playClick();
  const allTabs = document.querySelectorAll('.tab-pane');
  const allBtns = document.querySelectorAll('.nav-btn');

  allTabs.forEach(tab => tab.classList.remove('active'));
  allBtns.forEach(btn => btn.classList.remove('active'));

  const targetTab = document.getElementById(tabId);
  const targetBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);

  if (targetTab) targetTab.classList.add('active');
  if (targetBtn) targetBtn.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // If entering simulation tab, trigger canvas render
  if (tabId === 'sim-tab') {
    setTimeout(renderCompoundChart, 150);
  }
};

// Wire header nav buttons
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.getAttribute('data-tab');
    window.switchTab(tab);
  });
});

// Role Toggle Switcher
const roles = ['Estudiante', 'Profesor Jefe (Orientación)', 'Apoderado / Familia', 'Directivo UTP'];
let currentRoleIndex = 0;
const roleBtn = document.getElementById('role-toggle-btn');
const roleText = document.getElementById('active-role-text');

if (roleBtn) {
  roleBtn.addEventListener('click', () => {
    sfx.playClick();
    currentRoleIndex = (currentRoleIndex + 1) % roles.length;
    roleText.textContent = `Rol: ${roles[currentRoleIndex]}`;

    // Auto switch to relevant tab depending on role
    if (currentRoleIndex === 1) window.switchTab('teacher-tab');
    else if (currentRoleIndex === 2) window.switchTab('family-tab');
    else if (currentRoleIndex === 3) window.switchTab('dashboard-tab');
    else window.switchTab('sim-tab');
  });
}

// Sub-nav for 4 sessions
window.loadSession = function(num) {
  window.switchTab('sim-tab');
  window.switchSession(num);
};

window.switchSession = function(num) {
  sfx.playClick();
  document.querySelectorAll('.sub-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-session') === String(num));
  });

  document.querySelectorAll('.session-pane').forEach((pane, idx) => {
    pane.classList.toggle('active', idx + 1 === num);
  });

  if (num === 3) {
    setTimeout(renderCompoundChart, 100);
  }
};

document.querySelectorAll('.sub-nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const sNum = parseInt(btn.getAttribute('data-session'));
    window.switchSession(sNum);
  });
});


// ==========================================================================
// 3. DIAGNÓSTICO DIGITAL RÁPIDO (5 MINUTOS - CASOS PISA / CMF)
// ==========================================================================
const quizQuestions = [
  {
    tag: "Pregunta 1: Carga Anual Equivalente (CAE)",
    title: "Estás cotizando un crédito de consumo para un computador. ¿Por qué la CMF (Comisión para el Mercado Financiero) exige comparar la CAE y no solamente fijarse en la cuota mensual?",
    options: [
      { text: "Porque la CAE indica qué banco tiene las sucursales más cercanas al colegio.", isCorrect: false },
      { text: "Porque la CAE incluye intereses, comisiones y seguros obligatorios, revelando el costo real total anual del crédito.", isCorrect: true },
      { text: "Porque una cuota mensual más pequeña siempre significa que el crédito es más económico.", isCorrect: false },
      { text: "Porque la CAE es un impuesto del gobierno que se descuenta del sueldo del profesor.", isCorrect: false }
    ],
    explanation: "¡Correcto! Una cuota puede parecer 'chiquitita' porque la extienden a 48 meses, pero la CAE refleja el costo integral con todos los cargos ocultos. A menor CAE, más barato el crédito."
  },
  {
    tag: "Pregunta 2: Cartola de Tarjeta & Pago Mínimo",
    title: "Llega tu estado de cuenta con una deuda de $150.000 y el banco te ofrece la opción de 'Pago Mínimo' de $12.000. ¿Qué consecuencia tiene pagar solo el mínimo?",
    options: [
      { text: "La deuda se extingue automáticamente después de pagar 3 meses seguidos.", isCorrect: false },
      { text: "El banco premia tu fidelidad eliminando los intereses de mantención.", isCorrect: false },
      { text: "Se activan intereses rotativos sobre el saldo impago, prolongando la deuda por años y pagando más del doble del monto original.", isCorrect: true },
      { text: "Aumenta de inmediato tu puntaje para postular al crédito universitario.", isCorrect: false }
    ],
    explanation: "¡Exacto! El pago mínimo es la trampa más común: cubre principalmente intereses y casi nada del capital prestado, creando una bola de nieve de deuda."
  },
  {
    tag: "Pregunta 3: Regla de Presupuesto 50/30/20",
    title: "Recibes una mesada en tu tarjeta de $60.000. Según las buenas prácticas de finanzas personales, ¿cómo deberías distribuir ese dinero?",
    options: [
      { text: "Gastar $50.000 en salidas con amigos y guardar lo que sobre a fin de mes.", isCorrect: false },
      { text: "Destinar 50% a Necesidades ($30.000), 30% a Gustos ($18.000) y 20% a Ahorro intocable ($12.000).", isCorrect: true },
      { text: "Apostar $30.000 en casinos online para intentar doblar la mesada rápidamente.", isCorrect: false },
      { text: "Prestarle el 80% a compañeros de curso con cobro de intereses.", isCorrect: false }
    ],
    explanation: "¡Excelente! La regla 50/30/20 equilibra cubrir gastos esenciales escolares, disfrutar de tus gustos y construir un fondo de emergencia desde la enseñanza media."
  },
  {
    tag: "Pregunta 4: Inflación y la Unidad de Fomento (UF)",
    title: "¿Qué ventaja fundamental tiene una Cuenta de Ahorro Reajustable en UF frente a guardar billetes en efectivo o en una cuenta corriente?",
    options: [
      { text: "La cuenta en UF permite retirar dinero en cualquier cajero del mundo sin cobro.", isCorrect: false },
      { text: "La UF se reajusta diariamente con la inflación (IPC), protegiendo tu dinero para que no pierda poder adquisitivo en el tiempo.", isCorrect: true },
      { text: "El efectivo físico gana valor por sí solo cuando suben los precios de la colación escolar.", isCorrect: false },
      { text: "La UF solo sirve para personas mayores de 65 años jubiladas.", isCorrect: false }
    ],
    explanation: "¡Muy bien! Cuando hay inflación, $10.000 en efectivo compran cada vez menos cosas. El ahorro en UF reajusta tu capital al IPC asegurando tu poder de compra real."
  },
  {
    tag: "Pregunta 5: Ciberseguridad & Cuentas Mula",
    title: "Te ofrecen por redes sociales $50.000 rápidos solo por recibir transferencias en tu CuentaRUT y enviárselas a otra persona desconocida. ¿Qué riesgo enfrentas?",
    options: [
      { text: "Ninguno, es un empleo informal legítimo y recomendado por el INJUV.", isCorrect: false },
      { text: "Es el delito de 'Cuenta Mula' para blanquear dinero de estafas; serás investigado penalmente y tus cuentas serán bloqueadas.", isCorrect: true },
      { text: "Solo te arriesgas a que la transferencia se demore 24 horas hábiles.", isCorrect: false },
      { text: "El banco te premiará con una tarjeta de crédito sin comisiones.", isCorrect: false }
    ],
    explanation: "¡Respuesta crítica! Las organizaciones criminales usan a estudiantes como 'cuentas mula'. Aunque no hayas creado la estafa, eres legalmente cómplice de lavado de dinero."
  }
];

let currentQuizIndex = 0;
let quizScore = 0;
let userAnswers = [];

function renderQuizQuestion() {
  const box = document.getElementById('quiz-box');
  const stepText = document.getElementById('quiz-step-text');
  const progressFill = document.getElementById('quiz-progress-fill');

  if (!box) return;

  const q = quizQuestions[currentQuizIndex];
  stepText.textContent = `Pregunta ${currentQuizIndex + 1} de ${quizQuestions.length}`;
  progressFill.style.width = `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%`;

  const letters = ['A', 'B', 'C', 'D'];

  box.innerHTML = `
    <div class="quiz-scenario-tag">${q.tag}</div>
    <h3 class="quiz-question-title">${q.title}</h3>
    <div class="quiz-options-list">
      ${q.options.map((opt, i) => `
        <button class="quiz-opt-btn" onclick="window.handleQuizAnswer(${i})">
          <span class="opt-letter">${letters[i]}</span>
          <span>${opt.text}</span>
        </button>
      `).join('')}
    </div>
    <div id="quiz-explanation-area"></div>
  `;
}

window.handleQuizAnswer = function(chosenIndex) {
  const q = quizQuestions[currentQuizIndex];
  const buttons = document.querySelectorAll('.quiz-opt-btn');
  buttons.forEach(b => b.disabled = true);

  const isCorrect = q.options[chosenIndex].isCorrect;
  userAnswers.push({ question: q.tag, isCorrect, chosenText: q.options[chosenIndex].text });

  if (isCorrect) {
    sfx.playSuccess();
    quizScore++;
    buttons[chosenIndex].classList.add('correct');
  } else {
    sfx.playWarning();
    buttons[chosenIndex].classList.add('incorrect');
    // Highlight correct one
    q.options.forEach((opt, idx) => {
      if (opt.isCorrect) buttons[idx].classList.add('correct');
    });
  }

  const expArea = document.getElementById('quiz-explanation-area');
  expArea.innerHTML = `
    <div class="quiz-explanation-box ${isCorrect ? 'success' : 'error'}">
      <strong>${isCorrect ? '✨ ¡Respuesta Correcta!' : '⚠️ Ojo con este concepto:'}</strong>
      <p>${q.explanation}</p>
      <div style="margin-top: 1rem; text-align: right;">
        <button class="btn btn-sm btn-primary" onclick="window.nextQuizQuestion()">
          ${currentQuizIndex < quizQuestions.length - 1 ? 'Siguiente Pregunta &rarr;' : 'Ver Resultados del Diagnóstico'}
        </button>
      </div>
    </div>
  `;
};

window.nextQuizQuestion = function() {
  currentQuizIndex++;
  if (currentQuizIndex < quizQuestions.length) {
    renderQuizQuestion();
  } else {
    showQuizResults();
  }
};

function showQuizResults() {
  document.getElementById('quiz-box').classList.add('hidden');
  document.getElementById('quiz-step-text').classList.add('hidden');
  const resultBox = document.getElementById('quiz-result');
  resultBox.classList.remove('hidden');

  document.getElementById('score-val').textContent = quizScore;
  const title = document.getElementById('result-title');
  const desc = document.getElementById('result-desc');
  const benchmark = document.getElementById('result-benchmark');
  const breakdown = document.getElementById('result-breakdown');

  if (quizScore >= 4) {
    title.textContent = "¡Nivel Sobresaliente! Superas el Promedio OCDE";
    desc.textContent = "Cuentas con bases sólidas para tomar decisiones de crédito, ahorro y detectar fraudes en el aula.";
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  } else if (quizScore >= 2) {
    title.textContent = "Nivel Intermedio: En Rango Promedio Chile (PISA 451 pts)";
    desc.textContent = "Reconoces conceptos básicos, pero necesitas entrenar el impacto de la CAE, el pago mínimo y los riesgos digitales.";
  } else {
    title.textContent = "Alerta de Brecha: Bajo Nivel 2 de Competencia Financiera";
    desc.textContent = "Al igual que el 30% de los estudiantes evaluados en Chile, existe alto riesgo de caer en sobreendeudamiento prematuro.";
  }

  benchmark.innerHTML = `
    <span class="chip">🇨🇱 Promedio PISA Chile: 2.8 / 5 pts</span>
    <span class="chip">🌐 Promedio OCDE: 3.5 / 5 pts</span>
    <span class="chip">🎯 Meta del Laboratorio: 4.5+ pts</span>
  `;

  breakdown.innerHTML = userAnswers.map((ans, i) => `
    <div class="breakdown-item">
      <span style="font-size: 1.25rem;">${ans.isCorrect ? '✅' : '❌'}</span>
      <div>
        <strong>${ans.question}</strong>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
          Tu respuesta: "${ans.chosenText}"
        </p>
      </div>
    </div>
  `).join('');
}

window.resetQuiz = function() {
  currentQuizIndex = 0;
  quizScore = 0;
  userAnswers = [];
  document.getElementById('quiz-box').classList.remove('hidden');
  document.getElementById('quiz-step-text').classList.remove('hidden');
  document.getElementById('quiz-result').classList.add('hidden');
  renderQuizQuestion();
};

renderQuizQuestion();


// ==========================================================================
// 4. SESIÓN 1: PRESUPUESTO 50/30/20 & ROULETTE ANTI-IMPULSO
// ==========================================================================
const s1IncomeSlider = document.getElementById('s1-income-slider');
const s1IncomeDisplay = document.getElementById('s1-income-display');

const s1NeedsSlider = document.getElementById('s1-needs-slider');
const s1WantsSlider = document.getElementById('s1-wants-slider');
const s1SavingsSlider = document.getElementById('s1-savings-slider');

const s1NeedsVal = document.getElementById('s1-needs-val');
const s1WantsVal = document.getElementById('s1-wants-val');
const s1SavingsVal = document.getElementById('s1-savings-val');

const barNeeds = document.getElementById('bar-needs');
const barWants = document.getElementById('bar-wants');
const barSavings = document.getElementById('bar-savings');
const budgetSumAlert = document.getElementById('budget-sum-alert');

const s1FinalSavings = document.getElementById('s1-final-savings');
const s1DebtRisk = document.getElementById('s1-debt-risk');
const s1UfDefense = document.getElementById('s1-uf-defense');
const s1HealthTip = document.getElementById('s1-health-tip');

function formatCLP(val) {
  return '$' + Math.round(val).toLocaleString('es-CL');
}

function updateSession1Budget() {
  const income = parseFloat(s1IncomeSlider.value);
  const pNeeds = parseFloat(s1NeedsSlider.value);
  const pWants = parseFloat(s1WantsSlider.value);
  const pSavings = parseFloat(s1SavingsSlider.value);

  s1IncomeDisplay.textContent = `${formatCLP(income)} CLP`;

  const amtNeeds = income * (pNeeds / 100);
  const amtWants = income * (pWants / 100);
  const amtSavings = income * (pSavings / 100);

  s1NeedsVal.textContent = `${formatCLP(amtNeeds)} (${pNeeds}%)`;
  s1WantsVal.textContent = `${formatCLP(amtWants)} (${pWants}%)`;
  s1SavingsVal.textContent = `${formatCLP(amtSavings)} (${pSavings}%)`;

  barNeeds.style.width = `${pNeeds}%`;
  barNeeds.textContent = pNeeds > 10 ? `${pNeeds}%` : '';
  barWants.style.width = `${pWants}%`;
  barWants.textContent = pWants > 10 ? `${pWants}%` : '';
  barSavings.style.width = `${pSavings}%`;
  barSavings.textContent = pSavings > 10 ? `${pSavings}%` : '';

  const totalP = pNeeds + pWants + pSavings;

  if (totalP === 100) {
    budgetSumAlert.className = 'alert-inline alert-ok';
    budgetSumAlert.textContent = `Suma total: 100% de tus ingresos asignados correctamente.`;
  } else if (totalP > 100) {
    budgetSumAlert.className = 'alert-inline alert-warn';
    budgetSumAlert.textContent = `⚠️ Estás asignando el ${totalP}% (te sobregiraste en un ${totalP - 100}% de tu dinero).`;
  } else {
    budgetSumAlert.className = 'alert-inline alert-warn';
    budgetSumAlert.textContent = `Tienes un ${100 - totalP}% sin asignar (${formatCLP(income * ((100 - totalP) / 100))}). ¡Agrégalo al Ahorro!`;
  }

  s1FinalSavings.textContent = formatCLP(amtSavings);

  // Health assessment
  if (pSavings >= 20 && pNeeds <= 55 && totalP <= 100) {
    s1DebtRisk.textContent = "Bajo (0%)";
    s1DebtRisk.className = "text-emerald";
    s1UfDefense.textContent = "Alta (Blindado)";
    s1HealthTip.textContent = "¡Excelente disciplina financiera escolar! Mantener un 20% de ahorro protege al equipo ante cualquier imprevisto de transporte o colación.";
  } else if (pSavings < 10) {
    s1DebtRisk.textContent = "Crítico (65%)";
    s1DebtRisk.className = "text-danger";
    s1UfDefense.textContent = "Nula";
    s1HealthTip.textContent = "Peligro: Ahorrar menos del 10% te deja vulnerable. Ante cualquier alza de pasajes o gasto imprevisto, terminarás pidiéndole prestado a compañeros.";
  } else {
    s1DebtRisk.textContent = "Medio (25%)";
    s1DebtRisk.className = "text-warning";
    s1UfDefense.textContent = "Moderada";
    s1HealthTip.textContent = "Distribución aceptable, pero intenta ajustar los gastos impulsivos (Deseos) hacia el 30% para alcanzar la meta del 20% en ahorro.";
  }
}

if (s1IncomeSlider) {
  [s1IncomeSlider, s1NeedsSlider, s1WantsSlider, s1SavingsSlider].forEach(slider => {
    slider.addEventListener('input', updateSession1Budget);
  });
  updateSession1Budget();
}

// Random Real Life Events Pool
const chileanEvents = [
  {
    title: "Alza del Pasaje y Colación por Reajuste de la UF",
    desc: "El pasaje escolar y la comida del casino subieron un 12% este mes debido a la inflación. Necesitas $8.000 extra para tus Necesidades.",
    optA: "Ajustar: Recortar salidas de fin de semana para cubrir el transporte",
    optB: "Pedir prestado $8.000 a un compañero con promesa de pagarle el próximo mes",
    feedbackA: "¡Sabia decisión! Absorber el alza con disciplina presupuestaria evita contraer deudas con amigos.",
    feedbackB: "¡Cuidado! Pedir prestado para gastos corrientes es el inicio del sobreendeudamiento juvenil.",
    effectA: { savingsDelta: 0, ok: true },
    effectB: { savingsDelta: -8000, ok: false }
  },
  {
    title: "Tentación por Aburrimiento: Sushi con Amigos",
    desc: "Tus amigos deciden pedir sushi por delivery después de clases ($15.000 por persona). Ya gastaste tu cuota de Gustos del mes.",
    optA: "Proponer una once en casa o unirme solo a conversar sin gastar",
    optB: "Pedir el sushi y pagarlo sacando plata del fondo de Ahorro",
    feedbackA: "¡Excelente control de impulsos! Decir 'no' a compras por aburrimiento o presión social cuida tus metas.",
    feedbackB: "Quebraste la regla de oro: el fondo de ahorro NO se toca para compras de comida o impulsos.",
    effectA: { savingsDelta: 0, ok: true },
    effectB: { savingsDelta: -15000, ok: false }
  },
  {
    title: "Pituto de Fin de Semana: Pasear Mascotas",
    desc: "Un vecino te paga $20.000 por pasear a sus dos perros el sábado y domingo. Tienes dinero extra no planificado.",
    optA: "Destinar $10.000 a Ahorro para una meta futura y $10.000 a Gustos",
    optB: "Gastarlo todo en ropa y videojuegos esa misma noche",
    feedbackA: "¡Mentalidad de inversionista! Cuando recibas ingresos extraordinarios, ahorra al menos la mitad.",
    feedbackB: "Gastar todo de una vez refuerza el hábito del gasto impulsivo detectado en la encuesta escolar.",
    effectA: { savingsDelta: 10000, ok: true },
    effectB: { savingsDelta: 0, ok: false }
  },
  {
    title: "Oferta Relámpago en TikTok: Zapatillas con 40% OFF",
    desc: "Te aparece una notificación con zapatillas rebajadas a $28.000 solo por las próximas 3 horas. Tienes tus zapatillas de colegio en buen estado.",
    optA: "Aplicar la Regla de las 48 Horas: esperar dos días para ver si realmente las necesitas",
    optB: "Comprarlas de inmediato: ¡Es una oferta que no puedo desaprovechar!",
    feedbackA: "¡Regla de oro aplicada! El 80% de los deseos impulsivos desaparecen después de 48 horas de reflexión.",
    feedbackB: "Caíste en la trampa del marketing digital de urgencia. Gastaste dinero que no tenías presupuestado.",
    effectA: { savingsDelta: 0, ok: true },
    effectB: { savingsDelta: -28000, ok: false }
  }
];

let currentEvent = null;
const triggerEventBtn = document.getElementById('trigger-event-btn');
const eventTitle = document.getElementById('event-title');
const eventDesc = document.getElementById('event-desc');
const eventActions = document.getElementById('event-actions');
const eventOptA = document.getElementById('event-opt-a');
const eventOptB = document.getElementById('event-opt-b');
const eventFeedbackMsg = document.getElementById('event-feedback-msg');

if (triggerEventBtn) {
  triggerEventBtn.addEventListener('click', () => {
    sfx.playClick();
    const rand = Math.floor(Math.random() * chileanEvents.length);
    currentEvent = chileanEvents[rand];

    eventTitle.textContent = currentEvent.title;
    eventDesc.textContent = currentEvent.desc;

    eventOptA.textContent = currentEvent.optA;
    eventOptB.textContent = currentEvent.optB;

    eventActions.classList.remove('hidden');
    eventFeedbackMsg.classList.add('hidden');
  });

  eventOptA.addEventListener('click', () => {
    if (!currentEvent) return;
    sfx.playSuccess();
    eventFeedbackMsg.className = 'event-feedback-box alert-ok';
    eventFeedbackMsg.textContent = currentEvent.feedbackA;
    eventFeedbackMsg.classList.remove('hidden');
    eventActions.classList.add('hidden');
  });

  eventOptB.addEventListener('click', () => {
    if (!currentEvent) return;
    sfx.playWarning();
    eventFeedbackMsg.className = 'event-feedback-box alert-warn';
    eventFeedbackMsg.textContent = currentEvent.feedbackB;
    eventFeedbackMsg.classList.remove('hidden');
    eventActions.classList.add('hidden');
  });
}


// ==========================================================================
// 5. SESIÓN 2: CARTOLA REAL & COMPARADOR CAE
// ==========================================================================
const payOptTotal = document.getElementById('pay-opt-total');
const payOptMin = document.getElementById('pay-opt-min');
const payOptHalf = document.getElementById('pay-opt-half');
const payOutcomeDisplay = document.getElementById('pay-outcome-display');

function renderPaymentOutcome(type) {
  sfx.playClick();
  [payOptTotal, payOptMin, payOptHalf].forEach(b => b.classList.remove('active'));

  if (type === 'total') {
    payOptTotal.classList.add('active');
    payOutcomeDisplay.innerHTML = `
      <div class="outcome-title text-emerald">🟢 Excelente: Pago Total del Mes ($180.000)</div>
      <p>Decidiste pagar la totalidad facturada antes de la fecha de vencimiento.</p>
      <div class="outcome-stats-row">
        <div class="outcome-stat-box">
          <span class="text-muted">Intereses Pagados:</span>
          <strong class="text-emerald">$0 CLP</strong>
        </div>
        <div class="outcome-stat-box">
          <span class="text-muted">Tiempo para Salir de Deuda:</span>
          <strong class="text-emerald">1 Mes (Inmediato)</strong>
        </div>
        <div class="outcome-stat-box">
          <span class="text-muted">Costo Financiero Total:</span>
          <strong>$180.000 CLP</strong>
        </div>
      </div>
      <div class="alert-inline alert-ok">
        <strong>Conclusión del Equipo:</strong> Aprovechaste la tarjeta como medio de pago sin pagar un solo peso de interés. Eres un usuario 'totalero'.
      </div>
    `;
  } else if (type === 'min') {
    sfx.playWarning();
    payOptMin.classList.add('active');
    payOutcomeDisplay.innerHTML = `
      <div class="outcome-title text-danger">🔴 Peligro: Pago Mínimo ($15.000)</div>
      <p>Solo pagaste el mínimo exigido. El resto ($165.000) queda sujeto a interés rotativo del 3.4% mensual + comisión fija de mantención.</p>
      <div class="outcome-stats-row">
        <div class="outcome-stat-box">
          <span class="text-muted">Intereses y Cargos Rotativos:</span>
          <strong class="text-danger">+$218.400 CLP</strong>
        </div>
        <div class="outcome-stat-box">
          <span class="text-muted">Tiempo para Liquidar la Deuda:</span>
          <strong class="text-danger">39 Meses (¡Más de 3 años!)</strong>
        </div>
        <div class="outcome-stat-box">
          <span class="text-muted">Total que Terminarás Pagando:</span>
          <strong class="text-danger">$398.400 CLP</strong>
        </div>
      </div>
      <div class="alert-inline alert-warn">
        <strong>¡El Engaño del Mínimo!:</strong> Pagaste <strong>MÁS DEL DOBLE</strong> de lo que costaban las zapatillas ($180.000 originales). Por esto caen en morosidad los jóvenes de 18 a 24 años.
      </div>
    `;
  } else {
    payOptHalf.classList.add('active');
    payOutcomeDisplay.innerHTML = `
      <div class="outcome-title text-warning">🟡 Pago Parcial de $60.000</div>
      <p>Abonaste un monto intermedio. Reduces el impacto pero sigues generando intereses sobre los $120.000 restantes.</p>
      <div class="outcome-stats-row">
        <div class="outcome-stat-box">
          <span class="text-muted">Intereses Acumulados:</span>
          <strong class="text-warning">+$24.600 CLP</strong>
        </div>
        <div class="outcome-stat-box">
          <span class="text-muted">Tiempo para Liquidar:</span>
          <strong class="text-warning">4 Meses</strong>
        </div>
        <div class="outcome-stat-box">
          <span class="text-muted">Total Pagado:</span>
          <strong>$204.600 CLP</strong>
        </div>
      </div>
      <div class="alert-inline alert-ok">
        Mucho mejor que el pago mínimo, aunque sigue costándote $24.600 extras en comisiones e intereses.
      </div>
    `;
  }
}

if (payOptTotal) {
  payOptTotal.addEventListener('click', () => renderPaymentOutcome('total'));
  payOptMin.addEventListener('click', () => renderPaymentOutcome('min'));
  payOptHalf.addEventListener('click', () => renderPaymentOutcome('half'));
  renderPaymentOutcome('total');
}

// Loan Comparison
window.selectLoan = function(loanId) {
  sfx.playClick();
  const verdict = document.getElementById('loan-verdict');
  document.querySelectorAll('.loan-card').forEach(c => c.classList.remove('selected'));

  const card = document.getElementById(`loan-card-${loanId}`);
  if (card) card.classList.add('selected');

  if (loanId === 1) {
    sfx.playWarning();
    verdict.innerHTML = `
      <strong class="text-danger">Análisis Oferta A (Casa Comercial):</strong><br>
      La cuota mensual parece cómoda ($11.900), pero te atan por <strong>36 meses</strong> con una altísima <strong>CAE del 52.4%</strong>.
      Terminarás pagando <strong>$428.400</strong> por un préstamo de $200.000. ¡Pagarías más del doble!
    `;
  } else if (loanId === 2) {
    sfx.playSuccess();
    confetti({ particleCount: 50, spread: 60 });
    verdict.innerHTML = `
      <strong class="text-emerald">✨ ¡Opción Ganadora recomendada! Oferta B (Banco / Cooperativa):</strong><br>
      Tiene la <strong>menor CAE del mercado (16.8%)</strong>. Aunque la cuota mensual es de $19.200 (un poco más alta que la de la casa comercial), solo pagas 12 meses.
      El costo total es de <strong>$230.400</strong>. Te ahorras casi <strong>$200.000 pesos</strong> comparado con las otras opciones.
    `;
  } else {
    sfx.playWarning();
    verdict.innerHTML = `
      <strong class="text-danger">Análisis Oferta C (Avance Inmediato App):</strong><br>
      ¡La trampa perfecta! Te atraen con 'Solo $8.990 al mes', pero a <strong>48 meses</strong> y con una <strong>CAE devastadora de 64.1%</strong>.
      El costo total es de <strong>$431.520</strong>. Es la opción más cara de todas.
    `;
  }
};


// ==========================================================================
// 6. SESIÓN 3: AHORRO E INTERÉS COMPUESTO (CANVAS CHART)
// ==========================================================================
const s3AmountSlider = document.getElementById('s3-amount-slider');
const s3YearsSlider = document.getElementById('s3-years-slider');
const s3AmountDisplay = document.getElementById('s3-amount-display');
const s3YearsDisplay = document.getElementById('s3-years-display');

const resCash = document.getElementById('res-cash');
const resCashLoss = document.getElementById('res-cash-loss');
const resUf = document.getElementById('res-uf');
const resCompound = document.getElementById('res-compound');
const resInterestGain = document.getElementById('res-interest-gain');

function calculateCompoundInterest(monthlyDeposit, years, rate, inflationRate) {
  const months = years * 12;
  const monthlyRate = rate / 12;
  let totalBalance = 0;
  const balanceHistory = [0];

  for (let m = 1; m <= months; m++) {
    totalBalance = (totalBalance + monthlyDeposit) * (1 + monthlyRate);
    if (m % 12 === 0) {
      balanceHistory.push(totalBalance);
    }
  }

  // Cash value accounting for inflation loss
  const totalPrincipal = monthlyDeposit * months;
  const realCashValue = totalPrincipal * Math.pow(1 - inflationRate, years);

  return {
    principal: totalPrincipal,
    finalCompound: totalBalance,
    realCashValue: realCashValue,
    history: balanceHistory
  };
}

function renderCompoundChart() {
  const canvas = document.getElementById('compoundChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;

  const monthlyDeposit = parseFloat(s3AmountSlider.value);
  const years = parseInt(s3YearsSlider.value);

  s3AmountDisplay.textContent = `${formatCLP(monthlyDeposit)} / mes`;
  s3YearsDisplay.textContent = `${years} ${years === 1 ? 'Año' : 'Años'}`;

  // 1. Compound Fund (8% annual nominal)
  const compoundData = calculateCompoundInterest(monthlyDeposit, years, 0.08, 0.035);
  // 2. UF Account (UF + 2% real)
  const ufData = calculateCompoundInterest(monthlyDeposit, years, 0.055, 0.0);
  // 3. Cash under mattress (0% return, -3.5% inflation)
  const cashData = calculateCompoundInterest(monthlyDeposit, years, 0.0, 0.035);

  // Update DOM metrics
  resCash.textContent = formatCLP(compoundData.principal);
  const lostToInflation = compoundData.principal - cashData.realCashValue;
  resCashLoss.textContent = `Poder de compra real: ${formatCLP(cashData.realCashValue)} (Pierde ${formatCLP(lostToInflation)} por IPC)`;

  resUf.textContent = formatCLP(ufData.finalCompound);
  resCompound.textContent = formatCLP(compoundData.finalCompound);
  const gain = compoundData.finalCompound - compoundData.principal;
  resInterestGain.textContent = `+${formatCLP(gain)} de puro interés compuesto`;

  // Draw chart
  ctx.clearRect(0, 0, w, h);

  const paddingLeft = 60;
  const paddingBottom = 40;
  const paddingTop = 20;
  const paddingRight = 30;

  const chartW = w - paddingLeft - paddingRight;
  const chartH = h - paddingTop - paddingBottom;

  const maxVal = Math.max(compoundData.finalCompound * 1.15, 100000);

  // Draw horizontal grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i++) {
    const y = paddingTop + (chartH / gridSteps) * i;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(w - paddingRight, y);
    ctx.stroke();

    const val = maxVal - (maxVal / gridSteps) * i;
    ctx.fillStyle = '#64748B';
    ctx.font = '10px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(formatCLP(val), paddingLeft - 8, y + 4);
  }

  // Draw curves function
  function drawLine(history, strokeColor, fillColor) {
    ctx.beginPath();
    const stepX = chartW / years;

    history.forEach((val, idx) => {
      const x = paddingLeft + idx * stepX;
      const y = paddingTop + chartH - (val / maxVal) * chartH;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    if (fillColor) {
      ctx.lineTo(paddingLeft + years * stepX, paddingTop + chartH);
      ctx.lineTo(paddingLeft, paddingTop + chartH);
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
  }

  // Draw Cash line
  const cashHistory = [0];
  for (let i = 1; i <= years; i++) {
    cashHistory.push(monthlyDeposit * 12 * i);
  }
  drawLine(cashHistory, '#94A3B8', null);

  // Draw UF line
  drawLine(ufData.history, '#38BDF8', null);

  // Draw Compound Fund line with gradient fill
  const grad = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + chartH);
  grad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
  grad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
  drawLine(compoundData.history, '#10B981', grad);

  // Draw Year labels on X Axis
  ctx.fillStyle = '#94A3B8';
  ctx.font = '11px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  const labelStep = Math.max(1, Math.floor(years / 5));
  for (let yr = 0; yr <= years; yr += labelStep) {
    const x = paddingLeft + yr * (chartW / years);
    ctx.fillText(`Año ${yr}`, x, h - 12);
  }
}

if (s3AmountSlider) {
  s3AmountSlider.addEventListener('input', renderCompoundChart);
  s3YearsSlider.addEventListener('input', renderCompoundChart);
  window.addEventListener('resize', renderCompoundChart);
}


// ==========================================================================
// 7. SESIÓN 4: SMARTPHONE CYBER-SECURITY SIMULATOR & DICOM
// ==========================================================================
const cyberCases = [
  {
    sender: "Número Desconocido (+56 9 8765 4321)",
    avatar: "💼",
    content: "¡Hola! Somos de la agencia de empleos FlexWork Chile. Gana entre $35.000 y $60.000 diarios trabajando desde casa. Solo debes recibir pagos en tu CuentaRUT y transferirlos a una cuenta de empresa reteniendo tu 10% de comisión. ¿Te interesa?",
    isScam: true,
    feedbackScam: "🚨 ¡Excelente ojo! Es la clásica estafa de 'CUENTA MULA'. Las bandas criminales usan las cuentas bancarias de escolares para transferir dinero de robos y estafas. Si aceptas, la PDI rastreará tu RUT y serás imputado por lavado de activos.",
    feedbackTrust: "❌ ¡Grave error! Esto NO es un trabajo. Es el delito de prestar tu CuentaRUT para blanquear dinero ilícito. Tu cuenta será congelada de por vida por el banco."
  },
  {
    sender: "SMS - BancoEstado Alerta",
    avatar: "🏛️",
    content: "BancoEstado informa: Su CuentaRUT ha sido suspendida temporalmente por actividad inusual. Para reactivar su clave y evitar bloqueos permanentes, ingrese de inmediato en: https://bancoestad0-seguro-chile.xyz/reactivar",
    isScam: true,
    feedbackScam: "🚨 ¡Correcto! Es un ataque de PHISHING. Fíjate en el enlace: termina en '.xyz' y tiene un cero ('bancoestad0'). Los bancos NUNCA envían enlaces por SMS para pedir claves.",
    feedbackTrust: "❌ ¡Caíste en la trampa! Al ingresar a ese link falso, los delincuentes robarán tu clave de internet y transferirán todo el saldo de tu mesada."
  },
  {
    sender: "Promociones GoldenPlay Casino",
    avatar: "🎰",
    content: "🔥 ¡Bono Exclusivo para Jóvenes! Regístrate hoy y recibe $100.000 gratis para jugar en ruleta y tragamonedas en vivo. Retiros instantáneos a tu tarjeta. ¡Multiplica tu dinero en 5 minutos!",
    isScam: true,
    feedbackScam: "🚨 ¡Muy bien detectado! Los casinos online operan de forma ILEGAL en Chile y usan bonos falsos para captar escolares. Tienen algoritmos manipulados para que pierdas y generan ludopatía rápida.",
    feedbackTrust: "❌ ¡Peligro! Es una trampa de apuestas no reguladas. No existe dinero regalado y no podrás retirar ganancias. Muchos jóvenes quedan endeudados en semanas."
  },
  {
    sender: "Matías (Compañero de Curso)",
    avatar: "🎒",
    content: "Wena hermano, una consulta... ¿te tinca que saques un iPhone 15 en cuotas a tu nombre con tu tarjeta comercial? Yo no tengo tarjeta pero te juro que te transfiero la plata de la cuota todos los meses sin falta.",
    isScam: true,
    feedbackScam: "🚨 ¡Brillante! Prestar tu nombre o tarjeta de crédito para compras de terceros es la causa #1 por la que los jóvenes de 18 a 20 años terminan en DICOM. Si tu amigo se atrasa o no paga, la deuda legal es 100% tuya.",
    feedbackTrust: "❌ ¡Riesgo altísimo de DICOM! Si tu amigo no puede pagar, el boletín comercial te castigará a ti durante 5 años. Nunca prestes tu firma ni saques créditos para terceros."
  }
];

let currentCyberIndex = 0;

function renderCyberCase() {
  const c = cyberCases[currentCyberIndex];
  document.getElementById('msg-sender-name').textContent = c.sender;
  document.getElementById('msg-sender-avatar').textContent = c.avatar;
  document.getElementById('msg-content').textContent = c.content;
  document.getElementById('cyber-counter').textContent = `Caso ${currentCyberIndex + 1} de ${cyberCases.length}`;

  const feedbackCard = document.getElementById('cyber-feedback-card');
  feedbackCard.innerHTML = `
    <h5>Instrucción para el Equipo</h5>
    <p>Lean el mensaje en pantalla y deliberen con su <strong>Oficial de Seguridad Digital</strong>: ¿Qué elementos despiertan sospechas? ¿Es una estafa o parece confiable?</p>
  `;
}

window.resolveCyberCase = function(userSaidScam) {
  const c = cyberCases[currentCyberIndex];
  const feedbackCard = document.getElementById('cyber-feedback-card');

  if (userSaidScam === c.isScam) {
    sfx.playSuccess();
    feedbackCard.innerHTML = `
      <div class="alert-inline alert-ok" style="margin-bottom: 0.75rem;">
        <strong>✨ ¡Veredicto Correcto del Equipo!</strong>
      </div>
      <p>${c.feedbackScam}</p>
    `;
    confetti({ particleCount: 30, spread: 50 });
  } else {
    sfx.playWarning();
    feedbackCard.innerHTML = `
      <div class="alert-inline alert-warn" style="margin-bottom: 0.75rem;">
        <strong>⚠️ ¡Cuidado con esta trampa!</strong>
      </div>
      <p>${c.feedbackTrust}</p>
    `;
  }
};

window.changeCyberCase = function(delta) {
  sfx.playClick();
  currentCyberIndex = (currentCyberIndex + delta + cyberCases.length) % cyberCases.length;
  renderCyberCase();
};

renderCyberCase();

// DICOM Consequence Slider
const dicomSlider = document.getElementById('dicom-slider');
const dicomAmtDisplay = document.getElementById('dicom-amt-display');
const dicomImpactResults = document.getElementById('dicom-impact-results');

if (dicomSlider) {
  dicomSlider.addEventListener('input', () => {
    const val = parseFloat(dicomSlider.value);
    dicomAmtDisplay.textContent = `${formatCLP(val)} CLP en mora`;

    if (val < 50000) {
      dicomImpactResults.innerHTML = `
        <div class="impact-item blocked">
          <span class="impact-icon">🏢</span>
          <strong>Arriendo de Vivienda</strong>
          <span class="status-badge red">Bloqueado</span>
          <small>Aunque la deuda sea de solo $45.000, los corredores rechazan tu solicitud al aparecer en el Boletín Comercial.</small>
        </div>
        <div class="impact-item blocked">
          <span class="impact-icon">💳</span>
          <strong>Tarjetas Comerciales y Cuentas</strong>
          <span class="status-badge red">Suspendidas</span>
          <small>El retail congela tu línea de crédito de inmediato.</small>
        </div>
        <div class="impact-item warning">
          <span class="impact-icon">💼</span>
          <strong>Cobranza Judicial y Llamadas</strong>
          <span class="status-badge yellow">Intensa</span>
          <small>Empresas de cobranza externa llaman a familiares y apoderados.</small>
        </div>
        <div class="impact-item warning">
          <span class="impact-icon">💡</span>
          <strong>Salida de DICOM</strong>
          <span class="status-badge yellow">Factible</span>
          <small>Al pagar la deuda total, la empresa tiene 7 días para borrarte del registro.</small>
        </div>
      `;
    } else {
      dicomImpactResults.innerHTML = `
        <div class="impact-item blocked">
          <span class="impact-icon">🏢</span>
          <strong>Arriendo y Crédito Hipotecario</strong>
          <span class="status-badge red">Imposible por 5 Años</span>
          <small>Clasificación bancaria en Categoría D/E (pérdida financiera total).</small>
        </div>
        <div class="impact-item blocked">
          <span class="impact-icon">🚗</span>
          <strong>Crédito Automotriz y Financiamiento</strong>
          <span class="status-badge red">Rechazo Automático</span>
          <small>Ninguna entidad supervisada por la CMF prestará dinero.</small>
        </div>
        <div class="impact-item blocked">
          <span class="impact-icon">⚖️</span>
          <strong>Demanda Civil y Embargo</strong>
          <span class="status-badge red">Riesgo Judicial</span>
          <small>Por deudas mayores, la casa comercial inicia juicio ejecutivo sobre bienes.</small>
        </div>
        <div class="impact-item warning">
          <span class="impact-icon">💼</span>
          <strong>Postulaciones Laborales</strong>
          <span class="status-badge yellow">Restringido</span>
          <small>Cargos en bancos, contabilidad o comercio verifican certificado comercial.</small>
        </div>
      `;
    }
  });
}


// ==========================================================================
// 8. TAB 3: KIT METODOLÓGICO DOCENTE (45 MINUTOS)
// ==========================================================================
const teacherLessonPlans = {
  1: {
    title: "Sesión 1: Presupuesto 50/30/20 & Administración de Mesada",
    objective: "Que los estudiantes identifiquen sus patrones de gasto impulsivo, diferencien necesidades de deseos y apliquen la regla 50/30/20 protegiéndose de la inflación (UF).",
    timeline: [
      { min: "00 - 05 min", title: "Video Conceptual & Activación", desc: "El docente proyecta la cápsula de 5 min: ¿Por qué la plata de la mesada 'desaparece' en la tarjeta? Pregunta detonante: ¿Quién se ha quedado en cero a mitad de mes?" },
      { min: "05 - 25 min", title: "Dinámica Grupal: El Desafío de la Mesada", desc: "Equipos de 5 alumnos reciben la tarjeta virtual de $60.000. Asignan roles (Tesorero, Planificador, etc.) y distribuyen sus gastos bajo la regla 50/30/20 en su ficha." },
      { min: "25 - 35 min", title: "Ruleta de Imprevistos & Tentaciones", desc: "El profesor sortea 2 imprevistos en sala (alza de pasajes por UF y tentación de sushi). Cada equipo debe acordar cómo reajustar sin pedir prestado." },
      { min: "35 - 45 min", title: "Puesta en Común & Ticket de Salida", desc: "El Vocero de 2 equipos comparte su saldo final. Cierre con el concepto clave: 'El ahorro se guarda al inicio del mes, no con lo que sobra'." }
    ]
  },
  2: {
    title: "Sesión 2: Crédito, Cartolas Reales & La Trampa de la CAE",
    objective: "Interpretar una cartola de tarjeta comercial chilena, dimensionar el peligro de los intereses rotativos del pago mínimo y comparar ofertas de crédito usando la CAE.",
    timeline: [
      { min: "00 - 05 min", title: "Video Conceptual: Cartolas sin Secretos", desc: "Cápsula de 5 min: 'La zapatilla que costó $180.000 y se transformó en $400.000'. Definición clara de la CAE como exigencia legal de la CMF." },
      { min: "05 - 25 min", title: "Auditoría de Cartola en Equipos", desc: "Los alumnos reciben una cartola real impresa. El Auditor de Riesgo calcula cuánto terminarán pagando si optan por el pago mínimo de $15.000 vs el total." },
      { min: "25 - 35 min", title: "Juego de Rol: Elección del Préstamo de Aula", desc: "Simulan necesitar $200.000 para una gira o computador. Deben evaluar 3 ofertas y justificar ante el curso por qué la cuota más chica no es la más barata." },
      { min: "35 - 45 min", title: "Debate & Ticket de Salida", desc: "Pregunta de salida: Si un crédito tiene cuota de $10.000 y CAE 50%, y otro cuota de $15.000 y CAE 20%, ¿cuál eliges? Reflexión de cierre." }
    ]
  },
  3: {
    title: "Sesión 3: Ahorro e Interés Compuesto (El Tiempo Vale Oro)",
    objective: "Comprender el efecto exponencial del interés compuesto y comparar alternativas reales chilenas: Cuenta Reajustable en UF, Depósitos a Plazo (DAP) y Fondos.",
    timeline: [
      { min: "00 - 05 min", title: "Video Conceptual: El Caso Marta vs Lucas", desc: "Explicación audiovisual: Por qué Marta que empezó a los 17 años con $15.000 superó a Lucas que empezó a los 30 años poniendo el triple de plata." },
      { min: "05 - 25 min", title: "Laboratorio Gráfico de Inversión", desc: "En la plataforma web, los alumnos configuran metas de 5, 10 y 20 años comparando el dinero bajo el colchón vs en UF vs fondo indexado." },
      { min: "25 - 35 min", title: "Diseño de la Primera Meta de Ahorro", desc: "Cada alumno escribe en su ficha personal una meta real a 1 año (preuniversitario, viaje de estudio, licencia de conducir) con cálculo de ahorro mensual." },
      { min: "35 - 45 min", title: "Cierre: La Cuenta Ahorro UF de BancoEstado", desc: "El docente explica cómo cualquier joven de 16-18 años puede abrir una cuenta reajustable protegida de la inflación sin cobros de mantención." }
    ]
  },
  4: {
    title: "Sesión 4: Ciberseguridad, Apuestas & Blindaje Anti-DICOM",
    objective: "Entrenar a los estudiantes para identificar estafas digitales (phishing, cuentas mula), prevenir ludopatía en casinos online y evitar entrar a DICOM.",
    timeline: [
      { min: "00 - 05 min", title: "Video Conceptual: La Realidad de las Cuentas Mula", desc: "Cápsula de 5 min con advertencia de la PDI y CMF sobre cómo el crimen organizado recluta escolares para transferencias ilícitas en CuentaRUT." },
      { min: "05 - 25 min", title: "Simulador de Teléfono Móvil en Grupo", desc: "El Oficial de Seguridad Digital del equipo lidera la revisión de 4 mensajes reales (WhatsApp de trabajo falso, SMS banco, link de casino online, préstamo de firma)." },
      { min: "25 - 35 min", title: "Simulación de Consecuencias DICOM", desc: "Los alumnos analizan qué puertas se cierran en la vida adulta por una deuda impaga de $40.000 (arriendos, cuentas, créditos hipotecarios)." },
      { min: "35 - 45 min", title: "Firma del Decálogo de Seguridad", desc: "Cada equipo firma el 'Decálogo del Estudiante Financieramente Blindado': no prestar claves, no recibir dinero de extraños y jamás pedir prestado para apostar." }
    ]
  }
};

window.selectTeacherSession = function(sId) {
  sfx.playClick();
  document.querySelectorAll('.t-tab').forEach((tab, idx) => {
    tab.classList.toggle('active', idx + 1 === sId);
  });

  const plan = teacherLessonPlans[sId];
  const container = document.getElementById('lesson-plan-content');
  if (!container) return;

  container.innerHTML = `
    <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1.5rem;">
      <span class="badge badge-accent">Guión Cerrado para Orientación</span>
      <h3 style="font-family: var(--font-heading); font-size: 1.45rem; margin-top: 0.5rem;">${plan.title}</h3>
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.35rem;"><strong>Objetivo de Aprendizaje:</strong> ${plan.objective}</p>
    </div>

    <div class="timeline-breakdown">
      ${plan.timeline.map(t => `
        <div class="time-block-row">
          <div class="time-pill">${t.min}</div>
          <div class="time-desc">
            <h4>${t.title}</h4>
            <p>${t.desc}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
};

window.selectTeacherSession(1);

// Teacher Downloads / Print Handlers
window.printLessonPlan = function() {
  sfx.playClick();
  window.print();
};

window.downloadStudentWorksheet = function() {
  sfx.playSuccess();
  alert("📄 Descargando Ficha de Trabajo Alumno (PDF interactivo con cartolas y presupuesto 50/30/20)...");
};

window.downloadEvaluationRubric = function() {
  sfx.playSuccess();
  alert("📝 Descargando Rúbrica de Observación en Aula para Orientación (Indicadores José Díaz y Verónica Díaz)...");
};


// ==========================================================================
// 9. TAB 4: APODERADOS & MODAL GUÍAS FAMILIARES
// ==========================================================================
const capsuleGuides = {
  1: {
    title: "Cápsula 1: De la Mesada en Efectivo a la Tarjeta Digital",
    body: `
      <h4>El Desafío en Enseñanza Media</h4>
      <p>Cuando los jóvenes pasan del dinero en efectivo a la tarjeta (CuentaRUT o tarjeta prepago), ocurre el fenómeno del <strong>'dinero invisible'</strong>: gastar pasando una tarjeta no genera la misma sensación psicológica de pérdida que entregar billetes físicos.</p>
      <br>
      <h4>Recomendaciones Prácticas para Apoderados:</h4>
      <ul>
        <li><strong>Fijar un día fijo de depósito:</strong> Entregue la mesada una vez al mes o quincenalmente, pero jamás reponga fondos si el estudiante se queda sin saldo antes de tiempo. Aprender a administrar la escasez es la primera lección.</li>
        <li><strong>Revisión conjunta sin juicio:</strong> Una vez al mes, siéntense 10 minutos a mirar la cartola digital. Pregúntele: '¿En qué se fue la mayor parte? ¿Hubo algo que compraste por impulso y no necesitabas?'.</li>
        <li><strong>Separar ahorro al instante:</strong> Estimule a su hijo a transferir el 20% de la mesada a una cuenta de ahorro en UF el mismo día que recibe el dinero.</li>
      </ul>
    `
  },
  2: {
    title: "Cápsula 2: Cómo Hablar de Deudas en Familia sin Tabú",
    body: `
      <h4>Derribar el Silencio Financiero</h4>
      <p>En muchos hogares chilenos, el dinero solo se menciona cuando hay angustia, peleas o deudas impagas. Esto genera que los jóvenes asocien las finanzas con culpa o evasión.</p>
      <br>
      <h4>Pasos para una Conversación Constructiva:</h4>
      <ul>
        <li><strong>Explicar cómo funciona el presupuesto del hogar:</strong> Los jóvenes se sorprenden al conocer cuánto cuesta la luz, el agua, el arriendo o dividendo y el supermercado. Esto genera empatía y madurez económica.</li>
        <li><strong>Diferenciar deudas buenas de deudas destructivas:</strong> Explique que endeudarse para un estudio o una herramienta de trabajo genera valor futuro, mientras que endeudarse en 36 cuotas para ropa o comida rápida en casa comercial destruye el patrimonio familiar.</li>
      </ul>
    `
  },
  3: {
    title: "Cápsula 3: Frenar las Compras por Impulso y Aburrimiento",
    body: `
      <h4>El Hallazgo en Terreno Escolar</h4>
      <p>La investigación en colegios detectó que muchas compras se realizan simplemente por 'aburrimiento' en el colegio o por modas aceleradas en TikTok e Instagram.</p>
      <br>
      <h4>La Estrategia de las 48 Horas:</h4>
      <ul>
        <li>Cuando su hijo pida comprar algo que no sea de necesidad básica escolar, acuerden una regla: esperar 48 horas antes de pagar.</li>
        <li>Si pasados dos días la necesidad persiste y hay presupuesto, se evalúa. En más del 70% de los casos, la impulsividad inicial se apaga.</li>
      </ul>
    `
  },
  4: {
    title: "Cápsula 4: Alerta Padres: Apuestas Online en Escolares",
    body: `
      <h4>La Nueva Amenaza Digital</h4>
      <p>Las plataformas de casinos online y apuestas deportivas bombardean a adolescentes chilenos con publicidad agresiva y 'bonos de bienvenida'.</p>
      <br>
      <h4>Señales de Alerta para Madres y Padres:</h4>
      <ul>
        <li>El estudiante pide dinero prestado a amigos o familiares de forma reiterada sin justificación clara.</li>
        <li>Pasa horas mirando partidos de ligas desconocidas pendiente exclusivamente de estadísticas de apuestas.</li>
        <li>Ansiedad o cambios de humor bruscos cuando no tiene saldo en la tarjeta.</li>
        <li><strong>Acción preventiva:</strong> Nunca ingrese sus tarjetas bancarias de crédito de adulto en dispositivos compartidos con escolares.</li>
      </ul>
    `
  }
};

window.openCapsuleModal = function(capsuleId) {
  sfx.playClick();
  const c = capsuleGuides[capsuleId];
  if (!c) return;

  document.getElementById('modal-title').textContent = c.title;
  document.getElementById('modal-body-content').innerHTML = c.body;
  document.getElementById('modal-overlay').classList.remove('hidden');
};

window.closeModal = function() {
  document.getElementById('modal-overlay').classList.add('hidden');
};

document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
  if (e.target.id === 'modal-overlay') window.closeModal();
});


// ==========================================================================
// 10. TAB 5: PANEL DE IMPACTO SLEP (FILTROS EN VIVO)
// ==========================================================================
const schoolFilter = document.getElementById('school-filter');
if (schoolFilter) {
  schoolFilter.addEventListener('change', () => {
    sfx.playClick();
    const val = schoolFilter.value;
    const kpiVal = document.querySelector('.kpi-card:nth-child(1) .kpi-value');
    const kpiSub = document.querySelector('.kpi-card:nth-child(1) .kpi-sub');
    const kpiScore = document.querySelector('.kpi-card:nth-child(3) .kpi-value');

    if (val === 'liceo1') {
      kpiVal.textContent = '96.2%';
      kpiSub.textContent = '412 de 428 alumnos de 3° y 4° Medio';
      kpiScore.textContent = '6.3 / 7.0';
    } else if (val === 'colegio2') {
      kpiVal.textContent = '93.5%';
      kpiSub.textContent = '460 de 492 alumnos de 3° y 4° Medio';
      kpiScore.textContent = '5.9 / 7.0';
    } else {
      kpiVal.textContent = '94.8%';
      kpiSub.textContent = '872 de 920 alumnos de 3° y 4° Medio';
      kpiScore.textContent = '6.1 / 7.0';
    }
  });
}

// Initial Canvas trigger
window.addEventListener('DOMContentLoaded', () => {
  renderCompoundChart();
});
