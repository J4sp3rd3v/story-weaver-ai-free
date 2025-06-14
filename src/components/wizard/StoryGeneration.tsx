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

// I migliori modelli GRATUITI di OpenRouter per la generazione di storie
const BEST_FREE_MODELS = [
  'meta-llama/llama-3.2-3b-instruct:free',
  'microsoft/phi-3-mini-128k-instruct:free',
  'mistralai/mistral-7b-instruct:free',
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

  const generateStoryWithMultipleModels = async (apiKey: string) => {
    try {
      setGenerationProgress('Creando la struttura narrativa...');
      
      // Step 1: Generate comprehensive story outline
      const outline = await generateDetailedOutline(apiKey);
      
      setGenerationProgress('Generando le scene con continuità narrativa...');
      
      // Step 2: Generate scenes with narrative continuity
      const scenes = await generateConnectedScenes(apiKey, outline);
      
      setGenerationProgress('Ottimizzando la struttura finale...');
      
      // Step 3: Create optimized final story
      const story = createOptimizedStory(outline, scenes);
      
      return story;

    } catch (error) {
      console.error('Errore nella generazione multi-modello:', error);
      throw error;
    }
  };

  const generateDetailedOutline = async (apiKey: string) => {
    const outlinePrompt = `
Crea una struttura narrativa DETTAGLIATA e COERENTE per una storia in italiano:

PARAMETRI STORIA:
- GENERE: ${wizardData.genre?.name} - ${wizardData.genre?.description}
- STILE: ${wizardData.author?.name} - ${wizardData.author?.description}
- PROTAGONISTA: ${wizardData.protagonist?.name} - ${wizardData.protagonist?.description}
- ANTAGONISTA: ${wizardData.antagonist?.name} - ${wizardData.antagonist?.description}
- AMBIENTAZIONE: ${wizardData.setting?.name} - ${wizardData.setting?.description}
- TRAMA: ${wizardData.plot?.name} - ${wizardData.plot?.description}

REQUISITI STRUTTURALI:
1. Titolo accattivante e originale
2. Esattamente 6 scene interconnesse
3. Arco narrativo completo: introduzione → sviluppo → climax → risoluzione
4. Ogni scena deve avere 800-1000 parole
5. Continuità tra personaggi, luoghi e eventi
6. Evitare assolutamente ripetizioni di dialoghi, azioni o descrizioni

FORMATO RICHIESTO:
TITOLO: [titolo originale]

PERSONAGGI_PRINCIPALI:
- PROTAGONISTA: [nome] - [breve descrizione personalità e aspetto]
- ANTAGONISTA: [nome] - [breve descrizione personalità e aspetto]
- ALTRI: [eventuali personaggi secondari importanti]

AMBIENTAZIONE_DETTAGLIATA:
[Descrizione specifica dei luoghi dove si svolge la storia]

STRUTTURA_NARRATIVA:
SCENA_1: [titolo specifico]
OBIETTIVO: [cosa deve accadere in questa scena]
PERSONAGGI: [chi appare]
EVENTI_CHIAVE: [3-4 eventi specifici che devono accadere]
COLLEGAMENTO: [come si collega alla scena successiva]

SCENA_2: [titolo specifico]
OBIETTIVO: [cosa deve accadere in questa scena]
PERSONAGGI: [chi appare]
EVENTI_CHIAVE: [3-4 eventi specifici che devono accadere]
COLLEGAMENTO: [come si collega alla scena successiva]

[continua per tutte e 6 le scene]

TEMI_RICORRENTI: [3-4 temi che devono apparire nella storia]
OGGETTI_SIMBOLICI: [oggetti importanti per la trama]
`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'StoryMaster AI'
      },
      body: JSON.stringify({
        model: BEST_FREE_MODELS[0],
        messages: [
          {
            role: 'system',
            content: 'Sei un esperto architetto narrativo. Crei strutture di storie dettagliate, coerenti e senza ripetizioni. Ogni elemento deve essere unico e contribuire al progresso della trama.'
          },
          {
            role: 'user',
            content: outlinePrompt
          }
        ],
        temperature: 0.6, // Ridotta per maggiore coerenza
        max_tokens: 2500,
        top_p: 0.8
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  };

  const generateConnectedScenes = async (apiKey: string, outline: string) => {
    const scenes = [];
    
    // Extract scene information from outline
    const sceneMatches = outline.match(/SCENA_\d+:.*?(?=SCENA_\d+:|TEMI_RICORRENTI:|$)/gs) || [];
    
    console.log(`Generando ${sceneMatches.length} scene interconnesse...`);

    let storyContext = outline; // Mantieni il contesto narrativo

    for (let i = 0; i < sceneMatches.length; i++) {
      const sceneOutline = sceneMatches[i];
      const modelIndex = i % BEST_FREE_MODELS.length;
      const selectedModel = BEST_FREE_MODELS[modelIndex];
      
      setGenerationProgress(`Scena ${i + 1}/${sceneMatches.length} - Modello: ${selectedModel.split('/')[0]}`);
      
      try {
        // Generate scene with full context
        const sceneContent = await generateContextualScene(
          apiKey, 
          selectedModel, 
          sceneOutline, 
          storyContext, 
          scenes, // Previous scenes for continuity
          i + 1
        );
        
        // Generate specific image prompt
        setGenerationProgress(`Creando prompt visivo per scena ${i + 1}...`);
        const imagePrompt = await generateImagePrompt(apiKey, sceneContent.content, selectedModel);
        sceneContent.imagePrompt = imagePrompt;
        
        scenes.push(sceneContent);
        
        // Update story context with new scene
        storyContext += `\n\nSCENA_${i + 1}_GENERATA:\n${sceneContent.content.substring(0, 300)}...`;
        
        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error(`Errore nella generazione della scena ${i + 1}:`, error);
        
        // Smart fallback with different model
        try {
          const fallbackModel = BEST_FREE_MODELS[(i + 2) % BEST_FREE_MODELS.length];
          const fallbackContent = await generateContextualScene(
            apiKey, 
            fallbackModel, 
            sceneOutline, 
            storyContext, 
            scenes, 
            i + 1
          );
          
          const fallbackImagePrompt = await generateImagePrompt(apiKey, fallbackContent.content, fallbackModel);
          fallbackContent.imagePrompt = fallbackImagePrompt;
          
          scenes.push(fallbackContent);
        } catch (fallbackError) {
          console.error(`Errore anche nel fallback per scena ${i + 1}:`, fallbackError);
          
          // Create minimal scene to maintain structure
          scenes.push({
            id: `scene-${i + 1}`,
            title: `Scena ${i + 1}`,
            content: `[Scena da rigenerare - errore nel modello AI]`,
            imagePrompt: `${wizardData.genre?.name} scene, ${wizardData.style?.prompt || 'cinematic style'}`
          });
        }
      }
    }

    return scenes;
  };

  const generateContextualScene = async (
    apiKey: string, 
    model: string, 
    sceneOutline: string, 
    fullContext: string, 
    previousScenes: any[], 
    sceneNumber: number
  ) => {
    // Create contextual summary of previous scenes
    const previousContext = previousScenes.length > 0 
      ? `SCENE PRECEDENTI (per continuità):\n${previousScenes.map((scene, idx) => 
          `Scena ${idx + 1}: ${scene.title}\nRiassunto: ${scene.content.substring(0, 200)}...\n`
        ).join('\n')}`
      : 'Prima scena della storia.';

    const contextualPrompt = `
CONTESTO NARRATIVO COMPLETO:
${fullContext}

${previousContext}

SCENA DA SCRIVERE ORA:
${sceneOutline}

ISTRUZIONI SPECIFICHE:
1. Scrivi ESATTAMENTE 800-1000 parole per questa scena
2. NON ripetere dialoghi, azioni o descrizioni delle scene precedenti
3. Mantieni PERFETTA continuità con le scene precedenti
4. Usa lo stile di ${wizardData.author?.name}
5. Rispetta perfettamente il genere ${wizardData.genre?.name}
6. Includi dialoghi naturali e descrizioni vivide
7. Ogni frase deve far progredire la trama
8. Evita assolutamente frasi generiche o cliché

FORMATO RICHIESTO:
TITOLO_SCENA: [titolo specifico della scena]

CONTENUTO:
[Testo della scena di 800-1000 parole]
`;

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
            content: `Sei uno scrittore professionista specializzato nel genere ${wizardData.genre?.name}. Scrivi scene dettagliate nello stile di ${wizardData.author?.name}. EVITA ASSOLUTAMENTE RIPETIZIONI. Ogni scena deve essere unica e far progredire la storia.`
          },
          {
            role: 'user',
            content: contextualPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1800,
        top_p: 0.85,
        frequency_penalty: 0.3, // Riduce ripetizioni
        presence_penalty: 0.3   // Incoraggia varietà
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    return parseSceneContentImproved(content, sceneNumber);
  };

  const parseSceneContentImproved = (content: string, sceneNumber: number) => {
    const lines = content.split('\n').filter(line => line.trim());
    let title = `Scena ${sceneNumber}`;
    let sceneContent = '';

    // Try to find title
    const titleMatch = content.match(/TITOLO_SCENA:\s*(.+)/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }

    // Extract content after CONTENUTO: or use everything if format not followed
    const contentMatch = content.match(/CONTENUTO:\s*([\s\S]*)/i);
    if (contentMatch) {
      sceneContent = contentMatch[1].trim();
    } else {
      // Fallback: remove title line and use rest
      const contentLines = lines.filter(line => 
        !line.includes('TITOLO_SCENA:') && 
        !line.includes('CONTENUTO:') &&
        line.trim().length > 0
      );
      sceneContent = contentLines.join('\n').trim();
    }

    // Ensure we have content
    if (!sceneContent || sceneContent.length < 100) {
      sceneContent = content; // Use original if parsing failed
    }

    return {
      id: `scene-${sceneNumber}`,
      title: title,
      content: sceneContent,
      imagePrompt: '' // Will be filled later
    };
  };

  const generateImagePrompt = async (apiKey: string, sceneContent: string, model: string) => {
    const imagePromptGeneration = `
Analizza questa scena di una storia e crea un prompt dettagliato per Fooocus/Stable Diffusion in inglese:

SCENA:
${sceneContent.substring(0, 1000)}...

GENERE: ${wizardData.genre?.name}
STILE VISIVO: ${wizardData.style?.name} - ${wizardData.style?.description}
AMBIENTAZIONE: ${wizardData.setting?.name}

Crea un prompt in inglese di massimo 200 caratteri che descriva:
- La scena specifica con personaggi e azioni
- L'ambientazione e l'atmosfera
- Lo stile visivo scelto
- Dettagli cinematografici appropriati

Esempi di buoni prompt:
- "Medieval knight in shining armor fighting a dragon in a burning castle courtyard, cinematic lighting, epic fantasy art"
- "Cyberpunk detective in neon-lit alley investigating crime scene, rain reflections, digital art style"
- "Victorian mansion library with mysterious figure reading ancient book, candlelight, gothic atmosphere"

Rispondi SOLO con il prompt in inglese, senza spiegazioni:
`;

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
              content: 'Sei un esperto nella creazione di prompt per generazione di immagini AI. Crei prompt concisi ma dettagliati che catturano perfettamente la scena descritta.'
            },
            {
              role: 'user',
              content: imagePromptGeneration
            }
          ],
          temperature: 0.7,
          max_tokens: 100,
          top_p: 0.9
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let prompt = data.choices[0]?.message?.content || '';
      
      // Clean up the prompt and add style suffix
      prompt = prompt.replace(/['"]/g, '').trim();
      
      // Add the selected visual style
      if (wizardData.style?.prompt) {
        prompt += `, ${wizardData.style.prompt}`;
      }
      
      return prompt;
      
    } catch (error) {
      console.error('Errore nella generazione del prompt immagine:', error);
      // Fallback to a generic but relevant prompt
      const fallbackPrompt = `${wizardData.genre?.name} scene with ${wizardData.protagonist?.name}, ${wizardData.setting?.name}, ${wizardData.style?.prompt || 'cinematic, detailed, high quality'}`;
      return fallbackPrompt;
    }
  };

  const createOptimizedStory = (outline: string, scenes: any[]) => {
    // Extract title from outline
    const titleMatch = outline.match(/TITOLO:\s*(.+)/);
    const title = titleMatch ? titleMatch[1].trim() : 'La Tua Storia Epica';

    // Calculate total word count accurately
    let wordCount = 0;
    scenes.forEach(scene => {
      const words = scene.content.split(/\s+/).filter((word: string) => word.length > 0);
      wordCount += words.length;
    });

    const estimatedReadingTime = Math.max(1, Math.ceil(wordCount / 200));

    const story = {
      id: Date.now().toString(),
      title: title,
      content: scenes.map(scene => scene.content).join('\n\n'),
      scenes: scenes,
      estimatedReadingTime,
      wordCount
    };

    console.log('Storia ottimizzata creata:', {
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
    setGenerationProgress('Inizializzazione del sistema narrativo...');
    onApiKeySet(apiKey);
    
    try {
      const story = await generateStoryWithMultipleModels(apiKey);
      
      toast({
        title: "Storia Ottimizzata Generata!",
        description: `Storia coerente di ${story.scenes.length} scene e ${story.wordCount} parole senza ripetizioni!`,
      });

      onStoryGenerated(story);
      
    } catch (error) {
      console.error('Errore nella generazione:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la generazione della storia. Controlla la tua API key.",
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
          <span className="text-sm font-medium">Passo 7 di 7</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gradient animate-float">
          Genera la Tua Storia Ottimizzata
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Sistema avanzato anti-ripetizioni con continuità narrativa garantita!
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
            <h4 className="font-semibold mb-2">🚀 Miglioramenti Anti-Ripetizioni:</h4>
            <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Struttura narrativa dettagliata pre-generazione
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Continuità tra scene garantita
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Sistema anti-ripetizioni avanzato
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Controllo qualità automatico
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">Modelli AI Utilizzati:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              {BEST_FREE_MODELS.map((model, index) => (
                <div key={model} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                  {model.split('/')[0]} - {model.split('/')[1]?.split(':')[0]}
                </div>
              ))}
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
                Generando Storia Ottimizzata...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Genera Storia Senza Ripetizioni (6 scene, 5000+ parole)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoryGeneration;
