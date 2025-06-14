
// Dati modulari per elementi narrativi professionali

export interface GenreData {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tones: string[];
  themes: string[];
  writingStyle: string;
  targetLength: string;
}

export interface AuthorStyle {
  id: string;
  name: string;
  description: string;
  icon: string;
  period: string;
  techniques: string[];
  signature: string;
  genres: string[];
  toneAdjustments: Record<string, string>;
}

export interface CharacterArchetype {
  id: string;
  name: string;
  description: string;
  motivations: string[];
  flaws: string[];
  strengths: string[];
  archetypeFamily: string;
  compatibleGenres: string[];
}

export interface SettingTemplate {
  id: string;
  name: string;
  description: string;
  atmosphere: string[];
  conflicts: string[];
  opportunities: string[];
  visualElements: string[];
  compatibleGenres: string[];
}

export interface PlotStructure {
  id: string;
  name: string;
  description: string;
  acts: Array<{
    name: string;
    purpose: string;
    keyEvents: string[];
  }>;
  conflictTypes: string[];
  resolution: string;
  compatibleGenres: string[];
}

// GENERI PROFESSIONALI RAFFINATI (ESPANSI)
export const PROFESSIONAL_GENRES: GenreData[] = [
  {
    id: 'literary-fantasy',
    name: 'Fantasy Letterario',
    description: 'Fantasy sofisticato con profondità psicologica e temi universali',
    icon: '📚',
    color: 'from-purple-600 to-indigo-700',
    tones: ['contemplativo', 'epico', 'malinconia poetica', 'mistero arcano'],
    themes: ['crescita personale', 'potere e corruzione', 'sacrificio', 'eredità'],
    writingStyle: 'Prosa ricca, descrizioni evocative, dialoghi profondi',
    targetLength: '6000-8000 parole'
  },
  {
    id: 'noir-thriller',
    name: 'Noir Psicologico',
    description: 'Thriller introspettivo con atmosfere dark e personaggi complessi',
    icon: '🌙',
    color: 'from-gray-800 to-slate-900',
    tones: ['cupo', 'introspettivo', 'tensione crescente', 'rivelazione graduale'],
    themes: ['colpa e redenzione', 'verità nascosta', 'giustizia morale', 'identità'],
    writingStyle: 'Stile asciutto, tensione costante, flashback strategici',
    targetLength: '5000-7000 parole'
  },
  {
    id: 'magical-realism',
    name: 'Realismo Magico',
    description: 'Realtà quotidiana arricchita da elementi fantastici sottili',
    icon: '✨',
    color: 'from-emerald-600 to-teal-700',
    tones: ['onirico', 'nostalgico', 'surreale', 'emotivamente intenso'],
    themes: ['memoria e tempo', 'amore e perdita', 'tradizione vs modernità', 'destino'],
    writingStyle: 'Prosa poetica, simbolismo ricco, transizioni fluide',
    targetLength: '4000-6000 parole'
  },
  {
    id: 'historical-drama',
    name: 'Dramma Storico',
    description: 'Narrazioni ambientate nel passato con ricerca accurata',
    icon: '⚔️',
    color: 'from-amber-700 to-orange-800',
    tones: ['epico', 'intimista', 'drammatico', 'riflessivo'],
    themes: ['onore e dovere', 'cambiamento sociale', 'sopravvivenza', 'legacy'],
    writingStyle: 'Linguaggio d\'epoca, dettagli storici accurati, conflitti umani',
    targetLength: '6000-8000 parole'
  },
  {
    id: 'psychological-horror',
    name: 'Horror Psicologico',
    description: 'Terrore che nasce dalla mente umana e dalle sue ossessioni',
    icon: '🧠',
    color: 'from-red-900 to-black',
    tones: ['inquietante', 'claustrofobico', 'paranoico', 'disturbante'],
    themes: ['follia', 'isolamento', 'perdita di realtà', 'colpa nascosta'],
    writingStyle: 'Atmosfera opprimente, dettagli disturbanti, tensione crescente',
    targetLength: '5000-7000 parole'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Letterario',
    description: 'Futuro distopico con temi sociali e tecnologici profondi',
    icon: '🤖',
    color: 'from-cyan-600 to-purple-800',
    tones: ['dystopico', 'ribelle', 'tecnologico', 'esistenziale'],
    themes: ['umanità vs tecnologia', 'controllo sociale', 'identità digitale', 'resistenza'],
    writingStyle: 'Linguaggio tecnico, ritmo veloce, atmosfere neon',
    targetLength: '6000-8000 parole'
  },
  {
    id: 'romantic-drama',
    name: 'Dramma Romantico',
    description: 'Storie d\'amore profonde con conflitti emotivi complessi',
    icon: '💕',
    color: 'from-rose-500 to-pink-700',
    tones: ['passionale', 'malinconica', 'intensa', 'poetica'],
    themes: ['amore impossibile', 'sacrificio', 'crescita emotiva', 'destino'],
    writingStyle: 'Prosa emotiva, dialoghi intimi, descrizioni sensoriali',
    targetLength: '5000-7000 parole'
  },
  {
    id: 'literary-western',
    name: 'Western Letterario',
    description: 'Frontiera americana con profondità psicologica e morale',
    icon: '🤠',
    color: 'from-yellow-700 to-red-800',
    tones: ['epico', 'solitario', 'morale', 'selvaggio'],
    themes: ['giustizia', 'sopravvivenza', 'civiltà vs natura', 'redenzione'],
    writingStyle: 'Descrizioni paesaggistiche, dialoghi secchi, azione dinamica',
    targetLength: '6000-8000 parole'
  },
  {
    id: 'philosophical-scifi',
    name: 'Fantascienza Filosofica',
    description: 'Esplorazione di concetti profondi attraverso la speculazione scientifica',
    icon: '🌌',
    color: 'from-blue-600 to-indigo-900',
    tones: ['contemplativo', 'speculativo', 'cerebrale', 'visionario'],
    themes: ['natura dell\'umanità', 'tempo e spazio', 'coscienza', 'progresso'],
    writingStyle: 'Concetti complessi, dialoghi filosofici, descrizioni scientifiche',
    targetLength: '7000-9000 parole'
  },
  {
    id: 'gothic-mystery',
    name: 'Mistero Gotico',
    description: 'Enigmi avvolti in atmosfere oscure e romantiche',
    icon: '🏰',
    color: 'from-purple-900 to-black',
    tones: ['gotico', 'misterioso', 'romantico', 'tenebroso'],
    themes: ['segreti familiari', 'passato che ritorna', 'amore e morte', 'destino'],
    writingStyle: 'Atmosfere cupe, descrizioni elaborate, suspense graduali',
    targetLength: '6000-8000 parole'
  }
];

// STILI AUTORIALI SPECIFICI (MOLTO ESPANSI)
export const AUTHOR_STYLES: AuthorStyle[] = [
  // LETTERATURA CLASSICA
  {
    id: 'borges-style',
    name: 'Jorge Luis Borges',
    description: 'Labirinti concettuali, paradossi temporali, erudizione sottile',
    icon: '🌀',
    period: 'XX secolo',
    techniques: ['meta-narrazione', 'riferimenti letterari', 'strutture circolari', 'paradossi logici'],
    signature: 'Racconti brevi densi di significato filosofico',
    genres: ['literary-fantasy', 'magical-realism', 'philosophical-scifi'],
    toneAdjustments: {
      'contemplativo': 'Riflessione filosofica profonda',
      'misterioso': 'Enigmi intellettuali stratificati'
    }
  },
  {
    id: 'marquez-style',
    name: 'Gabriel García Márquez',
    description: 'Realismo magico, saghe familiari, tempo ciclico',
    icon: '🦋',
    period: 'XX secolo',
    techniques: ['realismo magico', 'narrazione epica', 'simbolismo ricco', 'tempo non-lineare'],
    signature: 'Storie generazionali con elementi fantastici naturali',
    genres: ['magical-realism', 'literary-fantasy', 'romantic-drama'],
    toneAdjustments: {
      'onirico': 'Fusione naturale tra reale e magico',
      'nostalgico': 'Malinconia per tempi perduti'
    }
  },
  {
    id: 'poe-style',
    name: 'Edgar Allan Poe',
    description: 'Maestro del terrore gotico e del mistero psicologico',
    icon: '🖤',
    period: 'XIX secolo',
    techniques: ['narrazione in prima persona', 'atmosfere oppressive', 'climax esplosivi', 'simbolismo dark'],
    signature: 'Racconti di follia, morte e ossessione',
    genres: ['psychological-horror', 'gothic-mystery', 'noir-thriller'],
    toneAdjustments: {
      'inquietante': 'Tensione psicologica crescente',
      'gotico': 'Atmosfere romantiche e terrificanti'
    }
  },
  {
    id: 'hemingway-style',
    name: 'Ernest Hemingway',
    description: 'Prosa iceberg, dialoghi essenziali, sottotesti profondi',
    icon: '🥃',
    period: 'XX secolo',
    techniques: ['teoria iceberg', 'dialoghi realistici', 'show don\'t tell', 'economia verbale'],
    signature: 'Storie di guerra, amore e perdita con stile minimalista',
    genres: ['literary-western', 'historical-drama', 'romantic-drama'],
    toneAdjustments: {
      'epico': 'Grandiosità sottile e non detta',
      'intimista': 'Emozioni nascoste dietro azioni'
    }
  },
  {
    id: 'tolkien-style',
    name: 'J.R.R. Tolkien',
    description: 'Creatore di mondi fantastici con mitologie profonde',
    icon: '🧙',
    period: 'XX secolo',
    techniques: ['world-building', 'lingue inventate', 'struttura epica', 'descrizioni dettagliate'],
    signature: 'Epiche fantasy con valori morali chiari',
    genres: ['literary-fantasy'],
    toneAdjustments: {
      'epico': 'Grandiosità mitica e leggendaria',
      'contemplativo': 'Saggezza antica e naturale'
    }
  },
  {
    id: 'dumas-style',
    name: 'Alexandre Dumas',
    description: 'Avventure epiche, personaggi eroici, intrighi di corte',
    icon: '⚔️',
    period: 'XIX secolo',
    techniques: ['narrazione epica', 'dialoghi teatrali', 'azione dinamica', 'conflitti d\'onore'],
    signature: 'Eroi coraggiosi in ambientazioni storiche grandiose',
    genres: ['historical-drama', 'literary-western'],
    toneAdjustments: {
      'epico': 'Grandiosità negli eventi e nei personaggi',
      'drammatico': 'Conflitti morali intensi'
    }
  },

  // THRILLER E NOIR
  {
    id: 'chandler-style',
    name: 'Raymond Chandler',
    description: 'Detective hard-boiled, dialoghi taglienti, atmosfere urbane',
    icon: '🕵️',
    period: 'Metà XX secolo',
    techniques: ['prima persona', 'descrizioni cinematografiche', 'dialoghi realistici', 'ritmo serrato'],
    signature: 'Investigatori cinici in città corrotte',
    genres: ['noir-thriller'],
    toneAdjustments: {
      'cupo': 'Cinismo urbano con umanità nascosta',
      'tensione': 'Suspense costruita attraverso l\'atmosfera'
    }
  },
  {
    id: 'king-style',
    name: 'Stephen King',
    description: 'Re dell\'horror moderno, personaggi realistici in situazioni soprannaturali',
    icon: '👻',
    period: 'XX-XXI secolo',
    techniques: ['caratterizzazione profonda', 'horror quotidiano', 'suspense graduali', 'dialoghi naturali'],
    signature: 'Horror che nasce dal quotidiano americano',
    genres: ['psychological-horror', 'gothic-mystery'],
    toneAdjustments: {
      'inquietante': 'Terrore che cresce dal familiare',
      'claustrofobico': 'Tensione in spazi chiusi'
    }
  },
  {
    id: 'lovecraft-style',
    name: 'H.P. Lovecraft',
    description: 'Horror cosmico, entità indicibili, follia dell\'universo',
    icon: '🐙',
    period: 'XX secolo',
    techniques: ['prosa arcaica', 'descrizioni elaborate', 'orrore indicibile', 'mitologie complesse'],
    signature: 'Terrore cosmico oltre la comprensione umana',
    genres: ['psychological-horror', 'philosophical-scifi'],
    toneAdjustments: {
      'inquietante': 'Terrore esistenziale e cosmico',
      'speculativo': 'Scienza al limite della follia'
    }
  },

  // FANTASCIENZA E SPECULATIVE
  {
    id: 'gibson-style',
    name: 'William Gibson',
    description: 'Padre del cyberpunk, linguaggio tecnologico poetico',
    icon: '💻',
    period: 'XX-XXI secolo',
    techniques: ['slang futuristico', 'descrizioni tecnologiche', 'ritmo veloce', 'immaginario digitale'],
    signature: 'Futures digitali oscuri e seducenti',
    genres: ['cyberpunk', 'philosophical-scifi'],
    toneAdjustments: {
      'dystopico': 'Futuro hi-tech ma degradato',
      'tecnologico': 'Fusione uomo-macchina poetica'
    }
  },
  {
    id: 'asimov-style',
    name: 'Isaac Asimov',
    description: 'Fantascienza hard, robot e psicorobotica, grandi imperi galattici',
    icon: '🤖',
    period: 'XX secolo',
    techniques: ['dialoghi socratici', 'problemi logici', 'world-building scientifico', 'rivoluzioni concettuali'],
    signature: 'Scienza rigorosa al servizio di grandi idee',
    genres: ['philosophical-scifi', 'cyberpunk'],
    toneAdjustments: {
      'speculativo': 'Logica ferrea applicata al futuro',
      'cerebrale': 'Puzzle intellettuali complessi'
    }
  },
  {
    id: 'dick-style',
    name: 'Philip K. Dick',
    description: 'Realtà alternative, paranoia, questioni di identità',
    icon: '🎭',
    period: 'XX secolo',
    techniques: ['realtà instabili', 'protagonisti paranoici', 'twist filosofici', 'domande esistenziali'],
    signature: 'Che cos\'è reale? Drammi dell\'identità',
    genres: ['philosophical-scifi', 'cyberpunk', 'psychological-horror'],
    toneAdjustments: {
      'paranoico': 'Dubbio costante sulla realtà',
      'esistenziale': 'Domande profonde sull\'essere'
    }
  },

  // REGISTI FAMOSI
  {
    id: 'hitchcock-style',
    name: 'Alfred Hitchcock',
    description: 'Maestro della suspense, tensione psicologica, protagonisti ordinari',
    icon: '🎬',
    period: 'XX secolo',
    techniques: ['suspense graduata', 'MacGuffin', 'protagonisti comuni', 'tensione visiva'],
    signature: 'Suspense che nasce dall\'ordinario',
    genres: ['noir-thriller', 'psychological-horror'],
    toneAdjustments: {
      'tensione': 'Suspense che cresce inesorabilmente',
      'introspettivo': 'Psicologia sotto pressione'
    }
  },
  {
    id: 'kubrick-style',
    name: 'Stanley Kubrick',
    description: 'Perfezionismo visivo, temi filosofici, freddezza emotiva',
    icon: '👁️',
    period: 'XX secolo',
    techniques: ['simmetria visiva', 'distacco emotivo', 'simbolismo elaborato', 'precisione maniacale'],
    signature: 'Bellezza fredda al servizio di idee profonde',
    genres: ['philosophical-scifi', 'psychological-horror'],
    toneAdjustments: {
      'cerebrale': 'Intelligenza fredda e calcolata',
      'disturbante': 'Disagio sotto superficie perfetta'
    }
  },
  {
    id: 'tarantino-style',
    name: 'Quentin Tarantino',
    description: 'Dialoghi brillanti, strutture non-lineari, violenza stilizzata',
    icon: '🎭',
    period: 'XX-XXI secolo',
    techniques: ['dialoghi esplosivi', 'timeline non-lineare', 'riferimenti pop', 'violenza coreografica'],
    signature: 'Pop culture elevata ad arte narrativa',
    genres: ['noir-thriller', 'literary-western'],
    toneAdjustments: {
      'ribelle': 'Energia anarchica e creativa',
      'cupo': 'Violenza poetica e stilizzata'
    }
  },
  {
    id: 'leone-style',
    name: 'Sergio Leone',
    description: 'Western epici, primi piani iconici, tensione dilatata',
    icon: '🌵',
    period: 'XX secolo',
    techniques: ['tempi dilatati', 'sguardi intensi', 'paesaggi epici', 'musica narrativa'],
    signature: 'Western operistici con eroi senza nome',
    genres: ['literary-western', 'historical-drama'],
    toneAdjustments: {
      'epico': 'Grandiosità operistica del West',
      'solitario': 'Eroi silenziosi in paesaggi infiniti'
    }
  },
  {
    id: 'lynch-style',
    name: 'David Lynch',
    description: 'Surreale, subconscio, atmosfere oniriche disturbanti',
    icon: '🌀',
    period: 'XX-XXI secolo',
    techniques: ['logica onirica', 'atmosfere inquietanti', 'simbolismo oscuro', 'non-linearità'],
    signature: 'Incubi americani sotto superficie normale',
    genres: ['psychological-horror', 'magical-realism'],
    toneAdjustments: {
      'surreale': 'Logica del sogno applicata alla realtà',
      'inquietante': 'Normalità che nasconde orrori'
    }
  },
  {
    id: 'miyazaki-style',
    name: 'Hayao Miyazaki',
    description: 'Fantasy poetico, natura vs tecnologia, crescita personale',
    icon: '🌸',
    period: 'XX-XXI secolo',
    techniques: ['animazione fluida', 'temi ecologici', 'protagonisti giovani', 'magia naturale'],
    signature: 'Mondi fantastici con cuore ecologico',
    genres: ['literary-fantasy', 'magical-realism'],
    toneAdjustments: {
      'contemplativo': 'Saggezza naturale e spirituale',
      'poetica': 'Bellezza che cura l\'anima'
    }
  }
];

// ARCHETIPI CARATTERIALI PROFESSIONALI
export const CHARACTER_ARCHETYPES: CharacterArchetype[] = [
  {
    id: 'reluctant-sage',
    name: 'Il Saggio Riluttante',
    description: 'Detentore di conoscenza che rifiuta il ruolo di mentore',
    motivations: ['proteggere la conoscenza', 'evitare responsabilità', 'redenzione personale'],
    flaws: ['isolamento', 'arroganza intellettuale', 'paura del fallimento'],
    strengths: ['saggezza profonda', 'intuizione', 'esperienza'],
    archetypeFamily: 'mentor',
    compatibleGenres: ['literary-fantasy', 'magical-realism']
  },
  {
    id: 'broken-detective',
    name: 'Il Detective Infranto',
    description: 'Investigatore segnato dal passato che cerca verità e redenzione',
    motivations: ['giustizia personale', 'redenzione', 'proteggere gli innocenti'],
    flaws: ['alcoolismo/dipendenze', 'cinismo', 'isolamento emotivo'],
    strengths: ['intuizione', 'determinazione', 'empatia nascosta'],
    archetypeFamily: 'hero',
    compatibleGenres: ['noir-thriller']
  },
  {
    id: 'memory-keeper',
    name: 'Il Custode della Memoria',
    description: 'Personaggio che preserva storie e tradizioni in via di estinzione',
    motivations: ['preservare il passato', 'tramandare saggezza', 'connettere generazioni'],
    flaws: ['nostalgia paralizzante', 'resistenza al cambiamento', 'solitudine'],
    strengths: ['conoscenza storica', 'narrazione', 'connessione emotiva'],
    archetypeFamily: 'guardian',
    compatibleGenres: ['magical-realism', 'historical-drama']
  }
];

export const SETTING_TEMPLATES: SettingTemplate[] = [
  {
    id: 'forgotten-library',
    name: 'Biblioteca Dimenticata',
    description: 'Antica biblioteca che custodisce segreti perduti nel tempo',
    atmosphere: ['misteriosa', 'polverosa', 'carica di magia latente', 'silenziosa'],
    conflicts: ['conoscenza proibita', 'guardiani antichi', 'tempo che scorre'],
    opportunities: ['scoperte rivoluzionarie', 'alleanze inaspettate', 'poteri nascosti'],
    visualElements: ['scaffali infiniti', 'luce filtrata', 'manoscritti antichi', 'echi del passato'],
    compatibleGenres: ['literary-fantasy', 'magical-realism']
  },
  {
    id: 'rain-soaked-city',
    name: 'Città sotto la Pioggia',
    description: 'Metropoli notturna dove ogni ombra nasconde segreti',
    atmosphere: ['noir', 'umida', 'elettrica', 'claustrofobica'],
    conflicts: ['corruzione sistemica', 'criminalità organizzata', 'isolamento urbano'],
    opportunities: ['alleanze inaspettate', 'verità nascoste', 'redenzione'],
    visualElements: ['luci al neon riflesse', 'vicoli bagnati', 'fumo di sigarette', 'finestre illuminate'],
    compatibleGenres: ['noir-thriller']
  },
  {
    id: 'ancestral-village',
    name: 'Villaggio Ancestrale',
    description: 'Comunità rurale dove passato e presente si intrecciano naturalmente',
    atmosphere: ['nostalgica', 'timeless', 'spirituale', 'organica'],
    conflicts: ['tradizioni vs modernità', 'segreti familiari', 'cambiamenti inevitabili'],
    opportunities: ['guarigione spirituale', 'connessioni profonde', 'saggezza antica'],
    visualElements: ['case di pietra', 'giardini rigogliosi', 'sentieri antichi', 'alberi secolari'],
    compatibleGenres: ['magical-realism', 'historical-drama']
  }
];

export const PLOT_STRUCTURES: PlotStructure[] = [
  {
    id: 'revelation-spiral',
    name: 'Spirale di Rivelazioni',
    description: 'Verità che si svelano gradualmente cambiando la percezione della realtà',
    acts: [
      {
        name: 'Mistero Iniziale',
        purpose: 'Stabilire l\'enigma centrale e il protagonista',
        keyEvents: ['evento scatenante', 'prima scoperta', 'dubbio iniziale']
      },
      {
        name: 'Ricerca e Scoperte',
        purpose: 'Approfondire il mistero attraverso indizi',
        keyEvents: ['false piste', 'alleati e nemici', 'rivelazione parziale']
      },
      {
        name: 'Verità Finale',
        purpose: 'Svelare la verità completa e le sue conseguenze',
        keyEvents: ['rivelazione shock', 'confronto finale', 'nuova comprensione']
      }
    ],
    conflictTypes: ['verità vs illusione', 'passato vs presente', 'conoscenza vs ignoranza'],
    resolution: 'Comprensione profonda che cambia il protagonista',
    compatibleGenres: ['noir-thriller', 'literary-fantasy']
  },
  {
    id: 'cyclical-legacy',
    name: 'Eredità Ciclica',
    description: 'Storie che si ripetono attraverso generazioni con variazioni',
    acts: [
      {
        name: 'Eredità del Passato',
        purpose: 'Mostrare l\'influenza delle generazioni precedenti',
        keyEvents: ['scoperta dell\'eredità', 'peso della tradizione', 'resistenza iniziale']
      },
      {
        name: 'Rottura del Ciclo',
        purpose: 'Tentativo di cambiare il destino prestabilito',
        keyEvents: ['ribellione', 'conseguenze impreviste', 'sacrifici necessari']
      },
      {
        name: 'Nuova Tradizione',
        purpose: 'Creare un nuovo equilibrio tra passato e futuro',
        keyEvents: ['accettazione', 'trasformazione', 'trasmissione rinnovata']
      }
    ],
    conflictTypes: ['destino vs libero arbitrio', 'tradizione vs innovazione', 'individuo vs comunità'],
    resolution: 'Equilibrio tra preservazione e cambiamento',
    compatibleGenres: ['magical-realism', 'historical-drama']
  }
];
