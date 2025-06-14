
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, BookOpen, Edit, Sparkles, Eye, Target } from 'lucide-react';

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
  const [currentPlotDialog, setCurrentPlotDialog] = useState<any>(null);

  // Funzione per generare trame specifiche basate sui personaggi e contesto
  const generateContextualPlots = () => {
    const protagonist = wizardData?.protagonist;
    const antagonist = wizardData?.antagonist;
    const setting = wizardData?.setting;
    const genre = wizardData?.genre;

    console.log('Generating plots for:', { protagonist, antagonist, setting, genre });

    // Se abbiamo detective + killer
    if (protagonist?.name?.toLowerCase().includes('detective') && 
        (antagonist?.name?.toLowerCase().includes('killer') || 
         antagonist?.name?.toLowerCase().includes('assassin'))) {
      return [
        {
          id: 'serial_investigation',
          name: 'Indagine Seriale',
          description: `${protagonist.name} deve catturare ${antagonist.name} che sta terrorizzando ${setting?.name || 'la città'}. Una caccia all'uomo psicologica dove ogni indizio porta più vicino alla verità.`
        },
        {
          id: 'mind_duel',
          name: 'Duello Mentale',
          description: `${antagonist.name} sfida direttamente ${protagonist.name} con messaggi criptici e scene del crimine elaborate in ${setting?.name || 'luoghi specifici'}.`
        },
        {
          id: 'personal_vendetta',
          name: 'Vendetta Personale',
          description: `Il caso diventa personale quando ${antagonist.name} prende di mira persone care a ${protagonist.name}, trasformando l'indagine in una questione di sopravvivenza.`
        }
      ];
    }

    // Se abbiamo mago + demone (fantasy)
    if (genre?.id === 'fantasy' && 
        protagonist?.name?.toLowerCase().includes('mago') && 
        antagonist?.name?.toLowerCase().includes('demon')) {
      return [
        {
          id: 'magical_binding',
          name: 'Il Patto Infranto',
          description: `${protagonist.name} deve fermare ${antagonist.name} che è sfuggito da un antico sigillo in ${setting?.name || 'un regno magico'}. La magia è l'unica arma disponibile.`
        },
        {
          id: 'ritual_prevention',
          name: 'Il Rituale Oscuro',
          description: `${antagonist.name} sta preparando un rituale per aprire un portale negli Inferi. ${protagonist.name} ha poco tempo per fermarlo prima che ${setting?.name || 'il mondo'} cada nell'oscurità.`
        }
      ];
    }

    // Se abbiamo guerriero + tiranno
    if (protagonist?.name?.toLowerCase().includes('guerriero') && 
        antagonist?.name?.toLowerCase().includes('tiranno')) {
      return [
        {
          id: 'rebellion_war',
          name: 'Guerra di Liberazione',
          description: `${protagonist.name} guida una ribellione contro ${antagonist.name} che opprime ${setting?.name || 'il regno'}. Una battaglia per la libertà e la giustizia.`
        },
        {
          id: 'chosen_destiny',
          name: 'Il Destino del Prescelto',
          description: `Solo ${protagonist.name} può wielding un'arma leggendaria per sconfiggere ${antagonist.name} e liberare ${setting?.name || 'la terra'} dalla sua tirannia.`
        }
      ];
    }

    // Trame generiche ma contestualizzate
    return [
      {
        id: 'epic_confrontation',
        name: 'Lo Scontro Finale',
        description: `${protagonist.name} e ${antagonist.name} si affrontano in ${setting?.name || 'un luogo leggendario'} per decidere il destino di tutti. Un conflitto che cambierà tutto per sempre.`
      },
      {
        id: 'hidden_truth',
        name: 'La Verità Nascosta',
        description: `${protagonist.name} scopre che la vera natura di ${antagonist.name} è molto diversa da quello che sembrava. In ${setting?.name || 'questo mondo'}, niente è come appare.`
      },
      {
        id: 'redemption_arc',
        name: 'Redenzione Impossibile',
        description: `${protagonist.name} deve decidere se ${antagonist.name} merita una seconda possibilità, mentre gli eventi in ${setting?.name || 'questo luogo'} precipitano verso il caos.`
      }
    ];
  };

  const plots = generateContextualPlots();

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
    setCurrentPlotDialog(plot);
    setEditingPlot(plot.description);
  };

  const handleSavePlotEdit = () => {
    if (editingPlot && currentPlotDialog) {
      const updatedPlot = {
        ...currentPlotDialog,
        description: editingPlot,
        custom: true
      };
      onPlotSelect(updatedPlot);
      setCurrentPlotDialog(null);
    }
  };

  const handleCloseDialog = () => {
    setCurrentPlotDialog(null);
    setEditingPlot('');
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
          Trame generate specificamente per le tue scelte: {wizardData?.protagonist?.name} vs {wizardData?.antagonist?.name} in {wizardData?.setting?.name}
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {wizardData?.genre && (
            <Badge variant="secondary">{wizardData.genre.icon} {wizardData.genre.name}</Badge>
          )}
          {wizardData?.setting && (
            <Badge variant="outline">{wizardData.setting.name}</Badge>
          )}
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <Target className="w-3 h-3 mr-1" />
            Trame Personalizzate
          </Badge>
        </div>
      </div>

      <Card className="gradient-dark border-border/50">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground text-center">
            <span className="text-green-400 font-semibold">✓ Trame generate automaticamente</span> basate sui tuoi personaggi e ambientazione
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4 mb-6">
        <Button 
          variant={!showCustom ? "default" : "outline"}
          onClick={() => setShowCustom(false)}
        >
          Trame Suggerite
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
        <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                <p className="text-sm text-muted-foreground">
                  {plot.description}
                </p>
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
                  placeholder={`Descrivi il conflitto tra ${wizardData?.protagonist?.name || 'il protagonista'} e ${wizardData?.antagonist?.name || 'l\'antagonista'} in ${wizardData?.setting?.name || 'questa ambientazione'}...`}
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

      <Dialog open={!!currentPlotDialog} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {currentPlotDialog?.name}
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
                onClick={handleCloseDialog}
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
