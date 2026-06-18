# AgroVision_360
Projeto Agrinho 2026 - AgroVision 360
# 🌱 AgroVision - Simulador de Agricultura Sustentável

O **AgroVision** é uma plataforma educacional e interativa desenvolvida para o **Concurso Agrinho 2026**. O projeto simula o gerenciamento de uma propriedade agrícola, desafiando o usuário a tomar decisões estratégicas para equilibrar a produtividade, o retorno financeiro e o impacto ecológico no planeta.

---

## 🚀 Funcionalidades Principais

O simulador é dividido em uma jornada de 7 etapas lógicas, controladas dinamicamente via JavaScript:

* **🏠 Home Dinâmica:** Apresenta contadores animados, Card Ambiental: Focado na preservação de recursos naturais e redução de fumaça poluente. Card Econômico: Destaca a importância de evitar o desperdício e custos excessivos no campo. Card Produtivo: Lembra o usuário de que o objetivo também é garantir a saúde e a força da plantação.Botão de Ação Principal (CTA): Um botão verde grande e destacado com o texto "Começar Simulação". Ele possui um efeito visual de escala (aumenta levemente de tamanho ao passar o mouse), convidando o usuário a iniciar a experiência.
* **🌾 Escolha da Cultura:** Permite selecionar entre 4 plantações diferentes (**Soja, Milho, Café e Hortaliças**). Cada uma possui um consumo base de água e um retorno financeiro proporcional, simulando o dilema real do produtor.
* **💧 Sistema de Irrigação Inteligente:** Um painel com sliders onde o usuário define o tamanho da área (em hectares) e a quantidade de água aplicada. O sistema calcula a **eficiência da irrigação** e alerta se houver desperdício.
* **⚡ Matriz Energética:** Compara três fontes de energia (**Diesel, Elétrica e Solar**). O sistema exibe animações gráficas (barras de progresso dinâmicas) calculando o custo de operação contra a pegada de emissão de CO₂.
* **🌎 Painel de Controle (Dashboard):** Gera um diagnóstico completo da fazenda. Utiliza uma renderização nativa em elemento `<canvas>` para desenhar um **Gráfico de Pizza** que divide visualmente a proporção do uso de água e o gasto com energia, gerando uma *Nota de Sustentabilidade*.
* **🎯 Missões e Medalhas:** Valida as ações do produtor. Se ele atingir alta eficiência hídrica, desbloqueia a medalha *Guardião da Água*. Se utilizar energia limpa, recebe a medalha *Carbono Zero*.
* **🤖 Assistente IA AgroVision:** Um chat simulado inteligente focado na experiência do usuário, que responde e dá dicas agrícolas personalizadas com base em palavras-chave como "água", "lucro" ou "energia".

---

## 🛠️ Tecnologias Utilizadas

Para garantir leveza, portabilidade e compatibilidade, o projeto foi construído utilizando a stack padrão da web (**Vanilla Architecture**):

* **HTML5:** Estruturação semântica das seções e telas do simulador.
* **CSS:** Estilização moderna utilizando a fonte orgânica *Quicksand*, variáveis CSS (Custom Properties) para controle de layout e **Media Queries** para responsividade completa em telas Full HD (1920x1080) e dispositivos móveis.
* **JavaScript :** Lógica de estados global da aplicação, manipulação do DOM, persistência de conquistas em `localStorage`, renderização de gráficos em Canvas.

---

## 💎 Diferenciais Técnicos Implementados

1. **Persistência de Dados:** O progresso e as conquistas do usuário ficam salvos no navegador utilizando `localStorage'.
2. **Gerenciamento de Estado Limpo:** Proteção contra quebra de rotas. Se o usuário tentar pular etapas ou acessar os desafios sem configurar a fazenda, o sistema reconhece o estado "Pendente" e evita falhas no código.
3. **Tema Escuro/Claro (Dark Mode):** Alternância completa de cores em tempo real clicando no botão de tema (🌙 / ☀️).

---

## 🔧 Como Executar o Projeto

Como o projeto utiliza tecnologias nativas do navegador, nenhuma instalação complexa é necessária:

