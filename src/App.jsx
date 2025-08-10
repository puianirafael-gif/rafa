import React, { useMemo, useState } from "react";

/**
 * One-page DISC assessment site
 * --------------------------------------------------------
 * ✅ Features
 * - Hero + Benefits + About + FAQ + Privacy
 * - 28-item DISC questionnaire (A/B/C/D -> D/I/S/C)
 * - Collects name, email, WhatsApp
 * - Calculates scores client-side (oculto ao participante)
 * - POST dos dados para OWNER_ENDPOINT (Apps Script / Zapier / Make / Formspree)
 * - Tela de agradecimento
 */

const OWNER_ENDPOINT = ""; // ex.: "https://script.google.com/macros/s/SEU_ID/exec"

const QUESTIONS = [
  { q:1, text:"Quando surge um desafio, eu geralmente…", options:[
    {key:"A", label:"assumo a liderança e parto para a ação"},
    {key:"B", label:"motivo o grupo e gero entusiasmo"},
    {key:"C", label:"procuro manter o clima estável e ajudar"},
    {key:"D", label:"analiso dados e critérios antes de decidir"},
  ]},
  { q:2, text:"Em reuniões, tendo a ser…", options:[
    {key:"A", label:"direto e objetivo"},
    {key:"B", label:"comunicativo e envolvente"},
    {key:"C", label:"ouvinte atento e conciliador"},
    {key:"D", label:"cuidadoso e orientado a detalhes"},
  ]},
  { q:3, text:"Meu foco principal no trabalho é…", options:[
    {key:"A", label:"atingir metas rapidamente"},
    {key:"B", label:"criar conexões e parcerias"},
    {key:"C", label:"dar suporte e consistência"},
    {key:"D", label:"garantir qualidade e precisão"},
  ]},
  { q:4, text:"Diante de mudanças inesperadas, eu…", options:[
    {key:"A", label:"decido rápido e ajusto o rumo"},
    {key:"B", label:"comunico e engajo os demais"},
    {key:"C", label:"busco estabilidade e segurança"},
    {key:"D", label:"investigo impactos e riscos"},
  ]},
  { q:5, text:"Para resolver conflitos, eu…", options:[
    {key:"A", label:"confronto o problema de frente"},
    {key:"B", label:"uso carisma e persuasão"},
    {key:"C", label:"busco acordo pacífico"},
    {key:"D", label:"recorro a regras e fatos"},
  ]},
  { q:6, text:"Ao receber feedback, eu…", options:[
    {key:"A", label:"quero objetividade e soluções"},
    {key:"B", label:"prefiro encorajamento"},
    {key:"C", label:"valorizo empatia e respeito"},
    {key:"D", label:"aprecio feedback estruturado"},
  ]},
  { q:7, text:"Em projetos, costumo…", options:[
    {key:"A", label:"decidir e delegar"},
    {key:"B", label:"inspirar e influenciar"},
    {key:"C", label:"apoiar e colaborar"},
    {key:"D", label:"planejar e documentar"},
  ]},
  { q:8, text:"Me descrevo como alguém…", options:[
    {key:"A", label:"competitivo"},
    {key:"B", label:"sociável"},
    {key:"C", label:"paciente"},
    {key:"D", label:"perfeccionista"},
  ]},
  { q:9, text:"Quando algo dá errado, eu…", options:[
    {key:"A", label:"assumo e corrijo rápido"},
    {key:"B", label:"reanimo a equipe"},
    {key:"C", label:"acalmo o ambiente"},
    {key:"D", label:"reviso o processo"},
  ]},
  { q:10, text:"Para comunicar ideias, eu…", options:[
    {key:"A", label:"vou direto ao ponto"},
    {key:"B", label:"conto histórias"},
    {key:"C", label:"busco consenso"},
    {key:"D", label:"uso dados e lógica"},
  ]},
  { q:11, text:"Diante de prazos curtos, eu…", options:[
    {key:"A", label:"acelero e corto atalhos"},
    {key:"B", label:"peço ajuda e mobilizo"},
    {key:"C", label:"priorizo o essencial sem estresse"},
    {key:"D", label:"repriorizo e crio checklists"},
  ]},
  { q:12, text:"Preferência de trabalho…", options:[
    {key:"A", label:"autonomia para decidir"},
    {key:"B", label:"interação constante"},
    {key:"C", label:"rotina previsível"},
    {key:"D", label:"processos claros"},
  ]},
  { q:13, text:"Sobre riscos, eu…", options:[
    {key:"A", label:"assumo riscos calculados"},
    {key:"B", label:"
