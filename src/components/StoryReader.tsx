
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Plus, 
  Clock, 
  FileText, 
  Loader2, 
  ChevronLeft,
  Sparkles,
  Share2
} from 'lucide-react';

interface Chapter {
  id: number;
  title: string;
  content: string;
  wordCount: number;
}

interface Story {
  id: string;
  title: string;
  genre: any;
  chapters: Chapter[];
  totalWordCount: number;
  createdAt: string;
  prompt: string;
}

interface StoryReaderProps {
  story: Story;
  onBack: () => void;
  apiKey: string;
}

const FREE_MODELS = [
  'meta-llama/llama-3.2-3b-instruct:free',
  'microsoft/phi-3-mini-128k-instruct:free',
  'deepseek/deepseek-chat-v3-0324:free',
  'openchat/openchat-7b:free'
];

const StoryReader: React.FC<StoryReaderProps> = ({ story, onBack, apiKey }) => {
  const [isGeneratingChapter, setIsGeneratingChapter] = useState(false);
  const [currentStory, setCurrentStory] = useState<Story>(story);
  const { toast } = useToast();

  const estimatedReadingTime = Math.ceil(currentStory.totalWordCount / 200); // 200 words per minute

  const generateNextChapter = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Richiesta",
        description: "L'API key è necessaria per generare nuovi capitoli.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingChapter(true);

    try {
      const nextChapterNumber = currentStory.chapters.length + 1;
      const modelIndex = (nextChapterNumber - 1) % FREE_MODELS.length;
      const selectedModel = FREE_MODELS[modelIndex];

      // Crea un riassunto dei capitoli precedenti
      const previousChapters = currentStory.chapters.map(ch => 
        `${ch.title}: ${ch.content.slice(0, 200)}...`
      ).join('\n\n');

      const prompt = `
Continua questa storia ${currentStory.genre.name.toLowerCase()} basandoti sui capitoli precedenti:

STORIA PRECEDENTE:
${previousChapters}

Scrivi il capitolo ${nextChapterNumber} che:
- Continua naturalmente dalla storia precedente
- Mantiene la coerenza dei personaggi e della trama
- Introduce nuovi elementi interessanti
- È di almeno 800 parole
- Mantiene lo stesso tono e stile narrativo
- Include dialoghi vivaci e descrizioni dettagliate

Inizia direttamente con il titolo del capitolo e poi il contenuto.
`;

      const newChapterContent = await generateChapter(selectedModel, prompt, apiKey);
      
      if (!newChapterContent) {
        throw new Error('Contenuto del capitolo vuoto');
      }

      // Estrai il titolo se presente
      const lines = newChapterContent.split('\n');
      let title = `Capitolo ${nextChapterNumber}`;
      let content = newChapterContent;

      if (lines[0].toLowerCase().includes('capitolo')) {
        title = lines[0].trim();
        content = lines.slice(1).join('\n').trim();
      }

      const newChapter: Chapter = {
        id: nextChapterNumber,
        title,
        content,
        wordCount: content.split(' ').length
      };

      const updatedStory = {
        ...currentStory,
        chapters: [...currentStory.chapters, newChapter],
        totalWordCount: currentStory.totalWordCount + newChapter.wordCount
      };

      setCurrentStory(updatedStory);

      toast({
        title: "Nuovo Capitolo Aggiunto!",
        description: `Capitolo ${nextChapterNumber} generato con successo usando ${selectedModel.split('/')[0]}.`,
      });

    } catch (error) {
      console.error('Errore nella generazione del capitolo:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la generazione del capitolo.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingChapter(false);
    }
  };

  const generateChapter = async (model: string, prompt: string, apiKey: string): Promise<string> => {
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
            content: 'Sei uno scrittore professionista specializzato nella continuazione di storie coinvolgenti. Mantieni sempre coerenza narrativa e scrivi in italiano con stile vivace.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
        top_p: 0.9,
        frequency_penalty: 0.2,
        presence_penalty: 0.1
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  };

  const shareStory = async () => {
    const storyText = currentStory.chapters.map(ch => `${ch.title}\n\n${ch.content}`).join('\n\n---\n\n');
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentStory.title,
          text: `${currentStory.title} - Una storia ${currentStory.genre.name} generata da AI`,
        });
      } catch (error) {
        console.log('Condivisione annullata');
      }
    } else {
      // Fallback: copia negli appunti
      try {
        await navigator.clipboard.writeText(storyText);
        toast({
          title: "Storia Copiata!",
          description: "La storia è stata copiata negli appunti.",
        });
      } catch (error) {
        toast({
          title: "Errore",
          description: "Impossibile copiare la storia.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="hover:bg-muted/50"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Indietro
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gradient">
            {currentStory.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/20 to-orange-500/20">
              {currentStory.genre.name}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {estimatedReadingTime} min lettura
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
              {currentStory.totalWordCount.toLocaleString()} parole
            </div>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={shareStory}
          className="hover:bg-muted/50"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Condividi
        </Button>
      </div>

      {/* Progress */}
      <Card className="mb-6 gradient-dark border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso Storia</span>
            <span className="text-sm text-muted-foreground">
              {currentStory.chapters.length} capitoli
            </span>
          </div>
          <Progress 
            value={Math.min((currentStory.totalWordCount / 6000) * 100, 100)} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Obiettivo: ~6000 parole per 30 minuti di lettura
          </p>
        </CardContent>
      </Card>

      {/* Story Content */}
      <div className="space-y-6">
        {currentStory.chapters.map((chapter) => (
          <Card key={chapter.id} className="gradient-dark border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gradient flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {chapter.title}
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {chapter.wordCount.toLocaleString()} parole • ~{Math.ceil(chapter.wordCount / 200)} min
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-96">
                <div className="prose prose-invert max-w-none">
                  {chapter.content.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="mb-4 text-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generate Next Chapter */}
      <Card className="mt-8 gradient-dark border-border/50">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-orange-600/20 rounded-full border border-purple-500/30">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">
                Prossimo modello: {FREE_MODELS[currentStory.chapters.length % FREE_MODELS.length].split('/')[0]}
              </span>
            </div>
            <h3 className="text-xl font-semibold">Continua la Storia</h3>
            <p className="text-muted-foreground">
              Genera il prossimo capitolo per sviluppare ulteriormente la trama
            </p>
            <Button 
              onClick={generateNextChapter}
              disabled={isGeneratingChapter}
              className="gradient-primary hover:opacity-90 transition-opacity"
              size="lg"
            >
              {isGeneratingChapter ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generando Capitolo {currentStory.chapters.length + 1}...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Genera Capitolo {currentStory.chapters.length + 1}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoryReader;
