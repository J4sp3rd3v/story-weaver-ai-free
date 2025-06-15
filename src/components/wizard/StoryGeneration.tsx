
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Key, Zap, Eye, Sparkles, Loader2 } from 'lucide-react';

interface StoryGenerationProps {
  wizardData: any;
  onApiKeySet: (apiKey: string) => void;
  onGenerate: () => void;
  onStoryGenerated: (story: any) => void;
  onPrev: () => void;
}

// Modelli AI specializzati per ruoli specifici - AGGIORNATI CON MODELLI DISPONIBILI
const SPECIALIZED_MODELS = {
  architect: 'meta-llama/llama-3.2-3b-instruct:free', // Struttura e continuità narrativa
  psychologist: 'meta-llama/llama-3.2-1b-instruct:free', // Sviluppo psicologico personaggi
  writer: 'mistralai/mistral-7b-instruct:free',        // Scrittura scene coinvolgenti
  atmosphere: 'huggingfaceh4/zephyr-7b-beta:free',    // Creazione atmosfera immersiva
  editor: 'openchat/openchat-7b:free'                  // Revisione finale e collegamenti
};

const FALLBACK_MODELS = [
  'google/gemma-7b-it:free',
  'meta-llama/llama-3.2-3b-instruct:free',
  'meta-llama/llama-3.2-1b-instruct:free'
];

const StoryGeneration: React.FC<StoryGenerationProps> = ({
  wizardData,
  onApiKeySet,
  onGenerate,
  onStoryGenerated,
  onPrev
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  const { toast } = useToast();

  const generateImmersiveStory = async (apiKey: string) => {
    try {
      setGenerationProgress('🧠 LLM Psicologo: Creando profili psicologici dei personaggi...');
      
      // Step 1: Sviluppo psicologico dettagliato dei personaggi
      const characterProfiles = await generateCharacterPsychology(apiKey);
      
      setGenerationProgress('🏗️ LLM Architetto: Tessendo mappa narrativa con archi emotivi...');
      
      // Step 2: Architetto crea struttura con archi emotivi
      const emotionalBlueprint = await generateEmotionalBlueprint(apiKey, characterProfiles);
      
      setGenerationProgress('🌍 LLM Atmosfera: Creando ambientazioni immersive e sensoriali...');
      
      // Step 3: Creazione atmosfere dettagliate per ogni scena
      const atmosphericElements = await generateAtmosphericElements(apiKey, emotionalBlueprint);
      
      setGenerationProgress('✍️ LLM Scrittore: Tessendo scene con profondità emotiva...');
      
      // Step 4: Scrittore genera scene immersive
      const immersiveScenes = await generateImmersiveScenes(apiKey, characterProfiles, emotionalBlueprint, atmosphericElements);
      
      setGenerationProgress('📝 LLM Editor: Intensificando coinvolgimento emotivo...');
      
      // Step 5: Editor perfeziona l'immersione
      const finalScenes = await polishEmotionalImmersion(apiKey, immersiveScenes, characterProfiles);
      
      setGenerationProgress('🎨 Creando prompt visivi atmosferici...');
      
      // Step 6: Prompt immagini che riflettono la continuità
      const scenesWithAtmosphericImages = await addAtmosphericImagePrompts(apiKey, finalScenes, atmosphericElements);
      
      setGenerationProgress('🔧 Assemblando storia immersiva...');
      
      // Step 7: Assemblaggio finale con controllo qualità
      const finalStory = createImmersiveStory(emotionalBlueprint, scenesWithAtmosphericImages, characterProfiles);
      
      return finalStory;

    } catch (error) {
      console.error('Errore nella generazione immersiva:', error);
      throw error;
    }
  };

  const generateCharacterPsychology = async (apiKey: string) => {
    const psychologyPrompt = `
Sei uno PSICOLOGO NARRATIVO ESPERTO. Crea profili psicologici PROFONDI e COINVOLGENTI per questi personaggi:

PROTAGONISTA: ${wizardData.protagonist?.name} - ${wizardData.protagonist?.description}
ANTAGONISTA: ${wizardData.antagonist?.name} - ${wizardData.antagonist?.description}

GENERE: ${wizardData.genre?.name} - Questo influenza la psicologia
AMBIENTAZIONE: ${wizardData.setting?.name} - Come plasma i personaggi

CREA PROFILI PSICOLOGICI DETTAGLIATI:

PROTAGONISTA_PSICOLOGIA:
TRAUMA_PASSATO: [Evento che ha formato il carattere]
DESIDERIO_PROFONDO: [Cosa vuole veramente nel cuore]
PAURA_NASCOSTA: [Di cosa ha più paura]
CONTRADDIZIONE_INTERNA: [Conflitto interno che lo rende umano]
LINGUAGGIO_CORPOREO: [Come si muove, gesticola]
ABITUDINI_NERVOSE: [Tic, gesti involontari]
DIALOGO_CARATTERISTICO: [Come parla, espressioni tipiche]
ARCO_EMOTIVO: [Come cambierà durante la storia]
SEGRETO_PERSONALE: [Qualcosa che nasconde]
PUNTO_ROTTURA: [Cosa lo farebbe crollare]

ANTAGONISTA_PSICOLOGIA:
MOTIVAZIONE_COMPRENSIBILE: [Perché fa quello che fa - deve essere comprensibile]
LATO_UMANO: [Aspetto che lo rende umano, non solo cattivo]
MOMENTO_VULNERABILE: [Quando mostra debolezza]
METODO_MANIPOLAZIONE: [Come influenza gli altri]
OSSESSIONE: [Cosa lo guida ossessivamente]
PAURA_SEGRETA: [Di cosa ha paura]
PASSATO_DOLOROSO: [Cosa lo ha reso così]
CONTRADDIZIONE: [Aspetto contradditorio del carattere]
DIALOGO_DISTINTIVO: [Come parla in modo unico]
GESTO_SIMBOLICO: [Azione ricorrente che lo caratterizza]

DINAMICA_TRA_PERSONAGGI:
COSA_LI_UNISCE: [Cosa hanno in comune]
SPECCHIO_OSCURO: [Come l'antagonista riflette il protagonista]
TENSIONE_SESSUALE/EMOTIVA: [Se appropriata al genere]
INCOMPRENSIONE_TRAGICA: [Malintesi che alimentano il conflitto]
MOMENTO_RICONOSCIMENTO: [Quando si capiscono veramente]

Scrivi tutto nei dettagli, ogni aspetto DEVE essere specifico e unico.
`;

    return await callLLM(apiKey, SPECIALIZED_MODELS.psychologist, psychologyPrompt, 'psicologo narrativo');
  };

  const generateEmotionalBlueprint = async (apiKey: string, characterProfiles: string) => {
    const blueprintPrompt = `
Sei un ARCHITETTO EMOTIVO MAESTRO. Crea una MAPPA NARRATIVA che fa innamorare il lettore della storia:

PROFILI_PSICOLOGICI_PERSONAGGI:
${characterProfiles}

PARAMETRI_STORIA:
- GENERE: ${wizardData.genre?.name}
- AMBIENTAZIONE: ${wizardData.setting?.name}
- TRAMA: ${wizardData.plot?.name}
- STILE: ${wizardData.author?.name}

CREA STRUTTURA EMOTIVA IRRESISTIBILE:

TITOLO_MAGNETICO: [Titolo che cattura immediatamente]

GANCIO_EMOTIVO_PRINCIPALE:
MISTERO_CHE_OSSESSIONA: [Domanda che tormenta il lettore]
PERSONAGGIO_AMABILE: [Perché il lettore si affeziona al protagonista]
POSTA_IN_GIOCO_PERSONALE: [Cosa rischia di perdere di importante]
TIMER_EMOTIVO: [Pressione temporale che crea ansia]

ARCO_EMOTIVO_6_SCENE:

SCENA_1: "L'Aggancio Irresistibile"
OBIETTIVO_EMOTIVO: Far innamorare il lettore del protagonista
SITUAZIONE_RELATABLE: [Situazione con cui il lettore si identifica]
VULNERABILITÀ_MOSTRATA: [Momento di debolezza che crea empatia]
MISTERO_INTRIGANTE: [Domanda che ossessiona]
DETTAGLIO_SENSORIALE: [Odore, suono, texture che immergono]
CLIFFHANGER_PERSONALE: [Qualcosa che riguarda il cuore del protagonista]
EMOZIONE_DOMINANTE: [Quale emozione deve provare il lettore]

SCENA_2: "L'Approfondimento"
RIVELAZIONE_CARATTERE: [Aspetto nuovo del protagonista]
COMPLICAZIONE_EMOTIVA: [Come si complica emotivamente]
CONTRASTO_ATMOSFERICO: [Cambio di mood/ambientazione]
ANTAGONISTA_INTRIGANTE: [Prima apparizione affascinante del nemico]
ALLEANZA_INASPETTATA: [Nuovo legame emotivo]
SEGRETO_RIVELATO: [Verità che cambia tutto]
EMOZIONE_DOMINANTE: [Curiosità, apprensione, fascino]

SCENA_3: "Il Tradimento Emotivo"
ILLUSIONE_INFRANTA: [Quando tutto quello che sembrava vero non lo è]
MOMENTO_VULNERABILITÀ: [Quando il protagonista è più fragile]
ANTAGONISTA_SEDUTTIVO: [Perché il nemico è affascinante]
PERDITA_DOLOROSA: [Cosa perde emotivamente]
SCELTA_IMPOSSIBILE: [Dilemma che spezza il cuore]
SIMBOLO_SPEZZATO: [Oggetto/simbolo che si rompe]
EMOZIONE_DOMINANTE: [Tradimento, dolore, confusione]

SCENA_4: "La Rivelazione Devastante"
VERITÀ_SCONVOLGENTE: [Rivelazione che cambia tutto]
PROTAGONISTA_SPEZZATO: [Momento di massima disperazione]
ANTAGONISTA_UMANO: [Quando vediamo il lato umano del nemico]
RICORDO_DOLOROSO: [Flashback che spiega tutto]
PUNTO_NON_RITORNO: [Momento in cui tutto cambia per sempre]
EMOZIONE_DOMINANTE: [Shock, devastazione, comprensione]

SCENA_5: "La Rinascita Eroica"
DECISIONE_CORAGGIOSA: [Quando il protagonista sceglie di lottare]
SUPERAMENTO_PAURA: [Come affronta la sua paura più grande]
SACRIFICIO_NOBILE: [Cosa è disposto a sacrificare]
ALLEATI_INASPETTATI: [Chi lo aiuta nel momento cruciale]
SCONTRO_INTERIORE: [Battaglia contro i suoi demoni]
EMOZIONE_DOMINANTE: [Coraggio, determinazione, speranza]

SCENA_6: "La Catarsi Finale"
CONFRONTO_DEFINITIVO: [Scontro finale non solo fisico ma emotivo]
PERDONO/VENDETTA: [Come risolve il conflitto interno]
TRASFORMAZIONE_COMPLETA: [Come è cambiato]
NUOVO_EQUILIBRIO: [Che persona è diventato]
SPERANZA_FUTURA: [Cosa succederà dopo]
EMOZIONE_DOMINANTE: [Catarsi, soddisfazione, commozione]

TECNICHE_COINVOLGIMENTO:
IDENTIFICAZIONE: [Come il lettore si identifica]
SUSPENSE_EMOTIVA: [Come mantenere l'ansia emotiva]
PAYOFF_EMOTIVI: [Momenti di grande soddisfazione]
SORPRESE_CARATTERE: [Rivelazioni sui personaggi]

Ogni elemento DEVE essere dettagliato e specifico per questa storia.
`;

    return await callLLM(apiKey, SPECIALIZED_MODELS.architect, blueprintPrompt, 'architetto emotivo');
  };

  const generateAtmosphericElements = async (apiKey: string, blueprint: string) => {
    const atmospherePrompt = `
Sei un MAESTRO DELL'ATMOSFERA. Crea elementi sensoriali e atmosferici che immergono il lettore:

BLUEPRINT_EMOTIVO:
${blueprint}

AMBIENTAZIONE: ${wizardData.setting?.name} - ${wizardData.setting?.description}
GENERE: ${wizardData.genre?.name}

CREA ATMOSFERE IMMERSIVE PER OGNI SCENA:

PALETTE_SENSORIALE_GLOBALE:
COLORI_DOMINANTI: [Palette cromatica della storia]
SUONI_RICORRENTI: [Suoni che caratterizzano l'ambientazione]
ODORI_CARATTERISTICI: [Profumi che definiscono i luoghi]
TEXTURE_TATTILI: [Sensazioni al tatto]
SAPORI_EMOTIVI: [Gusti legati a emozioni]

SCENA_1_ATMOSFERA:
AMBIENTAZIONE_DETTAGLIATA: [Descrizione sensoriale completa]
ILLUMINAZIONE: [Come la luce influenza l'umore]
SUONI_SPECIFICI: [Rumori di sottofondo, voci, silenzi]
ODORI_AMBIENTE: [Profumi che caratterizzano il momento]
TEMPERATURA_EMOTIVA: [Caldo/freddo che riflette emozioni]
MOVIMENTO_ARIA: [Vento, correnti, immobilità]
OGGETTI_SIMBOLICI: [Elementi fisici carichi di significato]

SCENA_2_ATMOSFERA:
[Ripeti la struttura per ogni scena con variazioni atmosferiche]

SCENA_3_ATMOSFERA:
[Idem]

SCENA_4_ATMOSFERA:
[Idem]

SCENA_5_ATMOSFERA:
[Idem]

SCENA_6_ATMOSFERA:
[Idem]

TRANSIZIONI_ATMOSFERICHE:
COME_CAMBIA_MOOD: [Come l'atmosfera evolve tra le scene]
CONTRASTI_EMOTIVI: [Cambi di ritmo atmosferico]
CONTINUITÀ_SENSORIALE: [Elementi che legano le atmosfere]

Ogni descrizione deve essere ricca di dettagli sensoriali specifici.
`;

    return await callLLM(apiKey, SPECIALIZED_MODELS.atmosphere, atmospherePrompt, 'maestro atmosfera');
  };

  const generateImmersiveScenes = async (apiKey: string, characterProfiles: string, blueprint: string, atmosphericElements: string) => {
    const scenes = [];
    
    // Estrai le scene dal blueprint
    const sceneMatches = blueprint.match(/SCENA_\d+:.*?(?=SCENA_\d+:|TECNICHE_COINVOLGIMENTO:|$)/gs) || [];
    
    for (let i = 0; i < Math.min(sceneMatches.length, 6); i++) {
      const sceneStructure = sceneMatches[i];
      
      setGenerationProgress(`✍️ LLM Scrittore: Scena ${i + 1}/6 - Immersione emotiva profonda...`);
      
      try {
        const sceneContent = await generateEmotionalScene(
          apiKey, 
          sceneStructure, 
          characterProfiles,
          blueprint, 
          atmosphericElements,
          scenes, 
          i + 1
        );
        
        scenes.push(sceneContent);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
      } catch (error) {
        console.error(`Errore nella scena ${i + 1}:`, error);
        
        try {
          const fallbackModel = FALLBACK_MODELS[i % FALLBACK_MODELS.length];
          const fallbackContent = await generateEmotionalScene(
            apiKey, 
            sceneStructure, 
            characterProfiles,
            blueprint, 
            atmosphericElements,
            scenes, 
            i + 1,
            fallbackModel
          );
          scenes.push(fallbackContent);
        } catch (fallbackError) {
          scenes.push(createEmotionalPlaceholder(i + 1, sceneStructure));
        }
      }
    }

    return scenes;
  };

  const generateEmotionalScene = async (
    apiKey: string, 
    sceneStructure: string, 
    characterProfiles: string,
    fullBlueprint: string, 
    atmosphericElements: string,
    previousScenes: any[], 
    sceneNumber: number,
    customModel?: string
  ) => {
    const model = customModel || SPECIALIZED_MODELS.writer;
    
    // Crea contesto di continuità dalle scene precedenti
    const continuityContext = previousScenes.length > 0 
      ? `SCENE_PRECEDENTI:
${previousScenes.map((scene, idx) => 
  `Scena ${idx + 1}: ${scene.title}
  STATO_EMOTIVO_FINALE: ${scene.emotionalState || 'Da definire'}
  ULTIMO_MOMENTO: "${scene.content.split('\n').slice(-2).join(' ')}"
  `
).join('\n\n')}`
      : 'Prima scena - Stabilisci il tono emotivo';

    const immersivePrompt = `
Sei uno SCRITTORE IMMERSIVO di livello mondiale. Scrivi scene che fanno dimenticare al lettore di star leggendo:

PROFILI_PSICOLOGICI:
${characterProfiles}

BLUEPRINT_EMOTIVO:
${fullBlueprint}

ATMOSFERE_SENSORIALI:
${atmosphericElements}

${continuityContext}

SCENA_DA_SCRIVERE:
${sceneStructure}

REGOLE_IMMERSIONE_TOTALE:
1. SHOW DON'T TELL: Mostra emozioni attraverso azioni, non dirle
2. DETTAGLI_SENSORIALI: Almeno 3 sensi in ogni paragrafo
3. DIALOGHI_AUTENTICI: Ogni personaggio ha modo di parlare unico
4. PENSIERI_INTERIORI: Accesso alla mente del protagonista
5. RITMO_VARIABILE: Alterna tensione e respiro
6. SOTTOTESTO: Quello che non viene detto è importante
7. SIMBOLISMO: Oggetti/azioni che rappresentano emozioni
8. CLIFFHANGER_EMOTIVO: Finisci con una domanda del cuore

TECNICHE_SPECIFICHE:
- USA METAFORE SENSORIALI per le emozioni
- CREA TENSIONE attraverso piccoli dettagli
- FAI RESPIRARE IL LETTORE nel ritmo
- COSTRUISCI EMPATIA con vulnerabilità del protagonista
- USA IL CORPO per mostrare stati d'animo
- CREA SUSPENSE emotiva, non solo di trama

LUNGHEZZA: 1200-1400 parole di qualità cinematografica

FORMATO_RISPOSTA:
TITOLO_EVOCATIVO: [Titolo che cattura l'essenza emotiva]

CONTENUTO_IMMERSIVO:
[Scena scritta con tecnica immersiva totale]

STATO_EMOTIVO_FINALE: [Come si sente il protagonista alla fine]

GANCIO_EMOTIVO: [Cosa spinge a leggere la scena successiva]

SIMBOLI_PRESENTI: [Elementi simbolici usati]

Scrivi una scena che il lettore non riuscirà a dimenticare.
`;

    const response = await callLLM(apiKey, model, immersivePrompt, 'scrittore immersivo');
    return parseEmotionalScene(response, sceneNumber);
  };

  const polishEmotionalImmersion = async (apiKey: string, scenes: any[], characterProfiles: string) => {
    const polishedScenes = [];
    
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      
      setGenerationProgress(`📝 LLM Editor: Intensificando impatto emotivo scena ${i + 1}...`);
      
      try {
        const polishedScene = await polishEmotionalImpact(apiKey, scene, scenes, characterProfiles, i + 1);
        polishedScenes.push(polishedScene);
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
      } catch (error) {
        console.error(`Errore perfezionamento scena ${i + 1}:`, error);
        polishedScenes.push(scene);
      }
    }
    
    return polishedScenes;
  };

  const polishEmotionalImpact = async (apiKey: string, scene: any, allScenes: any[], characterProfiles: string, sceneNumber: number) => {
    const polishPrompt = `
Sei un EDITOR EMOTIVO esperto. Intensifica l'impatto emotivo di questa scena:

SCENA_DA_PERFEZIONARE:
${scene.title}
${scene.content}

PROFILI_PERSONAGGI:
${characterProfiles}

OBIETTIVI_PERFEZIONAMENTO:
1. MASSIMIZZA COINVOLGIMENTO emotivo
2. RAFFORZA CARATTERIZZAZIONE attraverso azioni e dialoghi
3. INTENSIFICA ATMOSFERA sensoriale
4. MIGLIORA RITMO narrativo
5. POTENZIA SOTTOTESTO e non-detto
6. AFFINA TRANSIZIONI tra emozioni
7. AMPLIFICA SIMBOLISMO

TECNICHE_RAFFINAMENTO:
- Sostituisci aggettivi generici con dettagli specifici
- Trasforma esposizione in azione drammatica
- Aggiungi layer di significato attraverso gesti e sguardi
- Intensifica conflitto interno del protagonista
- Rendi ogni dialogo multi-livello (superficie + sottotesto)
- Usa pause e silenzi per creare tensione

MANTIENI:
- Stessa trama e sviluppi
- Lunghezza originale
- Gancio emotivo finale

FORMATO_RISPOSTA:
TITOLO_RAFFINATO: [Titolo con maggiore impatto]

CONTENUTO_INTENSIFICATO:
[Scena con coinvolgimento emotivo massimizzato]

IMPATTO_EMOTIVO_FINALE: [Come colpisce il lettore]

ELEMENTI_SIMBOLICI: [Simboli e metafore presenti]

Rendi questa scena indimenticabile.
`;

    const response = await callLLM(apiKey, SPECIALIZED_MODELS.editor, polishPrompt, 'editor emotivo');
    return parseEmotionalScene(response, sceneNumber, scene);
  };

  const addAtmosphericImagePrompts = async (apiKey: string, scenes: any[], atmosphericElements: string) => {
    const scenesWithImages = [];
    
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      
      setGenerationProgress(`🎨 Creando prompt visivo atmosferico per scena ${i + 1}...`);
      
      try {
        const imagePrompt = await generateAtmosphericImagePrompt(apiKey, scene, atmosphericElements);
        scenesWithImages.push({
          ...scene,
          imagePrompt
        });
        
        await new Promise(resolve => setTimeout(resolve, 600));
        
      } catch (error) {
        console.error(`Errore prompt immagine scena ${i + 1}:`, error);
        scenesWithImages.push({
          ...scene,
          imagePrompt: `atmospheric ${wizardData.genre?.name} scene, ${wizardData.setting?.name}, cinematic lighting, emotional depth`
        });
      }
    }
    
    return scenesWithImages;
  };

  const generateAtmosphericImagePrompt = async (apiKey: string, scene: any, atmosphericElements: string) => {
    const imagePrompt = `
Crea un prompt PERFETTO per Stable Diffusion che catturi l'atmosfera emotiva:

SCENA: ${scene.title}
CONTENUTO: ${scene.content.substring(0, 600)}...
STATO_EMOTIVO: ${scene.emotionalState || ''}

ELEMENTI_ATMOSFERICI:
${atmosphericElements.substring(0, 400)}...

GENERE: ${wizardData.genre?.name}
AMBIENTAZIONE: ${wizardData.setting?.name}

Crea prompt in inglese di MAX 150 caratteri che includa:
1. Protagonista in azione emotiva specifica
2. Atmosfera sensoriale dettagliata
3. Illuminazione che riflette l'emozione
4. Stile cinematografico del genere

Solo il prompt, senza spiegazioni:
`;

    try {
      const response = await callLLM(apiKey, SPECIALIZED_MODELS.atmosphere, imagePrompt, 'atmosfera visiva');
      let prompt = response.replace(/['"]/g, '').trim();
      
      // Aggiungi elementi di qualità cinematografica
      if (!prompt.includes('cinematic')) {
        prompt += ', cinematic';
      }
      
      return prompt.substring(0, 150);
      
    } catch (error) {
      return `emotional ${wizardData.genre?.name} scene, atmospheric lighting, ${wizardData.setting?.name}, cinematic depth`;
    }
  };

  const callLLM = async (apiKey: string, model: string, prompt: string, role: string) => {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'StoryMaster AI'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: `Sei un ${role} di livello mondiale. Crei storie che catturano il lettore emotivamente e lo tengono incollato. Scrivi sempre in italiano con prosa fluida e coinvolgente. Ogni parola deve servire a immergere il lettore.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: role.includes('psicologo') || role.includes('architetto') ? 0.4 : 0.7,
        max_tokens: role.includes('atmosfera') ? 1500 : 2200,
        top_p: 0.9,
        frequency_penalty: 0.3,
        presence_penalty: 0.6
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - Model: ${model}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  };

  const parseEmotionalScene = (content: string, sceneNumber: number, fallbackScene?: any) => {
    const lines = content.split('\n').filter(line => line.trim());
    let title = fallbackScene?.title || `Scena ${sceneNumber}`;
    let sceneContent = '';
    let emotionalState = '';
    let emotionalHook = '';
    let symbols = '';

    // Estrai titolo
    const titleMatch = content.match(/TITOLO[_\s]*(?:EVOCATIVO|RAFFINATO)?:\s*(.+)/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }

    // Estrai contenuto
    const contentMatch = content.match(/CONTENUTO[_\s]*(?:IMMERSIVO|INTENSIFICATO)?:\s*([\s\S]*?)(?=STATO_EMOTIVO|IMPATTO_EMOTIVO|GANCIO_EMOTIVO|$)/i);
    if (contentMatch) {
      sceneContent = contentMatch[1].trim();
    }

    // Estrai stato emotivo
    const stateMatch = content.match(/(?:STATO_EMOTIVO_FINALE|IMPATTO_EMOTIVO_FINALE):\s*(.+)/i);
    if (stateMatch) {
      emotionalState = stateMatch[1].trim();
    }

    // Estrai gancio emotivo
    const hookMatch = content.match(/GANCIO_EMOTIVO:\s*(.+)/i);
    if (hookMatch) {
      emotionalHook = hookMatch[1].trim();
    }

    // Estrai simboli
    const symbolsMatch = content.match(/(?:SIMBOLI_PRESENTI|ELEMENTI_SIMBOLICI):\s*(.+)/i);
    if (symbolsMatch) {
      symbols = symbolsMatch[1].trim();
    }

    // Fallback se il parsing fallisce
    if (!sceneContent || sceneContent.length < 300) {
      sceneContent = fallbackScene?.content || content;
    }

    return {
      id: `scene-${sceneNumber}`,
      title: title,
      content: sceneContent,
      emotionalState: emotionalState,
      emotionalHook: emotionalHook,
      symbols: symbols,
      imagePrompt: '' // Sarà popolato dopo
    };
  };

  const createEmotionalPlaceholder = (sceneNumber: number, sceneStructure: string) => {
    return {
      id: `scene-${sceneNumber}`,
      title: `Scena ${sceneNumber} - Immersione da completare`,
      content: `[SCENA DA RIGENERARE CON FOCUS EMOTIVO]\n\nStruttura richiesta: ${sceneStructure.substring(0, 200)}...`,
      emotionalState: 'Da definire nella rigenerazione',
      emotionalHook: `Collegamento emotivo verso scena ${sceneNumber + 1}`,
      symbols: 'Da identificare',
      imagePrompt: `emotional ${wizardData.genre?.name} placeholder scene`
    };
  };

  const createImmersiveStory = (blueprint: string, scenes: any[], characterProfiles: string) => {
    // Estrai il titolo dal blueprint
    const titleMatch = blueprint.match(/TITOLO_MAGNETICO:\s*(.+)/);
    const title = titleMatch ? titleMatch[1].trim() : 'Storia Immersiva con Personaggi Profondi';

    // Calcola statistiche
    let totalWordCount = 0;
    scenes.forEach(scene => {
      const words = scene.content.split(/\s+/).filter((word: string) => word.length > 0);
      totalWordCount += words.length;
    });

    const estimatedReadingTime = Math.max(1, Math.ceil(totalWordCount / 200));

    const story = {
      id: Date.now().toString(),
      title: title,
      content: scenes.map(scene => scene.content).join('\n\n'),
      scenes: scenes,
      estimatedReadingTime,
      wordCount: totalWordCount,
      immersionLevel: 'Massima', // Indica qualità della continuità
      characterDepth: 'Profonda',
      emotionalImpact: 'Alto',
      blueprint: blueprint, // Conserva la mappa narrativa
      characterProfiles: characterProfiles
    };

    console.log('Storia immersiva completata:', {
      title: story.title,
      scenes: story.scenes.length,
      wordCount: story.wordCount,
      emotionalStates: scenes.map(s => s.emotionalState).filter(Boolean),
      symbolism: scenes.map(s => s.symbols).filter(Boolean)
    });
    
    return story;
  };

  const handleGenerate = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Inserisci la tua API key di OpenRouter per continuare.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress('🧠 Inizializzazione sistema narrativo immersivo...');
    onApiKeySet(apiKey);
    
    try {
      const story = await generateImmersiveStory(apiKey);
      
      toast({
        title: "Storia Immersiva Completata!",
        description: `${story.scenes.length} scene con personaggi profondi e atmosfere coinvolgenti, ${story.wordCount} parole di qualità emotiva!`,
      });

      onStoryGenerated(story);
      
    } catch (error) {
      console.error('Errore nella generazione immersiva:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la generazione immersiva. Controlla la tua API key.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onPrev}
          className="hover:bg-muted/50"
          disabled={isGenerating}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Indietro
        </Button>
      </div>

      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-orange-600/20 rounded-full border border-purple-500/30">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-medium">Sistema Immersivo - 5 LLM Specializzati</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gradient animate-float">
          Storie che Catturano il Cuore
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          5 AI specializzati creano personaggi profondi e atmosfere immersive che rendono impossibile smettere di leggere!
        </p>
      </div>

      {/* Story Summary */}
      <Card className="gradient-dark border-border/50">
        <CardHeader>
          <CardTitle className="text-center">La Tua Storia Immersiva</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Genere:</span>
                <p className="font-semibold">{wizardData.genre?.icon} {wizardData.genre?.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Autore/Stile:</span>
                <p className="font-semibold">{wizardData.author?.icon} {wizardData.author?.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Protagonista:</span>
                <p className="font-semibold">{wizardData.protagonist?.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Antagonista:</span>
                <p className="font-semibold">{wizardData.antagonist?.name}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Ambientazione:</span>
                <p className="font-semibold">{wizardData.setting?.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Trama:</span>
                <p className="font-semibold">{wizardData.plot?.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Stile Visivo:</span>
                <p className="font-semibold">{wizardData.style?.preview} {wizardData.style?.name}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Key Input */}
      <Card className="gradient-dark border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            OpenRouter API Key
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="apikey">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="apikey"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="bg-input/50"
                disabled={isGenerating}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowApiKey(!showApiKey)}
                disabled={isGenerating}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-3">🎭 Sistema Immersivo con 5 LLM Specializzati:</h4>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">1</div>
                <div>
                  <div className="font-medium text-purple-300">LLM Psicologo</div>
                  <div className="text-muted-foreground">Crea profili psicologici profondi e autentici</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">2</div>
                <div>
                  <div className="font-medium text-blue-300">LLM Architetto Emotivo</div>
                  <div className="text-muted-foreground">Costruisce archi emotivi irresistibili</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">3</div>
                <div>
                  <div className="font-medium text-green-300">LLM Atmosfera</div>
                  <div className="text-muted-foreground">Crea ambientazioni sensoriali immersive</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">4</div>
                <div>
                  <div className="font-medium text-orange-300">LLM Scrittore Immersivo</div>
                  <div className="text-muted-foreground">Scrive scene che catturano il lettore</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs">5</div>
                <div>
                  <div className="font-medium text-red-300">LLM Editor Emotivo</div>
                  <div className="text-muted-foreground">Massimizza l'impatto emotivo finale</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">💝 Garanzie di Immersione Totale:</h4>
            <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Personaggi con psicologie complesse e realistiche
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                Atmosfere sensoriali che immergono completamente
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Archi emotivi che creano dipendenza dalla lettura
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Dialoghi autentici che rivelano personalità
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Simbolismo profondo che arricchisce la narrazione
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Cliffhanger emotivi impossibili da ignorare
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">🔗 Come ottenere la tua API Key:</h4>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1. Vai su <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">openrouter.ai</a></li>
              <li>2. Crea un account o accedi</li>
              <li>3. Vai nelle impostazioni API</li>
              <li>4. Genera una nuova API Key</li>
              <li>5. Incolla la chiave qui sopra</li>
            </ol>
          </div>

          {generationProgress && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">{generationProgress}</span>
              </div>
            </div>
          )}

          <Button 
            onClick={handleGenerate}
            disabled={!apiKey || isGenerating}
            className="w-full gradient-primary hover:opacity-90 transition-opacity"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creazione Storia Immersiva...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Genera Storia Immersiva (6 scene con personaggi profondi)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoryGeneration;
