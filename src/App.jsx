import React, { useEffect, useMemo, useState } from "react";

/**
 * DISC one-page (shuffle total)
 * - Embaralha perguntas e também a ordem das alternativas
 * - A letra A/B/C/D exibida é só visual; salvamos a CHAVE ORIGINAL para o cálculo
 * - Envio via FormSubmit (AJAX) + opcional OWNER_ENDPOINT
 */

const OWNER_ENDPOINT = ""; // opcional: ex. "https://script.google.com/macros/s/SEU_ID/exec"
const EMAIL_ENDPOINT = "https://formsubmit.co/ajax/ef82f91d95387fdff44e428297b29048"; // token do FormSubmit

// Base canônica (não mexer na ordem aqui; a UI embaralha)
const QUESTIONS_BASE = [
  { q:1, text:"Quando surge um desafio, eu geralmente...", options:[
    {key:"A", label:"assumo a liderança e parto para a ação"},
    {key:"B", label:"motivo o grupo e gero entusiasmo"},
    {key:"C", label:"procuro manter o clima estável e ajudar"},
    {key:"D", label:"analiso dados e critérios antes de decidir"},
  ]},
  { q:2, text:"Em reuniões, tendo a ser...", options:[
    {key:"A", label:"direto e objetivo"},
    {key:"B", label:"comunicativo e envolvente"},
    {key:"C", label:"ouvinte atento e conciliador"},
    {key:"D", label:"cuidadoso e orientado a detalhes"},
  ]},
  { q:3, text:"Meu foco principal no trabalho é...", options:[
    {key:"A", label:"atingir metas rapidamente"},
    {key:"B", label:"criar conexões e parcerias"},
    {key:"C", label:"dar suporte e consistência"},
    {key:"D", label:"garantir qualidade e precisão"},
  ]},
  { q:4, text:"Diante de mudanças inesperadas, eu...", options:[
    {key:"A", label:"decido rápido e ajusto o rumo"},
    {key:"B", label:"comunico e engajo os demais"},
    {key:"C", label:"busco estabilidade e segurança"},
    {key:"D", label:"investigo impactos e riscos"},
  ]},
  { q:5, text:"Para resolver conflitos, eu...", options:[
    {key:"A", label:"confronto o problema de frente"},
    {key:"B", label:"uso carisma e persuasão"},
    {key:"C", label:"busco acordo pacífico"},
    {key:"D", label:"recorro a regras e fatos"},
  ]},
  { q:6, text:"Ao receber feedback, eu...", options:[
    {key:"A", label:"quero objetividade e soluções"},
    {key:"B", label:"prefiro encorajamento"},
    {key:"C", label:"valorizo empatia e respeito"},
    {key:"D", label:"aprecio feedback estruturado"},
  ]},
  { q:7, text:"Em projetos, costumo...", options:[
    {key:"A", label:"decidir e delegar"},
    {key:"B", label:"inspirar e influenciar"},
    {key:"C", label:"apoiar e colaborar"},
    {key:"D", label:"planejar e documentar"},
  ]},
  { q:8, text:"Me descrevo como alguém...", options:[
    {key:"A", label:"competitivo"},
    {key:"B", label:"sociável"},
    {key:"C", label:"paciente"},
    {key:"D", label:"perfeccionista"},
  ]},
  { q:9, text:"Quando algo dá errado, eu...", options:[
    {key:"A", label:"assumo e corrijo rápido"},
    {key:"B", label:"reanimo a equipe"},
    {key:"C", label:"acalmo o ambiente"},
    {key:"D", label:"reviso o processo"},
  ]},
  { q:10, text:"Para comunicar ideias, eu...", options:[
    {key:"A", label:"vou direto ao ponto"},
    {key:"B", label:"conto histórias"},
    {key:"C", label:"busco consenso"},
    {key:"D", label:"uso dados e lógica"},
  ]},
  { q:11, text:"Diante de prazos curtos, eu...", options:[
    {key:"A", label:"acelero e corto atalhos"},
    {key:"B", label:"peço ajuda e mobilizo"},
    {key:"C", label:"priorizo o essencial sem estresse"},
    {key:"D", label:"repriorizo e crio checklists"},
  ]},
  { q:12, text:"Preferência de trabalho...", options:[
    {key:"A", label:"autonomia para decidir"},
    {key:"B", label:"interação constante"},
    {key:"C", label:"rotina previsível"},
    {key:"D", label:"processos claros"},
  ]},
  { q:13, text:"Sobre riscos, eu...", options:[
    {key:"A", label:"assumo riscos calculados"},
    {key:"B", label:"confio no timing e na rede"},
    {key:"C", label:"evito riscos desnecessários"},
    {key:"D", label:"só avanço com garantia"},
  ]},
  { q:14, text:"Para aprender, eu...", options:[
    {key:"A", label:"pratico fazendo"},
    {key:"B", label:"aprendo com pessoas"},
    {key:"C", label:"observo e repito"},
    {key:"D", label:"estudo sistemas e manuais"},
  ]},
  { q:15, text:"Em negociações, sou...", options:[
    {key:"A", label:"firme"},
    {key:"B", label:"envolvente"},
    {key:"C", label:"paciente"},
    {key:"D", label:"preciso"},
  ]},
  { q:16, text:"Com novidades, eu...", options:[
    {key:"A", label:"testo rápido"},
    {key:"B", label:"apresento para o grupo"},
    {key:"C", label:"avalio impacto no time"},
    {key:"D", label:"comparo especificações"},
  ]},
  { q:17, text:"Em imprevistos, eu...", options:[
    {key:"A", label:"tomo a frente"},
    {key:"B", label:"mantenho o ânimo"},
    {key:"C", label:"ofereço suporte"},
    {key:"D", label:"checo protocolos"},
  ]},
  { q:18, text:"Quando lidero, eu...", options:[
    {key:"A", label:"cobro resultados"},
    {key:"B", label:"inspiro e reconheço"},
    {key:"C", label:"protejo o time"},
    {key:"D", label:"organizo e padronizo"},
  ]},
  { q:19, text:"Em decisões pessoais, eu...", options:[
    {key:"A", label:"ajo com rapidez"},
    {key:"B", label:"procuro opiniões"},
    {key:"C", label:"considero a harmonia"},
    {key:"D", label:"listo prós e contras"},
  ]},
  { q:20, text:"Para motivação, eu...", options:[
    {key:"A", label:"gosto de desafios"},
    {key:"B", label:"de reconhecimento social"},
    {key:"C", label:"de estabilidade"},
    {key:"D", label:"de excelência técnica"},
  ]},
  { q:21, text:"No dia a dia, eu...", options:[
    {key:"A", label:"corto burocracias"},
    {key:"B", label:"conecto pessoas"},
    {key:"C", label:"mantenho rotinas"},
    {key:"D", label:"organizo informações"},
  ]},
  { q:22, text:"Em feedbacks que dou, eu...", options:[
    {key:"A", label:"sou franco"},
    {key:"B", label:"incentivo"},
    {key:"C", label:"cuido do clima"},
    {key:"D", label:"sou específico e objetivo"},
  ]},
  { q:23, text:"Sobre regras, eu...", options:[
    {key:"A", label:"questiono se travam resultados"},
    {key:"B", label:"adapto quando necessário"},
    {key:"C", label:"sigo para manter a paz"},
    {key:"D", label:"valorizo e cumpro"},
  ]},
  { q:24, text:"Sob pressão, eu...", options:[
    {key:"A", label:"acelero decisões"},
    {key:"B", label:"busco apoio"},
    {key:"C", label:"mantenho a calma"},
    {key:"D", label:"aumento o controle"},
  ]},
  { q:25, text:"Na comunicação, eu...", options:[
    {key:"A", label:"sou direto"},
    {key:"B", label:"sou expressivo"},
    {key:"C", label:"sou gentil"},
    {key:"D", label:"sou preciso"},
  ]},
  { q:26, text:"Em metas, eu...", options:[
    {key:"A", label:"priorizo resultados"},
    {key:"B", label:"engajo pessoas"},
    {key:"C", label:"sustento o ritmo"},
    {key:"D", label:"otimizo processos"},
  ]},
  { q:27, text:"No planejamento, eu...", options:[
    {key:"A", label:"penso no atalho"},
    {key:"B", label:"penso no impacto"},
    {key:"C", label:"penso na continuidade"},
    {key:"D", label:"penso no método"},
  ]},
  { q:28, text:"Quando erro, eu...", options:[
    {key:"A", label:"corrijo e sigo"},
    {key:"B", label:"compartilho lições"},
    {key:"C", label:"peço desculpas"},
    {key:"D", label:"documento para evitar recorrência"},
  ]},
];

const altToProfile = { A:"D", B:"I", C:"S", D:"C" };

// util: Fisher–Yates
function shuffle(arr){
  const a = arr.slice();
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function classNames(...c){ return c.filter(Boolean).join(" "); }

export default function App(){
  const [stage, setStage] = useState("home");
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ nome:"", email:"", whatsapp:"", answers:{} });

  // perguntas embaralhadas + alternativas embaralhadas (uma vez por visita)
  const [questions, setQuestions] = useState([]);
  useEffect(()=>{
    const qShuffled = shuffle(QUESTIONS_BASE).map(q => {
      // embaralhar alternativas; manter a CHAVE ORIGINAL num campo "orig"
      const opts = shuffle(q.options).map((opt, idx) => ({
        keyOriginal: opt.key,   // usado no cálculo
        label: opt.label,
        // letra visual muda conforme a posição embaralhada
        letter: ["A","B","C","D"][idx]
      }));
      return { ...q, options: opts };
    });
    setQuestions(qShuffled);
  }, []);

  const progress = useMemo(()=>{
    const answered = Object.values(form.answers).filter(Boolean).length;
    return questions.length ? Math.round((answered / questions.length) * 100) : 0;
  }, [form.answers, questions]);

  // cálculo baseado na CHAVE ORIGINAL salva em answers[q]
  const scores = useMemo(()=>{
    const map = { D:0, I:0, S:0, C:0 };
    questions.forEach(q=>{
      const originalKey = form.answers[q.q]; // "A"/"B"/"C"/"D" (original)
      if(!originalKey) return;
      map[altToProfile[originalKey]] += 1;
    });
    return map;
  }, [form.answers, questions]);

  const [primario, secundario] = useMemo(()=>{
    const arr = Object.entries(scores).sort((a,b)=>b[1]-a[1]);
    return [arr[0]?.[0], arr[1]?.[0]];
  }, [scores]);

  async function handleSubmit(e){
    e.preventDefault();
    if(!form.nome || !form.email || !form.whatsapp){
      alert("Preencha nome, e-mail e WhatsApp."); return;
    }
    const unanswered = questions.filter(q=>!form.answers[q.q]).length;
    if(unanswered>0){
      if(!confirm(`Faltam ${unanswered} pergunta(s). Deseja enviar assim mesmo?`)) return;
    }

    // construir itens com a resposta original
    const itens = questions.map(q => ({
      q: q.q,
      resp: form.answers[q.q] || null  // "A/B/C/D" (original)
    }));

    const payload = {
      nome: form.nome,
      email: form.email,
      whatsapp: form.whatsapp,
      scores, primario, secundario,
      itens,
      submittedAt: new Date().toISOString(),
      source: "site-disc-onepage",
    };

    const emailData = {
      _subject: "Novo resultado do Teste Comportamental (site)",
      _template: "table",
      _captcha: "false",
      _replyto: form.email,
      Nome: form.nome,
      Email_do_participante: form.email,
      WhatsApp: form.whatsapp,
      Perfil_Primario: primario || "",
      Perfil_Secundario: secundario || "",
      Pontuacao_D: String(scores.D),
      Pontuacao_I: String(scores.I),
      Pontuacao_S: String(scores.S),
      Pontuacao_C: String(scores.C),
      Respostas_JSON: JSON.stringify(itens),
    };

    setSending(true);
    try{
      // e-mail via FormSubmit
      if(EMAIL_ENDPOINT){
        const fd = new FormData();
        Object.entries(emailData).forEach(([k,v])=>fd.append(k,v));
        const r1 = await fetch(EMAIL_ENDPOINT, {
          method:"POST",
          headers:{ Accept:"application/json" },
          body: fd
        });
        if(!r1.ok) throw new Error("Falha ao enviar e-mail.");
      }

      // servidor opcional
      if(OWNER_ENDPOINT){
        const r2 = await fetch(OWNER_ENDPOINT, {
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify(payload)
        });
        if(!r2.ok) throw new Error("Falha ao enviar para o servidor.");
      }

      if(!EMAIL_ENDPOINT && !OWNER_ENDPOINT){
        // fallback local
        const blob = new Blob([JSON.stringify(payload,null,2)], {type:"application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `resultado-${Date.now()}.json`; a.click();
        URL.revokeObjectURL(url);
      }

      setStage("thanks");
      window.scrollTo({top:0,behavior:"smooth"});
    } catch(err){
      alert(err?.message || "Não foi possível enviar. Tente novamente.");
    } finally{
      setSending(false);
    }
  }

  function resetToHome(){
    setForm({ nome:"", email:"", whatsapp:"", answers:{} });
    setStage("home");
    window.scrollTo({top:0,behavior:"smooth"});
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header onStart={()=>{ setStage("test"); window.scrollTo({top:0,behavior:"smooth"}); }} />

      {stage==="home" && (
        <main>
          <Hero onStart={()=>setStage("test")} />
          <Benefits />
          <About />
          <FAQ />
          <Privacy />
          <Footer />
        </main>
      )}

      {stage==="test" && (
        <main>
          <section className="max-w-4xl mx-auto px-6 py-12">
            <h2 className="text-3xl md:text-4xl font-semibold">Teste Comportamental (DISC)</h2>
            <p className="mt-2 text-neutral-300">Leva 7–10 minutos. Marque a alternativa que mais representa você. As opções são embaralhadas em cada pergunta.</p>

            <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-3 gap-4 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
                <input className="bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 w-full" placeholder="Nome" value={form.nome} onChange={e=>setForm(f=>({...f, nome:e.target.value}))} required />
                <input className="bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 w-full" placeholder="E-mail" type="email" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} required />
                <input className="bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 w-full" placeholder="WhatsApp" value={form.whatsapp} onChange={e=>setForm(f=>({...f, whatsapp:e.target.value}))} required />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-400">Progresso</span>
                  <span className="text-sm text-neutral-200">{progress}%</span>
                </div>
                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="space-y-6">
                {questions.map(item=>(
                  <fieldset key={item.q} className="bg-neutral-900/40 rounded-2xl border border-neutral-800 p-4">
                    <legend className="font-medium text-neutral-100 mb-3">{item.q}. {item.text}</legend>
                    <div className="grid md:grid-cols-2 gap-3">
                      {item.options.map((opt, idx)=>{
                        const id = `q${item.q}-${idx}`;
                        const checked = form.answers[item.q] === opt.keyOriginal;
                        return (
                          <label key={id} htmlFor={id} className={classNames(
                            "cursor-pointer border rounded-xl px-4 py-3",
                            checked ? "border-emerald-500 bg-emerald-500/10" : "border-neutral-800 hover:border-neutral-700"
                          )}>
                            <input
                              id={id}
                              name={`q${item.q}`}
                              type="radio"
                              className="mr-2 align-middle accent-emerald-500"
                              checked={checked}
                              onChange={()=>setForm(f=>({
                                ...f,
                                answers:{...f.answers, [item.q]: opt.keyOriginal} // salva chave original A/B/C/D
                              }))}
                            />
                            <span className="text-neutral-200 font-medium mr-2">{opt.letter})</span>
                            <span className="text-neutral-300">{opt.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>

              <p className="text-sm text-neutral-400">Após o envio, nós analisaremos suas respostas e enviaremos <b>seu relatório completo</b> no seu e-mail/WhatsApp em até 24 horas.</p>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={resetToHome} className="px-5 py-3 rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800">Voltar</button>
                <button type="submit" disabled={sending} className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60">{sending ? "Enviando…" : "Enviar respostas"}</button>
              </div>

              <details className="mt-6 opacity-70">
                <summary className="cursor-pointer text-sm">(Admin) Ver pontuações calculadas localmente</summary>
                <div className="mt-2 text-sm grid grid-cols-2 gap-2 md:grid-cols-4">
                  <div className="bg-neutral-900 rounded-xl p-3 border border-neutral-800">D: <b>{scores.D}</b></div>
                  <div className="bg-neutral-900 rounded-xl p-3 border border-neutral-800">I: <b>{scores.I}</b></div>
                  <div className="bg-neutral-900 rounded-xl p-3 border border-neutral-800">S: <b>{scores.S}</b></div>
                  <div className="bg-neutral-900 rounded-xl p-3 border border-neutral-800">C: <b>{scores.C}</b></div>
                </div>
                <p className="text-xs text-neutral-400 mt-2">As letras exibidas mudam a cada visita. O cálculo usa a alternativa original da metodologia.</p>
              </details>
            </form>
          </section>
          <Footer />
        </main>
      )}

      {stage==="thanks" && (
        <main>
          <section className="max-w-3xl mx-auto px-6 py-24 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">✅</div>
            <h2 className="text-3xl md:text-4xl font-semibold mt-6">Obrigado! Recebemos suas respostas.</h2>
            <p className="text-neutral-300 mt-3">Seu relatório personalizado será enviado no seu e-mail/WhatsApp em até <b>24 horas</b>.</p>
            <button onClick={resetToHome} className="mt-8 px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700">Voltar ao início</button>
          </section>
          <Footer />
        </main>
      )}
    </div>
  );
}

function Header({ onStart }){
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-neutral-950/70 border-b border-neutral-900">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600"/>
          <span className="font-semibold">Bússola Comportamental</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
          <a href="#benefits" className="hover:text-white">Benefícios</a>
          <a href="#about" className="hover:text-white">Sobre</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
          <a href="#privacy" className="hover:text-white">Privacidade</a>
        </nav>
        <button onClick={onStart} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-sm">Fazer o teste</button>
      </div>
    </header>
  );
}

function Hero({ onStart }){
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight">Entenda seu perfil
            <span className="text-emerald-400"> comportamental</span> em 10 minutos.</h1>
          <p className="mt-4 text-neutral-300 text-lg">Responda ao teste, nós analisamos e você recebe um <b>relatório premium</b> com pontos fortes, oportunidades de desenvolvimento e estratégias práticas.</p>
          <div className="mt-8 flex gap-3">
            <button onClick={onStart} className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500">Fazer o teste agora</button>
            <a href="#benefits" className="px-6 py-3 rounded-2xl border border-neutral-800 hover:bg-neutral-900">Saiba mais</a>
          </div>
          <p className="mt-4 text-sm text-neutral-400">Leva 7–10 minutos · Resultado entregue individualmente · Base DISC</p>
        </div>
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-800 rounded-3xl p-6">
          <MiniChart />
        </div>
      </div>
    </section>
  );
}

function MiniChart(){
  const bars = [
    {label:"D", value:18},
    {label:"I", value:14},
    {label:"S", value:22},
    {label:"C", value:12},
  ];
  const max = Math.max(...bars.map(b=>b.value));
  return (
    <div>
      <h3 className="text-xl font-semibold">Exemplo de visual do relatório</h3>
      <p className="text-neutral-400 text-sm mt-1">Seu PDF incluirá um gráfico com a intensidade de cada estilo.</p>
      <div className="mt-6 grid grid-cols-4 gap-4 items-end h-40">
        {bars.map(b=>(
          <div key={b.label} className="flex flex-col items-center">
            <div className="w-12 rounded-t-xl bg-emerald-600" style={{height:`${(b.value/max)*100}%`}} />
            <span className="mt-2 text-neutral-300">{b.label}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-neutral-500 mt-4">Amostra ilustrativa.</p>
    </div>
  );
}

function Benefits(){
  const data = [
    {title:"Autoconhecimento prático", desc:"Clareza sobre como você age, decide e se comunica."},
    {title:"Performance no trabalho", desc:"Use seus pontos fortes para entregar mais com menos atrito."},
    {title:"Relacionamentos melhores", desc:"Adapte sua linguagem aos diferentes perfis."},
    {title:"Plano de ação", desc:"Receba um checklist de 7 dias feito para o seu estilo."},
  ];
  return (
    <section id="benefits" className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-semibold">Por que fazer o teste?</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {data.map((b,i)=>(
          <div key={i} className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-600/30" />
            <h3 className="mt-4 font-semibold">{b.title}</h3>
            <p className="text-neutral-300 mt-2 text-sm">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function About(){
  return (
    <section id="about" className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold">Sobre a metodologia</h2>
          <p className="text-neutral-300 mt-4">Utilizamos uma versão prática do modelo DISC para mapear seu estilo de comportamento. O resultado é enviado individualmente e acompanhado de recomendações acionáveis.</p>
          <ul className="list-disc list-inside text-neutral-300 mt-4 space-y-1">
            <li>Instrumento de autoconhecimento (não é diagnóstico clínico).</li>
            <li>Relatório premium entregue em PDF.</li>
            <li>Opção de mentoria/feedback após a entrega.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6">
          <h3 className="font-semibold">Como funciona</h3>
          <ol className="mt-3 text-neutral-300 space-y-2 list-decimal list-inside">
            <li>Você responde ao teste (7–10 minutos).</li>
            <li>Nós analisamos as respostas (manual + algoritmo).</li>
            <li>Você recebe seu relatório completo por e-mail/WhatsApp.</li>
          </ol>
        </div>
      </div>
    </section>
  );
}

function FAQ(){
  const items = [
    {q:"Quanto tempo leva?", a:"De 7 a 10 minutos, em média."},
    {q:"Vou ver o resultado na tela?", a:"Não. O resultado é analisado e enviado individualmente em um relatório completo (PDF)."},
    {q:"É científico?", a:"É um instrumento de mapeamento inspirado no DISC, útil para desenvolvimento pessoal e profissional."},
    {q:"Como recebo o relatório?", a:"Enviamos por e-mail/WhatsApp em até 24 horas."},
  ];
  return (
    <section id="faq" className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-semibold">Perguntas frequentes</h2>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {items.map((it,i)=>(
          <div key={i} className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
            <h3 className="font-semibold">{it.q}</h3>
            <p className="text-neutral-300 mt-2 text-sm">{it.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Privacy(){
  return (
    <section id="privacy" className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-semibold">Privacidade & LGPD</h2>
      <p className="text-neutral-300 mt-3">Coletamos nome, e-mail, WhatsApp e suas respostas para gerar o relatório personalizado. Não compartilhamos seus dados com terceiros. Você pode solicitar a exclusão a qualquer momento.</p>
      <p className="text-neutral-500 text-sm mt-2">Recomendamos revisão jurídica da política completa antes da publicação.</p>
    </section>
  );
}

function Footer(){
  return (
    <footer className="border-t border-neutral-900 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-neutral-400 flex flex-col md:flex-row items-center md:justify-between gap-2">
        <span>© {new Date().getFullYear()} Bússola Comportamental • Todos os direitos reservados</span>
        <span>Construído com base DISC (estilos comportamentais)</span>
      </div>
    </footer>
  );
}
