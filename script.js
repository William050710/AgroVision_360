// ==========================================================================
// 🎮 ESTADO GLOBAL DA SIMULAÇÃO
// ==========================================================================
let simulacao = {
    cultura: localStorage.getItem('cultura') || '',
    aguaBase: parseInt(localStorage.getItem('aguaBase')) || 0,
    lucroBase: parseInt(localStorage.getItem('lucroBase')) || 0,
    impactoBase: parseInt(localStorage.getItem('impactoBase')) || 0,
    aguaUtilizada: 0,
    eficienciaIrrigacao: 0,
    tipoEnergia: '',
    custoEnergia: 0,
    conquistas: JSON.parse(localStorage.getItem('conquistas')) || []
};

// ==========================================================================
// 🔄 FUNÇÃO PRINCIPAL DE NAVEGAÇÃO (MUDANÇA DE TELA)
// ==========================================================================
function mudarTela(idTela) {
    document.querySelectorAll('.tela').forEach(t => t.classList.add('hidden'));
    
    const telaAlvo = document.getElementById(`tela-${idTela}`);
    if (telaAlvo) {
        telaAlvo.classList.remove('hidden');
    }

    if (idTela === 'dashboard') {
        atualizarDashboard();
    }
    if (idTela === 'desafios') {
        renderizarMedalhas();
    }
}

// ==========================================================================
// 🌱 TELA 1: HOME (CONTADORES ANIMADOS)
// ==========================================================================
function rodarContadores() {
    animarContador("count-agua", 15400);
    animarContador("count-co2", 3200);
    animarContador("count-arvores", 85);
}

function animarContador(id, valorFinal) {
    let elemento = document.getElementById(id);
    if (!elemento) return;
    let atual = 0;
    let incremento = Math.ceil(valorFinal / 50);
    let timer = setInterval(() => {
        atual += incremento;
        if (atual >= valorFinal) {
            elemento.innerText = valorFinal.toLocaleString('pt-BR');
            clearInterval(timer);
        } else {
            elemento.innerText = atual.toLocaleString('pt-BR');
        }
    }, 30);
}
window.onload = rodarContadores;

// ==========================================================================
// 🌾 TELA 2: ESCOLHA DA FAZENDA ➡️ AVANÇA PRO CLIQUE
// ==========================================================================
function selecionarCultura(nome, agua, lucro, impacto) {
    simulacao.cultura = nome;
    simulacao.aguaBase = agua;
    simulacao.lucroBase = lucro;
    simulacao.impactoBase = impacto;

    localStorage.setItem('cultura', nome);
    localStorage.setItem('aguaBase', agua);
    localStorage.setItem('lucroBase', lucro);

    mostrarToast(`🌱 Cultura ${nome} definida! Indo para Irrigação...`);

    setTimeout(() => {
        mudarTela('irrigacao');
    }, 800); 
}

// ==========================================================================
// 💧 TELA 3: SISTEMA DE IRRIGAÇÃO ➡️ AVANÇA PELO BOTÃO
// ==========================================================================
const slider = document.getElementById('slider-agua');
if(slider) {
    slider.addEventListener('input', (e) => {
        let valor = e.target.value;
        document.getElementById('valor-slider').innerText = valor + "%";
        
        let aguaGasta = Math.round(simulacao.aguaBase * (valor / 50));
        let desperdicio = valor > 60 ? Math.round(aguaGasta * (valor / 100)) : 0;
        let eficiencia = valor >= 45 && valor <= 55 ? 100 : (valor < 45 ? valor * 2 : 100 - (valor - 55));

        simulacao.aguaUtilizada = aguaGasta;
        simulacao.eficienciaIrrigacao = eficiencia;

        document.getElementById('res-agua').innerText = aguaGasta;
        document.getElementById('res-desperdicio').innerText = desperdicio;
        document.getElementById('res-eficiencia').innerText = Math.max(0, eficiencia);

        if(eficiencia > 90) {
            document.getElementById('bonus-sustentavel').classList.remove('hidden');
            verificarConquista('💧 Agricultor Verde');
        } else {
            document.getElementById('bonus-sustentavel').classList.add('hidden');
        }

        if(desperdicio > 300) {
            mostrarToast("⚠️ Alerta: Alto desperdício de água!");
        }
    });
}

function confirmarIrrigacao() {
    mostrarToast("💧 Irrigação salva! Avançando para Energia...");
    setTimeout(() => {
        mudarTela('energia');
    }, 800);
}

// ==========================================================================
// ⚡ TELA 4: ENERGIA ➡️ AVANÇA PRO CLIQUE
// ==========================================================================
function selecionarEnergia(tipo, custo, emissoes, ecoPontos) {
    simulacao.tipoEnergia = tipo;
    simulacao.custoEnergia = custo;
    
    if(tipo === 'Solar') verificarConquista('☀️ Mestre da Sustentabilidade');

    const canvas = document.getElementById('grafico-energia');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#e53935';
        ctx.fillRect(50, 50, custo / 3, 30);
        ctx.fillStyle = 'var(--text-color)';
        ctx.fillText(`Custo ($${custo})`, 50, 45);

        ctx.fillStyle = '#757575';
        ctx.fillRect(50, 120, emissoes / 3, 30);
        ctx.fillStyle = 'var(--text-color)';
        ctx.fillText(`Emissões (${emissoes}kg)`, 50, 115);
    }

    mostrarToast(`⚡ Energia ${tipo} selecionada! Gerando Dashboard...`);

    setTimeout(() => {
        mudarTela('dashboard');
    }, 1200);
}

// ==========================================================================
// 🌎 TELA 5: DASHBOARD ➡️ AVANÇA PELO BOTÃO
// ==========================================================================
function atualizarDashboard() {
    document.getElementById('dash-cultura').innerText = simulacao.cultura || "Não escolhida";
    document.getElementById('dash-agua').innerText = simulacao.aguaUtilizada;
    document.getElementById('dash-custo-energia').innerText = simulacao.custoEnergia;
    
    let sust = Math.round((simulacao.eficienciaIrrigacao + (simulacao.tipoEnergia === 'Solar' ? 100 : 30)) / 2);
    document.getElementById('dash-sustentabilidade').innerText = isNaN(sust) ? 0 : sust;

    const canvas = document.getElementById('grafico-dashboard');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let dados = [simulacao.aguaUtilizada || 100, simulacao.custoEnergia || 100];
        let cores = ['#4caf50', '#ffb74d'];
        let total = dados.reduce((a, b) => a + b, 0);
        let anguloAtual = 0;

        dados.forEach((val, i) => {
            let fatias = (val / total) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(150, 150);
            ctx.arc(150, 150, 100, anguloAtual, anguloAtual + fatias);
            ctx.fillStyle = cores[i];
            ctx.fill();
            anguloAtual += fatias;
        });
    }
}

function confirmarDashboard() {
    mostrarToast("📊 Indo para a tela de Desafios...");
    setTimeout(() => {
        mudarTela('desafios');
    }, 800);
}

// ==========================================================================
// 🎯 TELA 6: DESAFIOS & CONQUISTAS ➡️ AVANÇA PELO BOTÃO
// ==========================================================================
function verificarConquista(nomeConquista) {
    if(!simulacao.conquistas.includes(nomeConquista)) {
        simulacao.conquistas.push(nomeConquista);
        localStorage.setItem('conquistas', JSON.stringify(simulacao.conquistas));
        tocarSomAcerto();
        mostrarToast(`🏅 Conquista: ${nomeConquista}`);
        renderizarMedalhas();
    }
}

function renderizarMedalhas() {
    const container = document.getElementById('medalhas-container');
    if(!container) return;
    container.innerHTML = '';
    simulacao.conquistas.forEach(med => {
        let div = document.createElement('div');
        div.className = 'card-contador';
        div.innerText = med;
        container.appendChild(div);
    });
}

function confirmarDesafios() {
    mostrarToast("🤖 Abrindo o Assistente IA...");
    setTimeout(() => {
        mudarTela('ia');
    }, 800);
}

// ==========================================================================
// 🤖 TELA 7: ASSISTENTE IA SIMULADO
// ==========================================================================
function perguntarIA() {
    let input = document.getElementById('chat-input').value.toLowerCase();
    let output = document.getElementById('chat-output');
    let resposta = "Tente falar sobre 'água', 'energia' ou 'lucro'.";

    if(input.includes("água") || input.includes("irrigação")) {
        resposta = "🤖 Dica: Deixe o slider em 50% para obter 100% de eficiência!";
    } else if(input.includes("energia") || input.includes("solar")) {
        resposta = "🤖 Dica: A energia Solar zera suas emissões poluentes.";
    } else if(input.includes("lucro")) {
        resposta = "🤖 Dica: O Café dá muito lucro, mas consome muita água!";
    }

    output.innerHTML += `<p><strong>Você:</strong> ${input}</p>`;
    output.innerHTML += `<p class="bot-msg">${resposta}</p>`;
    document.getElementById('chat-input').value = '';
    output.scrollTop = output.scrollHeight;
}

// ==========================================================================
// 🌙 EXTRAS: TEMA & UTILS
// ==========================================================================
const btnTheme = document.getElementById('btn-theme');
if (btnTheme) {
    btnTheme.addEventListener('click', () => {
        let html = document.documentElement;
        let novoTema = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', novoTema);
        btnTheme.innerText = novoTema === 'light' ? '🌙' : '☀️';
    });
}

function mostrarToast(txt) {
    let t = document.getElementById('toast');
    if(!t) return;
    t.innerText = txt;
    t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), 3000);
}

function tocarSomAcerto() {
    try {
        let ctx = new (window.AudioContext || window.webkitAudioContext)();
        let osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch(e) { console.log("Áudio não suportado."); }
}