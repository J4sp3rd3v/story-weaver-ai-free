
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

// Modelli AI specializzati per ruoli specifici - AGGIORNATI CON MODELLI DISPONIBILI 2024
const SPECIALIZED_MODELS = {
  architect: 'meta-llama/llama-3.3-70b-instruct:free', // Struttura e continuità narrativa
  psychologist: 'deepseek/deepseek-chat-v3-0324:free', // Sviluppo psicologico personaggi
  writer: 'google/gemini-2.0-flash-exp:free',        // Scrittura scene coinvolgenti
  atmosphere: 'google/gemma-3-27b-it:free',    // Creazione atmosfera immersiva
  editor: 'qwen/qwq-32b:free'                  // Revisione finale e collegamenti
};

const FALLBACK_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'deepseek/deepseek-chat-v3-0324:free',
  'google/gemini-2.0-flash-exp:free',
  'google/gemma-3-27b-it:free'
];

// Sistema di rate limiting per evitare 429
const MODEL_USAGE_TRACKER = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minuto
const MAX_REQUESTS_PER_MINUTE = 10;

// Funzione per scegliere il modello meno utilizzato
const getLeastUsedModel = (models: string[]) => {
  const now = Date.now();
  let leastUsedModel = models[0];
  let minUsage = Infinity;
  
  for (const model of models) {
    const usage = MODEL_USAGE_TRACKER.get(model) || [];
    const recentUsage = usage.filter((timestamp: number) => now - timestamp < RATE_LIMIT_WINDOW);
    
    if (recentUsage.length < minUsage) {
      minUsage = recentUsage.length;
      leastUsedModel = model;
    }
  }
  
  return leastUsedModel;
};

// Funzione per validare la qualità del contenuto
const validateContentQuality = (content: string): boolean => {
  if (!content || content.length < 50) return true;
  
  // Conta caratteri di punteggiatura vs lettere
  const punctuationCount = (content.match(/[.,;:!?*"'`]/g) || []).length;
  const letterCount = (content.match(/[a-zA-ZàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽž]/g) || []).length;
  
  // Se più del 40% è punteggiatura, è spazzatura
  if (punctuationCount > letterCount * 0.4) {
    console.warn(`🗑️ Troppa punteggiatura: ${punctuationCount}/${letterCount}`);
    return true;
  }
  
  // Controlla pattern di spazzatura
  const garbagePatterns = [
    /^\s*[*".,;:!?\s]+$/,  // Solo punteggiatura e spazi
    /^[\s*"'.,;:!?]{20,}/, // Inizio con troppa punteggiatura
    /[*]{3,}/,             // Troppi asterischi consecutivi
    /["']{3,}/,            // Troppe virgolette consecutive
    /[.,;:!?]{5,}/,        // Troppa punteggiatura consecutiva
    /^\s*["*\s.,;:!?]+\s*$/ // Solo caratteri speciali
  ];
  
  for (const pattern of garbagePatterns) {
    if (pattern.test(content)) {
      console.warn(`🗑️ Pattern spazzatura rilevato: ${pattern}`);
      return true;
    }
  }
  
  // Controlla se ha parole italiane valide
  const italianWords = content.match(/\b[a-zA-ZàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽž]{3,}\b/g) || [];
  
  if (italianWords.length < 10) {
    console.warn(`🗑️ Troppe poche parole valide: ${italianWords.length}`);
    return true;
  }
  
  return false;
};

// Funzione per pulire e validare il contenuto
const cleanAndValidateContent = (content: string): string => {
  if (!content) return '';
  
  let cleaned = content
    // Rimuovi caratteri non latini
    .replace(/[\u4e00-\u9fff\u3400-\u4dbf\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2b820-\u2ceaf]/g, '')
    // Rimuovi sequenze eccessive di punteggiatura
    .replace(/[*]{3,}/g, '...')
    .replace(/["']{3,}/g, '"')
    .replace(/[.,;:!?]{3,}/g, '.')
    // Rimuovi spazi multipli
    .replace(/\s{3,}/g, ' ')
    // Rimuovi righe vuote multiple
    .replace(/\n{3,}/g, '\n\n')
    // Rimuovi asterischi isolati
    .replace(/\s\*\s/g, ' ')
    .replace(/^\*+\s*/gm, '')
    .replace(/\s*\*+$/gm, '')
    // Pulisci virgolette malformate
    .replace(/"\s*"/g, '')
    .replace(/'\s*'/g, '')
    // Rimuovi pattern di spazzatura comuni
    .replace(/^[\s*"'.,;:!?]+/gm, '')
    .replace(/[\s*"'.,;:!?]+$/gm, '')
    .trim();
  
  // Se dopo la pulizia è troppo corto o ancora spazzatura, restituisci placeholder
  if (cleaned.length < 100 || validateContentQuality(cleaned)) {
    console.warn('🔧 Contenuto ancora corrotto dopo pulizia, uso placeholder');
    return 'CONTENUTO_DA_RIGENERARE: Il modello AI ha prodotto contenuto corrotto. Riprovare la generazione.';
  }
  
  return cleaned;
};



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

REGOLE_NOMI_E_LINGUA:
1. USA SOLO ITALIANO PURO - niente parole straniere o caratteri non latini
2. NOMI CARATTERISTICI DELL'AUTORE - adatta i nomi allo stile di ${wizardData.author?.name}
3. ESEMPI_NOMI_PER_AUTORE:
   - Stephen King: Jack, Danny, Carrie, Paul, Annie, Ben, Beverly, Wendy
   - Agatha Christie: Hercule, Miss Marple, Hastings, Poirot, nomi inglesi classici
   - George R.R. Martin: Tyrion, Arya, Jon, Cersei, Daenerys, nomi fantasy
   - Edgar Allan Poe: Edgar, Roderick, Ligeia, Morella, nomi gotici
   - Arthur Conan Doyle: Sherlock, Watson, Mycroft, Lestrade, nomi vittoriani
   - Dan Brown: Robert, Sophie, Langdon, nomi americani moderni
4. NOMI COERENTI con ambientazione, epoca e nazionalità della storia
5. COGNOMI SPECIFICI che riflettano background culturale
6. EVITA nomi generici come "Luca", "Marco", "Anna", "Giuseppe" a meno che non siano tipici dell'autore

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

STRUTTURA_NARRATIVA_6_SCENE:

SCENA_1: "L'Introduzione Coinvolgente"
OBIETTIVO_NARRATIVO: Presentare protagonista e situazione iniziale
SITUAZIONE_INIZIALE: [Situazione normale del protagonista]
ELEMENTO_SCATENANTE: [Evento che innesca la storia]
CONFLITTO_INTRODOTTO: [Primo ostacolo o problema]
INFORMAZIONI_CHIAVE: [Cosa deve sapere il lettore]
TRANSIZIONE_VERSO_SCENA_2: [Come si collega alla scena successiva]
EMOZIONE_DOMINANTE: [Emozione principale da trasmettere]

SCENA_2: "Lo Sviluppo del Conflitto"
APPROFONDIMENTO_PERSONAGGIO: [Mostra più aspetti del protagonista]
COMPLICAZIONE_PRINCIPALE: [Il problema si intensifica]
NUOVI_OSTACOLI: [Sfide aggiuntive che emergono]
INTRODUZIONE_ANTAGONISTA: [Prima apparizione del conflitto principale]
CRESCITA_TENSIONE: [Come aumenta lo stake]
TRANSIZIONE_VERSO_SCENA_3: [Collegamento logico alla scena successiva]
EMOZIONE_DOMINANTE: [Tensione, preoccupazione, determinazione]

SCENA_3: "Il Primo Climax"
CONFRONTO_INIZIALE: [Prima battaglia/confronto importante]
RIVELAZIONE_IMPORTANTE: [Informazione che cambia la prospettiva]
PERDITA_O_VITTORIA: [Risultato del confronto]
CONSEGUENZE_AZIONI: [Effetti delle scelte del protagonista]
CAMBIO_DINAMICHE: [Come si modifica la situazione]
TRANSIZIONE_VERSO_SCENA_4: [Setup per la scena successiva]
EMOZIONE_DOMINANTE: [Shock, realizzazione, svolta]

SCENA_4: "La Crisi Profonda"
MOMENTO_PIÙ_BUIO: [Quando tutto sembra perduto]
DUBBI_PROTAGONISTA: [Crisi interna del personaggio]
PROVE_DIFFICILI: [Sfide che testano il carattere]
RIVELAZIONI_DOLOROSE: [Verità difficili da accettare]
DECISIONE_CRUCIALE: [Scelta che determina il futuro]
TRANSIZIONE_VERSO_SCENA_5: [Come si prepara la rinascita]
EMOZIONE_DOMINANTE: [Disperazione, dubbio, riflessione]

SCENA_5: "La Rinascita e l'Azione"
DECISIONE_FINALE: [Il protagonista sceglie come agire]
PIANO_O_STRATEGIA: [Come affronta la sfida finale]
GATHERING_FORZE: [Preparazione per il confronto finale]
SUPERAMENTO_PAURE: [Come supera i suoi limiti]
MOVIMENTO_VERSO_CLIMAX: [Preparazione al confronto finale]
TRANSIZIONE_VERSO_SCENA_6: [Setup per la risoluzione]
EMOZIONE_DOMINANTE: [Determinazione, coraggio, speranza]

SCENA_6: "La Risoluzione"
CONFRONTO_FINALE: [Risoluzione del conflitto principale]
RISULTATO_DEFINITIVO: [Come si conclude la storia]
TRASFORMAZIONE_PROTAGONISTA: [Come è cambiato il personaggio]
NUOVO_EQUILIBRIO: [La nuova situazione normale]
MESSAGGIO_FINALE: [Cosa impara il lettore]
CHIUSURA_SODDISFACENTE: [Senso di completezza]
EMOZIONE_DOMINANTE: [Soddisfazione, catarsi, pace]

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
        // Pausa più lunga per evitare rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (error) {
        console.error(`Errore nella scena ${i + 1}:`, error);
        
        try {
          // Primo tentativo: fallback con modello diverso
          const fallbackModel = getLeastUsedModel(FALLBACK_MODELS);
          console.log(`🔄 Tentativo fallback scena ${i + 1} con ${fallbackModel}`);
          
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
          console.error(`❌ Fallback fallito per scena ${i + 1}:`, fallbackError);
          
          try {
            // Secondo tentativo: prompt semplificato
            console.log(`🔧 Tentativo con prompt semplificato per scena ${i + 1}`);
            const simpleContent = await generateSimpleScene(apiKey, i + 1, sceneStructure, scenes);
            scenes.push(simpleContent);
            
          } catch (simpleError) {
            console.error(`❌ Anche prompt semplificato fallito per scena ${i + 1}`);
            scenes.push(createEmotionalPlaceholder(i + 1, sceneStructure));
          }
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
    
    // Crea contesto di continuità dettagliato dalle scene precedenti
    const continuityContext = previousScenes.length > 0 
      ? `CONTINUITÀ_NARRATIVA_OBBLIGATORIA:
${previousScenes.map((scene, idx) => 
  `Scena ${idx + 1}: "${scene.title}"
  SITUAZIONE_FINALE: ${scene.emotionalHook || 'Situazione in sviluppo'}
  STATO_PROTAGONISTA: ${scene.emotionalState || 'Stato emotivo in evoluzione'}
  ELEMENTI_DA_CONTINUARE: ${scene.symbols || 'Elementi narrativi presenti'}
  ULTIMO_PARAGRAFO: "${scene.content.split('\n').filter(p => p.trim().length > 50).slice(-1)[0] || 'Continuità da stabilire'}"
  `
).join('\n\n')}

REGOLE_CONTINUITÀ:
1. La scena ${sceneNumber} DEVE collegarsi logicamente alla situazione finale della scena ${sceneNumber - 1}
2. Il protagonista DEVE mostrare coerenza emotiva con lo stato precedente
3. NON introdurre nuovi elementi senza collegamento alle scene precedenti
4. Rispettare la progressione temporale stabilita
5. Mantenere lo stesso tono e stile narrativo`
      : `Prima scena - STABILISCI:
1. Situazione iniziale chiara del protagonista
2. Ambientazione specifica e dettagliata
3. Tono narrativo coerente con genere e stile
4. Elemento scatenante della storia
5. Gancio per la scena successiva`;

    const immersivePrompt = `
Sei uno SCRITTORE PROFESSIONISTA. Scrivi scene STRUTTURATE e COERENTI che rispettano la narrativa precedente.

PROFILI_PSICOLOGICI:
${characterProfiles}

BLUEPRINT_EMOTIVO:
${fullBlueprint}

ATMOSFERE_SENSORIALI:
${atmosphericElements}

${continuityContext}

SCENA_DA_SCRIVERE:
${sceneStructure}

REGOLE_NARRATIVE_OBBLIGATORIE:
1. MANTIENI COERENZA con personaggi e situazioni precedenti
2. STRUTTURA CHIARA: Inizio-Sviluppo-Climax-Transizione
3. CONTINUITÀ LOGICA: Collega fluidamente alla scena precedente
4. DIALOGHI REALISTICI: Massimo 3-4 battute per volta
5. DESCRIZIONI BILANCIATE: Non sovraccaricare, alternare azione-descrizione
6. RITMO CONTROLLATO: Paragrafi di 3-5 righe massimo
7. PROGRESSIONE EMOTIVA: Un'emozione principale per scena
8. TRANSIZIONE FLUIDA: Prepara la scena successiva senza forzature

REGOLE_LINGUA_E_NOMI_RIGIDE:
1. SOLO ITALIANO CORRETTO - nessuna parola straniera, nessun carattere non latino
2. NOMI TIPICI DELL'AUTORE ${wizardData.author?.name || 'scelto'}:
   - Stephen King: Jack, Danny, Carrie, Paul, Annie, Ben, Beverly, Wendy
   - Agatha Christie: Hercule, Miss Marple, Hastings, Poirot, nomi inglesi
   - George R.R. Martin: Tyrion, Arya, Jon, Cersei, Daenerys, nomi fantasy
   - Edgar Allan Poe: Edgar, Roderick, Ligeia, Morella, nomi gotici
   - Altri autori: nomi coerenti con il loro stile letterario
3. EVITA nomi generici come "Luca", "Marco", "Anna" TRANNE se tipici dell'autore
4. COERENZA CULTURALE - nomi che riflettano l'ambientazione geografica
5. CORREZIONE AUTOMATICA - se scrivi caratteri strani, riscrivi in italiano puro

REGOLE_PUNTEGGIATURA_TTS (OBBLIGATORIE):
1. PUNTI E VIRGOLE: Usa ";" per pause enfatiche che creano suspense
2. VIRGOLE STRATEGICHE: Usa "," per creare ritmo e respiro naturale
3. PUNTI FERMI: Usa "." per conclusioni decise e momenti di impatto
4. DUE PUNTI: Usa ":" per introdurre rivelazioni o momenti drammatici
5. PUNTI ESCLAMATIVI: Usa "!" solo per momenti di vero shock o emozione intensa
6. PUNTI INTERROGATIVI: Usa "?" per creare suspense e coinvolgimento
7. PUNTINI SOSPENSIVI: Usa "..." per pause cariche di tensione (massimo 1 per paragrafo)
8. TRATTINI: Usa "—" per interruzioni drammatiche nel discorso

ESEMPI_PUNTEGGIATURA_TTS:
- SUSPENSE: "Lo sguardo si fermò sulla porta; qualcosa non andava."
- ENFASI: "Era lui: l'uomo che aveva cambiato tutto."
- RITMO: "Camminava lentamente, cautamente, come un predatore."
- TENSIONE: "Si voltò... e vide quello che temeva di più."

STRUTTURA_OBBLIGATORIA:
- PARAGRAFO 1: Collegamento alla scena precedente (se non è la prima)
- PARAGRAFI 2-3: Introduzione situazione/conflitto
- PARAGRAFI 4-5: Sviluppo con dialoghi o azioni
- PARAGRAFI 6-7: Climax emotivo della scena
- PARAGRAFO 8: Risoluzione parziale e gancio per la prossima scena

REGOLE_DIALOGHI_TTS:
1. ATTRIBUZIONI CHIARE: Sempre "disse Marco" non solo "disse"
2. PAUSE NATURALI: Inserisci virgole per respiro naturale nei dialoghi
3. EMOZIONI EXPLICIT: "disse con rabbia", "sussurrò nervosamente"
4. INTERRUZIONI: Usa "—" per dialoghi interrotti o sovrapposti
5. ENFASI VOCALE: Usa corsivo per parole da enfatizzare
6. SILENZIO: Descrivi pause significative "Rimase in silenzio per un momento"

LUNGHEZZA: 800-1000 parole, scritte con prosa fluida e leggibile per TTS

FORMATO_RISPOSTA OBBLIGATORIO:
TITOLO_EVOCATIVO: [Titolo chiaro della scena]

CONTENUTO_IMMERSIVO:
[Scena scritta seguendo la struttura obbligatoria sopra]

STATO_EMOTIVO_FINALE: [Emozione principale del protagonista alla fine]

GANCIO_EMOTIVO: [Una frase che collega alla scena successiva]

SIMBOLI_PRESENTI: [Massimo 2 elementi simbolici, specifici]

RISPETTA RIGOROSAMENTE questa struttura. Non aggiungere elementi non richiesti.
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
8. OTTIMIZZA PUNTEGGIATURA per sintetizzatori vocali (TTS)

TECNICHE_RAFFINAMENTO:
- Sostituisci aggettivi generici con dettagli specifici
- Trasforma esposizione in azione drammatica
- Aggiungi layer di significato attraverso gesti e sguardi
- Intensifica conflitto interno del protagonista
- Rendi ogni dialogo multi-livello (superficie + sottotesto)
- Usa pause e silenzi per creare tensione

PERFEZIONAMENTO_PUNTEGGIATURA_TTS:
- Sostituisci frasi lunghe con punti e virgole strategici
- Aggiungi virgole per creare ritmo respiratorio naturale
- Usa due punti prima di rivelazioni importanti
- Inserisci trattini per interruzioni drammatiche
- Bilancia puntini sospensivi per massima tensione
- Ottimizza ogni frase per la lettura vocale fluida

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

  // Funzione helper per creare prompt specifici dal contenuto
  const createSpecificImagePrompt = (scene: any, wizardData: any) => {
    const content = scene.content.toLowerCase();
    let prompt = "";
    let character = "person";
    let action = "";
    let environment = "";
    let objects = "";
    let emotion = "";
    
    // Identifica il personaggio principale se menzionato
    const nameMatch = content.match(/(jack|danny|carrie|paul|ben|marco|luca|anna|giuseppe|maria)\s/i);
    if (nameMatch) {
      character = nameMatch[1].toLowerCase() === 'jack' || nameMatch[1].toLowerCase() === 'danny' ? "man" : 
                  nameMatch[1].toLowerCase() === 'carrie' || nameMatch[1].toLowerCase() === 'anna' ? "woman" : "person";
    }
    
    // Identifica azioni specifiche
    if (content.includes('porta') && (content.includes('chiud') || content.includes('control'))) {
      action = "checking door lock repeatedly";
    } else if (content.includes('telefon') && content.includes('squilla')) {
      action = "answering ringing phone with hesitation";
    } else if (content.includes('specchio') && content.includes('guard')) {
      action = "staring at reflection in mirror";
    } else if (content.includes('finestra') && content.includes('guard')) {
      action = "looking out window into darkness";
    } else if (content.includes('letto') && content.includes('svegl')) {
      action = "sitting up in bed after waking";
    } else if (content.includes('cammin') && content.includes('corridor')) {
      action = "walking through dark hallway";
    } else if (content.includes('scritt') || content.includes('computer')) {
      action = "typing at computer screen";
    } else {
      action = "standing with tense posture";
    }
    
    // Ambiente specifico
    if (content.includes('appartament') || content.includes('casa')) {
      environment = "inside dimly lit apartment";
    } else if (content.includes('cucina')) {
      environment = "in modern kitchen";
    } else if (content.includes('bagno')) {
      environment = "in small bathroom";
    } else if (content.includes('studio') || content.includes('ufficio')) {
      environment = "in home office";
    } else if (content.includes('salon') || content.includes('soggiorn')) {
      environment = "in living room";
    } else if (content.includes('camera') || content.includes('letto')) {
      environment = "in dark bedroom";
    } else {
      environment = "in shadowy interior space";
    }
    
    // Oggetti specifici
    if (content.includes('telefon')) objects += "telephone on table, ";
    if (content.includes('computer') || content.includes('schermo')) objects += "glowing computer screen, ";
    if (content.includes('specchio')) objects += "large mirror on wall, ";
    if (content.includes('finestra')) objects += "window with venetian blinds, ";
    if (content.includes('porta')) objects += "wooden door with multiple locks, ";
    if (content.includes('lamp')) objects += "single desk lamp, ";
    
    // Espressione emotiva
    if (scene.emotionalState?.includes('ansios') || content.includes('ansia')) {
      emotion = "anxious expression, sweaty forehead, clenched fists";
    } else if (scene.emotionalState?.includes('paur') || content.includes('paura')) {
      emotion = "fearful eyes, pale complexion, tense shoulders";
    } else if (scene.emotionalState?.includes('confus') || content.includes('confus')) {
      emotion = "confused look, furrowed brow, uncertain gesture";
    } else {
      emotion = "worried expression, tired eyes";
    }
    
    // Costruisci il prompt finale
    prompt = `${character} ${action}, ${environment}, ${objects}${emotion}, dramatic lighting with harsh shadows, psychological thriller atmosphere, cinematic realism, high detail`;
    
    return prompt;
  };

  const generateAtmosphericImagePrompt = async (apiKey: string, scene: any, atmosphericElements: string) => {
    const imagePrompt = `
Analizza DETTAGLIATAMENTE questa scena e crea un prompt visivo SPECIFICO per Stable Diffusion:

TITOLO_SCENA: ${scene.title}
CONTENUTO_COMPLETO: ${scene.content}
EMOZIONE_DOMINANTE: ${scene.emotionalState || ''}
SIMBOLI_PRESENTI: ${scene.symbols || ''}

ESTRAI ELEMENTI SPECIFICI:
1. CHI: Quali personaggi sono presenti? Che aspetto hanno? Cosa indossano?
2. DOVE: Ambiente specifico (non generico). Che stanza? Che mobili? Che oggetti?
3. COSA: Azione specifica che sta succedendo in quel momento
4. COME: Posizione dei personaggi, espressioni facciali, gesti
5. QUANDO: Ora del giorno, tipo di illuminazione
6. DETTAGLI: Oggetti specifici menzionati (telefono, tazza, porta, specchio, ecc.)

CREA PROMPT DETTAGLIATO CHE INCLUDA:
- Personaggio specifico in azione specifica
- Ambiente dettagliato con oggetti menzionati
- Illuminazione che riflette l'emozione
- Dettagli visivi specifici dal testo
- Stile fotografico/cinematografico appropriato

FORMATO: Prompt di 150-200 caratteri in inglese, molto specifico e dettagliato

ESEMPIO BUONO: "Man with scar on wrist sitting in dark apartment, checking door lock repeatedly, anxious expression, dim lamp light, shadows on wall, psychological tension, cinematic realism"

ESEMPIO CATTIVO: "emotional horror scene, atmospheric lighting, modern city"

Scrivi SOLO il prompt finale dettagliato:
`;

    try {
      const response = await callLLM(apiKey, SPECIALIZED_MODELS.atmosphere, imagePrompt, 'atmosfera visiva');
      let prompt = response.replace(/['"]/g, '').trim();
      
      // Valida che il prompt sia specifico, non generico
      const genericTerms = ['emotional', 'atmospheric', 'cinematic', 'modern city', 'scene', 'lighting'];
      const isGeneric = genericTerms.some(term => 
        prompt.toLowerCase().includes(term) && prompt.split(' ').length < 15
      );
      
      // Se il prompt è troppo generico, crea uno basato sul contenuto
      if (isGeneric || prompt.length < 80) {
        prompt = createSpecificImagePrompt(scene, wizardData);
      }
      
      // Aggiungi elementi di qualità cinematografica
      if (!prompt.includes('cinematic')) {
        prompt += ', cinematic';
      }
      
      return prompt.substring(0, 150);
      
    } catch (error) {
      return `emotional ${wizardData.genre?.name} scene, atmospheric lighting, ${wizardData.setting?.name}, cinematic depth`;
    }
  };

  const callLLM = async (apiKey: string, model: string, prompt: string, role: string, retryCount = 0) => {
    const maxRetries = 3;
    const fallbackModels = FALLBACK_MODELS.filter(m => m !== model);
    
    // Controllo rate limiting
    const now = Date.now();
    const modelUsage = MODEL_USAGE_TRACKER.get(model) || [];
    const recentRequests = modelUsage.filter((timestamp: number) => now - timestamp < RATE_LIMIT_WINDOW);
    
    if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
      console.warn(`⚠️ Rate limit preventivo per ${model}, uso fallback`);
      if (fallbackModels.length > 0) {
        const fallbackModel = getLeastUsedModel(fallbackModels);
        console.log(`🔄 Scelto modello meno utilizzato: ${fallbackModel}`);
        return await callLLM(apiKey, fallbackModel, prompt, role, retryCount);
      }
    }
    
    // Aggiorna tracker
    recentRequests.push(now);
    MODEL_USAGE_TRACKER.set(model, recentRequests);
    
    try {
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
        // Gestione specifica per errore 429 (Rate Limit)
        if (response.status === 429) {
          console.warn(`⚠️ Rate limit raggiunto per ${model}, tentativo ${retryCount + 1}/${maxRetries}`);
          
          // Se abbiamo ancora tentativi, prova con un modello diverso
          if (retryCount < maxRetries && fallbackModels.length > 0) {
            const fallbackModel = getLeastUsedModel(fallbackModels);
            console.log(`🔄 Fallback al modello meno utilizzato: ${fallbackModel}`);
            
            // Aggiorna il progresso per informare l'utente
            setGenerationProgress(`⚠️ Modello sovraccarico, passando a ${fallbackModel.split('/')[1]}...`);
            
            // Attesa progressiva: 3s, 6s, 9s
            const waitTime = (retryCount + 1) * 3000;
            await new Promise(resolve => setTimeout(resolve, waitTime));
            
            return await callLLM(apiKey, fallbackModel, prompt, role, retryCount + 1);
          }
        }
        
        throw new Error(`HTTP error! status: ${response.status} - Model: ${model}`);
      }

      const data = await response.json();
      let content = data.choices[0]?.message?.content || '';
      
      // VALIDAZIONE CRITICA: Controlla se il contenuto è spazzatura
      const isGarbage = validateContentQuality(content);
      if (isGarbage) {
        console.error(`🗑️ Contenuto spazzatura rilevato da ${model}`);
        
        // Se è spazzatura, forza il fallback
        if (retryCount < maxRetries && fallbackModels.length > 0) {
          const fallbackModel = getLeastUsedModel(fallbackModels);
          console.log(`🔄 Rigenerazione con ${fallbackModel} per contenuto corrotto`);
          setGenerationProgress(`🔧 Contenuto corrotto, rigenerando con ${fallbackModel.split('/')[1]}...`);
          
          await new Promise(resolve => setTimeout(resolve, 2000));
          return await callLLM(apiKey, fallbackModel, prompt, role, retryCount + 1);
        }
      }
      
      // Pulizia robusta del contenuto
      content = cleanAndValidateContent(content);
      
      if (retryCount > 0) {
        console.log(`✅ Successo con fallback dopo ${retryCount} tentativi`);
      }
      
      return content;
      
    } catch (error) {
      console.error(`❌ Errore con modello ${model}:`, error);
      
      // Se è un errore di rete o altro, prova comunque il fallback
      if (retryCount < maxRetries && fallbackModels.length > 0) {
        const fallbackModel = fallbackModels[retryCount % fallbackModels.length];
        console.log(`🔄 Tentativo fallback per errore: ${fallbackModel}`);
        
        const waitTime = (retryCount + 1) * 2000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        return await callLLM(apiKey, fallbackModel, prompt, role, retryCount + 1);
      }
      
      throw error;
    }
  };

  // Funzione di emergenza per generare scene con prompt semplificato
  const generateSimpleScene = async (apiKey: string, sceneNumber: number, sceneStructure: string, previousScenes: any[]) => {
    const simplePrompt = `
Scrivi una scena semplice e chiara in italiano per una storia.

SCENA ${sceneNumber} di 6

STRUTTURA RICHIESTA:
${sceneStructure.substring(0, 300)}

SCENE PRECEDENTI:
${previousScenes.map((scene, idx) => `Scena ${idx + 1}: ${scene.title}`).join('\n')}

REGOLE SEMPLICI:
1. Scrivi SOLO in italiano corretto
2. Lunghezza: 400-600 parole
3. Struttura: Inizio-Sviluppo-Fine
4. Niente caratteri strani o simboli
5. Storia coerente con le scene precedenti

FORMATO:
TITOLO: [Titolo della scena]

CONTENUTO:
[Scrivi qui la scena in italiano semplice e chiaro]

EMOZIONE: [Emozione principale]
`;

    const response = await callLLM(apiKey, getLeastUsedModel(FALLBACK_MODELS), simplePrompt, 'scrittore semplice');
    
    // Parsing semplificato
    let title = `Scena ${sceneNumber}`;
    let content = '';
    let emotion = 'Tensione narrativa';
    
    const titleMatch = response.match(/TITOLO:\s*(.+)/i);
    if (titleMatch) {
      title = titleMatch[1].trim().replace(/["']/g, '');
    }
    
    const contentMatch = response.match(/CONTENUTO:\s*([\s\S]*?)(?=EMOZIONE:|$)/i);
    if (contentMatch) {
      content = contentMatch[1].trim();
    }
    
    const emotionMatch = response.match(/EMOZIONE:\s*(.+)/i);
    if (emotionMatch) {
      emotion = emotionMatch[1].trim().replace(/["']/g, '');
    }
    
    // Se il contenuto è ancora troppo corto, crea un placeholder decente
    if (!content || content.length < 200) {
      content = `La storia continua con eventi che si sviluppano gradualmente. I personaggi affrontano nuove sfide mentre la trama procede verso il suo climax. Ogni momento è carico di tensione e significato, portando il lettore sempre più in profondità nella narrazione.

Gli eventi si susseguono con un ritmo incalzante, mentre i protagonisti devono fare i conti con le conseguenze delle loro azioni precedenti. La situazione si complica ulteriormente, creando nuovi ostacoli da superare.

Il destino dei personaggi sembra appeso a un filo, mentre le forze in gioco si preparano per il confronto finale. Ogni decisione potrebbe cambiare il corso degli eventi in modo irreversibile.`;
    }
    
    // Pulizia finale
    content = cleanAndValidateContent(content);
    
    return {
      id: `scene-${sceneNumber}`,
      title: title,
      content: content,
      emotionalState: emotion,
      emotionalHook: `Collegamento verso scena ${sceneNumber + 1}`,
      symbols: 'Elementi narrativi di continuità',
      imagePrompt: ''
    };
  };

  // Funzioni helper per nomi appropriati all'autore
  const getAuthorAppropiateName = (gender: 'male' | 'female'): string => {
    const authorName = wizardData.author?.name?.toLowerCase() || '';
    
    if (authorName.includes('stephen king')) {
      return gender === 'male' ? ['Jack', 'Danny', 'Paul', 'Ben'][Math.floor(Math.random() * 4)] 
                                : ['Carrie', 'Annie', 'Beverly', 'Wendy'][Math.floor(Math.random() * 4)];
    }
    if (authorName.includes('agatha christie')) {
      return gender === 'male' ? ['Hercule', 'Hastings', 'Inspector'][Math.floor(Math.random() * 3)]
                                : ['Miss Marple', 'Ariadne', 'Jane'][Math.floor(Math.random() * 3)];
    }
    if (authorName.includes('george martin') || authorName.includes('r.r. martin')) {
      return gender === 'male' ? ['Tyrion', 'Jon', 'Jaime', 'Robb'][Math.floor(Math.random() * 4)]
                                : ['Arya', 'Cersei', 'Daenerys', 'Sansa'][Math.floor(Math.random() * 4)];
    }
    if (authorName.includes('edgar allan poe')) {
      return gender === 'male' ? ['Edgar', 'Roderick', 'William'][Math.floor(Math.random() * 3)]
                                : ['Ligeia', 'Morella', 'Berenice'][Math.floor(Math.random() * 3)];
    }
    if (authorName.includes('arthur conan doyle')) {
      return gender === 'male' ? ['Sherlock', 'Watson', 'Mycroft', 'Lestrade'][Math.floor(Math.random() * 4)]
                                : ['Irene', 'Mary', 'Mrs. Hudson'][Math.floor(Math.random() * 3)];
    }
    
    // Default per autori italiani o altri
    return gender === 'male' ? ['Adriano', 'Damiano', 'Emilio', 'Silvano'][Math.floor(Math.random() * 4)]
                              : ['Celeste', 'Isadora', 'Valentina', 'Serafina'][Math.floor(Math.random() * 4)];
  };

  const getAuthorAppropriateSurname = (): string => {
    const authorName = wizardData.author?.name?.toLowerCase() || '';
    
    if (authorName.includes('stephen king')) {
      return ['Torrance', 'Chambers', 'Creed', 'White'][Math.floor(Math.random() * 4)];
    }
    if (authorName.includes('agatha christie')) {
      return ['Poirot', 'Marple', 'Christie', 'Hastings'][Math.floor(Math.random() * 4)];
    }
    if (authorName.includes('arthur conan doyle')) {
      return ['Holmes', 'Watson', 'Moriarty', 'Lestrade'][Math.floor(Math.random() * 4)];
    }
    
    return ['Meridiani', 'Selvaggio', 'Monteverdi', 'Bellavista'][Math.floor(Math.random() * 4)];
  };

  const parseEmotionalScene = (content: string, sceneNumber: number, fallbackScene?: any) => {
    const lines = content.split('\n').filter(line => line.trim());
    let title = fallbackScene?.title || `Scena ${sceneNumber}`;
    let sceneContent = '';
    let emotionalState = '';
    let emotionalHook = '';
    let symbols = '';

    // Estrai titolo con pattern più flessibile
    const titleMatch = content.match(/TITOLO[_\s]*(?:EVOCATIVO|RAFFINATO|CHIARO)?:\s*(.+)/i);
    if (titleMatch) {
      title = titleMatch[1].trim()
        .replace(/["']/g, '')
        // Pulisci caratteri non latini dal titolo
        .replace(/[\u4e00-\u9fff\u3400-\u4dbf\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2b820-\u2ceaf]/g, '')
        // Sostituisci nomi comuni nei titoli
        .replace(/\bLuca\b/g, 'Adriano')
        .replace(/\bMarco\b/g, 'Damiano');
    }

    // Estrai contenuto con pattern più robusto
    const contentMatch = content.match(/CONTENUTO[_\s]*(?:IMMERSIVO|INTENSIFICATO)?:\s*([\s\S]*?)(?=STATO_EMOTIVO|IMPATTO_EMOTIVO|GANCIO_EMOTIVO|SIMBOLI_PRESENTI|$)/i);
    if (contentMatch) {
      sceneContent = contentMatch[1].trim();
    }

    // Se non trova il contenuto strutturato, prende tutto dopo il titolo
    if (!sceneContent && content.includes('TITOLO')) {
      const afterTitle = content.split(/TITOLO[_\s]*(?:EVOCATIVO|RAFFINATO|CHIARO)?:\s*.+/i)[1];
      if (afterTitle) {
        const beforeMeta = afterTitle.split(/(?:STATO_EMOTIVO|GANCIO_EMOTIVO|SIMBOLI_PRESENTI)/i)[0];
        sceneContent = beforeMeta.trim();
      }
    }

    // Estrai stato emotivo
    const stateMatch = content.match(/(?:STATO_EMOTIVO_FINALE|IMPATTO_EMOTIVO_FINALE):\s*(.+)/i);
    if (stateMatch) {
      emotionalState = stateMatch[1].trim().replace(/["']/g, '');
    }

    // Estrai gancio emotivo
    const hookMatch = content.match(/GANCIO_EMOTIVO:\s*(.+)/i);
    if (hookMatch) {
      emotionalHook = hookMatch[1].trim().replace(/["']/g, '');
    }

    // Estrai simboli
    const symbolsMatch = content.match(/(?:SIMBOLI_PRESENTI|ELEMENTI_SIMBOLICI):\s*(.+)/i);
    if (symbolsMatch) {
      symbols = symbolsMatch[1].trim().replace(/["']/g, '');
    }

    // Fallback più robusto
    if (!sceneContent || sceneContent.length < 200) {
      // Prova a estrarre il contenuto principale
      const cleanContent = content
        .replace(/TITOLO[_\s]*(?:EVOCATIVO|RAFFINATO|CHIARO)?:\s*.+/i, '')
        .replace(/(?:STATO_EMOTIVO|GANCIO_EMOTIVO|SIMBOLI_PRESENTI)[\s\S]*/i, '')
        .trim();
      
      sceneContent = cleanContent.length > 200 ? cleanContent : (fallbackScene?.content || content);
    }

    // Pulizia finale del contenuto e correzione errori
    sceneContent = sceneContent
      .replace(/CONTENUTO[_\s]*(?:IMMERSIVO|INTENSIFICATO)?:\s*/i, '')
      .trim()
      // Rimuovi caratteri non latini
      .replace(/[\u4e00-\u9fff\u3400-\u4dbf\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2b820-\u2ceaf]/g, '')
      // Pulisci asterischi strani
      .replace(/\*[^*]+\*/g, (match) => match.replace(/[^\x00-\x7F]/g, ''))
      // Sostituisci nomi troppo comuni con nomi appropriati all'autore
      .replace(/\bLuca\b/g, getAuthorAppropiateName('male'))
      .replace(/\bMarco\b/g, getAuthorAppropiateName('male'))
      .replace(/\bAnna\b/g, getAuthorAppropiateName('female'))
      .replace(/\bMaria\b/g, getAuthorAppropiateName('female'))
      .replace(/\bGiuseppe\b/g, getAuthorAppropiateName('male'))
             .replace(/\bdottor\s+Rossi\b/gi, `dottor ${getAuthorAppropriateSurname()}`)
       .replace(/\bdottor\s+Bianchi\b/gi, `dottor ${getAuthorAppropriateSurname()}`);

    return {
      id: `scene-${sceneNumber}`,
      title: title,
      content: sceneContent,
      emotionalState: emotionalState || `Emozione scena ${sceneNumber}`,
      emotionalHook: emotionalHook || `Collegamento verso scena ${sceneNumber + 1}`,
      symbols: symbols || 'Elementi narrativi',
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
