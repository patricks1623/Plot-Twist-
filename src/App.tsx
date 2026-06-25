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
    "Open the curtains/drape",
    "Turn on / turn off the fan",
    "I'm going to charge my phone /Put the phone on the charger",
    "to fold the clothes",
    "to change clothes",
    "to lie down/to go to bed",
    "Leave my bag on the chair",
    "sheet/bedsheet/sheets",
    "blanket",
    "I start my day by",
    "How often do you...?"
  ],
  "Productivity & Places": [
    "figure out",
    "pick up",
    "check my emails",
    "take a short break",
    "lose track of time",
    "What does she/he do for a living?",
    "gatherings / meetings"
  ],
  "Relationships": [
    "Siblings",
    "Sister-in-law/Brother-in-law",
    "Uncle/Aunt",
    "Nephew/Niece",
    "Stepmother/stepfather",
    "What is she/he like?",
    "Husband/wife",
    "Relatives",
    "acquaintance",
    "close friend",
    "childhood friend",
    "count on",
    "We have been friends for/since",
    "hang out with",
    "grow apart",
    "Barely talk",
    "lasts forever",
    "Catch up",
    "hit it off (with someone)",
    "to get together with",
    "only child",
    "get on well with",
    "close with",
    "what are your parents like?",
    "do they get along well with each other?",
    "Bonds",
    "value",
    "to stand by someone",
    "on the same wavelength",
    "click with"
  ],
  "Appearance & Personality": [
    "What does she/he look like?",
    "silly",
    "come along",
    "outgoing",
    "laid-back",
    "strict",
    "stubborn",
    "quite",
    "old-fashioned",
    "pretty",
    "forgetful",
    "cheerful",
    "over the years",
    "went on",
    "showcase",
    "revolve around - something/someone",
    "invasive",
    "gender roles",
    "rubs me the wrong way",
    "easygoing",
    "fun to be around",
    "help or hurt",
    "own good",
    "would rather",
    "two-faced",
    "short/tall",
    "average height/medium height",
    "He is very tall",
    "She is quite short",
    "thin",
    "fat",
    "slender",
    "slim",
    "lean",
    "petite",
    "slight",
    "curvy",
    "voluptuous",
    "stocky",
    "I have blond hair",
    "I am blonde-haired",
    "I have fair hair",
    "I have dark eyes",
    "bald",
    "short hair",
    "long hair",
    "My hair goes down to my waist",
    "straight hair",
    "wavy hair",
    "curly hair",
    "afro hair",
    "soft hair/damaged hair",
    "silky hair",
    "Dry hair",
    "fair skin",
    "dark skin",
    "Shape",
    "a few of"
  ],
  "Objects": []
};

const STARTING_PROMPTS = [
  "Yesterday, I woke up at 6 AM and went straight to the gym...",
  "It was a quiet afternoon at the bakery, and the fresh croissants were coming out of the oven...",
  "I had just put my phone on the charger when I heard a direct tap on the window...",
  "While walking back from the supermarket, I realized my bag had a tiny hole at the bottom...",
  "Deep in conversation at the coffee shop, we both suddenly stopped as we saw who just walked in...",
  "Sighing, I set the alarm for 5 AM, hoping to fold the clothes early, but my dog had other plans...",
  "I was halfway through washing the dishes when I noticed the water wasn't draining anymore...",
  "I was already running late for the flight when I realized I had left something very important at the hotel...",
  "I was already waiting in line to pay when I reached into my pocket and realized my wallet was nowhere to be found...",
  "The waiter had just placed our food on the table when my friend looked at me with an expression I had never seen before...",
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
    definition: "To set a clock or phone to make a sound at a specific time, usually to wake up.",
    example: "I need to set the alarm for 6:00 AM so I don't miss my early bus."
  },
  "Open the curtains/drape": {
    translation: "Abrir as cortinas",
    definition: "To pull apart the window coverings to let light into the room.",
    example: "The first thing she does in the morning is open the curtains to let the sunshine in."
  },
  "Turn on / turn off the fan": {
    translation: "Ligar / desligar o ventilador",
    definition: "To start or stop an electric fan to circulate air and cool down.",
    example: "It is very warm in here; could you please turn on the fan?"
  },
  "I'm going to charge my phone /Put the phone on the charger": {
    translation: "Vou carregar meu celular / Colocar o celular no carregador",
    definition: "To connect a mobile phone to an electrical outlet to restore its battery power.",
    example: "My phone is at 2%, so I'm going to charge my phone right now."
  },
  "to fold the clothes": {
    translation: "Dobrar as roupas",
    definition: "To bend and smooth out clothing neatly for storage in a drawer or shelf.",
    example: "After doing the laundry, I sat on the bed to fold the clothes."
  },
  "to change clothes": {
    translation: "Trocar de roupa",
    definition: "To take off the clothes you are wearing and put on different ones.",
    example: "Give me five minutes to change clothes before we go to the dinner party."
  },
  "to lie down/to go to bed": {
    translation: "Deitar-se / Ir para a cama",
    definition: "To place your body in a flat position to rest, relax, or sleep.",
    example: "I had a very long day, so I'm ready to lie down and go to bed."
  },
  "Leave my bag on the chair": {
    translation: "Deixar minha bolsa na cadeira",
    definition: "To put down a backpack or purse on a seating furniture when arriving somewhere.",
    example: "When I got home, I decided to leave my bag on the chair near the door."
  },
  "sheet/bedsheet/sheets": {
    translation: "Lençol / Lençóis",
    definition: "A large piece of cloth used to cover a bed mattress and to sleep under.",
    example: "I love the feeling of clean, freshly washed sheets on my bed."
  },
  "blanket": {
    translation: "Cobertor / Manta",
    definition: "A thick, warm cover made of wool or fabric used on a bed to stay warm.",
    example: "It was freezing cold last night, so I pulled a heavy blanket over myself."
  },
  "I start my day by": {
    translation: "Eu começo o meu dia...",
    definition: "A phrase used to describe the very first activity someone does in the morning.",
    example: "I start my day by drinking a large glass of water and meditating."
  },
  "How often do you...?": {
    translation: "Com que frequência você...?",
    definition: "A question used to ask about the frequency of an action or habit.",
    example: "How often do you go to the supermarket to buy fresh vegetables?"
  },

  // Productivity & Places
  "figure out": {
    translation: "Descobrir / Compreender / Encontrar uma solução",
    definition: "To solve a problem or understand something through thinking and reasoning.",
    example: "I need to figure out how to solve this math equation before tomorrow."
  },
  "pick up": {
    translation: "Pegar / Buscar / Colecionar",
    definition: "To lift someone or something up, or to go get someone/something from a place.",
    example: "Can you pick up some fresh bread from the bakery on your way home?"
  },
  "check my emails": {
    translation: "Verificar meus e-mails",
    definition: "To access your digital inbox to read and respond to messages.",
    example: "I usually check my emails first thing when I arrive at the office."
  },
  "take a short break": {
    translation: "Fazer uma pequena pausa",
    definition: "To pause an activity, study, or work for a brief moment to rest.",
    example: "After studying English for two hours, I decided to take a short break."
  },
  "lose track of time": {
    translation: "Perder a noção do tempo",
    definition: "To fail to notice how much time has passed because you are so focused on something.",
    example: "I was reading such an interesting book that I completely lost track of time."
  },
  "What does she/he do for a living?": {
    translation: "O que ela/ele faz da vida? / Qual a profissão dela/dele?",
    definition: "A question asking about someone's job, profession, or occupation.",
    example: "I met your cousin yesterday. What does she do for a living?"
  },
  "gatherings / meetings": {
    translation: "Encontros / Reuniões",
    definition: "Social assemblies or professional sessions where people come together.",
    example: "Our company holds weekly meetings, but I prefer informal family gatherings."
  },

  // Relationships
  "Siblings": {
    translation: "Irmãos",
    definition: "A person's brothers or sisters.",
    example: "I have two siblings: an older brother and a younger sister."
  },
  "Sister-in-law/Brother-in-law": {
    translation: "Cunhada / Cunhado",
    definition: "The sister or brother of one's spouse, or the spouse of one's sibling.",
    example: "My brother-in-law is very laid-back and we get along really well."
  },
  "Uncle/Aunt": {
    translation: "Tio / Tia",
    definition: "The brother or sister of one's parent, or the spouse of one's parent's sibling.",
    example: "My aunt always brings delicious chocolate cakes to our family gatherings."
  },
  "Nephew/Niece": {
    translation: "Sobrinho / Sobrinha",
    definition: "A son or daughter of one's brother or sister.",
    example: "My little niece is very cheerful and loves to play outside."
  },
  "Stepmother/stepfather": {
    translation: "Madrasta / Padrasto",
    definition: "The spouse of one's biological mother or father, who is not their biological parent.",
    example: "He has a great relationship with his stepfather, who helped raise him."
  },
  "What is she/he like?": {
    translation: "Como ela/ele é? (personalidade/caráter)",
    definition: "A question asking about someone's personality, behavior, or character traits.",
    example: "You mentioned your new flatmate; what is he like?"
  },
  "Husband/wife": {
    translation: "Marido / Esposa",
    definition: "The male or female partner in a marriage.",
    example: "She lives with her husband in a small apartment downtown."
  },
  "Relatives": {
    translation: "Parentes",
    definition: "Members of your wider family, such as cousins, aunts, and uncles.",
    example: "All of our relatives gather at my grandmother's house for Christmas."
  },
  "acquaintance": {
    translation: "Conhecido(a)",
    definition: "Someone you know slightly, but who is not a close friend.",
    example: "I wouldn't call him a friend; he is just an acquaintance from college."
  },
  "close friend": {
    translation: "Amigo(a) próximo(a)",
    definition: "A trusted companion with whom you share a deep connection and secrets.",
    example: "She is a close friend of mine, and I can tell her absolutely anything."
  },
  "childhood friend": {
    translation: "Amigo(a) de infância",
    definition: "A friend whom you have known since you were very young children.",
    example: "We met in kindergarten, so he is my oldest childhood friend."
  },
  "count on": {
    translation: "Contar com",
    definition: "To rely or depend on someone for support, help, or loyalty.",
    example: "No matter what happens, I know I can count on my best friend."
  },
  "We have been friends for/since": {
    translation: "Nós somos amigos há/desde",
    definition: "A phrase used to express the duration or starting point of a friendship.",
    example: "We have been friends since high school, which was ten years ago."
  },
  "hang out with": {
    translation: "Sair com / Passar tempo com",
    definition: "To spend free time in an informal and relaxed way with someone.",
    example: "On Saturday afternoons, I like to hang out with my classmates."
  },
  "grow apart": {
    translation: "Distanciar-se / Afastar-se",
    definition: "To gradually lose a close relationship with someone over time.",
    example: "We went to different colleges, and unfortunately, we started to grow apart."
  },
  "Barely talk": {
    translation: "Mal se falar",
    definition: "To have very little communication or conversation with someone.",
    example: "We had a big argument last month, and now we barely talk."
  },
  "lasts forever": {
    translation: "Dura para sempre",
    definition: "Something that continues to exist or hold value for an infinite duration.",
    example: "A true friendship is built on trust and lasts forever."
  },
  "Catch up": {
    translation: "Colocar o papo em dia / Atualizar-se",
    definition: "To talk to an old friend to find out what has happened in their life recently.",
    example: "We haven't seen each other in months; let's get together and catch up!"
  },
  "hit it off (with someone)": {
    translation: "Dar-se muito bem de cara / Sintonia imediata",
    definition: "To immediately become friendly and click with someone upon meeting.",
    example: "At the conference, I hit it off with a developer and we talked for hours."
  },
  "to get together with": {
    translation: "Reunir-se com / Encontrar-se com",
    definition: "To meet socially with someone or a group of people.",
    example: "I love to get together with my cousins during the summer holidays."
  },
  "only child": {
    translation: "Filho(a) único(a)",
    definition: "A person who has no siblings (brothers or sisters).",
    example: "She is an only child, so she received a lot of attention from her parents."
  },
  "get on well with": {
    translation: "Dar-se bem com",
    definition: "To have a friendly, smooth relationship with someone.",
    example: "I get on well with my sister-in-law; we have a lot in common."
  },
  "close with": {
    translation: "Próximo(a) de / Íntimo(a) de",
    definition: "Having a strong emotional connection or friendship with someone.",
    example: "I am very close with my grandparents and visit them every week."
  },
  "what are your parents like?": {
    translation: "Como são seus pais? (personalidade/comportamento)",
    definition: "A question asking about the character, nature, and personality of your parents.",
    example: "Tell me, what are your parents like? Are they strict or laid-back?"
  },
  "do they get along well with each other?": {
    translation: "Eles se dão bem um com o outro?",
    definition: "A question asking if two or more people have a harmonious relationship.",
    example: "My siblings argue occasionally, but generally, do they get along well with each other?"
  },
  "Bonds": {
    translation: "Laços / Vínculos",
    definition: "Strong connections or ties between family members or friends.",
    example: "Family gatherings help to strengthen the bonds between relatives."
  },
  "value": {
    translation: "Valorizar / Valor",
    definition: "To consider someone or something as important, highly appreciated, or precious.",
    example: "I deeply value my childhood friend because she always supports me."
  },
  "to stand by someone": {
    translation: "Apoiar alguém / Ficar ao lado de alguém",
    definition: "To remain loyal to someone and support them in a difficult situation.",
    example: "A true partner will always stand by you through thick and thin."
  },
  "on the same wavelength": {
    translation: "Na mesma sintonia / Pensando igual",
    definition: "Thinking in a very similar way or having a mutual understanding.",
    example: "We hit it off immediately because we are completely on the same wavelength."
  },
  "click with": {
    translation: "Dar liga / Dar-se bem imediatamente",
    definition: "To instantly connect and form a good relationship with someone.",
    example: "As soon as I started working with my new colleague, we clicked with each other."
  },

  // Appearance & Personality
  "What does she/he look like?": {
    translation: "Como ela/ele é fisicamente? / Qual a aparência dele/dela?",
    definition: "A question asking about someone's physical appearance, like height, hair, or style.",
    example: "I have a blind date tonight. What does he look like?"
  },
  "silly": {
    translation: "Bobo / Engraçado / Tolo",
    definition: "Playful, funny, or showing a lack of serious thought in a harmless way.",
    example: "He was wearing a silly hat that made all the children laugh."
  },
  "come along": {
    translation: "Acompanhar / Progredir / Aparecer",
    definition: "To accompany someone, arrive, or make progress.",
    example: "We are going to the coffee shop; would you like to come along?"
  },
  "outgoing": {
    translation: "Extrovertido / Sociável",
    definition: "Friendly, socially confident, and enjoying the company of other people.",
    example: "My sister is very outgoing and makes friends easily wherever she goes."
  },
  "laid-back": {
    translation: "Descontraído / Tranquilo",
    definition: "Relaxed, calm, and not easily stressed or worried about rules.",
    example: "He has a laid-back lifestyle and doesn't worry about minor issues."
  },
  "strict": {
    translation: "Rígido / Rigoroso / Exigente",
    definition: "Expecting people to obey rules or behave in a certain precise way.",
    example: "My stepfather was quite strict when I was growing up."
  },
  "stubborn": {
    translation: "Teimoso / Obstinado",
    definition: "Refusing to change your mind or behavior even when there are good reasons to do so.",
    example: "She is so stubborn that she won't apologize even when she knows she's wrong."
  },
  "quite": {
    translation: "Bastante / Bem",
    definition: "To a noticeable degree; moderately or very.",
    example: "My niece is quite short, but she runs exceptionally fast."
  },
  "old-fashioned": {
    translation: "Antiquado / Tradicional / À moda antiga",
    definition: "Belonging to a past style or time; not modern.",
    example: "My uncle is a bit old-fashioned and still writes letters by hand."
  },
  "pretty": {
    translation: "Bonita / Lindo (também significa 'bastante')",
    definition: "Attractive in a delicate or pleasant way; can also mean 'fairly/moderately'.",
    example: "She bought a pretty dress for the family gathering."
  },
  "forgetful": {
    translation: "Esquecido(a)",
    definition: "Often forgetting things; absent-minded.",
    example: "As I grow older, I find myself becoming more forgetful."
  },
  "cheerful": {
    translation: "Alegre / Bem-humorado",
    definition: "Noticeably happy, optimistic, and friendly in spirit.",
    example: "He always has a cheerful smile on his face, which brightens my day."
  },
  "over the years": {
    translation: "Ao longo dos anos",
    definition: "Happening or changing gradually over a long period.",
    example: "Over the years, our childhood friendship grew even stronger."
  },
  "went on": {
    translation: "Continuou / Prosseguiu",
    definition: "Continued to happen or do something; proceeded.",
    example: "Despite the cold, we went on with our outdoor hike."
  },
  "showcase": {
    translation: "Exibir / Demonstrar",
    definition: "To exhibit or display the best qualities or features of something.",
    example: "The festival is a great way to showcase local music and food."
  },
  "revolve around - something/someone": {
    translation: "Girar em torno de - algo/alguém",
    definition: "To have someone or something as the main subject, focus, or interest.",
    example: "Her entire life seems to revolve around her children."
  },
  "invasive": {
    translation: "Invasivo(a)",
    definition: "Intruding on someone's privacy or personal space without permission.",
    example: "Asking about someone's salary is considered quite invasive in many cultures."
  },
  "gender roles": {
    translation: "Papéis de gênero",
    definition: "Social expectations and behaviors associated with being male or female.",
    example: "In modern societies, traditional gender roles are changing rapidly."
  },
  "rubs me the wrong way": {
    translation: "Não me bate bem / Irrita-me",
    definition: "To annoy or irritate someone slightly without a clear reason.",
    example: "The way he always speaks over other people really rubs me the wrong way."
  },
  "easygoing": {
    translation: "Maleável / Fácil de lidar / Despreocupado",
    definition: "Relaxed and tolerant in approach; easy to get along with.",
    example: "She is very easygoing, so she doesn't mind where we go for dinner."
  },
  "fun to be around": {
    translation: "Divertido de se ter por perto",
    definition: "Pleasant, entertaining, and exciting company.",
    example: "He is outgoing and has a great sense of humor, so he is very fun to be around."
  },
  "help or hurt": {
    translation: "Ajudar ou prejudicar",
    definition: "To produce positive assistance or negative impact on a situation.",
    example: "Your comments during the meeting can either help or hurt our proposal."
  },
  "own good": {
    translation: "Próprio bem",
    definition: "For someone's personal benefit or advantage, even if they dislike it.",
    example: "I'm telling you this for your own good, because I care about your future."
  },
  "would rather": {
    translation: "Preferiria / Preferia",
    definition: "Used to express a preference for one thing over another.",
    example: "I would rather drink a hot coffee than a cold soda right now."
  },
  "two-faced": {
    translation: "Duas-caras / Falso",
    definition: "Insincere, deceitful, or saying different things to different people.",
    example: "Be careful with her; she is two-faced and spreads gossip behind your back."
  },
  "short/tall": {
    translation: "Baixo / Alto",
    definition: "Measuring a small or large distance from bottom to top; below or above average height.",
    example: "My father is very tall, but my stepmother is short."
  },
  "average height/medium height": {
    translation: "Altura média",
    definition: "Neither short nor tall; of typical height for a human.",
    example: "She has brown hair, dark eyes, and is of average height."
  },
  "He is very tall": {
    translation: "Ele é muito alto",
    definition: "Having a high stature (male).",
    example: "He is very tall and has to bend down to pass through low doorways."
  },
  "She is quite short": {
    translation: "Ela é bem baixinha",
    definition: "Having a low stature (female).",
    example: "She is quite short, so she often wears high heels."
  },
  "thin": {
    translation: "Magro(a)",
    definition: "Having little extra flesh or fat on the body.",
    example: "He stayed thin even though he ate a lot of fast food."
  },
  "fat": {
    translation: "Gordo(a) / Forte",
    definition: "Having a large amount of excess flesh or body weight.",
    example: "Our family dog became a bit fat after we fed him extra treats."
  },
  "slender": {
    translation: "Esguio(a) / Esbelto(a)",
    definition: "Gracefully thin, elegant, and slight in build.",
    example: "The ballet dancer had a slender and graceful figure."
  },
  "slim": {
    translation: "Magro(a) / Esbelto(a) / Elegante",
    definition: "Thin in an attractive and healthy way.",
    example: "She exercises regularly to stay slim and fit."
  },
  "lean": {
    translation: "Magro e forte / Sem gordura / Atlético",
    definition: "Thin and healthy, with strong, clear muscles and little fat.",
    example: "As an athlete, he has a lean and powerful physique."
  },
  "petite": {
    translation: "Pequena / Delicada (mulher)",
    definition: "Attractively small and dainty (describing a female body).",
    example: "She is quite petite, so children's clothing sometimes fits her."
  },
  "slight": {
    translation: "Pequeno / Frágil / Delgado",
    definition: "Small, thin, and delicate in physical build.",
    example: "She is of slight build but has surprising physical strength."
  },
  "curvy": {
    translation: "Com curvas / Violão",
    definition: "Having an attractively curved female shape with prominent hips and bust.",
    example: "She embraced her curvy body and wore form-fitting dresses."
  },
  "voluptuous": {
    translation: "Voluptuosa / Curvilínea",
    definition: "Full-figured and curvaceous in a highly attractive way.",
    example: "Her voluptuous figure made her a famous model for evening gowns."
  },
  "stocky": {
    translation: "Atarracado / Forte / Robusto",
    definition: "Broad and sturdily built; thick-set and strong.",
    example: "He is a stocky guy who looks like a rugby player."
  },
  "I have blond hair": {
    translation: "Tenho cabelo loiro",
    definition: "Describing having pale yellow or golden-colored hair.",
    example: "I have blond hair and blue eyes, just like my father."
  },
  "I am blonde-haired": {
    translation: "Sou loiro(a) / Tenho cabelos loiros",
    definition: "Another way to describe having blond hair.",
    example: "I am blonde-haired and have fair skin, so I sunburn easily."
  },
  "I have fair hair": {
    translation: "Tenho cabelo claro",
    definition: "Having light-colored hair, such as blond or light brown.",
    example: "Most of my relatives have fair hair and light eyes."
  },
  "I have dark eyes": {
    translation: "Tenho olhos escuros",
    definition: "Having deep brown or black eyes.",
    example: "I have dark eyes and wavy black hair."
  },
  "bald": {
    translation: "Careca",
    definition: "Having little or no hair on the scalp.",
    example: "My stepfather decided to shave his head completely when he started going bald."
  },
  "short hair": {
    translation: "Cabelo curto",
    definition: "Hair cut close to the scalp or above the shoulders.",
    example: "I prefer short hair in the summer because it keeps me cool."
  },
  "long hair": {
    translation: "Cabelo comprido",
    definition: "Hair that grows below the shoulders or waist.",
    example: "She tied her long hair in a neat ponytail before the gym session."
  },
  "My hair goes down to my waist": {
    translation: "Meu cabelo vai até a minha cintura",
    definition: "Having exceptionally long hair that reaches the waist level.",
    example: "I haven't trimmed it in four years, so now my hair goes down to my waist."
  },
  "straight hair": {
    translation: "Cabelo liso",
    definition: "Hair without curls, waves, or bends.",
    example: "Her straight hair was so shiny and silky in the light."
  },
  "wavy hair": {
    translation: "Cabelo ondulado",
    definition: "Hair that has smooth, gentle curves or waves but is not fully curly.",
    example: "She styled her wavy hair with sea salt spray for a beachy look."
  },
  "curly hair": {
    translation: "Cabelo cacheado",
    definition: "Hair that grows in tight spirals, loops, or curls.",
    example: "He inherited his beautiful curly hair from his mother's side."
  },
  "afro hair": {
    translation: "Cabelo afro / Crespo",
    definition: "Naturally dense, coily, and textured hair typical of people of African descent.",
    example: "She proudly wears her beautiful, voluminous afro hair."
  },
  "soft hair/damaged hair": {
    translation: "Cabelo macio / Cabelo danificado",
    definition: "Describing the condition of hair, being smooth and healthy or dry and split.",
    example: "Using conditioner makes my soft hair even silkier, whereas bleaching causes damaged hair."
  },
  "silky hair": {
    translation: "Cabelo sedoso",
    definition: "Hair that is incredibly smooth, soft, and shiny like silk.",
    example: "The salon treatment left her with beautiful, silky hair."
  },
  "Dry hair": {
    translation: "Cabelo seco / Cabelo ressecado",
    definition: "Hair that lacks moisture, feeling rough or brittle to the touch.",
    example: "Using a hairdryer too often can leave you with very dry hair."
  },
  "fair skin": {
    translation: "Pele clara",
    definition: "Light-colored skin that is sensitive to sunlight.",
    example: "Because she has fair skin, she always wears high factor sunscreen."
  },
  "dark skin": {
    translation: "Pele escura",
    definition: "Skin naturally rich in melanin, having a deep, brown shade.",
    example: "Her dark skin looks absolutely beautiful in bright yellow clothing."
  },
  "Shape": {
    translation: "Forma / Silhueta / Condição física",
    definition: "The physical silhouette, form, or standard of fitness of a person.",
    example: "He runs every morning to stay in good shape."
  },
  "a few of": {
    translation: "Alguns de / Poucos de",
    definition: "A small number of people or things from a larger group.",
    example: "Only a few of my colleagues came along to the restaurant."
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
      
      const merged: Record<string, string[]> = {};
      Object.keys(CATEGORIES).forEach((cat) => {
        const defaultWords = CATEGORIES[cat] || [];
        const savedWords = parsed[cat] || [];
        // Combine default words and saved words to preserve both
        merged[cat] = Array.from(new Set([...defaultWords, ...savedWords]));
      });
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
          // Keep the default translation, definition and example if they were updated
          cleaned[word] = {
            ...(WORD_MEANINGS[word] || {}),
            ...(parsed[word] || {})
          };
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
      if (saved) {
        const parsed = JSON.parse(saved) as string[];
        let updated = [...parsed];
        let hasChanges = false;
        STARTING_PROMPTS.forEach(p => {
          if (!updated.includes(p)) {
            updated.push(p);
            hasChanges = true;
          }
        });
        if (hasChanges) {
          localStorage.setItem("plot_twist_prompts_v3", JSON.stringify(updated));
          return updated;
        }
        return parsed;
      }
      return STARTING_PROMPTS;
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
