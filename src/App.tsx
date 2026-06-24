import { useState, FormEvent, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Check, 
  Copy,
  BookOpen,
  HelpCircle,
  Volume2,
  BookMarked,
  Plus,
  X,
  Sun,
  Moon
} from 'lucide-react';

// Vocabulary Data
const CONNECTORS = [
  "Suddenly", 
  "However", 
  "Because of that", 
  "Meanwhile", 
  "Intending to", 
  "So", 
  "Besides that", 
  "In the end"
];

const CATEGORIES: Record<string, string[]> = {
  "Home & Routine": [
    "Set the alarm for", 
    "Turn on/off the fan", 
    "Put the phone on the charger", 
    "To fold the clothes", 
    "To change clothes", 
    "To lie down", 
    "Bedsheet", 
    "Blanket"
  ],
  "Productivity & Places": [
    "Check my emails", 
    "Take a short break", 
    "Lose track of time", 
    "Supermarket", 
    "Bakery", 
    "Pharmacy", 
    "Gym", 
    "Coffee shop"
  ],
  "Relationships": [
    "Count on", 
    "Hang out with", 
    "Grow apart", 
    "Barely talk", 
    "Catch up", 
    "Hit it off", 
    "Siblings", 
    "Close friend"
  ],
  "Appearance & Personality": [
    "Silly", 
    "Laid-back", 
    "Strict", 
    "Stubborn", 
    "He is very tall", 
    "She is quite short", 
    "Bald", 
    "My hair goes down to my waist"
  ],
  "Objects": [
    "Smartphone / Cell phone",
    "Keys",
    "Wallet",
    "Earphones / Headphones",
    "Backpack / Bag",
    "Water bottle",
    "Glasses / Sunglasses",
    "Notebook",
    "Charger",
    "Watch / Smartwatch"
  ]
};

const STARTING_PROMPTS = [
  "Yesterday, I woke up at 6 AM and went straight to the gym...",
  "It was a quiet afternoon at the bakery, and the fresh croissants were coming out of the oven...",
  "I had just put my phone on the charger when I heard a direct tap on the window...",
  "While walking back from the supermarket, I realized my bag had a tiny hole at the bottom...",
  "Deep in conversation at the coffee shop, we both suddenly stopped as we saw who just walked in...",
  "Sighing, I set the alarm for 5 AM, hoping to fold the clothes early, but my dog had other plans...",
];

// Meaning dictionary with translation, definition, and example
const WORD_MEANINGS: Record<string, { translation: string; definition: string; example: string }> = {
  // Connectors
  "Suddenly": {
    translation: "De repente / Repentinamente",
    definition: "Indicates that something happens unexpectedly or quickly.",
    example: "Suddenly, the lights went out and we heard a strange noise."
  },
  "However": {
    translation: "No entanto / Porém",
    definition: "Used to introduce a statement that contrasts with what has already been said.",
    example: "I wanted to go to the gym; however, it started raining heavily."
  },
  "Because of that": {
    translation: "Por causa disso / Devido a isso",
    definition: "Shows the cause or reason for an action or situation.",
    example: "I forgot my keys, and because of that, I was locked outside."
  },
  "Meanwhile": {
    translation: "Enquanto isso",
    definition: "While something else is happening.",
    example: "She was reading a book; meanwhile, her brother was preparing lunch."
  },
  "Intending to": {
    translation: "Com a intenção de / Pretendendo",
    definition: "Having a plan or purpose in mind.",
    example: "He woke up early, intending to finish his work before noon."
  },
  "So": {
    translation: "Então / Por isso",
    definition: "Used to introduce the result of something.",
    example: "It was getting dark, so we decided to head back home."
  },
  "Besides that": {
    translation: "Além disso",
    definition: "In addition to the thing mentioned.",
    example: "The pie was delicious. Besides that, it was very easy to make."
  },
  "In the end": {
    translation: "No final / Por fim",
    definition: "Finally, after a long time or series of events.",
    example: "We had many problems during the trip, but in the end, it was wonderful."
  },

  // Home & Routine
  "Set the alarm for": {
    translation: "Definir o alarme para",
    definition: "To adjust a clock to make a sound at a specific time in the morning.",
    example: "I need to set the alarm for 6 AM to make it to the gym."
  },
  "Turn on/off the fan": {
    translation: "Ligar/desligar o ventilador",
    definition: "To start or stop the operation of an electric fan.",
    example: "It is getting really warm here, please turn on the fan."
  },
  "Put the phone on the charger": {
    translation: "Colocar o celular no carregador",
    definition: "To connect a mobile phone to an electrical source to charge the battery.",
    example: "My battery is at 5%, I must put the phone on the charger."
  },
  "To fold the clothes": {
    translation: "Dobrar as roupas",
    definition: "To bend clothes neatly so they can be stored in a drawer or closet.",
    example: "After washing, my mother asked me to fold the clothes."
  },
  "To change clothes": {
    translation: "Trocar de roupa",
    definition: "To take off the clothes you are wearing and put on different ones.",
    example: "I will change clothes quickly before we go to the restaurant."
  },
  "To lie down": {
    translation: "Deitar-se",
    definition: "To move your body into a horizontal position, usually on a bed or sofa to rest.",
    example: "I am feeling extremely tired, I need to lie down for a few minutes."
  },
  "Bedsheet": {
    translation: "Lençol",
    definition: "A large piece of cloth used to cover a bed.",
    example: "We put a clean white bedsheet on the guest bed."
  },
  "Blanket": {
    translation: "Cobertor / Manta",
    definition: "A warm cover made of wool or thick fabric, used on a bed.",
    example: "It gets freezing during winter nights, so I sleep with a heavy blanket."
  },

  // Productivity & Places
  "Check my emails": {
    translation: "Verificar meus e-mails",
    definition: "To open your email inbox to see if you have received new messages.",
    example: "The first thing I do when I arrive at the office is check my emails."
  },
  "Take a short break": {
    translation: "Fazer uma pequena pausa",
    definition: "To stop working or studying for a brief time to rest.",
    example: "After writing for two hours, I took a short break to stretch."
  },
  "Lose track of time": {
    translation: "Perder a noção do tempo",
    definition: "To become so involved in something that you do not notice the time passing.",
    example: "When I play video games, I always lose track of time."
  },
  "Supermarket": {
    translation: "Supermercado",
    definition: "A large shop that sells food, drinks, and household items.",
    example: "We bought fresh fruits and vegetables at the local supermarket."
  },
  "Bakery": {
    translation: "Padaria",
    definition: "A place where bread, cakes, and pastries are made and sold.",
    example: "She goes to the bakery every morning to buy fresh warm rolls."
  },
  "Pharmacy": {
    translation: "Farmácia",
    definition: "A shop where medicines are prepared and sold.",
    example: "I need to go to the pharmacy to get some pain relievers."
  },
  "Gym": {
    translation: "Academia",
    definition: "A room or hall with equipment for physical exercise.",
    example: "He lifts weights and runs on the treadmill at the gym."
  },
  "Coffee shop": {
    translation: "Cafeteria",
    definition: "A small restaurant where you can buy coffee, drinks, and light meals.",
    example: "Let's meet at the coffee shop around the corner for an espresso."
  },

  // Relationships
  "Count on": {
    translation: "Contar com (alguém)",
    definition: "To rely on someone or be confident that they will help you.",
    example: "You can always count on me whenever you have a problem."
  },
  "Hang out with": {
    translation: "Sair com / Passar tempo com",
    definition: "To spend time with someone in a friendly and informal way.",
    example: "On weekends, I love to hang out with my close friends."
  },
  "Grow apart": {
    translation: "Afastar-se / Distanciar-se",
    definition: "To gradually become less friendly or lose a close relationship with someone.",
    example: "After high school, we started to grow apart as we went to different universities."
  },
  "Barely talk": {
    translation: "Mal se falar",
    definition: "To speak to someone very rarely or almost never.",
    example: "They used to be best friends, but now they barely talk."
  },
  "Catch up": {
    translation: "Colocar o papo em dia",
    definition: "To talk to someone you haven't seen in a while to find out what has happened in their life.",
    example: "Let's grab a coffee and catch up on all the news."
  },
  "Hit it off": {
    translation: "Dar-se bem de primeira / Bater o santo",
    definition: "To like each other and become friendly immediately upon meeting.",
    example: "At the party, we hit it off right away and talked for hours."
  },
  "Siblings": {
    translation: "Irmãos (no plural, masculino e feminino)",
    definition: "Brothers and sisters.",
    example: "I have three siblings: two brothers and one sister."
  },
  "Close friend": {
    translation: "Amigo próximo / Amigo do peito",
    definition: "A person you know well and like very much, with high trust.",
    example: "Maria is a close friend of mine; we tell each other everything."
  },

  // Appearance & Personality
  "Silly": {
    translation: "Bobo / Tolo / Engraçado",
    definition: "Showing a lack of serious thought, or being playful and funny.",
    example: "He made a silly joke that made everyone in the room laugh."
  },
  "Laid-back": {
    translation: "Descontraído / Tranquilo / Relaxado",
    definition: "Relaxed and easygoing, not easily worried or stressed.",
    example: "Our new boss is very laid-back and easy to talk to."
  },
  "Strict": {
    translation: "Rígido / Exigente / Rigoroso",
    definition: "Demanding that rules are obeyed and observed closely.",
    example: "My teacher is very strict about submitting homework on time."
  },
  "Stubborn": {
    translation: "Teimoso / Obstinado",
    definition: "Determined not to change your opinion or attitude.",
    example: "She is too stubborn to admit that she made a mistake."
  },
  "He is very tall": {
    translation: "Ele é muito alto",
    definition: "Describes a male person who has a height well above average.",
    example: "He is very tall, so he plays basketball exceptionally well."
  },
  "She is quite short": {
    translation: "Ela é bem baixinha / curta",
    definition: "Describes a female person whose height is below average.",
    example: "She is quite short, so she often needs a stool to reach high shelves."
  },
  "Bald": {
    translation: "Careca",
    definition: "Having little or no hair on the head.",
    example: "He went completely bald in his early thirties."
  },
  "My hair goes down to my waist": {
    translation: "Meu cabelo vai até a cintura",
    definition: "Describes having extremely long hair that reaches the waist level.",
    example: "I haven't cut my hair for three years, so now my hair goes down to my waist."
  },
  "Smartphone / Cell phone": {
    translation: "Smartphone / Celular",
    definition: "A portable touch-screen device that connects to the internet and runs mobile applications.",
    example: "I can't leave the house without my smartphone."
  },
  "Keys": {
    translation: "Chaves",
    definition: "Small metal objects specifically cut to fit and operate a door lock or ignition.",
    example: "I always spend five minutes looking for my house keys."
  },
  "Wallet": {
    translation: "Carteira",
    definition: "A small, flat pocket-sized folding container for carrying money, cards, and ID.",
    example: "I keep my driver's license and credit cards in my wallet."
  },
  "Earphones / Headphones": {
    translation: "Fones de ouvido",
    definition: "Audio devices worn inside or over the ears, allowing private listening of sound.",
    example: "I like to listen to podcasts using my headphones on the bus."
  },
  "Backpack / Bag": {
    translation: "Mochila / Bolsa",
    definition: "A sturdy fabric pack carried over the shoulders or a general-purpose portable container.",
    example: "I put my laptop and notebook inside my backpack."
  },
  "Water bottle": {
    translation: "Garrafa de água",
    definition: "A portable bottle designed to safely hold and carry drinking water or other liquids.",
    example: "Keeping a water bottle on my desk helps me stay hydrated."
  },
  "Glasses / Sunglasses": {
    translation: "Óculos / Óculos de sol",
    definition: "Lenses supported by a frame worn over the nose and ears to assist vision or protect against the sun.",
    example: "I need to wear my glasses to read the computer screen."
  },
  "Notebook": {
    translation: "Caderno / Bloco de notas (Nota: para o computador portátil, use \"laptop\")",
    definition: "A bound book with blank, ruled, or grid paper intended for handwriting notes and sketches.",
    example: "I write down my daily tasks in a small notebook."
  },
  "Charger": {
    translation: "Carregador (de celular, notebook, etc.)",
    definition: "A cable and power adapter accessory used to supply electric power to rechargeable batteries.",
    example: "Can I borrow your phone charger for a look? My battery is low."
  },
  "Watch / Smartwatch": {
    translation: "Relógio / Relógio inteligente",
    definition: "A wearable timekeeping instrument on the wrist, or an interactive smart accessory syncing with phone alerts.",
    example: "My smartwatch buzzes every time I receive a text message."
  }
};

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem("plot_twist_theme_v3");
      if (saved === "light" || saved === "dark") return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem("plot_twist_theme_v3", nextTheme);
  };

  useEffect(() => {
    const saved = localStorage.getItem("plot_twist_theme_v3");
    if (!saved) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // State for Categories and Meanings (persisted in LocalStorage)
  const [categories, setCategories] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem("plot_twist_categories_v3");
      const parsed = saved ? JSON.parse(saved) : {};
      const merged = { ...CATEGORIES, ...parsed };
      merged["Objects"] = CATEGORIES["Objects"];
      
      const cleaned: Record<string, string[]> = {};
      Object.keys(merged).forEach((cat) => {
        if (cat.toLowerCase() !== "object") {
          cleaned[cat] = merged[cat].filter((w: string) => w.toLowerCase() !== "cake");
        }
      });
      return cleaned;
    } catch {
      return CATEGORIES;
    }
  });

  const [wordMeanings, setWordMeanings] = useState<Record<string, { translation?: string; definition: string; example: string }>>(() => {
    try {
      const saved = localStorage.getItem("plot_twist_meanings_v3");
      const parsed = saved ? JSON.parse(saved) : {};
      const merged = { ...WORD_MEANINGS, ...parsed };
      const cleaned: Record<string, { translation?: string; definition: string; example: string }> = {};
      Object.keys(merged).forEach((word) => {
        if (word.toLowerCase() !== "cake") {
          cleaned[word] = merged[word];
        }
      });
      return cleaned;
    } catch {
      const cleaned: Record<string, { translation?: string; definition: string; example: string }> = {};
      Object.keys(WORD_MEANINGS).forEach((word) => {
        if (word.toLowerCase() !== "cake") {
          cleaned[word] = WORD_MEANINGS[word];
        }
      });
      return cleaned;
    }
  });

  useEffect(() => {
    localStorage.setItem("plot_twist_categories_v3", JSON.stringify(categories));
    localStorage.setItem("plot_twist_meanings_v3", JSON.stringify(wordMeanings));
  }, []);

  // Starting Prompts list (persisted in LocalStorage)
  const [prompts, setPrompts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("plot_twist_prompts_v3");
      return saved ? JSON.parse(saved) : STARTING_PROMPTS;
    } catch {
      return STARTING_PROMPTS;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    const keys = Object.keys(categories);
    return keys.includes("Home & Routine") ? "Home & Routine" : (keys[0] || "");
  });
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);
  
  // Game Output States
  const [currentConnector, setCurrentConnector] = useState<string>("");
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  
  // Selected meaning to display
  const [selectedMeaningWord, setSelectedMeaningWord] = useState<string>("Suddenly");
  
  // Control States
  const [copiedWord, setCopiedWord] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [showAddWord, setShowAddWord] = useState<boolean>(false);
  const [showAddPrompt, setShowAddPrompt] = useState<boolean>(false);

  // Add Custom Word Form States
  const [newWord, setNewWord] = useState("");
  const [newCategory, setNewCategory] = useState("Home & Routine");
  const [customCategory, setCustomCategory] = useState("");
  const [newDefinition, setNewDefinition] = useState("");
  const [newExample, setNewExample] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Custom Starting Prompt Input State
  const [newPromptText, setNewPromptText] = useState("");

  // Helper: Cycle clean target prompts
  const handleNextPrompt = () => {
    if (prompts.length === 0) return;
    const nextIndex = (currentPromptIndex + 1) % prompts.length;
    setCurrentPromptIndex(nextIndex);
  };

  // Helper: Add custom starting prompt
  const handleAddPromptSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = newPromptText.trim();
    if (!text) return;

    const updatedPrompts = [...prompts, text];
    setPrompts(updatedPrompts);
    localStorage.setItem("plot_twist_prompts_v3", JSON.stringify(updatedPrompts));
    
    // Select the new prompt instantly
    setCurrentPromptIndex(updatedPrompts.length - 1);
    setNewPromptText("");
    setShowAddPrompt(false);
  };

  // Helper: Delete current starting prompt
  const handleDeletePrompt = () => {
    if (prompts.length <= 1) {
      alert("You must keep at least one starting prompt!");
      return;
    }
    const updatedPrompts = prompts.filter((_, idx) => idx !== currentPromptIndex);
    setPrompts(updatedPrompts);
    localStorage.setItem("plot_twist_prompts_v3", JSON.stringify(updatedPrompts));
    // Reset index safely
    setCurrentPromptIndex(Math.max(0, currentPromptIndex - 1));
  };

  // Pick random element
  const getRandomElement = <T,>(arr: T[]): T => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  // Generate words from specified category
  const handleGenerateFromCategory = () => {
    const connector = getRandomElement(CONNECTORS);
    const pool = categories[selectedCategory] || [];
    
    if (pool.length === 0) {
      alert("Esta categoria está vazia. Adicione algumas palavras primeiro!");
      return;
    }

    // Pick 3 unique words from this category
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const word1 = shuffled[0];
    const word2 = shuffled[1] || shuffled[0]; // fallback
    const word3 = shuffled[2] || shuffled[1] || shuffled[0]; // fallback
    
    setCurrentConnector(connector);
    setCurrentWords([word1, word2, word3]);
    setSelectedMeaningWord(""); // Clear selected meaning on new generation
  };

  // Generate random words across all categories
  const handleGenerateRandom = () => {
    const connector = getRandomElement(CONNECTORS);
    
    // Flatten all category words
    const allWords: string[] = Object.values(categories).flat() as string[];
    if (allWords.length === 0) {
      alert("Nenhuma palavra disponível. Adicione palavras primeiro!");
      return;
    }

    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    
    const word1 = shuffled[0];
    const word2 = shuffled[1] || shuffled[0];
    const word3 = shuffled[2] || shuffled[1] || shuffled[0];

    setCurrentConnector(connector);
    setCurrentWords([word1, word2, word3]);
    setSelectedMeaningWord(""); // Clear selected meaning on new generation
  };

  // Safely speak the word or sentence using the browser SpeechSynthesis API
  const handleSpeak = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.85; // slightly slower for better learning
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.warn("Speech synthesis failed or blocked", err);
    }
  };

  // Copy word inside the meaning card helper
  const handleCopyWord = (word: string) => {
    const showFeedback = () => {
      setCopiedWord(word);
      setTimeout(() => setCopiedWord(null), 1500);
    };

    const runFallbackCopy = (text: string) => {
      try {
        const temp = document.createElement("textarea");
        temp.value = text;
        temp.style.position = "fixed";
        temp.style.opacity = "0";
        temp.style.top = "0";
        temp.style.left = "0";
        document.body.appendChild(temp);
        temp.select();
        try {
          document.execCommand("copy");
        } catch (cmdErr) {
          console.warn("copy command blocked", cmdErr);
        }
        try {
          document.body.removeChild(temp);
        } catch (rmErr) {
          console.warn("removal blocked", rmErr);
        }
      } catch (err) {
        console.warn("Fallback failed", err);
      }
      showFeedback();
    };

    try {
      if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText(word)
          .then(() => showFeedback())
          .catch(() => runFallbackCopy(word));
      } else {
        runFallbackCopy(word);
      }
    } catch (err) {
      runFallbackCopy(word);
    }
  };

  const activeMeaning = wordMeanings[selectedMeaningWord] || {
    translation: "Significado não encontrado",
    definition: "No definition available for this term.",
    example: "No example sentence available."
  };

  const handleAddWordSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!newWord.trim()) {
      setFormError("The word or phrase cannot be empty.");
      return;
    }
    if (!newDefinition.trim()) {
      setFormError("The definition cannot be empty.");
      return;
    }
    if (!newExample.trim()) {
      setFormError("The example sentence cannot be empty.");
      return;
    }

    const categoryToUse = newCategory === "NEW" ? customCategory.trim() : newCategory;
    if (newCategory === "NEW" && !categoryToUse) {
      setFormError("Please enter a custom category name.");
      return;
    }

    const wordKey = newWord.trim();

    // Update categories
    const updatedCategories = { ...categories };
    if (!updatedCategories[categoryToUse]) {
      updatedCategories[categoryToUse] = [];
    }
    if (!updatedCategories[categoryToUse].includes(wordKey)) {
      updatedCategories[categoryToUse] = [...updatedCategories[categoryToUse], wordKey];
    }

    // Update meanings
    const updatedMeanings = {
      ...wordMeanings,
      [wordKey]: {
        translation: "",
        definition: newDefinition.trim(),
        example: newExample.trim()
      }
    };

    setCategories(updatedCategories);
    localStorage.setItem("plot_twist_categories_v3", JSON.stringify(updatedCategories));

    setWordMeanings(updatedMeanings);
    localStorage.setItem("plot_twist_meanings_v3", JSON.stringify(updatedMeanings));

    // Reset Form
    setNewWord("");
    setNewDefinition("");
    setNewExample("");
    setCustomCategory("");
    setNewCategory(categoryToUse);
    setFormSuccess("Word successfully added!");

    // Auto close form after delay
    setTimeout(() => {
      setFormSuccess("");
      setShowAddWord(false);
    }, 1500);
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Do you really want to reset the vocabulary and prompts to defaults? All your custom added words and starting prompts will be deleted.")) {
      setCategories(CATEGORIES);
      setWordMeanings(WORD_MEANINGS);
      setPrompts(STARTING_PROMPTS);
      localStorage.removeItem("plot_twist_categories_v3");
      localStorage.removeItem("plot_twist_meanings_v3");
      localStorage.removeItem("plot_twist_prompts_v3");
      setSelectedMeaningWord("");
      setCurrentPromptIndex(0);
      setFormSuccess("Vocabulary and prompts successfully reset!");
      setTimeout(() => setFormSuccess(""), 1500);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans p-4 sm:p-8 flex flex-col items-center justify-center antialiased ${isDark ? 'bg-stone-950 text-stone-100' : 'bg-[#E9E5DE] text-gray-800'}`}>
      
      {/* Sleek Interface Notepad Container */}
      <div className={`w-full max-w-[600px] rounded-xl border overflow-hidden flex flex-col transition-colors duration-300 ${isDark ? 'bg-stone-900 border-stone-800 shadow-[0_20px_50px_rgba(0,0,0,0.4)]' : 'bg-white border-[#D1CDC7] shadow-[0_20px_50px_rgba(0,0,0,0.1)]'}`}>
        
        {/* Brand & Main Panel with elegant padded margins */}
        <div className="p-6 sm:p-8 flex flex-col gap-5">
          
          {/* Header Title Section */}
          <div className="flex justify-between items-start gap-2" id="header-section">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-1.5 ${isDark ? 'text-stone-50' : 'text-gray-800'}`}>
                Plot Twist<span className="text-indigo-600">!</span>
              </h1>
              <p className={`text-xs font-semibold tracking-wider uppercase ${isDark ? 'text-stone-500' : 'text-gray-400'}`}>Cooperative Story Builder</p>
            </div>
            
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5">
              {/* Theme Toggle Button */}
              <button 
                onClick={toggleTheme}
                className={`p-1.5 rounded-lg border active:translate-y-0.5 transition-all flex items-center justify-center shadow-sm ${
                  isDark 
                    ? 'border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-200' 
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                }`}
                title={isDark ? "Modo Claro" : "Modo Escuro"}
                id="theme-toggle"
              >
                {isDark ? <Sun size={13} className="text-amber-400" /> : <Moon size={13} className="text-slate-500" />}
              </button>

              <button 
                onClick={() => {
                  setShowAddWord(!showAddWord);
                  if (showInstructions) setShowInstructions(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg border transition-all text-xs font-semibold flex items-center gap-1 shadow-sm active:translate-y-0.5 ${
                  showAddWord 
                    ? "bg-indigo-600 border-indigo-600 text-white" 
                    : isDark 
                      ? "border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-200"
                      : "border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
                }`}
                title="Add custom word"
                id="add-word-toggle"
              >
                <Plus size={13} className={showAddWord ? "text-white" : "text-indigo-600"} />
                <span>Add Word</span>
              </button>

              <button 
                onClick={() => {
                  setShowInstructions(!showInstructions);
                  if (showAddWord) setShowAddWord(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg border active:translate-y-0.5 transition-all text-xs font-semibold flex items-center gap-1 shadow-sm ${
                  isDark 
                    ? "border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-200"
                    : "border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
                }`}
                title="How to play"
                id="how-to-play-toggle"
              >
                <HelpCircle size={13} className={isDark ? "text-stone-400" : "text-gray-400"} />
                <span>{showInstructions ? "Hide" : "Rules"}</span>
              </button>
            </div>
          </div>

          {/* Collapsible Quick Rules Board - Styled Sleek (Pure Tailwind CSS transitions) */}
          <div 
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showInstructions ? "max-h-[300px] opacity-100 mb-1" : "max-h-0 opacity-0 pointer-events-none"
            }`}
            id="instructions-panel"
          >
            <div className={`border rounded-xl p-4 text-xs flex flex-col gap-2 shadow-sm ${isDark ? 'bg-stone-800/40 border-stone-700 text-stone-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
              <div className={`flex items-center gap-1.5 font-bold uppercase tracking-wide ${isDark ? 'text-stone-200' : 'text-gray-800'}`}>
                <BookOpen size={14} className="text-indigo-500" />
                <span>Interactive Notebook Rules</span>
              </div>
              <ol className={`list-decimal list-inside space-y-1 font-medium leading-relaxed ${isDark ? 'text-stone-300' : 'text-gray-700'}`}>
                <li>Choose an opening scenario to start your storytelling session.</li>
                <li>Select a category or click <strong className="text-indigo-500 font-bold">All Random Draw</strong> to assign your vocabulary words.</li>
                <li>Use the assigned Connector and all 3 vocabulary terms to continue your group story!</li>
                <li><span className="text-indigo-500 font-semibold">Dictionary feature:</span> Tap any word sticker pill below to view its English definition, correct usage, and hear its pronunciation!</li>
              </ol>
            </div>
          </div>

          {/* Collapsible Add Custom Word Form Panel */}
          <div 
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showAddWord ? "max-h-[550px] opacity-100 mb-1 border-b border-gray-100 pb-3" : "max-h-0 opacity-0 pointer-events-none"
            }`}
            id="add-word-panel"
          >
            <form onSubmit={handleAddWordSubmit} className={`border rounded-xl p-4 flex flex-col gap-3 shadow-sm ${isDark ? 'bg-indigo-950/20 border-indigo-900/40' : 'bg-indigo-50/50 border-indigo-100'}`}>
              <div className="flex justify-between items-center">
                <div className={`flex items-center gap-1.5 font-bold text-xs uppercase tracking-wide ${isDark ? 'text-indigo-200' : 'text-indigo-950'}`}>
                  <Plus size={14} className="text-indigo-500" />
                  <span>Add Custom Term</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowAddWord(false)}
                  className={`p-1 rounded-md transition-colors ${isDark ? 'text-stone-400 hover:text-stone-200 hover:bg-stone-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                >
                  <X size={14} />
                </button>
              </div>

              {formError && (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs font-medium">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs font-medium">
                  {formSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Word / Phrase Input */}
                <div className="flex flex-col gap-1">
                  <label className={`text-[10px] font-bold uppercase tracking-wide ${isDark ? 'text-stone-400' : 'text-gray-500'}`}>Word or Phrase *</label>
                  <input
                    type="text"
                    placeholder="e.g., Piece of pie"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    className={`h-9 px-2.5 rounded-lg border text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${isDark ? 'bg-stone-800 border-stone-700 text-stone-100 focus:ring-indigo-400' : 'bg-white border-gray-300 text-gray-800 focus:ring-indigo-500'}`}
                    required
                  />
                </div>

                {/* Category Selection */}
                <div className="flex flex-col gap-1">
                  <label className={`text-[10px] font-bold uppercase tracking-wide ${isDark ? 'text-stone-400' : 'text-gray-500'}`}>Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className={`h-9 px-2.5 rounded-lg border text-xs focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer transition-colors ${isDark ? 'bg-stone-800 border-stone-700 text-stone-100 focus:ring-indigo-400' : 'bg-white border-gray-300 text-gray-800 focus:ring-indigo-500'}`}
                  >
                    {Object.keys(categories).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="NEW">+ Create New Category...</option>
                  </select>
                </div>
              </div>

              {/* Conditionally render custom category input */}
              {newCategory === "NEW" && (
                <div className="flex flex-col gap-1">
                  <label className={`text-[10px] font-bold uppercase tracking-wide ${isDark ? 'text-stone-400' : 'text-gray-500'}`}>New Category Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Idioms & Slang"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className={`h-9 px-2.5 rounded-lg border text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${isDark ? 'bg-stone-800 border-stone-700 text-stone-100 focus:ring-indigo-400' : 'bg-white border-gray-300 text-gray-800 focus:ring-indigo-500'}`}
                    required
                  />
                </div>
              )}

              {/* Definition */}
              <div className="flex flex-col gap-1">
                <label className={`text-[10px] font-bold uppercase tracking-wide ${isDark ? 'text-stone-400' : 'text-gray-500'}`}>English Definition *</label>
                <textarea
                  placeholder="Describe the meaning of the word or phrase in English..."
                  value={newDefinition}
                  onChange={(e) => setNewDefinition(e.target.value)}
                  className={`p-2 h-16 rounded-lg border text-xs focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-colors ${isDark ? 'bg-stone-800 border-stone-700 text-stone-100 focus:ring-indigo-400' : 'bg-white border-gray-300 text-gray-800 focus:ring-indigo-500'}`}
                  required
                />
              </div>

              {/* Example of Use */}
              <div className="flex flex-col gap-1">
                <label className={`text-[10px] font-bold uppercase tracking-wide ${isDark ? 'text-stone-400' : 'text-gray-500'}`}>Example Sentence *</label>
                <textarea
                  placeholder="Create an example sentence showing how to use the word..."
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  className={`p-2 h-16 rounded-lg border text-xs focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-colors ${isDark ? 'bg-stone-800 border-stone-700 text-stone-100 focus:ring-indigo-400' : 'bg-white border-gray-300 text-gray-800 focus:ring-indigo-500'}`}
                  required
                />
              </div>

              <div className="flex justify-between items-center pt-1 gap-2">
                <button
                  type="button"
                  onClick={handleResetToDefaults}
                  className={`text-[10px] font-bold underline transition-colors ${isDark ? 'text-stone-500 hover:text-red-400' : 'text-stone-400 hover:text-red-500'}`}
                >
                  Reset to Defaults
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddWord(false)}
                    className={`h-8 px-3 rounded-lg border text-xs font-semibold transition-colors ${isDark ? 'border-stone-700 text-stone-300 bg-stone-800 hover:bg-stone-700' : 'border-gray-300 text-gray-600 bg-white hover:bg-gray-50'}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-8 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
                  >
                    Add Word
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Step 1: Starting Prompt Box - Sleek minimal card with user customization */}
          <div className={`border-l-4 rounded-r-xl p-3.5 flex flex-col gap-2 relative transition-colors duration-300 ${isDark ? 'bg-stone-800/30 border-stone-600' : 'bg-stone-50 border-stone-400'}`} id="prompt-box">
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-bold tracking-widest uppercase ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                Starting Prompt Hook ({prompts.length > 0 ? `${currentPromptIndex + 1}/${prompts.length}` : "0/0"})
              </span>
              <div className="flex items-center gap-1.5">
                {/* Delete Prompt button */}
                {prompts.length > 1 && (
                  <button
                    onClick={handleDeletePrompt}
                    className={`p-1 rounded border transition-colors shadow-sm ${isDark ? 'bg-stone-800 border-stone-700 text-stone-400 hover:text-red-400 hover:bg-stone-700' : 'bg-white border-gray-200 hover:bg-red-50 text-gray-400 hover:text-red-600'}`}
                    title="Delete This Prompt"
                    id="delete-prompt"
                  >
                    <X size={12} />
                  </button>
                )}

                {/* Toggle Add Prompt form */}
                <button
                  onClick={() => setShowAddPrompt(!showAddPrompt)}
                  className={`p-1 rounded border transition-colors shadow-sm ${
                    showAddPrompt 
                      ? "bg-indigo-600 border-indigo-600 text-white" 
                      : isDark 
                        ? "bg-stone-800 border-stone-700 text-stone-400 hover:text-indigo-400 hover:bg-stone-700"
                        : "bg-white border-gray-200 text-gray-500 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                  title="Add Custom Starting Prompt"
                  id="add-prompt-toggle"
                >
                  <Plus size={12} />
                </button>

                {/* Cycle Prompt button */}
                {prompts.length > 1 && (
                  <button
                    onClick={handleNextPrompt}
                    className={`p-1 rounded border transition-colors shadow-sm ${isDark ? 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200 hover:bg-stone-700' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-800'}`}
                    title="Cycle Next Prompt"
                    id="cycle-prompt"
                  >
                    <RotateCcw size={12} />
                  </button>
                )}
              </div>
            </div>
            
            {showAddPrompt ? (
              <form onSubmit={handleAddPromptSubmit} className="flex flex-col gap-2 mt-1.5">
                <textarea
                  placeholder="Type your own custom story opening prompt..."
                  value={newPromptText}
                  onChange={(e) => setNewPromptText(e.target.value)}
                  className={`p-2 h-16 rounded-lg border text-xs focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-serif italic transition-colors ${isDark ? 'bg-stone-800 border-stone-700 text-stone-100 focus:ring-indigo-400' : 'bg-white border-gray-300 text-stone-700'}`}
                  required
                  autoFocus
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddPrompt(false);
                      setNewPromptText("");
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-semibold border transition-colors ${isDark ? 'border-stone-700 text-stone-300 bg-stone-800 hover:bg-stone-700' : 'border-gray-300 text-gray-600 bg-white hover:bg-gray-50'}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-2.5 py-1 rounded text-[10px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                  >
                    Save Prompt
                  </button>
                </div>
              </form>
            ) : (
              <p className={`text-sm italic leading-relaxed font-serif ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                "{prompts[currentPromptIndex] || "No starting prompts available. Click + to add one!"}"
              </p>
            )}
          </div>

          {/* Step 2: Vocabulary Generator Control Panel */}
          <section className="grid grid-cols-1 gap-3" id="control-panel">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`flex-1 h-10 px-3 rounded-lg border text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer transition-colors ${isDark ? 'bg-stone-800 border-stone-700 text-stone-100 focus:ring-indigo-400' : 'bg-white border-gray-300 text-gray-800'}`}
                id="category-dropdown"
              >
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat} className={isDark ? 'bg-stone-800 text-stone-100' : 'bg-white text-gray-800'}>
                    {cat === "Home & Routine" ? "🏠" : cat === "Productivity & Places" ? "💼" : cat === "Relationships" ? "❤️" : cat === "Appearance & Personality" ? "🎭" : cat === "Objects" ? "🎒" : "✨"} {cat}
                  </option>
                ))}
              </select>

              <button
                onClick={handleGenerateFromCategory}
                className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-all active:translate-y-0.5 whitespace-nowrap flex items-center justify-center gap-1.5 shadow-sm"
                id="generate-from-category"
              >
                <Sparkles size={13} />
                <span>Apply Category</span>
              </button>
            </div>

            <button
              onClick={handleGenerateRandom}
              className={`w-full h-10 border-2 text-xs font-semibold rounded-lg transition-all active:translate-y-0.5 flex items-center justify-center gap-1.5 ${isDark ? 'border-indigo-500 text-indigo-400 hover:bg-indigo-950/20' : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'}`}
              id="generate-random"
            >
              <Sparkles size={13} />
              <span>Generate Random Words</span>
            </button>
          </section>

          {/* Step 3: Immersive Term Output display styled with beautiful Indigo pills */}
          {currentWords.length > 0 && (
            <section id="outputDisplay" className={`p-4 rounded-xl border flex flex-wrap gap-2 items-center transition-colors duration-300 ${isDark ? 'bg-indigo-950/20 border-indigo-900/40' : 'bg-indigo-50 border-indigo-100'}`}>
              <span className={`text-[10px] uppercase tracking-widest font-extrabold w-full mb-1 ${isDark ? 'text-indigo-400/90' : 'text-indigo-400'}`}>
                Tap any assigned term below to view its meaning:
              </span>
              
              {/* Connector pill */}
              <button
                onClick={() => setSelectedMeaningWord(currentConnector)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-sans border transition-all cursor-pointer shadow-sm flex items-center gap-1.5 ${
                  selectedMeaningWord === currentConnector 
                    ? "bg-indigo-600 border-indigo-600 text-white scale-95 ring-2 ring-indigo-350" 
                    : isDark 
                      ? "bg-stone-800 border-stone-700 text-stone-200 hover:bg-stone-700" 
                      : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                }`}
                id="connector-card"
              >
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                  selectedMeaningWord === currentConnector 
                    ? "bg-indigo-700 text-indigo-100" 
                    : isDark 
                      ? "bg-stone-700 text-stone-300" 
                      : "bg-gray-200 text-gray-600"
                }`}>CONN</span>
                <span>{currentConnector}</span>
              </button>

              {/* Vocabulary word pills */}
              {currentWords.map((word, idx) => (
                <button
                  key={`${word}-${idx}`}
                  onClick={() => setSelectedMeaningWord(word)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold font-sans border transition-all cursor-pointer shadow-sm flex items-center gap-1.5 ${
                    selectedMeaningWord === word 
                      ? "bg-indigo-600 border-indigo-600 text-white scale-95 ring-2 ring-indigo-350" 
                      : isDark 
                        ? "bg-stone-800 border-stone-700 text-indigo-400 hover:bg-stone-700" 
                        : "bg-indigo-50 border-indigo-150 text-indigo-700 hover:bg-indigo-100"
                  }`}
                  id={`vocab-card-${idx + 1}`}
                >
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                    selectedMeaningWord === word 
                      ? "bg-indigo-700 text-indigo-100" 
                      : isDark 
                        ? "bg-indigo-950/50 text-indigo-300" 
                        : "bg-[#E0E7FF] text-[#4338CA]"
                  }`}>VOCAB</span>
                  <span>{word}</span>
                </button>
              ))}
            </section>
          )}

          {/* Step 4: Dictionary Meaning Display Board */}
          {currentWords.length > 0 && selectedMeaningWord && (
            <section id="meaningCard" className={`p-5 rounded-xl border shadow-inner flex flex-col gap-3.5 transition-all duration-300 ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-50 border-gray-200'}`}>
              
              <div className={`flex justify-between items-start border-b pb-2.5 ${isDark ? 'border-stone-800' : 'border-gray-200'}`}>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <BookMarked size={16} className="text-indigo-500" />
                    <span className={`text-sm font-extrabold tracking-tight ${isDark ? 'text-stone-100' : 'text-gray-900'}`}>{selectedMeaningWord}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-stone-500' : 'text-gray-400'}`}>
                    {CONNECTORS.includes(selectedMeaningWord) ? "Connector Word" : "Vocabulary Phrase"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Speech Button */}
                  <button 
                    onClick={() => handleSpeak(selectedMeaningWord)}
                    className={`p-2 rounded-lg border active:scale-95 transition-all ${isDark ? 'bg-indigo-950/30 border-indigo-900 text-indigo-400 hover:bg-indigo-900/40' : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100'}`}
                    title="Ouvrir Pronúncia (Pronounce)"
                  >
                    <Volume2 size={14} />
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopyWord(selectedMeaningWord)}
                    className={`p-2 rounded-lg border transition-all active:scale-95 flex items-center justify-center ${
                      copiedWord === selectedMeaningWord
                        ? "bg-emerald-500 border-emerald-400 text-white"
                        : isDark 
                          ? "bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200 hover:bg-stone-700" 
                          : "bg-white border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                    title="Copiar palavra (Copy)"
                  >
                    {copiedWord === selectedMeaningWord ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Definition Definição section */}
              <div className="flex flex-col gap-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>Definição (English)</span>
                <p className={`text-xs font-medium leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  {activeMeaning.definition}
                </p>
              </div>

              {/* Example Sentence Exemplo section */}
              <div className={`flex flex-col gap-1.5 border-t pt-3 ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>Exemplo de Uso</span>
                  <button 
                    onClick={() => handleSpeak(activeMeaning.example)}
                    className={`text-[10px] font-semibold flex items-center gap-1 ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
                    title="Pronunciar Exemplo"
                  >
                    <Volume2 size={12} />
                    Ouvir exemplo
                  </button>
                </div>
                <p className={`text-xs italic p-3 rounded-lg leading-relaxed font-serif border ${isDark ? 'text-stone-300 bg-stone-800/50 border-stone-700' : 'text-stone-700 bg-stone-100 border-stone-200'}`}>
                  "{activeMeaning.example}"
                </p>
              </div>

            </section>
          )}

        </div>

      </div>
      
    </div>
  );
}
