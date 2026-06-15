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
// 🌾 TELA 2: ESCOLHA DA FAZENDA
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
// 💧 TELA 3: SISTEMA DE IRRIGAÇÃO
// ==========================================================================
const slider = document.getElementById('slider-agua');
if(slider) {
    slider.addEventListener('input', (e) => {
        let valor = e.target.value;
        if(document.getElementById('valor-slider')) document.getElementById('valor-slider').innerText = valor + "%";
        
        let aguaGasta = Math.round(simulacao.aguaBase * (valor / 50));
        let desperdicio = valor > 60 ? Math.round(aguaGasta * (valor / 100)) : 0;
        let eficiencia = valor >= 45 && valor <= 55 ? 100 : (valor < 45 ? valor * 2 : 100 - (valor - 55));

        simulacao.aguaUtilizada = aguaGasta;
        simulacao.eficienciaIrrigacao = eficiencia;

        if(document.getElementById('res-agua')) document.getElementById('res-agua').innerText = aguaGasta;
        if(document.getElementById('res-desperdicio')) document.getElementById('res-desperdicio').innerText = desperdicio;
        if(document.getElementById('res-eficiencia')) document.getElementById('res-eficiencia').innerText = Math.max(0, eficiencia);

        if(eficiencia > 90) {
            if(document.getElementById('bonus-sustentavel')) document.getElementById('bonus-sustentavel').classList.remove('hidden');
            verificarConquista('💧 Agricultor Verde');
        } else {
            if(document.getElementById('bonus-sustentavel')) document.getElementById('bonus-sustentavel').classList.add('hidden');
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
// ⚡ TELA 4: ENERGIA (BARRAS E NÚMEROS INCREMENTAIS)
// ==========================================================================
let timerCusto; 
let timerEmissoes;

function selecionarEnergia(tipo, custo, emissoes) {
    simulacao.tipoEnergia = tipo;
    simulacao.custoEnergia = custo;
    
    if(tipo === 'Solar') verificarConquista('☀️ Mestre da Sustentabilidade');

    clearInterval(timerCusto);
    clearInterval(timerEmissoes);

    if(document.getElementById('titulo-energia-selecionada')) {
        document.getElementById('titulo-energia-selecionada').innerText = `Análise: Energia ${tipo}`;
    }

    let elementoCusto = document.getElementById('txt-custo');
    let custoAtual = 0;
    let passoCusto = Math.ceil(custo / 20);

    if(elementoCusto) {
        timerCusto = setInterval(() => {
            custoAtual += passoCusto;
            if (custoAtual >= custo) {
                elementoCusto.innerText = `$${custo}`;
                clearInterval(timerCusto);
            } else {
                elementoCusto.innerText = `$${custoAtual}`;
            }
        }, 25);
    }

    let elementoEmissoes = document.getElementById('txt-emissoes');
    let emissoesAtuais = 0;
    let passoEmissoes = Math.ceil(emissoes / 20);

    if(elementoEmissoes) {
        timerEmissoes = setInterval(() => {
            emissoesAtuais += passoEmissoes;
            if (emissoesAtuais >= emissoes) {
                elementoEmissoes.innerText = `${emissoes} kg`;
                clearInterval(timerEmissoes);
            } else {
                elementoEmissoes.innerText = `${emissoesAtuais} kg`;
            }
        }, 25);
    }

    let porcCusto = (custo / 500) * 100;
    let porcEmissoes = (emissoes / 1000) * 100;

    setTimeout(() => {
        if(document.getElementById('barra-custo')) document.getElementById('barra-custo').style.width = porcCusto + '%';
        if(document.getElementById('barra-emissoes')) document.getElementById('barra-emissoes').style.width = porcEmissoes + '%';
    }, 50);

    if(document.getElementById('btn-avancar-energia')) document.getElementById('btn-avancar-energia').classList.remove('hidden');
    mostrarToast(`Calculando impactos da Energia ${tipo}...`);
}

function confirmarEnergia() {
    mostrarToast("⚡ Matriz energética salva! Gerando Dashboard...");
    setTimeout(() => {
        mudarTela('dashboard');
    }, 800);
}

// ==========================================================================
// 🌎 TELA 5: DASHBOARD (PIZZA FIXADO SEM ERROS)
// ==========================================================================
function atualizarDashboard() {
    if(document.getElementById('dash-cultura')) document.getElementById('dash-cultura').innerText = simulacao.cultura || "Não escolhida";
    if(document.getElementById('dash-agua')) document.getElementById('dash-agua').innerText = `${simulacao.aguaUtilizada} Litros`;
    if(document.getElementById('dash-custo-energia')) document.getElementById('dash-custo-energia').innerText = `$${simulacao.custoEnergia}`;
    if(document.getElementById('dash-tipo-energia')) document.getElementById('dash-tipo-energia').innerText = simulacao.tipoEnergia || "Não escolhido";
    
    let lucroCalculado = simulacao.lucroBase || 0;
    if(document.getElementById('dash-lucro')) document.getElementById('dash-lucro').innerText = `$${lucroCalculado.toLocaleString('pt-BR')}`;
    
    let bonusEnergia = simulacao.tipoEnergia === 'Solar' ? 100 : (simulacao.tipoEnergia === 'Elétrica' ? 50 : 10);
    let sust = Math.round((simulacao.eficienciaIrrigacao + bonusEnergia) / 2);
    if (isNaN(sust)) sust = 0;
    if(document.getElementById('dash-sustentabilidade')) document.getElementById('dash-sustentabilidade').innerText = sust;

    let diagnosticoTexto = "";
    if (sust >= 85) {
        diagnosticoTexto = "🏆 Excelente! Sua fazenda alcançou o equilíbrio perfeito entre alta lucratividade e preservação ambiental extrema.";
    } else if (sust >= 50) {
        diagnosticoTexto = "⚠️ Bom progresso, mas pode melhorar. Tente otimizar o uso da água na irrigação ou migrar para uma matriz energética 100% limpa.";
    } else {
        diagnosticoTexto = "🚨 Alerta Crítico! Alto impacto ambiental detectado. Seu consumo de recursos está acima do recomendado para uma produção sustentável.";
    }
    if(document.getElementById('dash-diagnostico')) document.getElementById('dash-diagnostico').innerText = diagnosticoTexto;

    const canvas = document.getElementById('grafico-dashboard');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let dados = [simulacao.aguaUtilizada || 150, simulacao.custoEnergia || 150];
        let cores = ['#4caf50', '#ffb74d'];
        let total = dados.reduce((a, b) => a + b, 0);
        let anguloAtual = -Math.PI / 2;

        let centroX = 225;
        let centroY = 225;
        let raio = 180;

        dados.forEach((val, i) => {
            let fatias = (val / total) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(centroX, centroY);
            ctx.arc(centroX, centroY, raio, anguloAtual, anguloAtual + fatias);
            ctx.fillStyle = cores[i];
            ctx.fill();
            
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#000000';
            ctx.stroke();
            
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
// 🎯 TELA 6: DESAFIOS & CONQUISTAS DINÂMICAS ACENDENDO EM TELA
// ==========================================================================
function verificarConquista(nomeConquista) {
    if(!simulacao.conquistas.includes(nomeConquista)) {
        simulacao.conquistas.push(nomeConquista);
        localStorage.setItem('conquistas', JSON.stringify(simulacao.conquistas));
        tocarSomAcerto();
        mostrarToast(`🏅 Conquista: ${nomeConquista}`);
    }
}

function renderizarMedalhas() {
    const container = document.getElementById('medalhas-container');
    if(!container) return;
    container.innerHTML = '';

    let cardAgua = document.getElementById('card-missao-agua');
    let iconeAgua = document.getElementById('icone-missao-agua');
    let statusAgua = document.getElementById('status-missao-agua');
    
    if (simulacao.eficienciaIrrigacao > 80) {
        if(cardAgua) cardAgua.style.borderLeft = "6px solid #4caf50";
        if(cardAgua) cardAgua.style.background = "rgba(76, 175, 80, 0.08)";
        if(iconeAgua) iconeAgua.innerText = "✅";
        if(statusAgua) { statusAgua.innerText = "Cumprido!"; statusAgua.style.color = "#4caf50"; }
        container.innerHTML += `<div class="card-contador" style="border: 2px solid #4caf50; box-shadow: 0 0 15px rgba(76,175,80,0.3);">🏅 Guardião da Água</div>`;
    } else {
        if(cardAgua) cardAgua.style.borderLeft = "6px solid #f44336";
        if(cardAgua) cardAgua.style.background = "rgba(244, 67, 54, 0.04)";
        if(iconeAgua) iconeAgua.innerText = "❌";
        if(statusAgua) { statusAgua.innerText = "Não Atingido"; statusAgua.style.color = "#f44336"; }
    }

    let cardEnergia = document.getElementById('card-missao-energia');
    let iconeEnergia = document.getElementById('icone-missao-energia');
    let statusEnergia = document.getElementById('status-missao-energia');

    if (simulacao.tipoEnergia === 'Solar') {
        if(cardEnergia) cardEnergia.style.borderLeft = "6px solid #4caf50";
        if(cardEnergia) cardEnergia.style.background = "rgba(76, 175, 80, 0.08)";
        if(iconeEnergia) iconeEnergia.innerText = "✅";
        if(statusEnergia) { statusEnergia.innerText = "Cumprido!"; statusEnergia.style.color = "#4caf50"; }
        container.innerHTML += `<div class="card-contador" style="border: 2px solid #ffb74d; box-shadow: 0 0 15px rgba(255,183,77,0.3);">🏅 Carbono Zero</div>`;
    } else {
        if(cardEnergia) cardEnergia.style.borderLeft = "6px solid #ff9800";
        if(cardEnergia) cardEnergia.style.background = "rgba(255, 152, 0, 0.04)";
        if(iconeEnergia) iconeEnergia.innerText = "🚜";
        if(statusEnergia) { statusEnergia.innerText = "Use Solar"; statusEnergia.style.color = "#ff9800"; }
    }

    if (container.innerHTML === '') {
        container.innerHTML = `<p style="grid-column: span 2; opacity: 0.6; font-style: italic;">Nenhuma medalha conquistada nesta rodada.</p>`;
    }
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
        resposta = "🤖 Dica: A energia Solar zera suas emissões poluentes e garante nota máxima.";
    } else if(input.includes("lucro")) {
        resposta = "🤖 Dica: O Café dá muito lucro, mas consome muita água!";
    }

    if(output) {
        output.innerHTML += `<p><strong>Você:</strong> ${input}</p>`;
        output.innerHTML += `<p class="bot-msg">${resposta}</p>`;
        document.getElementById('chat-input').value = '';
        output.scrollTop = output.scrollHeight;
    }
}

// ==========================================================================
// 🔄 RECOMEÇAR SIMULAÇÃO DO ZERO
// ==========================================================================
function recomecarSimulacao() {
    simulacao.cultura = '';
    simulacao.aguaBase = 0;
    simulacao.lucroBase = 0;
    simulacao.impactoBase = 0;
    simulacao.aguaUtilizada = 0;
    simulacao.eficienciaIrrigacao = 0;
    simulacao.tipoEnergia = '';
    simulacao.custoEnergia = 0;

    if(document.getElementById('status-fazenda')) document.getElementById('status-fazenda').innerText = '';
    if(document.getElementById('valor-slider')) document.getElementById('valor-slider').innerText = "50%";
    if(document.getElementById('slider-agua')) document.getElementById('slider-agua').value = 50;
    if(document.getElementById('res-agua')) document.getElementById('res-agua').innerText = '0';
    if(document.getElementById('res-desperdicio')) document.getElementById('res-desperdicio').innerText = '0';
    if(document.getElementById('res-eficiencia')) document.getElementById('res-eficiencia').innerText = '0';
    
    if(document.getElementById('titulo-energia-selecionada')) document.getElementById('titulo-energia-selecionada').innerText = "Selecione uma opção acima";
    if(document.getElementById('txt-custo')) document.getElementById('txt-custo').innerText = "$0";
    if(document.getElementById('txt-emissoes')) document.getElementById('txt-emissoes').innerText = "0 kg";
    if(document.getElementById('barra-custo')) document.getElementById('barra-custo').style.width = "0%";
    if(document.getElementById('barra-emissoes')) document.getElementById('barra-emissoes').style.width = "0%";
    if(document.getElementById('btn-avancar-energia')) document.getElementById('btn-avancar-energia').classList.add('hidden');

    if(document.getElementById('chat-output')) {
        document.getElementById('chat-output').innerHTML = `<p class="bot-msg">Olá! O sistema foi reiniciado. Pergunte-me sobre "água", "energia", "lucro" ou "sustentabilidade".</p>`;
    }

    mostrarToast("🔄 Simulação reiniciada! Boa sorte na nova rodada.");
    mudarTela('home');
}

// ==========================================================================
// 🌙 EXTRAS: TEMA & AUDIO UTILS
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