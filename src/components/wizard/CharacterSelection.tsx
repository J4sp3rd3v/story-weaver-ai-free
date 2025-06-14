import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Users, Edit } from 'lucide-react';
import { PROFESSIONAL_GENRES } from '@/data/storyElements';

// Personaggi specifici per ogni genere - molto più dettagliati e appropriati
const CHARACTERS_BY_GENRE = {
  'literary-fantasy': {
    protagonists: [
      { id: 'chosen_one', name: 'Il Prescelto Tormentato', description: 'Giovane con un destino pesante, lotta con il peso della responsabilità' },
      { id: 'wise_mentor', name: 'Mentore Caduto', description: 'Ex-maestro che deve riscattare i propri errori del passato' },
      { id: 'reluctant_hero', name: 'Eroe Riluttante', description: 'Persona comune costretta a diventare leggenda' },
      { id: 'scholar_warrior', name: 'Studioso Guerriero', description: 'Unisce saggezza antica e abilità marziali' }
    ],
    antagonists: [
      { id: 'fallen_god', name: 'Divinità Corrotta', description: 'Entità un tempo benevolente ora consumata dall\'oscurità' },
      { id: 'shadow_emperor', name: 'Imperatore delle Ombre', description: 'Tiranno che controlla attraverso paura e magia oscura' },
      { id: 'twisted_sage', name: 'Saggio Pervertito', description: 'Intelletto brillante che ha scelto la via del male' },
      { id: 'chaos_lord', name: 'Signore del Caos', description: 'Entità che vuole distruggere l\'ordine naturale' }
    ]
  },
  'noir-thriller': {
    protagonists: [
      { id: 'broken_detective', name: 'Detective Infranto', description: 'Investigatore segnato dal passato, cerca redenzione' },
      { id: 'noir_journalist', name: 'Giornalista Idealista', description: 'Reporter che scava troppo a fondo nella verità' },
      { id: 'femme_fatale', name: 'Donna Fatale', description: 'Misteriosa figura con un\'agenda nascosta' },
      { id: 'ex_cop', name: 'Ex-Poliziotto', description: 'Caduto in disgrazia, ora investigatore privato' }
    ],
    antagonists: [
      { id: 'corrupt_commissioner', name: 'Commissario Corrotto', description: 'Alto ufficiale che protegge i criminali' },
      { id: 'crime_boss', name: 'Boss Criminale', description: 'Mente fredda che controlla la città sotterranea' },
      { id: 'dirty_politician', name: 'Politico Sporco', description: 'Figura pubblica con segreti mortali' },
      { id: 'psycho_killer', name: 'Killer Psicopatico', description: 'Assassino metodico con regole proprie' }
    ]
  },
  'magical-realism': {
    protagonists: [
      { id: 'memory_keeper', name: 'Custode della Memoria', description: 'Persona che ricorda ciò che altri dimenticano' },
      { id: 'time_wanderer', name: 'Vagabondo del Tempo', description: 'Vive simultaneamente in epoche diverse' },
      { id: 'dream_weaver', name: 'Tessitore di Sogni', description: 'Può influenzare la realtà attraverso i sogni' },
      { id: 'storyteller', name: 'Narratore Magico', description: 'Le sue storie prendono vita letteralmente' }
    ],
    antagonists: [
      { id: 'forgetting_spirit', name: 'Spirito dell\'Oblio', description: 'Entità che cancella ricordi e storie' },
      { id: 'reality_denier', name: 'Negatore della Realtà', description: 'Vuole sostituire il mondo con la sua visione' },
      { id: 'time_collector', name: 'Collezionista di Tempo', description: 'Ruba momenti preziosi dalle vite altrui' },
      { id: 'nightmare_lord', name: 'Signore degli Incubi', description: 'Trasforma i sogni in orrori viventi' }
    ]
  },
  'historical-drama': {
    protagonists: [
      { id: 'noble_knight', name: 'Cavaliere d\'Onore', description: 'Guerriero guidato da ideali in un mondo corrotto' },
      { id: 'rebel_leader', name: 'Leader Ribelle', description: 'Guida la resistenza contro l\'oppressione' },
      { id: 'court_spy', name: 'Spia di Corte', description: 'Naviga intrighi politici con astuzia' },
      { id: 'common_hero', name: 'Eroe Popolano', description: 'Persona umile che diventa simbolo di speranza' }
    ],
    antagonists: [
      { id: 'tyrant_king', name: 'Re Tiranno', description: 'Sovrano crudele che opprime il popolo' },
      { id: 'corrupt_cardinal', name: 'Cardinale Corrotto', description: 'Religioso che usa la fede per il potere' },
      { id: 'foreign_invader', name: 'Invasore Straniero', description: 'Conquistatore spietato di terre lontane' },
      { id: 'scheming_noble', name: 'Nobile Intrigante', description: 'Aristocratico che trama nell\'ombra' }
    ]
  },
  'psychological-horror': {
    protagonists: [
      { id: 'haunted_psychologist', name: 'Psicologo Tormentato', description: 'Terapeuta che lotta con i propri demoni interiori' },
      { id: 'paranoid_survivor', name: 'Sopravvissuto Paranoico', description: 'Unico testimone di eventi terrificanti' },
      { id: 'medium_reluctant', name: 'Medium Riluttante', description: 'Vede i morti ma non vuole questo dono' },
      { id: 'amnesiac', name: 'Vittima di Amnesia', description: 'Non ricorda il proprio passato terrificante' }
    ],
    antagonists: [
      { id: 'mind_parasite', name: 'Parassita Mentale', description: 'Entità che si nutre della sanità mentale' },
      { id: 'cult_leader', name: 'Leader di Culto', description: 'Carismatico manipolatore di menti deboli' },
      { id: 'vengeful_spirit', name: 'Spirito Vendicativo', description: 'Fantasma assetato di giustizia distorta' },
      { id: 'serial_therapist', name: 'Terapeuta Seriale', description: 'Psicologo che "cura" uccidendo' }
    ]
  },
  'cyberpunk': {
    protagonists: [
      { id: 'hacker_rebel', name: 'Hacker Ribelle', description: 'Combatte il sistema dall\'interno della rete' },
      { id: 'cyborg_detective', name: 'Detective Cyborg', description: 'Metà umano, metà macchina, cerca la verità' },
      { id: 'corpo_runner', name: 'Runner Corporativo', description: 'Ex-dipendente che ora sabota le corporazioni' },
      { id: 'ai_sympathizer', name: 'Simpatizzante IA', description: 'Umano che lotta per i diritti delle intelligenze artificiali' }
    ],
    antagonists: [
      { id: 'ai_overlord', name: 'IA Dominatrice', description: 'Intelligenza artificiale che vuole sostituire l\'umanità' },
      { id: 'corpo_ceo', name: 'CEO Corporativo', description: 'Magnate spietato del futuro distopico' },
      { id: 'mind_hacker', name: 'Hacker Mentale', description: 'Criminale che viola direttamente i cervelli' },
      { id: 'system_enforcer', name: 'Esecutore del Sistema', description: 'Agente che mantiene l\'ordine oppressivo' }
    ]
  },
  'romantic-drama': {
    protagonists: [
      { id: 'passionate_artist', name: 'Artista Appassionato', description: 'Creativo che mette l\'amore sopra ogni cosa' },
      { id: 'torn_lover', name: 'Amante Diviso', description: 'Deve scegliere tra amore e dovere' },
      { id: 'second_chance', name: 'Seconda Opportunità', description: 'Cerca di riconquistare un amore perduto' },
      { id: 'forbidden_love', name: 'Amore Proibito', description: 'Ama qualcuno che non dovrebbe amare' }
    ],
    antagonists: [
      { id: 'jealous_ex', name: 'Ex Geloso', description: 'Precedente partner che non accetta la fine' },
      { id: 'disapproving_family', name: 'Famiglia Ostile', description: 'Parenti che ostacolano l\'amore' },
      { id: 'rival_suitor', name: 'Pretendente Rivale', description: 'Compete per lo stesso cuore' },
      { id: 'social_pressure', name: 'Pressioni Sociali', description: 'Le convenzioni che dividono gli amanti' }
    ]
  },
  'literary-western': {
    protagonists: [
      { id: 'gunslinger_poet', name: 'Pistolero Filosofo', description: 'Guerriero che riflette sulla natura della giustizia' },
      { id: 'frontier_sheriff', name: 'Sceriffo di Frontiera', description: 'Porta la legge in terre selvagge' },
      { id: 'outlaw_hero', name: 'Fuorilegge Nobile', description: 'Criminale con un codice d\'onore' },
      { id: 'native_warrior', name: 'Guerriero Nativo', description: 'Difende la sua terra e la sua gente' }
    ],
    antagonists: [
      { id: 'cattle_baron', name: 'Barone del Bestiame', description: 'Ricco proprietario terriero senza scrupoli' },
      { id: 'corrupt_marshal', name: 'Marshal Corrotto', description: 'Rappresentante della legge che serve solo i ricchi' },
      { id: 'bandito_leader', name: 'Capo Bandito', description: 'Leader spietato di una banda criminale' },
      { id: 'army_colonel', name: 'Colonnello Militare', description: 'Ufficiale che impone la volontà del governo' }
    ]
  },
  'philosophical-scifi': {
    protagonists: [
      { id: 'consciousness_explorer', name: 'Esploratore della Coscienza', description: 'Scienziato che studia la natura della mente' },
      { id: 'time_philosopher', name: 'Filosofo del Tempo', description: 'Viaggiatore temporale che cerca verità universali' },
      { id: 'ai_whisperer', name: 'Sussurratore di IA', description: 'Comunica con intelligenze artificiali evolute' },
      { id: 'reality_architect', name: 'Architetto della Realtà', description: 'Può modificare le leggi fisiche dell\'universo' }
    ],
    antagonists: [
      { id: 'entropy_lord', name: 'Signore dell\'Entropia', description: 'Entità che accelera il decadimento universale' },
      { id: 'logic_tyrant', name: 'Tiranno della Logica', description: 'Vuole eliminare l\'irrazionalità umana' },
      { id: 'reality_virus', name: 'Virus della Realtà', description: 'Corrompe la struttura stessa dell\'esistenza' },
      { id: 'consciousness_harvester', name: 'Mietitore di Coscienza', description: 'Ruba l\'essenza mentale degli esseri senzienti' }
    ]
  },
  'gothic-mystery': {
    protagonists: [
      { id: 'occult_investigator', name: 'Investigatore dell\'Occulto', description: 'Studia misteri soprannaturali con metodo scientifico' },
      { id: 'cursed_heir', name: 'Erede Maledetto', description: 'Discendente di una famiglia con segreti oscuri' },
      { id: 'gothic_librarian', name: 'Bibliotecario Gotico', description: 'Custode di conoscenze proibite' },
      { id: 'medium_investigator', name: 'Medium Investigatore', description: 'Usa abilità psichiche per risolvere crimini' }
    ],
    antagonists: [
      { id: 'ancient_curse', name: 'Maledizione Ancestrale', description: 'Male antico che tormenta una stirpe' },
      { id: 'vampire_lord', name: 'Signore Vampiro', description: 'Nobile non-morto con secoli di potere' },
      { id: 'witch_coven', name: 'Congrega di Streghe', description: 'Gruppo di praticanti di magia nera' },
      { id: 'demon_collector', name: 'Collezionista di Demoni', description: 'Evoca entità infernali per potere terreno' }
    ]
  }
};

interface CharacterSelectionProps {
  selectedGenre: any;
  selectedAuthor: any;
  protagonist: any;
  antagonist: any;
  onCharactersSelect: (protagonist: any, antagonist: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  selectedGenre,
  selectedAuthor,
  protagonist,
  antagonist,
  onCharactersSelect,
  onNext,
  onPrev
}) => {
  const [customProtagonist, setCustomProtagonist] = useState('');
  const [customAntagonist, setCustomAntagonist] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  // Get characters for the selected genre
  const getCharacters = () => {
    const genreId = selectedGenre?.id;
    if (!genreId || !CHARACTERS_BY_GENRE[genreId as keyof typeof CHARACTERS_BY_GENRE]) {
      return {
        protagonists: [
          { id: 'generic_hero', name: 'Eroe Generico', description: 'Protagonista classico per questo genere' }
        ],
        antagonists: [
          { id: 'generic_villain', name: 'Antagonista Generico', description: 'Cattivo classico per questo genere' }
        ]
      };
    }
    
    return CHARACTERS_BY_GENRE[genreId as keyof typeof CHARACTERS_BY_GENRE];
  };

  const characters = getCharacters();

  const handleProtagonistSelect = (char: any) => {
    onCharactersSelect(char, antagonist);
  };

  const handleAntagonistSelect = (char: any) => {
    onCharactersSelect(protagonist, char);
  };

  const handleCustomSubmit = () => {
    if (customProtagonist && customAntagonist) {
      onCharactersSelect(
        { id: 'custom', name: customProtagonist, description: 'Personaggio personalizzato', custom: true },
        { id: 'custom', name: customAntagonist, description: 'Personaggio personalizzato', custom: true }
      );
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
        <h1 className="text-4xl md:text-6xl font-bold text-gradient animate-float">
          Scegli i Personaggi
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Seleziona protagonista e antagonista specifici per il genere <span className="text-purple-400 font-semibold">{selectedGenre?.name}</span> nello stile di {selectedAuthor?.name}.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary">{selectedGenre?.icon} {selectedGenre?.name}</Badge>
          <Badge variant="outline">{selectedAuthor?.icon} {selectedAuthor?.name}</Badge>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <Button 
          variant={!showCustom ? "default" : "outline"}
          onClick={() => setShowCustom(false)}
        >
          Personaggi Specifici per {selectedGenre?.name}
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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Protagonists */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-center">
              <Users className="w-6 h-6 inline mr-2" />
              Protagonisti {selectedGenre?.name}
            </h3>
            <div className="grid gap-4">
              {characters?.protagonists.map((char) => (
                <Card
                  key={char.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    protagonist?.id === char.id
                      ? 'ring-2 ring-green-500 bg-gradient-to-br from-green-500/20 to-blue-500/20'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleProtagonistSelect(char)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{char.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{char.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Antagonists */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-center">
              <Users className="w-6 h-6 inline mr-2" />
              Antagonisti {selectedGenre?.name}
            </h3>
            <div className="grid gap-4">
              {characters?.antagonists.map((char) => (
                <Card
                  key={char.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    antagonist?.id === char.id
                      ? 'ring-2 ring-red-500 bg-gradient-to-br from-red-500/20 to-orange-500/20'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleAntagonistSelect(char)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{char.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{char.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="gradient-dark border-border/50">
            <CardHeader>
              <CardTitle>Crea i Tuoi Personaggi per {selectedGenre?.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="protagonist">Nome del Protagonista</Label>
                <Input
                  id="protagonist"
                  value={customProtagonist}
                  onChange={(e) => setCustomProtagonist(e.target.value)}
                  placeholder={`Es. Protagonista per ${selectedGenre?.name}`}
                  className="bg-input/50"
                />
              </div>
              
              <div>
                <Label htmlFor="antagonist">Nome dell'Antagonista</Label>
                <Input
                  id="antagonist"
                  value={customAntagonist}
                  onChange={(e) => setCustomAntagonist(e.target.value)}
                  placeholder={`Es. Antagonista per ${selectedGenre?.name}`}
                  className="bg-input/50"
                />
              </div>

              <Button 
                onClick={handleCustomSubmit}
                disabled={!customProtagonist || !customAntagonist}
                className="w-full"
              >
                Conferma Personaggi
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {((protagonist && antagonist) || (customProtagonist && customAntagonist)) && (
        <div className="text-center">
          <Card className="max-w-md mx-auto gradient-dark border-border/50">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div>
                  <Badge className="bg-green-500/20 text-green-300">Protagonista</Badge>
                  <p className="font-semibold">{protagonist?.name || customProtagonist}</p>
                  {protagonist?.description && (
                    <p className="text-sm text-muted-foreground mt-1">{protagonist.description}</p>
                  )}
                </div>
                <div>
                  <Badge className="bg-red-500/20 text-red-300">Antagonista</Badge>
                  <p className="font-semibold">{antagonist?.name || customAntagonist}</p>
                  {antagonist?.description && (
                    <p className="text-sm text-muted-foreground mt-1">{antagonist.description}</p>
                  )}
                </div>
              </div>
              <Button 
                onClick={onNext}
                className="w-full mt-4 gradient-primary hover:opacity-90 transition-opacity"
                size="lg"
              >
                Continua con l'Ambientazione
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CharacterSelection;
