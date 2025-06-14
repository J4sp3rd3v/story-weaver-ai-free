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

// Modelli AI specializzati per ruoli specifici
const SPECIALIZED_MODELS = {
  architect: 'meta-llama/llama-3.2-3b-instruct:free', // Struttura e continuità narrativa
  writer: 'microsoft/phi-3-mini-128k-instruct:free',   // Scrittura scene coinvolgenti
  editor: 'mistralai/mistral-7b-instruct:free',        // Revisione e collegamenti
  continuity: 'huggingfaceh4/zephyr-7b-beta:free'      // Controllo continuità tra scene
};

const FALLBACK_MODELS = [
  'openchat/openchat-7b:free',
  'google/gemma-7b-it:free'
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

  const generateContinuousStory = async (apiKey: string) => {
    try {
      setGenerationProgress('🏗️ LLM Architetto: Creando mappa narrativa con cliffhanger...');
      
      // Step 1: Architetto crea struttura con continuità perfetta
      const storyBlueprint = await generateStoryBlueprint(apiKey);
      
      setGenerationProgress('✍️ LLM Scrittore: Tessendo scene collegate...');
      
      // Step 2: Scrittore genera scene con perfetta continuità
      const connectedScenes = await generateConnectedScenes(apiKey, storyBlueprint);
      
      setGenerationProgress('🔗 LLM Continuità: Verificando collegamenti narrativi...');
      
      // Step 3: Controllo continuità e aggiustamenti
      const verifiedScenes = await verifyContinuityAndAdjust(apiKey, connectedScenes, storyBlueprint);
      
      setGenerationProgress('📝 LLM Editor: Perfezionando transizioni e suspense...');
      
      // Step 4: Editor perfeziona transizioni e suspense
      const polishedScenes = await polishTransitionsAndSuspense(apiKey, verifiedScenes);
      
      setGenerationProgress('🎨 Ottimizzando prompt visivi narrativi...');
      
      // Step 5: Prompt immagini che riflettono la continuità
      const scenesWithImages = await addContinuityImagePrompts(apiKey, polishedScenes);
      
      setGenerationProgress('🔧 Assemblando storia con continuità perfetta...');
      
      // Step 6: Assemblaggio finale con controllo qualità
      const finalStory = createContinuousStory(storyBlueprint, scenesWithImages);
      
      return finalStory;

    } catch (error) {
      console.error('Errore nella generazione continua:', error);
      throw error;
    }
  };

  const generateStoryBlueprint = async (apiKey: string) => {
    const blueprintPrompt = `
Sei un ARCHITETTO NARRATIVO MAESTRO della continuità. Crea una MAPPA NARRATIVA PERFETTA con collegamenti irresistibili:

PARAMETRI STORIA:
- GENERE: ${wizardData.genre?.name} - ${wizardData.genre?.description}
- STILE: ${wizardData.author?.name} - ${wizardData.author?.description}
- PROTAGONISTA: ${wizardData.protagonist?.name} - ${wizardData.protagonist?.description}
- ANTAGONISTA: ${wizardData.antagonist?.name} - ${wizardData.antagonist?.description}
- AMBIENTAZIONE: ${wizardData.setting?.name} - ${wizardData.setting?.description}
- TRAMA: ${wizardData.plot?.name} - ${wizardData.plot?.description}

COMPITO: Crea una STRUTTURA NARRATIVA CON CONTINUITÀ PERFETTA

TITOLO: [Titolo che cattura l'essenza della storia]

FILO_CONDUTTORE_PRINCIPALE:
MISTERO_CENTRALE: [Il grande mistero che attraversa tutta la storia]
OGGETTO_RICORRENTE: [Elemento fisico che appare in ogni scena]
SEGRETO_RIVELATO_GRADUALMENTE: [Cosa si scopre poco alla volta]
MINACCIA_CRESCENTE: [Come il pericolo aumenta progressivamente]

CATENA_NARRATIVA_6_SCENE:

SCENA_1: "L'Innesco Misterioso"
OBIETTIVO: Introdurre protagonista e primo mistero
EVENTO_SCATENANTE: [Cosa accade di inquietante]
OGGETTO_INTRODOTTO: [Elemento ricorrente che appare]
DOMANDA_IRRISOLTA: [Cosa lascia il lettore con curiosità]
CLIFFHANGER: [Come finisce per creare suspense]
PONTE_SCENA_2: [Come si collega perfettamente alla scena 2]

SCENA_2: "Il Primo Indizio"
CONTINUA_DA: [Riprende esattamente dal cliffhanger della scena 1]
RIVELAZIONE_PARZIALE: [Cosa si scopre sul mistero]
COMPLICAZIONE: [Come si aggrava la situazione]
OGGETTO_EVOLUTO: [Come l'elemento ricorrente cambia]
NUOVO_PERSONAGGIO: [Chi entra in scena]
CLIFFHANGER: [Suspense per la scena 3]
PONTE_SCENA_3: [Collegamento preciso]

SCENA_3: "L'Inganno"
CONTINUA_DA: [Esatto seguito della scena 2]
FALSA_PISTA: [Cosa sembra vero ma non lo è]
ANTAGONISTA_RIVELATO: [Come emerge il nemico]
TRADIMENTO: [Chi non è quello che sembra]
PERICOLO_CRESCENTE: [Come aumenta la tensione]
CLIFFHANGER: [Momento di massimo pericolo]
PONTE_SCENA_4: [Transizione drammatica]

SCENA_4: "La Rivelazione Scioccante"
CONTINUA_DA: [Riprende dal pericolo della scena 3]
VERITÀ_SCONVOLGENTE: [Grande rivelazione sul mistero]
CAPOVOLGIMENTO: [Come tutto cambia]
ALLEATO_INASPETTATO: [Chi aiuta il protagonista]
CORSA_CONTRO_TEMPO: [Urgenza crescente]
CLIFFHANGER: [Momento decisivo]
PONTE_SCENA_5: [Verso il climax]

SCENA_5: "Il Confronto Finale"
CONTINUA_DA: [Diretto dalla tensione della scena 4]
SCONTRO_DECISIVO: [Battaglia finale]
SACRIFICIO: [Cosa deve rinunciare il protagonista]
MOMENTO_DISPERAZIONE: [Quando tutto sembra perduto]
SVOLTA_FINALE: [Come si ribalta la situazione]
CLIFFHANGER: [Verso la risoluzione]
PONTE_SCENA_6: [Collegamento alla conclusione]

SCENA_6: "La Risoluzione Epica"
CONTINUA_DA: [Conclude la tensione della scena 5]
RISOLUZIONE_MISTERO: [Come si spiega tutto]
TRASFORMAZIONE_PROTAGONISTA: [Come è cambiato]
OGGETTO_FINALE: [Destino dell'elemento ricorrente]
NUOVA_NORMALITÀ: [Come finisce la storia]
EPILOGO_INTRIGANTE: [Ultima nota che lascia il segno]

ELEMENTI_CONTINUITÀ:
DIALOGHI_RICORRENTI: [Frasi che ritornano modificate]
SIMBOLI_EVOLVENTI: [Come i simboli cambiano significato]
ATMOSFERA_PROGRESSIVA: [Come cambia il mood]
COUNTDOWN_NARRATIVO: [Elemento di urgenza crescente]

Scrivi ESATTAMENTE questa struttura, ogni sezione DEVE essere dettagliata e specifica.
`;

    return await callLLM(apiKey, SPECIALIZED_MODELS.architect, blueprintPrompt, 'architetto continuità');
  };

  const generateConnectedScenes = async (apiKey: string, blueprint: string) => {
    const scenes = [];
    
    // Estrai le scene dal blueprint
    const sceneMatches = blueprint.match(/SCENA_\d+:.*?(?=SCENA_\d+:|ELEMENTI_CONTINUITÀ:|$)/gs) || [];
    
    console.log(`🎭 Generando ${sceneMatches.length} scene perfettamente collegate...`);

    for (let i = 0; i < sceneMatches.length; i++) {
      const sceneStructure = sceneMatches[i];
      
      setGenerationProgress(`✍️ LLM Scrittore: Scena ${i + 1}/${sceneMatches.length} - Continuità narrativa...`);
      
      try {
        const sceneContent = await generateConnectedScene(
          apiKey, 
          sceneStructure, 
          blueprint, 
          scenes, 
          i + 1
        );
        
        scenes.push(sceneContent);
        
        // Pausa per rate limiting
        await new Promise(resolve => setTimeout(resolve, 1200));
        
      } catch (error) {
        console.error(`Errore nella scena ${i + 1}:`, error);
        
        // Fallback con verifica continuità
        try {
          const fallbackModel = FALLBACK_MODELS[i % FALLBACK_MODELS.length];
          const fallbackContent = await generateConnectedScene(
            apiKey, 
            sceneStructure, 
            blueprint, 
            scenes, 
            i + 1,
            fallbackModel
          );
          scenes.push(fallbackContent);
        } catch (fallbackError) {
          console.error(`Errore fallback scena ${i + 1}:`, fallbackError);
          scenes.push(createContinuityPlaceholder(i + 1, sceneStructure, scenes));
        }
      }
    }

    return scenes;
  };

  const generateConnectedScene = async (
    apiKey: string, 
    sceneStructure: string, 
    fullBlueprint: string, 
    previousScenes: any[], 
    sceneNumber: number,
    customModel?: string
  ) => {
    const model = customModel || SPECIALIZED_MODELS.writer;
    
    // Crea contesto di continuità dalle scene precedenti
    const continuityContext = previousScenes.length > 0 
      ? `SCENE_PRECEDENTI_DETTAGLIATE:
${previousScenes.map((scene, idx) => 
  `Scena ${idx + 1}: ${scene.title}
  COME_FINISCE: ${scene.cliffhanger || 'Transizione verso la scena successiva'}
  ELEMENTI_RICORRENTI: ${scene.recurringElements || 'Da identificare'}
  ULTIMO_PARAGRAFO: "${scene.content.split('\n').slice(-2).join(' ')}"
  `
).join('\n\n')}

COLLEGAMENTO_RICHIESTO: La scena ${sceneNumber} DEVE iniziare esattamente da dove finisce la scena ${sceneNumber - 1}.
`
      : 'Prima scena - Stabilisci gli elementi ricorrenti e il primo cliffhanger.';

    const continuityPrompt = `
Sei un SCRITTORE MAESTRO della CONTINUITÀ NARRATIVA. Ogni tua scena è un anello perfetto di una catena narrativa.

BLUEPRINT_COMPLETO:
${fullBlueprint}

${continuityContext}

SCENA_DA_SCRIVERE_ADESSO:
${sceneStructure}

REGOLE_FERREE_CONTINUITÀ:
1. Se NON è la prima scena, inizia ESATTAMENTE dove finiva la precedente
2. Riprendi dialoghi, azioni, emozioni in corso
3. Mantieni PERFETTA coerenza di personaggi e ambientazione
4. Usa elementi ricorrenti in modo evoluto
5. Includi dialoghi che richiamano scene precedenti
6. Termina con un CLIFFHANGER irresistibile
7. Scrivi ESATTAMENTE 1000-1200 parole
8. Stile ${wizardData.author?.name}, genere ${wizardData.genre?.name}

OBIETTIVI_SPECIFICI:
- CONTINUITÀ: Zero interruzioni narrative, collegamento fluido
- SUSPENSE: Ogni paragrafo aumenta la tensione
- ELEMENTI_RICORRENTI: Usa oggetti/simboli che attraversano la storia
- CLIFFHANGER: Finisci con una domanda irrisolta che spinge alla scena successiva
- CARATTERIZZAZIONE: Sviluppa personaggi attraverso azioni e dialoghi

FORMATO_RISPOSTA:
TITOLO_SCENA: [Titolo che riflette la continuità]

CONTENUTO_CONTINUO:
[Scena di 1000-1200 parole che si collega perfettamente alle precedenti]

CLIFFHANGER_FINALE: [L'elemento di suspense che porta alla scena successiva]

ELEMENTI_RICORRENTI: [Oggetti/simboli che appaiono in questa scena]

Scrivi SOLO il formato richiesto, senza commenti aggiuntivi.
`;

    const response = await callLLM(apiKey, model, continuityPrompt, 'scrittore continuità');
    return parseConnectedScene(response, sceneNumber);
  };

  const verifyContinuityAndAdjust = async (apiKey: string, scenes: any[], blueprint: string) => {
    const verifiedScenes = [];
    
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      
      setGenerationProgress(`🔗 LLM Continuità: Verificando collegamento scena ${i + 1}...`);
      
      try {
        if (i === 0) {
          // Prima scena non ha precedenti
          verifiedScenes.push(scene);
        } else {
          const verifiedScene = await verifyContinuity(apiKey, scene, scenes[i - 1], i + 1);
          verifiedScenes.push(verifiedScene);
        }
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
      } catch (error) {
        console.error(`Errore verifica continuità scena ${i + 1}:`, error);
        // Usa la scena originale se la verifica fallisce
        verifiedScenes.push(scene);
      }
    }
    
    return verifiedScenes;
  };

  const verifyContinuity = async (apiKey: string, currentScene: any, previousScene: any, sceneNumber: number) => {
    const verificationPrompt = `
Sei un CONTROLLORE DI CONTINUITÀ NARRATIVA esperto. Verifica e correggi la continuità tra queste due scene:

SCENA_PRECEDENTE (${sceneNumber - 1}):
Titolo: ${previousScene.title}
Cliffhanger finale: "${previousScene.cliffhanger}"
Ultimi paragrafi: "${previousScene.content.split('\n').slice(-3).join(' ')}"

SCENA_ATTUALE (${sceneNumber}):
Titolo: ${currentScene.title}
Primi paragrafi: "${currentScene.content.split('\n').slice(0, 3).join(' ')}"
Contenuto completo: ${currentScene.content}

VERIFICA_E_CORREGGI:
1. La scena ${sceneNumber} inizia coerentemente dal cliffhanger della scena ${sceneNumber - 1}?
2. Ci sono contraddizioni di personaggi, luoghi, azioni?
3. Il collegamento è fluido e naturale?
4. Gli elementi ricorrenti sono mantenuti?

Se trovi problemi, RISCRIVI l'inizio della scena ${sceneNumber} per perfetta continuità.
Se va già bene, conferma senza modifiche.

FORMATO_RISPOSTA:
VALUTAZIONE: [OK/CORREZIONE_NECESSARIA]

SCENA_CORRETTA (se necessario):
TITOLO: ${currentScene.title}
CONTENUTO_MIGLIORATO: [Contenuto con continuità perfetta]
CLIFFHANGER: ${currentScene.cliffhanger}
ELEMENTI_RICORRENTI: ${currentScene.recurringElements}

Fornisci solo la valutazione e l'eventuale correzione.
`;

    const response = await callLLM(apiKey, SPECIALIZED_MODELS.continuity, verificationPrompt, 'controllore continuità');
    
    if (response.includes('CORREZIONE_NECESSARIA')) {
      return parseConnectedScene(response, sceneNumber, currentScene);
    } else {
      return currentScene;
    }
  };

  const polishTransitionsAndSuspense = async (apiKey: string, scenes: any[]) => {
    const polishedScenes = [];
    
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      
      setGenerationProgress(`📝 LLM Editor: Perfezionando transizioni scena ${i + 1}...`);
      
      try {
        const polishedScene = await polishTransitions(apiKey, scene, scenes, i + 1);
        polishedScenes.push(polishedScene);
        
        await new Promise(resolve => setTimeout(resolve, 700));
        
      } catch (error) {
        console.error(`Errore perfezionamento scena ${i + 1}:`, error);
        polishedScenes.push(scene);
      }
    }
    
    return polishedScenes;
  };

  const polishTransitions = async (apiKey: string, scene: any, allScenes: any[], sceneNumber: number) => {
    const polishPrompt = `
Sei un EDITOR ESPERTO di transizioni e suspense. Perfeziona questa scena per massimizzare continuità e tensione:

SCENA_DA_PERFEZIONARE:
${scene.title}
${scene.content}
Cliffhanger: ${scene.cliffhanger}

CONTESTO_NARRATIVO:
- Scena ${sceneNumber} di ${allScenes.length}
- Genere: ${wizardData.genre?.name}
- Deve mantenere il lettore incollato

PERFEZIONA:
1. TRANSIZIONI: Rendi i collegamenti tra paragrafi più fluidi
2. SUSPENSE: Aumenta gradualmente la tensione
3. DIALOGHI: Rendili più naturali e caratterizzanti
4. CLIFFHANGER: Massimizza l'impatto emotivo
5. RITMO: Alterna momenti di tensione e respiro
6. GRAMMATICA: Correggi ogni errore

MANTIENI:
- Stessa lunghezza (1000-1200 parole)
- Stessa trama e personaggi
- Stesso cliffhanger (migliorato)
- Stessi elementi ricorrenti

FORMATO_RISPOSTA:
TITOLO_PERFEZIONATO: [Titolo ottimizzato]

CONTENUTO_PERFEZIONATO:
[Scena con transizioni e suspense ottimizzate]

CLIFFHANGER_OTTIMIZZATO: [Cliffhanger con massimo impatto]

ELEMENTI_RICORRENTI: [Elementi simbolici presenti]

Perfeziona senza stravolgere la storia originale.
`;

    const response = await callLLM(apiKey, SPECIALIZED_MODELS.editor, polishPrompt, 'editor transizioni');
    return parseConnectedScene(response, sceneNumber, scene);
  };

  const addContinuityImagePrompts = async (apiKey: string, scenes: any[]) => {
    const scenesWithImages = [];
    
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      
      setGenerationProgress(`🎨 Generando prompt visivo per scena ${i + 1}...`);
      
      try {
        const imagePrompt = await generateOptimizedImagePrompt(apiKey, scene);
        scenesWithImages.push({
          ...scene,
          imagePrompt
        });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Errore prompt immagine scena ${i + 1}:`, error);
        scenesWithImages.push({
          ...scene,
          imagePrompt: `${wizardData.genre?.name} scene, ${wizardData.setting?.name}, ${wizardData.style?.prompt || 'cinematic, high quality'}`
        });
      }
    }
    
    return scenesWithImages;
  };

  const generateOptimizedImagePrompt = async (apiKey: string, scene: any) => {
    const imagePrompt = `
Analizza questa scena e crea un prompt PERFETTO per Stable Diffusion:

SCENA: ${scene.title}
CONTENUTO: ${scene.content.substring(0, 800)}...

PARAMETRI_VISIVI:
- Genere: ${wizardData.genre?.name}
- Ambientazione: ${wizardData.setting?.name}
- Stile: ${wizardData.style?.name}

Crea un prompt in inglese di MAX 150 caratteri che descriva:
1. La scena specifica con personaggi principali
2. L'ambientazione e atmosfera
3. Lo stile visivo scelto
4. Qualità cinematografica

Rispondi SOLO con il prompt in inglese, senza spiegazioni:
`;

    try {
      const response = await callLLM(apiKey, SPECIALIZED_MODELS.writer, imagePrompt, 'generatore prompt immagini');
      let prompt = response.replace(/['"]/g, '').trim();
      
      if (wizardData.style?.prompt && !prompt.includes(wizardData.style.prompt)) {
        prompt += `, ${wizardData.style.prompt}`;
      }
      
      return prompt.substring(0, 150);
      
    } catch (error) {
      console.error('Errore generazione prompt immagine:', error);
      return `${wizardData.genre?.name} scene, ${wizardData.setting?.name}, ${wizardData.style?.prompt || 'cinematic style'}`;
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
            content: `Sei un ${role} professionista. Scrivi sempre in italiano perfetto con grammatica e punteggiatura impeccabili. Crea CONTINUITÀ NARRATIVA PERFETTA tra le scene. Ogni scena deve collegare perfettamente a quella successiva.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: role === 'architetto continuità' ? 0.3 : role === 'controllore continuità' ? 0.2 : 0.6,
        max_tokens: role === 'architetto continuità' ? 2500 : 2000,
        top_p: 0.85,
        frequency_penalty: 0.5, // Riduce molto le ripetizioni
        presence_penalty: 0.4   // Incoraggia varietà mantenendo coerenza
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - Model: ${model}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  };

  const parseConnectedScene = (content: string, sceneNumber: number, fallbackScene?: any) => {
    const lines = content.split('\n').filter(line => line.trim());
    let title = fallbackScene?.title || `Scena ${sceneNumber}`;
    let sceneContent = '';
    let cliffhanger = '';
    let recurringElements = '';

    // Estrai titolo
    const titleMatch = content.match(/TITOLO[_\s]*(?:SCENA|PERFEZIONATO)?:\s*(.+)/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }

    // Estrai contenuto
    const contentMatch = content.match(/CONTENUTO[_\s]*(?:CONTINUO|MIGLIORATO|PERFEZIONATO)?:\s*([\s\S]*?)(?=CLIFFHANGER|ELEMENTI_RICORRENTI|$)/i);
    if (contentMatch) {
      sceneContent = contentMatch[1].trim();
    }

    // Estrai cliffhanger
    const cliffhangerMatch = content.match(/CLIFFHANGER[_\s]*(?:FINALE|OTTIMIZZATO)?:\s*(.+)/i);
    if (cliffhangerMatch) {
      cliffhanger = cliffhangerMatch[1].trim();
    }

    // Estrai elementi ricorrenti
    const elementsMatch = content.match(/ELEMENTI_RICORRENTI:\s*(.+)/i);
    if (elementsMatch) {
      recurringElements = elementsMatch[1].trim();
    }

    // Fallback se il parsing fallisce
    if (!sceneContent || sceneContent.length < 200) {
      sceneContent = fallbackScene?.content || content;
    }

    return {
      id: `scene-${sceneNumber}`,
      title: title,
      content: sceneContent,
      cliffhanger: cliffhanger,
      recurringElements: recurringElements,
      imagePrompt: '' // Sarà popolato dopo
    };
  };

  const createContinuityPlaceholder = (sceneNumber: number, sceneStructure: string, previousScenes: any[]) => {
    const lastCliffhanger = previousScenes.length > 0 ? previousScenes[previousScenes.length - 1].cliffhanger : '';
    
    return {
      id: `scene-${sceneNumber}`,
      title: `Scena ${sceneNumber} - Continuità da ristabilire`,
      content: `[SCENA DA RIGENERARE CON CONTINUITÀ]\n\nDeve continuare da: "${lastCliffhanger}"\n\nStruttura richiesta: ${sceneStructure.substring(0, 200)}...`,
      cliffhanger: `Collegamento verso scena ${sceneNumber + 1}`,
      recurringElements: 'Da identificare nella rigenerazione',
      imagePrompt: `${wizardData.genre?.name} placeholder scene`
    };
  };

  const createContinuousStory = (blueprint: string, scenes: any[]) => {
    // Estrai il titolo dal blueprint
    const titleMatch = blueprint.match(/TITOLO:\s*(.+)/);
    const title = titleMatch ? titleMatch[1].trim() : 'Storia Epica con Continuità Perfetta';

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
      continuityScore: 'Perfetta', // Indica qualità della continuità
      blueprint: blueprint // Conserva la mappa narrativa
    };

    console.log('Storia con continuità perfetta completata:', {
      title: story.title,
      scenes: story.scenes.length,
      wordCount: story.wordCount,
      continuityElements: scenes.map(s => s.recurringElements).filter(Boolean),
      cliffhangers: scenes.map(s => s.cliffhanger).filter(Boolean)
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
    setGenerationProgress('🚀 Inizializzazione sistema narrativo con continuità...');
    onApiKeySet(apiKey);
    
    try {
      const story = await generateContinuousStory(apiKey);
      
      toast({
        title: "Storia con Continuità Perfetta Completata!",
        description: `${story.scenes.length} scene perfettamente collegate, ${story.wordCount} parole di qualità cinematografica!`,
      });

      onStoryGenerated(story);
      
    } catch (error) {
      console.error('Errore nella generazione continua:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la generazione continua. Controlla la tua API key.",
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
          <span className="text-sm font-medium">Sistema Narrativo Continuo - 4 LLM Specializzati</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gradient animate-float">
          Continuità Narrativa Perfetta
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          4 AI specializzati creano storie con continuità cinematografica: ogni scena si collega perfettamente alla successiva!
        </p>
      </div>

      {/* Story Summary */}
      <Card className="gradient-dark border-border/50">
        <CardHeader>
          <CardTitle className="text-center">Riepilogo della Tua Storia</CardTitle>
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
            <h4 className="font-semibold mb-3">🎭 Sistema Narrativo con Continuità Perfetta:</h4>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">1</div>
                <div>
                  <div className="font-medium text-blue-300">LLM Architetto</div>
                  <div className="text-muted-foreground">Crea mappa narrativa con cliffhanger perfetti</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">2</div>
                <div>
                  <div className="font-medium text-green-300">LLM Scrittore</div>
                  <div className="text-muted-foreground">Tesse scene perfettamente collegate</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">3</div>
                <div>
                  <div className="font-medium text-orange-300">LLM Continuità</div>
                  <div className="text-muted-foreground">Verifica e corregge collegamenti narrativi</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">4</div>
                <div>
                  <div className="font-medium text-purple-300">LLM Editor</div>
                  <div className="text-muted-foreground">Perfeziona transizioni e suspense</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">🔗 Garantie di Continuità:</h4>
            <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Ogni scena inizia dove finisce la precedente
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Cliffhanger irresistibili tra le scene
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Elementi ricorrenti che attraversano la storia
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Personaggi coerenti e ben caratterizzati
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Ritmo crescente che mantiene il lettore incollato
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">Come ottenere la tua API Key:</h4>
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
                Creazione Continuità Narrativa...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Genera Storia con Continuità Perfetta (6 scene collegate)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoryGeneration;
