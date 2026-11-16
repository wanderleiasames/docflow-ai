const PRESETS = {
  cliente: {
    raw: "Olá, fiz o pedido #4821 na terça-feira passada e até agora o código de rastreio não atualizou no site. Preciso desses produtos até sexta-feira porque vou viajar no fim de semana. Se não chegar a tempo, prefiro cancelar e pedir o estorno. Aguardo retorno urgente! Att, Fernanda.",
    summary: "A cliente Fernanda solicita posicionamento urgente sobre o pedido #4821 (rastreio sem atualização) e condiciona a manutenção da compra à entrega até sexta-feira, devido a uma viagem.",
    tasks: [
      "[ALTA PRIORIDADE] Consultar status real do pedido #4821 junto à transportadora.",
      "[MÉDIA PRIORIDADE] Confirmar prazo garantido de entrega até sexta-feira.",
      "[ATENDIMENTO] Enviar atualização transparente à cliente com opção de rastreio direto ou estorno imediato."
    ],
    reply: `Olá, Fernanda! Tudo bem?\n\nAgradecemos pelo seu contato e entendemos perfeitamente a urgência por conta da sua viagem.\n\nJá acionamos nossa equipe logística para verificar a movimentação atual do pedido #4821 junto à transportadora e confirmar a previsão exata de entrega até sexta-feira. Retornaremos ainda hoje com o código atualizado ou, caso haja qualquer risco de atraso, realizaremos o estorno imediato conforme sua preferência.\n\nSeguimos à disposição,\nEquipe de Atendimento`
  },
  reuniao: {
    raw: "Na call de hoje alinhamos que o catálogo de verão precisa subir até quarta-feira às 18h. O Marcos vai revisar as fotos e preços, a Juliana vai configurar os cupons de primeira compra e precisamos validar o checkout no celular antes de liberar tráfego pago na quinta pela manhã.",
    summary: "Alinhamento operacional para lançamento do catálogo de verão na quarta-feira (18h), com divisão de responsabilidades entre revisão visual, configuração promocional e testes mobile antes da mídia paga.",
    tasks: [
      "[Marcos] Revisar todas as fotos e precificação do catálogo até quarta-feira.",
      "[Juliana] Configurar e testar regras dos cupons de primeira compra.",
      "[Operações] Validar fluxo completo de checkout em dispositivos móveis antes de quinta-feira (manhã)."
    ],
    reply: `Resumo de Alinhamento — Lançamento Catálogo de Verão\n\nPessoal, seguem os próximos passos combinados na reunião de hoje:\n• Quarta-feira (18h): Publicação do catálogo completo.\n• Responsáveis: Marcos (fotos e preços) e Juliana (cupons de primeira compra).\n• Checkpoint obrigatório: Teste de checkout mobile antes da ativação das campanhas na quinta-feira pela manhã.`
  },
  projeto: {
    raw: "Precisamos estruturar uma oficina prática de 2 aulas sobre uso ético de Inteligência Artificial na produção textual para alunos do 9º ano, destacando autoria, verificação de fontes e pensamento crítico sem depender de respostas prontas.",
    summary: "Proposta pedagógica de oficina em 2 encontros voltada ao 9º ano sobre uso ético de IA Generativa na escrita, com foco em autoria estudantil, checagem de fatos e autonomia crítica.",
    tasks: [
      "[Aula 1] Dinâmica diagnóstica comparando texto autoral e texto gerado por IA (identificando lacunas e alucinações).",
      "[Aula 2] Produção textual assistida: alunos usam prompts apenas para revisão e debate crítico, mantendo autoria própria.",
      "[Avaliação] Rubrica de autoria e registro das fontes verificadas pelos estudantes."
    ],
    reply: `Plano Sintético — Oficina de IA Ética e Autoria (9º Ano)\n\nObjetivo: Desenvolver letramento digital e pensamento crítico no uso de ferramentas de IA na escrita.\n• Encontro 1: Análise crítica e verificação de fontes em textos gerados por IA.\n• Encontro 2: Oficina de escrita autoral com uso ético de prompts como apoio à revisão.`
  }
};

const rawTextInput = document.getElementById("rawText");
const apiKeyInput = document.getElementById("apiKey");
const processBtn = document.getElementById("processBtn");
const outputSection = document.getElementById("outputSection");
const summaryOutput = document.getElementById("summaryOutput");
const tasksOutput = document.getElementById("tasksOutput");
const replyOutput = document.getElementById("replyOutput");
const promptOutput = document.getElementById("promptOutput");

let activePreset = "cliente";

function buildPrompt(text) {
  return `ROLE: Especialista em Operações, Comunicação Executiva e Produtividade (AI Builder).
TAREFA: Analise o texto bruto abaixo e gere três saídas objetivas:
1. Resumo Executivo (máximo 3 linhas, direto ao ponto).
2. Lista de Tarefas Priorizadas (com responsável ou nível de prioridade).
3. Rascunho de Resposta Profissional (tom empático, claro e resolutivo).

TEXTO DE ENTRADA:
"${text}"`;
}

function renderResult(data, inputText) {
  summaryOutput.textContent = data.summary;
  tasksOutput.innerHTML = "";
  data.tasks.forEach(task => {
    const li = document.createElement("li");
    li.textContent = task;
    tasksOutput.appendChild(li);
  });
  replyOutput.textContent = data.reply;
  promptOutput.textContent = buildPrompt(inputText);
  outputSection.classList.remove("hidden");
}

document.querySelectorAll(".preset-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    activePreset = btn.dataset.preset;
    rawTextInput.value = PRESETS[activePreset].raw;
    renderResult(PRESETS[activePreset], PRESETS[activePreset].raw);
  });
});

processBtn.addEventListener("click", async () => {
  const text = rawTextInput.value.trim();
  if (!text) {
    rawTextInput.value = PRESETS[activePreset].raw;
    renderResult(PRESETS[activePreset], PRESETS[activePreset].raw);
    return;
  }

  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    const matched = Object.values(PRESETS).find(p => p.raw.toLowerCase() === text.toLowerCase());
    if (matched) {
      renderResult(matched, text);
    } else {
      renderResult({
        summary: `Síntese automática (Modo Demo): O texto apresenta uma demanda operacional de ${text.split(" ").length} palavras que requer triagem, definição de responsáveis e resposta formal.`,
        tasks: [
          "[PRIORIDADE 1] Identificar o ponto focal e prazo crítico mencionados na mensagem.",
          "[PRIORIDADE 2] Validar informações internas antes de confirmar prazos externos.",
          "[PRIORIDADE 3] Enviar retorno formal utilizando o modelo estruturado abaixo."
        ],
        reply: `Olá!\n\nRecebemos sua mensagem e já iniciamos a análise dos pontos apresentados para dar o encaminhamento adequado o mais breve possível.\n\nRetornaremos em seguida com a confirmação completa.\n\nAtenciosamente,\nEquipe de Operações`
      }, text);
    }
    return;
  }

  processBtn.textContent = "⏳ Estruturando com Gemini LLM...";
  processBtn.disabled = true;

  try {
    const prompt = buildPrompt(text) + `\n\nResponda ESTRITAMENTE em JSON válido sem markdown:\n{"summary": "...", "tasks": ["...", "..."], "reply": "..."}`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const rawJson = data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(rawJson);

    renderResult(parsed, text);
  } catch (err) {
    alert("Não foi possível conectar à API com essa chave. Verifique a chave ou deixe em branco para usar o Modo Demo.");
  } finally {
    processBtn.textContent = "✨ Estruturar Resumo, Tarefas e Resposta";
    processBtn.disabled = false;
  }
});

document.querySelectorAll(".copy-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.target);
    navigator.clipboard.writeText(target.innerText);
    const original = btn.textContent;
    btn.textContent = "Copiado!";
    setTimeout(() => (btn.textContent = original), 1500);
  });
});

// Carrega o primeiro exemplo automaticamente
rawTextInput.value = PRESETS.cliente.raw;
renderResult(PRESETS.cliente, PRESETS.cliente.raw);
