import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import Page from '../../shared/page';

type translationKey = 'es' | 'en' | 'it' | 'fr' | 'de';

export default class ComponentDayTip extends LitElement {
  @property({ type: String }) language: translationKey = 'en';

  @state() private tips: { [key in translationKey]: string[]; } = {
    es: [
      "Tu dieta debe tener en cuenta tu contexto, debe ser realista y considerar tus condiciones.",
      "Evita la hipermonitorización, contar obsesivamente calorías te puede desconectar de tus señales internas y llevarte a prácticas de riesgo.",
      "Intenta identificar conductas de riesgo, lavarse los dientes por hambre o sobreentrenar para compensar pueden ser prácticas peligrosas y no hábitos saludables. Pide ayuda si las identificas y plantéate darte un decanso de la dieta.",
      "No demonices alimentos, pues culpar a ciertos nutrientes no te ayudará a mantener una buena relación con la comida y puede desencadenar problemas psicológicos.",
      "Prioriza la comida real, los suplementos solo complementan y depender de muchos puede indicar que te faltan nutrientes.",
      "Come sin culpa, ejerciendo tu derecho a comer lo que desees sin ganártelo entrenando y sin culparte con juicios morales.",
      "Cuida tu relación con la comida. Entendiende que la salud no se define solo por lo que comes o tu forma física, tu salud mental e intentar cambiar tus hábitos también cuenta como salud.",
      "Recuerda que ganar peso también es liberador, especialmente en deportes de fuerza donde subir de peso para rendir mejor te puede liberar de la obsesión por adelgazar.",
      "Recuerda que tu dieta no es tu identidad, y comer estrictamente para encajar en el fitness te puede aislar de tus vínculos.",
      "Gestiona el deseo de adelgazar aceptando que es normal desear un cuerpo más delgado, pero analiza el porqué de ese deseo (presión estética, canon social...) e intenta que ese anhelo no te impida disfrutar.",
      "Registra tu progreso reservando días fijos para entrenar y anota tus avances para visualizar todo lo que has conseguido. Pero también está bien si no lo haces y sólo disfrutas de comer y entrenar",
      "Huye de los gurús y desconfía de quienes venden soluciones milagrosas, ya que ninguna fórmula mágica funciona para todos.",
      "Ten cuidado con los relojes inteligentes, porque sustituir tu percepción interna por datos externos que te pueden desconectar corporalmente. Escuchate y date los cuidados y necesidades que tu cuerpo te pida",
      "Recupera tu soberanía corporal entrenando para sentirte libre y capaz, y nunca desde la culpa o como una simple obligación moral.",
      "Renuncia a la carta de feminidad sin pedir perdón por entrenar fuerza, usa tu cuerpo para tu propia satisfacción personal.",
      "Ten claro que no debes tu apariencia a nadie. Tu físico y como cuidarlo es una decisión exclusivamente tuya.",
      "Sé consciente de que tu género condiciona tu trato, ya que tu identidad, origen y economía determinan cómo se te tratará en los espacios deportivos.",
      "Busca espacios seguros, crea entornos donde puedas descubrir tu fuerza sin depender de las miradas del resto.",
      "Recuerda que las dietas restrictivas no funcionan porque comer menos de lo necesario activa el modo supervivencia, el cuerpo entra en autofagia y deja de ser saludable..",
      "Acepta que es normal sentir hambre porque tu cuerpo necesita comer más para regenerarse al entrenar, y no fracasas si no pierdes peso.",
      "Pierde el miedo a comer y retira la culpa asociada a la comida, piensa que comer sin pasar hambre es muy positivo.",
      "No opines sobre cuerpos ajenos ni comentes los cambios de peso de otros, pueden deberse a problemas de salud y esos comentarios pueden hacer daño.",
      "No elogies la pérdida de peso, esto refuerza la falsa idea de que perder peso siempre equivale a salud y éxito estético.",
      "Ten en cuenta que el IMC es inválido, esta herramienta es para hacer análisis sociales de población, cruza peso y altura sin distinguir grasa de músculo y puede catalogar erróneamente a personas fuertes como obesas y viceversa.",
      "Ten cuidado con el sesgo gordófobo, porque exigir perder peso antes de tratar dolencias es reduccionista y las causas del dolor son siempre multifactoriales.",
      "Tienes derecho a una atención sanitaria digna, y si condicionan tu tratamiento a perder peso, cambia de especialista.",
      "Valora los beneficios inmediatos y haz deporte para tener más energía y bienestar, no solo con el fin utilitarista de adelgazar.",
      "Defiéndete de comentarios no solicitados. Tienes derecho a responder como prefieras cuando alguien opina sin tu permiso sobre tu cuerpo.",
      "Adapta tu terminología sustituyendo la palabra peso por composición corporal, esto ayudará a cambiar tu percepción y evitar estigmas perjudiciales.",
      "Deconstruye la meritocracia del peso. Estar delgado no tiene porqué tener mérito, ya que el peso depende de múltiples factores.",
      "La salud no es un deber moral. Rechaza la idea de que tienes que tener un aspecto saludable para recibir respeto.",
      "Pierde el miedo a la palabra 'gorda/o' y evita los eufemismos que perpetúan el estigma. Reapropiate del término.",
      "Cuestiona el autocuidado extremo. Revisa si tus reglas alimenticias. Si te generan miedo y/o culpa cuando te las saltas, es solo control.",
      "Busca profesionales con visión crítica acudiendo a nutricionistas que entiendan la conducta y el entorno social en lugar de solo enfocarse en las calorías.",
      "No pauses tu vida a causa de tu peso. Habita tu cuerpo como es, en lugar de pausar tu vida por la estética.",
      "El sistema se lucra de ti; el capitalismo necesita tu insatisfacción corporal crónica para seguir vendiéndote dietas y operaciones estéticas.",
      "No compenses con ejercicio si subes de peso, no sobreentrenes y reflexiona por qué ahora tu identidad depende de algo puramente estético.",
      "Quiere y cuida también a tus versiones incómodas. No te rechaces en esos días en los que no cumples con tus expectativas deportivas, nutricionales o visuales.",
      "Rechaza el 'querer es poder', este mensaje tóxico ignora tus contexto socioeconómico y genera culpa al obligarte a pelear contra tu propia vida.",
      "Protege tus datos y vínculos evitando planes gratuitos que extraen datos; huye de gurús que te pidan aislarte de tus seres queridos.",
      "Existe una hipocresía en el mundo fitness, es contradictorio que exigir hacer deporte y al mismo tiempo despreciar a los cuerpos no normativos en el gimnasio.",
      "Haz comunidad al entrenar usando el gimnasio para tejer lazos y apoyo mutuo. Recuerda que el entrenamiento no debe aislarte de tu entorno.",
      "Consume fruta y verdura todos los días, cómprala en la frutería de tu barrio",
      "Haz deporte varios días a la semana para estar fuerte. Apoya a al box / gimnasio de tu barrio",
      "Tu progreso no se mide bajo un único factor, tu progreso es visible de muchas cosas (ser capaz de mantener los hábitos, sentirte más saludable, tener más energía, tener más disciplina...) medirlo sólo a través de la evolución de tu peso es un error y no refleja de manera real el trabajo que estás haciendo.",
      "Tanto en el cálculo de la ingesta de las calorías, como en la información nutricional de los alimentos, existen márgenes de errores. No te obsesiones con las calorías puesto que es un dato aproximado y no una medida exacta."
    ],
    en: [
      "Your diet should take your context into account, the plan must be realistic and consider your conditions.",
      "Avoid hyper-monitoring, obsessively counting calories can disconnect you from your internal signals and lead to risky practices.",
      "Try to identify risky behaviors, brushing your teeth out of hunger or overtraining to compensate can be dangerous practices and not healthy habits. Ask for help if you identify them and consider taking a break from dieting.",
      "Do not demonize foods, as blaming certain nutrients will not help you maintain a good relationship with food and can trigger psychological problems.",
      "Prioritize real food, supplements only complement and relying on many may indicate that you lack nutrients.",
      "Eat without guilt, exercising your right to eat what you want without earning it by training and without blaming yourself with moral judgments.",
      "Take care of your relationship with food. Understand that health is not defined only by what you eat or your physical shape, your mental health and trying to change your habits also count as health.",
      "Remember that gaining weight is also liberating, especially in strength sports where gaining weight to perform better can free you from the obsession of losing weight.",
      "Remember that your diet is not your identity, and eating strictly to fit into fitness can isolate you from your bonds.",
      "Manage the desire to lose weight by accepting that it is normal to want a thinner body, but analyze the reason for that desire (aesthetic pressure, social standards...) and try not to let that desire prevent you from enjoying yourself.",
      "Record your progress by setting fixed days to train and write down your progress to visualize everything you have achieved. But it's also well if you don't and you just enjoy eating and training.",
      "Run away from gurus and beware of those who sell miracle solutions, as no magic formula works for everyone.",
      "Be careful with smartwatches, because replacing your internal perception with external data can physically disconnect you. Listen to yourself and give yourself the care and needs your body asks for.",
      "Regain your bodily sovereignty by training to feel free and capable, and never out of guilt or as a simple moral obligation.",
      "Renounce the femininity card without apologizing for strength training, use your body for your own personal satisfaction.",
      "Be clear that you don't owe your appearance to anyone. Your physical appearance and how you take care of it is a decision made solely by you.",
      "Be aware that your gender conditions the way you are treated, since your identity, origin, and economy determine how you will be treated in sports spaces.",
      "Look for safe spaces, create environments where you can discover your strength without depending on the eyes of others.",
      "Remember that restrictive diets don't work because eating less than necessary activates survival mode, the body goes into autophagy and stops being healthy.",
      "Accept that it's normal to feel hungry because your body needs to eat more to regenerate when training, and you haven't failed if you don't lose weight.",
      "Lose the fear of eating and remove the guilt associated with food, think that eating without going hungry is highly positive.",
      "Don't give your opinion on other people's bodies or comment on the weight changes of others, they could be due to health issues and those comments can cause harm.",
      "Don't praise weight loss, this reinforces the false idea that losing weight always equals health and aesthetic success.",
      "Keep in mind that the BMI is invalid, this tool is designed for social analysis of populations, it crosses weight and height without distinguishing fat from muscle and can erroneously classify strong people as obese and vice versa.",
      "Beware of fatphobic bias, because demanding weight loss before treating ailments is reductionist and the causes of pain are always multifactorial.",
      "You have the right to decent healthcare, and if your treatment is conditioned on losing weight, change specialists.",
      "Value the immediate benefits and play sports to have more energy and well-being, not just for the utilitarian purpose of losing weight.",
      "Defend yourself from unsolicited comments. You have the right to reply as you prefer when someone gives an opinion about your body without your permission.",
      "Adapt your terminology by replacing the word weight with body composition, this will help change your perception and avoid harmful stigmas.",
      "Deconstruct the weight meritocracy. Being thin doesn't necessarily mean it has merit, since weight depends on multiple factors.",
      "Health is not a moral duty. Reject the idea that you have to look healthy to be respected.",
      "Lose the fear of the word 'fat' and avoid euphemisms that perpetuate the stigma. Reclaim the term.",
      "Question extreme self-care. Review your dietary rules. If they generate fear and/or guilt when you break them, it's just control.",
      "Look for professionals with a critical vision by going to nutritionists who understand behavior and the social environment instead of just focusing on calories.",
      "Don't pause your life because of your weight. Inhabit your body as it is, instead of pausing your life for aesthetics.",
      "The system profits from you; capitalism needs your chronic body dissatisfaction to continue selling you diets and cosmetic surgeries.",
      "Don't compensate with workouts if you gain weight, don't overtrain and reflect on why your identity now depends on something purely aesthetic.",
      "Love and take care of your uncomfortable versions too. Don't reject yourself on the days when you don't meet your sporting, nutritional or visual expectations.",
      "Reject the 'where there is a will, there is a way', this toxic message ignores your socioeconomic context and generates guilt by forcing you to fight against your own life.",
      "Protect your data and bonds by avoiding free plans that extract data; run away from gurus who ask you to isolate yourself from your loved ones.",
      "There is a hypocrisy in the fitness world, it is contradictory to demand sports and at the same time to despise non-normative bodies in the gym.",
      "Build community when training using the gym to weave ties and mutual support. Remember that training should not isolate you from your environment.",
      "Consume fruit and vegetables every day, buy them at your neighborhood greengrocer's.",
      "Exercise several days a week to be strong. Support your neighborhood box / gym.",
      "Your progress is not measured by a single factor, your progress is visible in many ways (being able to maintain habits, feeling healthier, having more energy, having more discipline...) measuring it only through the evolution of your weight is a mistake and does not truly reflect the work you are doing.",
      "Both in calculating caloric intake and in the nutritional information of food, there are margins of error. Do not obsess over calories since it is an approximate figure and not an exact measure."
    ],
    it: [
      "La tua dieta deve tenere conto del tuo contesto, deve essere realistica e considerare le tue condizioni.",
      "Evita l'ipermonitoraggio, contare in modo ossessivo le calorie ti può disconnettere dai tuoi segnali interni e portarti a pratiche rischiose.",
      "Cerca di identificare comportamenti a rischio, lavarsi i denti per fame o sovrallenarsi per compensare possono essere pratiche pericolose e non abitudini sane. Chiedi aiuto se le identifichi e considera di prenderti una pausa dalla dieta.",
      "Non demonizzare gli alimenti, poiché incolpare determinati nutrienti non ti aiuterà a mantenere un buon rapporto con il cibo e può innescare problemi psicologici.",
      "Dai priorità al cibo vero, gli integratori servono solo a completare e fare affidamento su molti può indicare che ti mancano dei nutrienti.",
      "Mangia senza sensi di colpa, esercitando il tuo diritto di mangiare ciò che desideri senza doverlo meritare con l'allenamento e senza biasimarti con giudizi morali.",
      "Prenditi cura del tuo rapporto con il cibo. Comprendi che la salute non è definita solo da ciò che mangi o dalla tua forma fisica, anche la tua salute mentale e cercare di cambiare le tue abitudini contano come salute.",
      "Ricorda che anche aumentare di peso è liberatorio, specialmente negli sport di forza in cui guadagnare peso per migliorare le prestazioni ti può liberare dall'ossessione di dimagrire.",
      "Ricorda che la tua dieta non è la tua identità e mangiare rigorosamente per adattarsi al fitness ti può isolare dai tuoi legami.",
      "Gestisci il desiderio di dimagrire accettando che è normale volere un corpo più magro, ma analizza il motivo di quel desiderio (pressione estetica, canone sociale...) e cerca di fare in modo che quel desiderio non ti impedisca di godertela.",
      "Registra i tuoi progressi riservando giorni fissi per allenarti e annota i tuoi progressi per visualizzare tutto ciò che hai ottenuto. Ma va bene lo stesso se non lo fai e ti limiti a divertirti mangiando e allenandoti.",
      "Fuggi dai guru e diffida di chi vende soluzioni miracolose, poiché nessuna formula magica funziona per tutti.",
      "Fai attenzione agli smartwatch, perché sostituire la tua percezione interna con dati esterni può disconnetterti corporalmente. Ascoltati e concediti le cure e le necessità richieste dal tuo corpo.",
      "Recupera la tua sovranità corporea allenandoti per sentirti libero e capace, e mai per senso di colpa o come un semplice obbligo morale.",
      "Rinuncia alla carta della femminilità senza chiedere scusa per l'allenamento di forza, usa il tuo corpo per la tua personale soddisfazione.",
      "Abbi chiaro che non devi il tuo aspetto a nessuno. Il tuo fisico e come prendertene cura è una tua decisione esclusiva.",
      "Sii consapevole che il tuo genere condiziona il modo in cui vieni trattato, poiché la tua identità, origine ed economia determinano come verrai trattato negli spazi sportivi.",
      "Cerca spazi sicuri, crea ambienti in cui puoi scoprire la tua forza senza dipendere dagli sguardi degli altri.",
      "Ricorda che le diete restrittive non funzionano perché mangiare meno del necessario attiva la modalità di sopravvivenza, il corpo entra in autofagia e smette di essere in salute.",
      "Accetta che è normale avere fame perché il tuo corpo ha bisogno di mangiare di più per rigenerarsi durante l'allenamento, e non fallisci se non perdi peso.",
      "Perdi la paura di mangiare e togli il senso di colpa associato al cibo, pensa che mangiare senza patire la fame è molto positivo.",
      "Non dare opinioni sui corpi altrui né commentare i cambiamenti di peso degli altri, potrebbero essere dovuti a problemi di salute e quei commenti possono fare male.",
      "Non elogiare la perdita di peso, questo rafforza la falsa idea che perdere peso equivolga sempre a salute e successo estetico.",
      "Tieni presente che l'IMC non è valido, questo strumento serve per analisi sociali sulla popolazione, incrocia peso e altezza senza distinguere il grasso dal muscolo e può catalogare erroneamente persone forti come obese e viceversa.",
      "Fai attenzione al pregiudizio grassofobico, perché esigere la perdita di peso prima di curare i disturbi è riduzionista e le cause del dolore sono sempre multifattoriali.",
      "Hai diritto a un'assistenza sanitaria dignitosa, e se condizionano il tuo trattamento alla perdita di peso, cambia specialista.",
      "Valuta i benefici immediati e fai sport per avere più energia e benessere, non solo con il fine utilitaristico di dimagrire.",
      "Difenditi dai commenti non richiesti. Hai diritto a rispondere come preferisci quando qualcuno esprime opinioni sul tuo corpo senza il tuo permesso.",
      "Adatta la tua terminologia sostituendo la parola peso con composizione corporea, questo ti aiuterà a cambiare la tua percezione e a evitare stigmi pregiudizievoli.",
      "Decostruisci la meritocrazia del peso. Essere magri non ha necessariamente alcun merito, poiché il peso dipende da molteplici fattori.",
      "La salute non è un dovere morale. Rifiuta l'idea di dover avere un aspetto sano per ricevere rispetto.",
      "Perdi la paura della parola 'grasso/a' ed evita eufemismi che perpetuano lo stigma. Riappropriati del termine.",
      "Metti in discussione l'estrema cura di te. Rivedi le tue regole alimentari. Se ti generano paura e/o colpa quando le infrangi, è solo controllo.",
      "Cerca professionisti con una visione critica rivolgendoti a nutrizionisti che comprendono il comportamento e l'ambiente sociale invece di concentrarsi solo sulle calorie.",
      "Non mettere in pausa la tua vita a causa del tuo peso. Abita il tuo corpo così com'è, invece di mettere in pausa la tua vita per l'estetica.",
      "Il sistema trae profitto da te; il capitalismo ha bisogno della tua cronica insoddisfazione corporea per continuare a venderti diete e operazioni estetiche.",
      "Non compensare con l'esercizio se prendi peso, non sovrallenarti e rifletti sul perché ora la tua identità dipende da qualcosa di puramente estetico.",
      "Ama e prenditi cura anche delle tue versioni scomode. Non rifiutarti in quei giorni in cui non soddisfi le tue aspettative sportive, nutrizionali o visive.",
      "Rifiuta il 'volere è potere', questo messaggio tossico ignora il tuo contesto socioeconomico e genera sensi di colpa costringendoti a lottare contro la tua stessa vita.",
      "Proteggi i tuoi dati e i tuoi legami evitando i piani gratuiti che estraggono dati; scappa dai guru che ti chiedono di isolarti dai tuoi cari.",
      "Esiste un'ipocrisia nel mondo del fitness, è contraddittorio esigere di fare sport e allo stesso tempo disprezzare i corpi non normativi in palestra.",
      "Fai comunità quando ti alleni usando la palestra per tessere legami e supporto reciproco. Ricorda che l'allenamento non dovrebbe isolarti dal tuo ambiente.",
      "Consuma frutta e verdura tutti i giorni, comprale dal fruttivendolo del tuo quartiere",
      "Fai sport vari giorni a settimana per essere forte. Sostieni il box / la palestra del tuo quartiere",
      "Il tuo progresso non si misura attraverso un unico fattore, il tuo progresso è visibile da molti elementi (essere in grado di mantenere le abitudini, sentirti più in salute, avere più energia, avere più disciplina...) misurarlo solo attraverso l'evoluzione del tuo peso è un errore e non riflette in modo reale il lavoro che stai facendo.",
      "Sia nel calcolo dell'assunzione di calorie che nelle informazioni nutrizionali degli alimenti, ci sono margini di errore. Non ossessionarti con le calorie poiché si tratta di un dato approssimativo e non di una misura esatta."
    ],
    fr: [
      "Ton régime doit prendre en compte de ton contexte, il doit être réaliste et tenir compte de tes conditions.",
      "Évite l'hyper-surveillance, compter les calories de manière obsessionnelle peut te déconnecter de tes signaux internes et te mener vers des pratiques à risque.",
      "Essaie d'identifier les comportements à risque, se brosser les dents à cause de la faim ou s'entraîner de manière excessive pour compenser peuvent être des pratiques dangereuses et non des habitudes saines. Demande de l'aide si tu les identifies et envisage de faire une pause dans ton régime.",
      "Ne diabolise pas les aliments, car blâmer certains nutriments ne t'aidera pas à maintenir une bonne relation avec la nourriture et peut déclencher des problèmes psychologiques.",
      "Priorise la vraie nourriture, les compléments ne font que compléter et dépendre de beaucoup d'entre eux peut indiquer que tu manques de nutriments.",
      "Mange sans culpabilité, en exerçant ton droit de manger ce que tu veux sans avoir à le mériter par l'entraînement et sans te culpabiliser avec des jugements moraux.",
      "Prends soin de ta relation avec la nourriture. Comprends que la santé ne se définit pas seulement par ce que tu manges ou par ta forme physique, ta santé mentale et le fait d'essayer de changer tes habitudes comptent également comme étant de la santé.",
      "N'oublie pas que prendre du poids est aussi libérateur, en particulier dans les sports de force où prendre du poids pour être plus performant peut te libérer de l'obsession de perdre du poids.",
      "Garde à l'esprit que ton régime n'est pas ton identité, et que manger de manière stricte pour entrer coller à une image de fitness peut t'isoler de tes proches.",
      "Gère le désir de perdre du poids en acceptant qu'il est normal de vouloir un corps plus mince, mais analyse la raison de ce désir (pression esthétique, norme sociale...) et essaie de faire en sorte que ce désir ne t'empêche pas de profiter.",
      "Note tes progrès en réservant des jours fixes pour t'entraîner et note tes avancées pour visualiser tout ce que tu as accompli. Mais ce n'est pas grave non plus si tu ne le fais pas et que tu te contentes de profiter de la nourriture et de l'entraînement.",
      "Fuis les gourous et méfie-toi de ceux qui vendent des solutions miracles, car aucune formule magique fonctionne pour tout le monde.",
      "Méfie-toi des montres connectées, car le fait de remplacer ta perception interne par des données externes peut te déconnecter corporellement. Écoute-toi et offre-toi les soins et les besoins dont ton corps a besoin.",
      "Retrouve ta souveraineté corporelle en t'entraînant pour te sentir libre et capable, et jamais par culpabilité ou comme une simple obligation morale.",
      "Renonce à la carte de la féminité sans t'excuser pour l'entraînement de force, utilise ton corps pour ta propre satisfaction personnelle.",
      "Garde à l'esprit que tu ne dois ton apparence à personne. Ton physique et la façon de l'entretenir sont de ton seul ressort.",
      "Sois consciente que ton sexe conditionne la façon dont tu es traitée, car ton identité, ton origine et ta situation économique déterminent comment tu seras traitée dans les espaces sportifs.",
      "Recherche des espaces sûrs, crée des environnements où tu peux découvrir ta force sans dépendre du regard des autres.",
      "N'oublie pas que les régimes restrictifs ne fonctionnent pas car manger moins que nécessaire active le mode survie, le corps entre en autophagie et cesse d'être en bonne santé.",
      "Accepte qu'il est normal de ressentir de la faim parce que ton corps a besoin de manger plus pour se régénérer lorsque tu t'entraînes, et tu n'as pas échoué si tu ne perds pas de poids.",
      "Perds la peur de manger et retire la culpabilité associée à la nourriture, dis-toi que manger sans avoir faim est très positif.",
      "Ne donne pas ton avis sur le corps des autres et ne commente pas les changements de poids des autres, ils peuvent être dus à des problèmes de santé et ces commentaires peuvent être blessants.",
      "Ne fais pas l'éloge de la perte de poids, car cela renforce la fausse idée que la perte de poids équivaut toujours à la santé et au succès esthétique.",
      "Garde à l'esprit que l'IMC n'est pas valide, c'est un outil d'analyse sociale des populations, qui croise le poids et la taille sans distinguer la graisse du muscle et peut étiqueter à tort des personnes fortes comme étant obèses et inversement.",
      "Fais attention aux préjugés grossophobes, car exiger de perdre du poids avant de soigner des douleurs est réducteur et les causes de la douleur sont toujours plurifactorielles.",
      "Tu as droit à des soins de santé dignes, et si on conditionne ton traitement à la perte de poids, change de spécialiste.",
      "Valorise les bénéfices immédiats et fais du sport pour avoir plus d'énergie et de bien-être, et pas seulement dans le but utilitariste de perdre du poids.",
      "Défends-toi contre les commentaires non sollicités. Tu as le droit de répondre comme tu l'entends lorsque quelqu'un donne son avis sur ton corps sans ta permission.",
      "Adapte ta terminologie en remplaçant le mot poids par composition corporelle, cela t'aidera à changer ta perception et à éviter les stigmates nuisibles.",
      "Déconstruis la méritocratie du poids. Être mince n'est pas forcément un mérite, car le poids dépend de multiples facteurs.",
      "La santé n'est pas un devoir moral. Rejette l'idée qu'il faut avoir l'air en bonne santé pour être respecté.",
      "Perds la peur du mot 'gros.se' et évite les euphémismes qui perpétuent les préjugés. Réapproprie-toi le terme.",
      "Remets en question l'extrême soin de soi. Revois tes règles alimentaires. Si elles engendrent de la peur et/ou de la culpabilité lorsque tu les enfreins, c'est juste du contrôle.",
      "Recherche des professionnels avec un esprit critique en te tournant vers des nutritionnistes qui comprennent le comportement et l'environnement social au lieu de se concentrer uniquement sur les calories.",
      "Ne mets pas ta vie sur pause à cause de ton poids. Habite ton corps tel qu'il est, au lieu de mettre ta vie sur pause pour des raisons esthétiques.",
      "Le système profite de toi; le capitalisme a besoin de l'insatisfaction chronique vis-à-vis de ton corps pour continuer à te vendre des régimes et des opérations chirurgicales esthétiques.",
      "Ne compense pas en faisant de l'exercice si tu prends du poids, ne fais pas de surentraînement et réfléchis aux raisons pour lesquelles ton identité dépend désormais de quelque chose de purement esthétique.",
      "Aime et prends soin de tes versions inconfortables. Ne te rejette pas ces jours-là où tu ne réponds pas à tes attentes sportives, nutritionnelles ou visuelles.",
      "Rejette le 'quand on veut on peut', ce message toxique ignore ton contexte socio-économique et engendre un sentiment de culpabilité en t'obligeant à lutter contre ta propre vie.",
      "Protège tes données et tes liens en évitant les plans gratuits qui extraient tes données ; fuis les gourous qui te demandent de t'isoler de tes proches.",
      "Il y a une hypocrisie dans le monde du fitness, il est contradictoire d'exiger de faire du sport et en même temps de mépriser les corps non normatifs dans la salle de sport.",
      "Fais communauté lorsque tu t'entraînes en utilisant la salle de sport pour tisser des liens et du soutien mutuel. Garde à l'esprit que l'entraînement ne doit pas t'isoler de ton environnement.",
      "Consomme des fruits et légumes tous les jours, achète-les chez le primeur de ton quartier.",
      "Fais du sport plusieurs jours par semaine pour être forte. Soutiens la box / la salle de sport de ton quartier.",
      "Ton avancement ne se mesure pas sur un seul critère, tes progrès se voient à travers plein de choses (ta capacité à maintenir de nouvelles habitudes, un sentiment d'être en meilleure santé, d'avoir plus d'énergie, de faire preuve de plus de discipline...), ainsi le fait de le mesurer uniquement par l'évolution de ton poids est une erreur et ne reflète pas réellement le travail que tu fais.",
      "Tant dans le calcul des calories que dans les informations nutritionnelles des aliments, il y a des marges d'erreur. Ne sois pas obsédée par les calories car c'est une donnée approximative et non une mesure exacte."
    ],
    de: [
      "Deine Ernährung sollte deinen Kontext berücksichtigen, sie muss realistisch sein und deine Bedingungen einbeziehen.",
      "Vermeide Hyper-Monitoring, das obsessive Zählen von Kalorien kann dich von deinen inneren Signalen entfremden und zu riskanten Praktiken führen.",
      "Versuche, riskante Verhaltensweisen zu erkennen: Aus Hunger die Zähne zu putzen oder zum Ausgleich übermäßig zu trainieren, können gefährliche Praktiken und keine gesunden Gewohnheiten sein. Bitte um Hilfe, wenn du sie erkennst, und ziehe in Betracht, eine Diätpause einzulegen.",
      "Dämonisiere keine Lebensmittel, denn bestimmten Nährstoffen die Schuld zu geben, hilft dir nicht dabei, ein gutes Verhältnis zum Essen aufrechtzuerhalten, und kann psychische Probleme auslösen.",
      "Bevorzuge echte Lebensmittel, Nahrungsergänzungsmittel sind nur eine Ergänzung, und wenn du dich auf viele verlässt, kann das darauf hindeuten, dass dir Nährstoffe fehlen.",
      "Iss ohne Schuldgefühle, nimm dein Recht in Anspruch, zu essen, was du willst, ohne es dir durch Training verdienen zu müssen und ohne dich selbst mit moralischen Urteilen fertigzumachen.",
      "Pflege deine Beziehung zum Essen. Verstehe, dass Gesundheit nicht nur dadurch definiert wird, was du isst oder wie deine körperliche Verfassung ist. Deine mentale Gesundheit und der Versuch, deine Gewohnheiten zu ändern, zählen ebenfalls als Gesundheit.",
      "Denk daran, dass Gewichtszunahme auch befreiend sein kann, besonders bei Kraftsportarten, bei denen eine Gewichtszunahme zur Leistungssteigerung dich von der Gewichtsverlust-Obsession befreien kann.",
      "Denk daran, dass deine Ernährung nicht deine Identität ist, und wenn du streng isst, um ins Fitnessbild zu passen, kann dich das von deinen Bindungen isolieren.",
      "Gehe mit dem Wunsch, abzunehmen, um, indem du akzeptierst, dass es normal ist, sich einen dünneren Körper zu wünschen, aber analysiere den Grund für diesen Wunsch (ästhetischer Druck, gesellschaftliche Normen...) und versuche zu verhindern, dass dieser Wunsch dir den Spaß verdirbt.",
      "Protokolliere deine Fortschritte, indem du feste Trainingstage einplanst, und notiere deine Fortschritte, um alles, was du erreicht hast, zu visualisieren. Aber es ist auch in Ordnung, wenn du das nicht tust und einfach nur das Essen und das Training genießt.",
      "Fliehe vor den Gurus und nimm dich in Acht vor denen, die Wunderlösungen verkaufen, denn keine magische Formel funktioniert für alle.",
      "Sei vorsichtig mit Smartwatches, denn wenn du deine innere Wahrnehmung durch externe Daten ersetzt, kann dich das körperlich entfremden. Hör auf dich selbst und gib dir die Pflege und erfülle die Bedürfnisse, nach denen dein Körper verlangt.",
      "Erlange deine körperliche Souveränität zurück, indem du trainierst, um dich frei und fähig zu fühlen, und niemals aus Schuldgefühlen oder als einfache moralische Verpflichtung.",
      "Verzichte auf die Weiblichkeitskarte, ohne dich für Krafttraining zu entschuldigen, nutze deinen Körper zu deiner eigenen persönlichen Zufriedenheit.",
      "Mach dir klar, dass du niemandem dein Aussehen schuldest. Dein Körper und wie du ihn pflegst, ist ganz allein deine Entscheidung.",
      "Sei dir bewusst, dass dein Geschlecht beeinflusst, wie du behandelt wirst, da deine Identität, Herkunft und wirtschaftliche Situation bestimmen, wie du in sportlichen Räumen behandelt wirst.",
      "Suche nach sicheren Räumen, schaffe Umgebungen, in denen du deine Stärke entdecken kannst, ohne von den Blicken anderer abhängig zu sein.",
      "Denk daran, dass restriktive Diäten nicht funktionieren, weil der Körper in den Überlebensmodus wechselt, wenn er weniger isst als nötig, in Autophagie verfällt und aufhört, gesund zu sein.",
      "Akzeptiere, dass es normal ist, Hunger zu verspüren, weil dein Körper mehr Nahrung zur Regeneration braucht, wenn er trainiert, und du bist nicht gescheitert, wenn du nicht abnimmst.",
      "Verliere die Angst vor dem Essen und befreie dich von den mit Essen verbundenen Schuldgefühlen. Denk daran, dass Essen ohne zu hungern sehr positiv ist.",
      "Äußere dich nicht über die Körper anderer Leute oder kommentiere die Gewichtsveränderungen anderer Personen nicht, sie könnten auf gesundheitliche Probleme zurückzuführen sein und diese Kommentare können Schaden anrichten.",
      "Lobe keinen Gewichtsverlust, denn das verstärkt die falsche Vorstellung, dass Gewichtsverlust immer Gesundheit und ästhetischem Erfolg entspricht.",
      "Denke daran, dass der BMI nicht aussagekräftig ist, dieses Tool dient der sozialen Analyse von Populationen, es vergleicht Gewicht und Größe, ohne Fett von Muskeln zu unterscheiden, und kann starke Menschen fälschlicherweise als fettleibig einstufen und umgekehrt.",
      "Hüte dich vor fatphobischen Vorurteilen, denn Gewichtsabnahme vor der Behandlung von Beschwerden zu fordern, ist reduktiv, und die Ursachen für Schmerzen sind immer multifaktoriell.",
      "Du hast das Recht auf eine angemessene Gesundheitsversorgung, und falls deine Behandlung an eine Gewichtsabnahme geknüpft ist, wechsle den Spezialisten.",
      "Schätze die sofortigen Vorteile und treibe Sport, um mehr Energie und Wohlbefinden zu haben, nicht nur wegen des rein praktischen Ziels, abzunehmen.",
      "Verteidige dich gegen ungebetene Kommentare. Du hast das Recht, so zu antworten, wie du es vorziehst, wenn jemand ohne deine Erlaubnis eine Meinung über deinen Körper abgibt.",
      "Passe deine Terminologie an, indem du das Wort Gewicht durch Körperzusammensetzung ersetzt, das wird dir helfen, deine Wahrnehmung zu verändern und schädliche Stigmata zu vermeiden.",
      "Dekonstruiere die Leistungsgesellschaft des Gewichts. Schlank zu sein hat nicht unbedingt etwas mit Leistung zu tun, da das Gewicht von mehreren Faktoren abhängt.",
      "Gesundheit ist keine moralische Pflicht. Lehne den Gedanken ab, dass du gesund aussehen musst, um respektiert zu werden.",
      "Verliere die Angst vor dem Wort 'fett' und vermeide Euphemismen, die dieses Stigma aufrechterhalten. Eigne dir den Begriff wieder an.",
      "Hinterfrage extreme Selbstfürsorge. Überprüfe deine Ernährungsregeln. Wenn sie Angst und/oder Schuldgefühle erzeugen, wenn du sie nicht einhältst, geht es nur um Kontrolle.",
      "Suche nach Fachleuten mit einem kritischen Blick, indem du dich an Ernährungsberater wendest, die Verhaltensweisen und das soziale Umfeld verstehen, anstatt sich nur auf Kalorien zu konzentrieren.",
      "Pausiere dein Leben nicht wegen deines Gewichts. Lebe in deinem Körper, wie er ist, anstatt dein Leben aus ästhetischen Gründen zu pausieren.",
      "Das System profitiert von dir; der Kapitalismus braucht deine chronische Unzufriedenheit mit dem Körper, um dir weiterhin Diäten und Schönheitsoperationen zu verkaufen.",
      "Kompensiere es nicht mit Sport, wenn du zunimmst, trainiere nicht übermäßig und überlege, warum deine Identität nun von etwas rein Ästhetischem abhängt.",
      "Liebe und kümmere dich auch um deine unbequemen Versionen. Lehne dich nicht an den Tagen ab, an denen du deine sportlichen, ernährungstechnischen oder visuellen Erwartungen nicht erfüllst.",
      "Lehne das Sprichwort 'Wo ein Wille ist, ist auch ein Weg' ab, diese giftige Botschaft ignoriert deinen sozioökonomischen Kontext und erzeugt Schuldgefühle, indem sie dich zwingt, gegen dein eigenes Leben zu kämpfen.",
      "Schütze deine Daten und Bindungen, indem du kostenlose Pläne meidest, die Daten abzweigen; laufe vor Gurus davon, die von dir verlangen, dich von deinen Liebsten zu isolieren.",
      "In der Fitnesswelt herrscht Heuchelei, es ist widersprüchlich, Sport zu verlangen und gleichzeitig nicht-normative Körper im Fitnessstudio zu verachten.",
      "Baue eine Community auf, wenn du trainierst, nutze das Fitnessstudio, um Kontakte zu knüpfen und gegenseitige Unterstützung aufzubauen. Denke daran, dass Training dich nicht von deinem Umfeld isolieren sollte.",
      "Verzehre jeden Tag Obst und Gemüse, kaufe sie beim Gemüsehändler in deiner Nähe.",
      "Treibe mehrmals pro Woche Sport, um stark zu sein. Unterstütze die Box / das Fitnessstudio in deiner Nähe.",
      "Dein Fortschritt wird nicht an einem einzigen Faktor gemessen, dein Fortschritt ist an vielen Dingen sichtbar (Fähigkeit, Gewohnheiten beizubehalten, sich gesünder zu fühlen, mehr Energie zu haben, disziplinierter zu sein...) Ihn nur durch die Entwicklung deines Gewichts zu messen, ist ein Fehler und spiegelt nicht wirklich die Arbeit wider, die du leistest.",
      "Sowohl bei der Berechnung der Kalorienaufnahme als auch bei den Nährwertangaben von Lebensmitteln gibt es Fehlertoleranzen. Sei nicht von Kalorien besessen, da es sich um einen ungefähren Wert und nicht um ein genaues Maß handelt."
    ]
  };

  @state() private selectedTip = '';

  static styles = [
    Page.styles,
    css`
      :host {
        display: block;
        margin: 16px 0;
      }
      .card {
        box-shadow: 0 0 10px var(--carbs-color), inset 0 0 20px rgba(184, 255, 61, 0.1);
      }
      .tip-title {
        font-weight: bold;
        color: var(--palette-purple);
        font-size: 0.9rem;
        padding-bottom: 16px;
        width: 100%;
        text-align: center;
        text-transform: uppercase;
      }
      :host-context([data-theme="light"]) .tip-title {
        color: var(--palette-green);
      }
      .tip-text {
        font-size: 1rem;
        color: var(--card-text);
        line-height: 1.4;
      }
    `
  ];

  connectedCallback() {
    super.connectedCallback();
    this.selectRandomTip();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('language')) {
      this.selectRandomTip();
    }
  }

  private selectRandomTip() {
    const languageTips = this.tips[this.language] || this.tips.en;
    const randomIndex = Math.floor(Math.random() * languageTips.length);
    this.selectedTip = languageTips[randomIndex];
  }

  render() {
    const tipTitle = {
      es: 'Consejo del día',
      en: 'Tip of the day',
      it: 'Consiglio del giorno',
      fr: 'Conseil du jour',
      de: 'Tipp des Tages'
    }[this.language] || 'Tip of the day';

    return html`
      <div class="card">
        <div class="tip-title">${tipTitle}</div>
        <div class="tip-text">${this.selectedTip}</div>
      </div>
    `;
  }
}
