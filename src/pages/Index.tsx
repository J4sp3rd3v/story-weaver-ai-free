
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-6 py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-orange-600/20 rounded-full border border-purple-500/30">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium">Alimentato da AI multipli</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold text-gradient animate-float">
            StoryMaster AI
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Crea storie assurde e coinvolgenti di almeno 30 minuti personalizzando ogni dettaglio: 
            genere, autore, personaggi, ambientazione e stile visivo.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="gradient-dark border-border/50 hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h3 className="text-lg font-semibold mb-2">7 Passi Guidati</h3>
                <p className="text-sm text-muted-foreground">
                  Scegli genere, autore, personaggi, ambientazione, trama e stile
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-dark border-border/50 hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 mx-auto mb-4 text-orange-400" />
                <h3 className="text-lg font-semibold mb-2">AI Multipli</h3>
                <p className="text-sm text-muted-foreground">
                  Utilizza diversi modelli per una narrazione ricca e variata
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-dark border-border/50 hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-lg font-semibold mb-2">Prompt Immagini</h3>
                <p className="text-sm text-muted-foreground">
                  Genera prompt per Fooocus per ogni scena della storia
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="pt-8">
            <Button 
              onClick={() => navigate('/wizard')}
              className="gradient-primary hover:opacity-90 transition-opacity text-lg px-8 py-4 h-auto"
              size="lg"
            >
              <BookOpen className="w-6 h-6 mr-3" />
              Inizia a Creare la Tua Storia
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
