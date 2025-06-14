import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronLeft, BookOpen, Edit, Sparkles, Eye } from 'lucide-react';

const PLOTS_BY_GENRE = {
  fantasy: [
    { id: 'quest', name: 'La Grande Missione', description: 'Un viaggio epico per salvare il mondo da un male antico' },
    { id: 'prophecy', name: 'La Profezia Perduta', description: 'Il protagonista deve compiere una profezia dimenticata' },
    { id: 'rebellion', name: 'La Ribellione', description: 'Una lotta contro un tiranno che opprime il regno' },
    { id: 'artifact', name: 'L\'Artefatto Maledetto', description: 'La ricerca di un oggetto magico dai poteri terribili' }
  ],
  scifi: [
    { id: 'invasion', name: 'L\'Invasione Aliena', description: 'La Terra sotto attacco da una forza extraterrestre' },
    { id: 'ai_uprising', name: 'La Rivolta delle IA', description: 'Le macchine si ribellano contro i loro creatori' },
    { id: 'time_paradox', name: 'Il Paradosso Temporale', description: 'Viaggi nel tempo che minacciano la realtà' },
    { id: 'exploration', name: 'L\'Esplorazione Galattica', description: 'La scoperta di nuovi mondi e civiltà' }
  ]
};

interface PlotSelectionProps {
  wizardData: any;
  selectedPlot: any;
  onPlotSelect: (plot: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const PlotSelection: React.FC<PlotSelectionProps> = ({
  wizardData,
  selectedPlot,
  onPlotSelect,
  onNext,
  onPrev
}) => {
  const [customPlot, setCustomPlot] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [editingPlot, setEditingPlot] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewingPlot, setViewingPlot] = useState(null);

  const plots = PLOTS_BY_GENRE[wizardData.genre?.id as keyof typeof PLOTS_BY_GENRE] || [];

  const handleCustomSubmit = () => {
    if (customPlot) {
      onPlotSelect({
        id: 'custom',
        name: 'Trama Personalizzata',
        description: customPlot,
        custom: true
      });
    }
  };

  const handleViewPlot = (plot: any) => {
    setViewingPlot(plot);
    setEditingPlot(plot.description);
    setDialogOpen(true);
  };

  const handleSavePlotEdit = () => {
    if (editingPlot) {
      const updatedPlot = {
        ...viewingPlot,
        description: editingPlot,
        custom: true
      };
      onPlotSelect(updatedPlot);
      setDialogOpen(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onPrev}
          className="hover:bg-muted/50"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Indietro
        </Button>
      </div>

      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-orange-600/20 rounded-full border border-purple-500/30">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-medium">Passo 5 di 7</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gradient animate-float">
          Scegli la Trama
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Quale conflitto centrale guiderà la tua storia in {wizardData.setting?.name}?
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Badge variant="secondary">{wizardData.genre?.icon} {wizardData.genre?.name}</Badge>
          <Badge variant="outline">{wizardData.setting?.name}</Badge>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <Button 
          variant={!showCustom ? "default" : "outline"}
          onClick={() => setShowCustom(false)}
        >
          Trame Predefinite
        </Button>
        <Button 
          variant={showCustom ? "default" : "outline"}
          onClick={() => setShowCustom(true)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Personalizza
        </Button>
      </div>

      {!showCustom ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {plots.map((plot) => (
            <Card
              key={plot.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedPlot?.id === plot.id
                  ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-500/20 to-orange-500/20'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => onPlotSelect(plot)}
            >
              <CardHeader className="text-center pb-2">
                <div className="text-4xl mb-2">
                  <BookOpen className="w-12 h-12 mx-auto text-orange-400" />
                </div>
                <CardTitle className="text-lg">{plot.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {plot.description}
                </p>
                <Dialog open={dialogOpen && viewingPlot?.id === plot.id} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewPlot(plot);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Visualizza e Modifica
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {plot.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="plot-edit">Descrizione della Trama</Label>
                        <Textarea
                          id="plot-edit"
                          value={editingPlot}
                          onChange={(e) => setEditingPlot(e.target.value)}
                          className="bg-input/50 min-h-[150px]"
                          placeholder="Modifica la descrizione della trama..."
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => setDialogOpen(false)}
                        >
                          Annulla
                        </Button>
                        <Button
                          onClick={handleSavePlotEdit}
                          disabled={!editingPlot}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Salva Modifiche
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="gradient-dark border-border/50">
            <CardHeader>
              <CardTitle>Crea la Tua Trama</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="plot">Descrivi la Trama</Label>
                <Textarea
                  id="plot"
                  value={customPlot}
                  onChange={(e) => setCustomPlot(e.target.value)}
                  placeholder="Descrivi il conflitto principale, gli obiettivi del protagonista e gli ostacoli che dovrà affrontare..."
                  className="bg-input/50 min-h-[120px]"
                />
              </div>

              <Button 
                onClick={handleCustomSubmit}
                disabled={!customPlot}
                className="w-full"
              >
                Conferma Trama
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {(selectedPlot || customPlot) && (
        <div className="text-center">
          <Card className="max-w-md mx-auto gradient-dark border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-orange-400" />
                <div>
                  <h3 className="font-semibold">{selectedPlot?.name || 'Trama Personalizzata'}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {selectedPlot?.description || customPlot}
                  </p>
                </div>
              </div>
              {selectedPlot && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mb-3"
                  onClick={() => handleViewPlot(selectedPlot)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizza Trama Completa
                </Button>
              )}
              <Button 
                onClick={onNext}
                className="w-full gradient-primary hover:opacity-90 transition-opacity"
                size="lg"
              >
                Continua con lo Stile
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PlotSelection;
