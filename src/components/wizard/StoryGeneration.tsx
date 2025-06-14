
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

// Modelli AI specializzati per diversi ruoli
const SPECIALIZED_MODELS = {
  architect: 'meta-llama/llama-3.2-3b-instruct:free', // Struttura narrativa
  writer: 'microsoft/phi-3-mini-128k-instruct:free',   // Scrittura creativa
  editor: 'mistralai/mistral-7b-instruct:free'         // Revisione e correzione
};

const FALLBACK_MODELS = [
  'huggingfaceh4/zephyr-7b-beta:free',
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

  const generateCollaborativeStory = async (apiKey: string) => {
    try {
      setGenerationProgress('🏗️ LLM Architetto: Progettando la struttura narrativa...');
      
      // Step 1: LLM Architetto crea la struttura dettagliata
      const narrative = await generateNarrativeStructure(apiKey);
      
      setGenerationProgress('✍️ LLM Scrittore: Creando le scene narrative...');
      
      // Step 2: LLM Scrittore genera le scene basandosi sulla struttura
      const rawScenes = await generateCollaborativeScenes(apiKey, narrative);
      
      setGenerationProgress('📝 LLM Editor: Perfezionando stile e correzioni...');
      
      // Step 3: LLM Editor revisiona e perfeziona ogni scena
      const polishedScenes = await editAndPolishScenes(apiKey, rawScenes);
      
      setGenerationProgress('🎨 Generando i prompt visivi ottimizzati...');
      
      // Step 4: Genera i prompt per le immagini
      const scenesWithImages = await addOptimizedImagePrompts(apiKey, polishedScenes);
      
      setGenerationProgress('🔧 Assemblando la storia finale...');
      
      // Step 5: Crea la storia finale ottimizzata
      const finalStory = createProfessionalStory(narrative, scenesWithImages);
      
      return finalStory;

    } catch (error) {
      console.error('Errore nella generazione collaborativa:', error);
      throw error;
    }
  };

  const generateNarrativeStructure = async (apiKey: string) => {
    const structurePrompt = `
Sei un ARCHITETTO NARRATIVO esperto. Crea una struttura narrativa PERFETTA e DETTAGLIATA:

PARAMETRI STORIA:
- GENERE: ${wizardData.genre?.name} - ${wizardData.genre?.description}
- STILE: ${wizardData.author?.name} - ${wizardData.author?.description}
- PROTAGONISTA: ${wizardData.protagonist?.name} - ${wizardData.protagonist?.description}
- ANTAGONISTA: ${wizardData.antagonist?.name} - ${wizardData.antagonist?.description}
- AMBIENTAZIONE: ${wizardData.setting?.name} - ${wizardData.setting?.description}
- TRAMA: ${wizardData.plot?.name} - ${wizardData.plot?.description}

COMPITO: Crea una MAPPA NARRATIVA DETTAGLIATA con:

TITOLO: [Titolo evocativo e memorabile]

ARCO_NARRATIVO:
TEMA_CENTRALE: [Il tema principale che unisce tutta la storia]
CONFLITTO_PRINCIPALE: [Il conflitto che guida la narrazione]
CRESCITA_PROTAGONISTA: [Come evolve il protagonista]

STRUTTURA_6_SCENE:
SCENA_1: "L'Inizio"
OBIETTIVO: [Cosa deve accadere]
MOOD: [Atmosfera emotiva]
EVENTI_CHIAVE: [3 eventi specifici e dettagliati]
DIALOGHI_ESSENZIALI: [Tipo di dialoghi necessari]
COLLEGAMENTO: [Come si collega alla scena 2]

SCENA_2: "La Chiamata"
OBIETTIVO: [Cosa deve accadere]
MOOD: [Atmosfera emotiva]
EVENTI_CHIAVE: [3 eventi specifici e dettagliati]
DIALOGHI_ESSENZIALI: [Tipo di dialoghi necessari]
COLLEGAMENTO: [Come si collega alla scena 3]

[continua per tutte e 6 le scene...]

ELEMENTI_RICORRENTI:
SIMBOLI: [Oggetti/elementi simbolici che ritornano]
FRASI_CHIAVE: [Frasi che caratterizzano personaggi]
LUOGHI_SIGNIFICATIVI: [Ambientazioni importanti]

STILE_NARRATIVO:
PUNTO_DI_VISTA: [Prima/terza persona, prospettiva]
TEMPO_VERBALE: [Presente/passato]
REGISTRO_LINGUISTICO: [Formale/informale/poetico]
LUNGHEZZA_FRASI: [Brevi/lunghe/miste]

Rispondi SOLO con questa struttura, senza commenti aggiuntivi.
`;

    return await callLLM(apiKey, SPECIALIZED_MODELS.architect, structurePrompt, 'architetto narrativo');
  };

  const generateCollaborativeScenes = async (apiKey: string, narrative: string) => {
    const scenes = [];
    
    // Estrai le scene dalla struttura narrativa
    const sceneMatches = narrative.match(/SCENA_\d+:.*?(?=SCENA_\d+:|ELEMENTI_RICORRENTI:|$)/gs) || [];
    
    console.log(`🎭 Generando ${sceneMatches.length} scene collaborative...`);

    for (let i = 0; i < sceneMatches.length; i++) {
      const sceneStructure = sceneMatches[i];
      
      setGenerationProgress(`✍️ LLM Scrittore: Scena ${i + 1}/${sceneMatches.length} - Creazione narrativa...`);
      
      try {
        const sceneContent = await generateCreativeScene(
          apiKey, 
          sceneStructure, 
          narrative, 
          scenes, 
          i + 1
        );
        
        scenes.push(sceneContent);
        
        // Pausa per evitare rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Errore nella scena ${i + 1}:`, error);
        
        // Fallback con modello diverso
        try {
          const fallbackModel = FALLBACK_MODELS[i % FALLBACK_MODELS.length];
          const fallbackContent = await generateCreativeScene(
            apiKey, 
            sceneStructure, 
            narrative, 
            scenes, 
            i + 1,
            fallbackModel
          );
          scenes.push(fallbackContent);
        } catch (fallbackError) {
          console.error(`Errore fallback scena ${i + 1}:`, fallbackError);
          // Crea scena placeholder per mantenere struttura
          scenes.push(createPlaceholderScene(i + 1, sceneStructure));
        }
      }
    }

    return scenes;
  };

  const generateCreativeScene = async (
    apiKey: string, 
    sceneStructure: string, 
    fullNarrative: string, 
    previousScenes: any[], 
    sceneNumber: number,
    customModel?: string
  ) => {
    const model = customModel || SPECIALIZED_MODELS.writer;
    
    // Crea contesto dalle scene precedenti
    const previousContext = previousScenes.length > 0 
      ? `SCENE_PRECEDENTI_GENERATE:\n${previousScenes.map((scene, idx) => 
          `Scena ${idx + 1}: ${scene.title}\nRiassunto: ${scene.content.substring(0, 150)}...\n`
        ).join('\n')}`
      : 'Prima scena della storia.';

    const creativePrompt = `
Sei un SCRITTORE PROFESSIONISTA esperto nel genere ${wizardData.genre?.name}.

STRUTTURA_NARRATIVA_COMPLETA:
${fullNarrative}

${previousContext}

SCENA_DA_SCRIVERE_ADESSO:
${sceneStructure}

ISTRUZIONI_CREATIVE:
1. Scrivi ESATTAMENTE 900-1100 parole per questa scena
2. Usa lo stile distintivo di ${wizardData.author?.name}
3. Mantieni PERFETTA continuità con le scene precedenti
4. Includi dialoghi realistici e coinvolgenti
5. Descrizioni vivide ma non eccessive
6. Ritmo narrativo appropriato al genere ${wizardData.genre?.name}
7. ZERO ripetizioni di contenuti precedenti
8. Punteggiatura e grammatica perfette

STILE_RICHIESTO:
- Usa il presente narrativo per maggiore immediatezza
- Alterna descrizioni e dialoghi in modo equilibrato
- Crea tensione appropriata al genere
- Caratterizza i personaggi attraverso azioni e parole

FORMATO_RISPOSTA:
TITOLO_SCENA: [Titolo evocativo specifico]

CONTENUTO:
[Testo della scena di 900-1100 parole, scritto in modo professionale]

Scrivi SOLO il titolo e il contenuto, senza note o commenti.
`;

    const response = await callLLM(apiKey, model, creativePrompt, 'scrittore creativo');
    return parseSceneContent(response, sceneNumber);
  };

  const editAndPolishScenes = async (apiKey: string, rawScenes: any[]) => {
    const polishedScenes = [];
    
    for (let i = 0; i < rawScenes.length; i++) {
      const scene = rawScenes[i];
      
      setGenerationProgress(`📝 LLM Editor: Perfezionando scena ${i + 1}/${rawScenes.length}...`);
      
      try {
        const polishedScene = await polishScene(apiKey, scene, i + 1);
        polishedScenes.push(polishedScene);
        
        // Pausa per rate limiting
        await new Promise(resolve => setTimeout(resolve, 800));
        
      } catch (error) {
        console.error(`Errore nell'editing della scena ${i + 1}:`, error);
        // Usa la scena originale se l'editing fallisce
        polishedScenes.push(scene);
      }
    }
    
    return polishedScenes;
  };

  const polishScene = async (apiKey: string, scene: any, sceneNumber: number) => {
    const editingPrompt = `
Sei un EDITOR PROFESSIONALE esperto. Perfeziona questa scena mantenendo il contenuto originale:

SCENA_ORIGINALE:
Titolo: ${scene.title}
Contenuto: ${scene.content}

COMPITI_EDITING:
1. CORREGGERE eventuali errori grammaticali e di punteggiatura
2. MIGLIORARE la fluidità del testo senza cambiare la trama
3. OTTIMIZZARE i dialoghi per renderli più naturali
4. PERFEZIONARE le descrizioni per maggiore impatto
5. MANTENERE esattamente la stessa storia e personaggi
6. RISPETTARE il conteggio parole (900-1100)

REGOLE_FERREE:
- NON cambiare gli eventi della storia
- NON aggiungere o rimuovere personaggi
- NON modificare i dialoghi principali, solo migliorarli
- MANTIENI lo stesso stile narrativo
- ZERO repetizioni o ridondanze

FORMATO_RISPOSTA:
TITOLO_PERFEZIONATO: [Titolo ottimizzato se necessario]

CONTENUTO_PERFEZIONATO:
[Testo della scena perfezionato]

Rispondi SOLO con il titolo e contenuto perfezionati.
`;

    const response = await callLLM(apiKey, SPECIALIZED_MODELS.editor, editingPrompt, 'editor professionale');
    return parseSceneContent(response, sceneNumber, scene.title);
  };

  const addOptimizedImagePrompts = async (apiKey: string, scenes: any[]) => {
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
        // Fallback con prompt generico
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

ESEMPI_RIFERIMENTO:
- "Dark gothic mansion library, mysterious cloaked figure reading ancient tome, candlelight, cinematic horror atmosphere"
- "Futuristic cyberpunk street chase, neon lights reflecting on wet asphalt, dramatic action scene, film noir style"

Rispondi SOLO con il prompt in inglese, senza spiegazioni:
`;

    try {
      const response = await callLLM(apiKey, SPECIALIZED_MODELS.writer, imagePrompt, 'generatore prompt immagini');
      let prompt = response.replace(/['"]/g, '').trim();
      
      // Aggiungi stile se necessario
      if (wizardData.style?.prompt && !prompt.includes(wizardData.style.prompt)) {
        prompt += `, ${wizardData.style.prompt}`;
      }
      
      return prompt.substring(0, 150); // Limita la lunghezza
      
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
            content: `Sei un ${role} professionista. Scrivi sempre in italiano perfetto con grammatica e punteggiatura impeccabili. Segui ESATTAMENTE le istruzioni fornite.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: role === 'architetto narrativo' ? 0.4 : role === 'editor professionale' ? 0.3 : 0.7,
        max_tokens: role === 'architetto narrativo' ? 2000 : 1800,
        top_p: 0.85,
        frequency_penalty: 0.4, // Riduce ripetizioni
        presence_penalty: 0.3   // Incoraggia varietà
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - Model: ${model}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  };

  const parseSceneContent = (content: string, sceneNumber: number, fallbackTitle?: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    let title = fallbackTitle || `Scena ${sceneNumber}`;
    let sceneContent = '';

    // Cerca il titolo
    const titleMatch = content.match(/TITOLO[_\s]*(?:SCENA|PERFEZIONATO)?:\s*(.+)/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }

    // Estrai il contenuto
    const contentMatch = content.match(/CONTENUTO[_\s]*(?:PERFEZIONATO)?:\s*([\s\S]*)/i);
    if (contentMatch) {
      sceneContent = contentMatch[1].trim();
    } else {
      // Fallback: usa tutto il contenuto escludendo la linea del titolo
      const contentLines = lines.filter(line => 
        !line.match(/TITOLO|CONTENUTO/i) && line.trim().length > 0
      );
      sceneContent = contentLines.join('\n').trim();
    }

    // Assicurati che ci sia contenuto
    if (!sceneContent || sceneContent.length < 100) {
      sceneContent = content; // Usa tutto se il parsing fallisce
    }

    return {
      id: `scene-${sceneNumber}`,
      title: title,
      content: sceneContent,
      imagePrompt: '' // Sarà popolato dopo
    };
  };

  const createPlaceholderScene = (sceneNumber: number, sceneStructure: string) => {
    return {
      id: `scene-${sceneNumber}`,
      title: `Scena ${sceneNumber}`,
      content: `[Scena da rigenerare - ${sceneStructure.substring(0, 100)}...]`,
      imagePrompt: `${wizardData.genre?.name} scene, ${wizardData.setting?.name}`
    };
  };

  const createProfessionalStory = (narrative: string, scenes: any[]) => {
    // Estrai il titolo dalla struttura narrativa
    const titleMatch = narrative.match(/TITOLO:\s*(.+)/);
    const title = titleMatch ? titleMatch[1].trim() : 'La Tua Storia Epica';

    // Calcola statistiche accurate
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
      wordCount: totalWordCount
    };

    console.log('Storia professionale completata:', {
      title: story.title,
      scenes: story.scenes.length,
      wordCount: story.wordCount,
      estimatedTime: story.estimatedReadingTime
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
    setGenerationProgress('🚀 Inizializzazione sistema collaborativo AI...');
    onApiKeySet(apiKey);
    
    try {
      const story = await generateCollaborativeStory(apiKey);
      
      toast({
        title: "Storia Professionale Completata!",
        description: `Storia di ${story.scenes.length} scene, ${story.wordCount} parole con qualità editoriale!`,
      });

      onStoryGenerated(story);
      
    } catch (error) {
      console.error('Errore nella generazione collaborativa:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la generazione collaborativa. Controlla la tua API key.",
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
          <span className="text-sm font-medium">Sistema Collaborativo AI - 3 LLM Specializzati</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gradient animate-float">
          Generazione Professionale
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          3 AI specializzati lavorano insieme: Architetto + Scrittore + Editor per qualità editoriale!
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
            <h4 className="font-semibold mb-3">🎭 Sistema Collaborativo AI Professionale:</h4>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">1</div>
                <div>
                  <div className="font-medium text-blue-300">LLM Architetto</div>
                  <div className="text-muted-foreground">Progetta struttura narrativa dettagliata</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">2</div>
                <div>
                  <div className="font-medium text-green-300">LLM Scrittore</div>
                  <div className="text-muted-foreground">Crea scene coinvolgenti e dialoghi</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">3</div>
                <div>
                  <div className="font-medium text-purple-300">LLM Editor</div>
                  <div className="text-muted-foreground">Perfeziona stile e correzioni</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">🔧 Miglioramenti Qualità:</h4>
            <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Grammatica e punteggiatura perfette
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Struttura narrativa professionale
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Dialoghi naturali e coinvolgenti
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Continuità narrativa garantita
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Zero ripetizioni o ridondanze
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
                Generazione Collaborativa in Corso...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Genera Storia Professionale (6 scene, qualità editoriale)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoryGeneration;
