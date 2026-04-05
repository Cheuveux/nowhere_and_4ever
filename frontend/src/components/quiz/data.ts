import type { Question, ResultData, StrapiItem} from "./types"	

export const FALLBACK: Question[] = [
	{
		id: 1,
		text: "You see a video that perfectly confirms your political views. You:",
		answer: [
		{ text: "Check the source before sharing anything", points: 0 },
		{ text: "Like it, I'll fact-check later maybe", points: 10 },
		{ text: "Share it immediately, it's obviously true", points: 20 },
		{ text: "Finally, proof. I blast it to every group chat.", points: 30 },
		],
	},
	{
		id: 2,
		text: "Someone votes for a party you despise. You think:",
		answer: [
		{ text: "People have complex reasons for voting how they do", points: 0 },
		{ text: "I don't get it but okay", points: 10 },
		{ text: "They're either ignorant or acting in bad faith", points: 20 },
		{ text: "This person is morally beneath me. I can't respect them.", points: 30 },
		],
	},
	{
		id: 3,
		text: "A political debate breaks out at dinner. You:",
		answer: [
		{ text: "Listen to the different perspectives", points: 0 },
		{ text: "Share my opinion if asked", points: 10 },
		{ text: "Take over and explain how things actually work", points: 20 },
		{ text: "Cut people off when they're wrong. It's a public service.", points: 30 },
		],
	},
	{
		id: 4,
		text: "You come across an article that contradicts your worldview. You:",
		answer: [
		{ text: "Read it fully and genuinely reconsider some points", points: 0 },
		{ text: "Skim it looking for flaws", points: 10 },
		{ text: "Immediately look up who funds that media outlet", points: 20 },
		{ text: "It's propaganda. Close tab.", points: 30 },
		],
	},
	{
		id: 5,
		text: "Someone says 'it's more complicated than that' after you share a political opinion. You feel:",
		answer: [
		{ text: "Curious, they might have a point", points: 0 },
		{ text: "Slightly annoyed but I'll hear them out", points: 10 },
		{ text: "That's what people say when they want to dodge the real issue", points: 20 },
		{ text: "Nothing is ever that complicated. They're just a coward.", points: 30 },
		],
	},
	{
		id: 6,
		text: "A public figure you support gets accused of something serious. Your first thought:",
		answer: [
		{ text: "I wait for the facts before saying anything", points: 0 },
		{ text: "I hope it's false but I stay open", points: 10 },
		{ text: "This is obviously a hit job to take them down", points: 20 },
		{ text: "I'm already writing a defense thread.", points: 30 },
		],
	},
	{
		id: 7,
		text: "You find out someone you genuinely like votes the complete opposite of you. You:",
		answer: [
		{ text: "Still like them, politics is one part of a person", points: 0 },
		{ text: "Feel weird about it but move on", points: 10 },
		{ text: "Reframe every opinion they've ever shared through this new lens", points: 20 },
		{ text: "The friendship is different now. I can't help it.", points: 30 },
		],
	},
	{
		id: 8,
		text: "People who don't vote, in your opinion:",
		answer: [
		{ text: "Are making a political statement in their own way", points: 0 },
		{ text: "It's a shame but I understand the disillusionment", points: 10 },
		{ text: "Are exercising unchecked privilege", points: 20 },
		{ text: "Are actively complicit in everything they claim to hate", points: 30 },
		],
	},
	{
		id: 9,
		text: "You post a political opinion and someone calmly replies with data that contradicts you. You:",
		answer: [
		{ text: "Acknowledge it if the numbers check out", points: 0 },
		{ text: "Ask for the source and dig deeper", points: 10 },
		{ text: "Find the flaw in their reasoning, there's always one", points: 20 },
		{ text: "Stats can say anything. My lived experience trumps their spreadsheet.", points: 30 },
		],
	},
	{
		id: 10,
		text: "People who don't share your political values are, fundamentally:",
		answer: [
		{ text: "Products of a different path and context", points: 0 },
		{ text: "Wrong, but mostly in good faith", points: 10 },
		{ text: "Refusing to see what's plainly obvious", points: 20 },
		{ text: "An active threat to society", points: 30 },
		],
	},
];
	
	// RESULTATS
	export const RESULTS: ResultData[] = [
		{
		range: [0, 70],
		label:"Suprisingly Sane",
		color:"#00ff9f",
		tag: "Delusion level: background noise",
		description: "Tu n’es pas delulu, ou alors slightly delulu. Tout va bien : tu es cartésien.ne, la tête sur les épaules encore solidement attaché.e à la réalité commune … Tu sais garder ton calme, tu ne confonds pas un eye contact avec une compatibilité astrale, et franchement, dans ce quiz, c’est presque suspect de stabilité. Mais manques-tu d’un peu de romantisme ? Un petit scénario avant de dormir n’a jamais fait de mal à personne. Il y a peut-être, en toi, un potentiel de delulu encore en veille, bien rangé, bien domestiqué, qui ne demande qu’à faire deux-trois tours de piste. Tu es Émile dans Ratatouille, ou Stanley dans The Office : lucide, cool, pas encore emporté.e par le vortex. Tu observes les gens qui partent en roue libre affective avec une légère distance, parfois même avec un peu de jugement, mais aussi peut-être avec une pointe d’envie bb…",
		},
		{
		range: [71, 150],
		label:"Mildly Unhinged",
		color:"#ffe135",
		tag: "Delusion level: a vibe",
		description: "Je dirais que tu es une personne slightly delulu. Tu es un peu le green flag sur l’échelle de la delusion : tu es un peu dans ta tête, tu romantises par moments, tu repenses à une phrase un peu plus longtemps que nécessaire, tu peux accorder à un détail une importance légèrement disproportionnée… mais ça reste encore dans une zone fréquentable par la société civile. Tu es un.e Bridget Jones soft : ça cogite, ça projette un peu, ça s’emballe parfois, En gros, tu es dans cette zone grise où tu peux encore rire de toi-même puis reprendre une vie presque normale. Stade léger de la folie.",
		},
		{
		range: [151, 220],
		label:"Chronically Delusional",
		color:"#ff6bff",
		tag: "Delusion level: a whole personality",
		description: "Tu es clairement a delusional bitch. Tu vis dans Sex and the City, tu es un mélange entre Carrie et Charlotte: tu vies dans la croyance secrète qu’un détail a forcément un sens… qu’un message n’arrive jamais par hasard… et qu’une connexion un peu floue mérite déjà un ptit scénario intérieur en six épisodes. And as we said: if delusional paid rent, you’d own Manhattan sweetheart. Fais attention à toi, mon cœur : c’est super de fuir le réel quand ton monde intérieur est aussi bien décoré, mais n’oublie pas le présent ni la réalité. Expérimente pour de vrai, car les personnes vaporeuses sont souvent décevantes… Elles brillent beaucoup dans la tête, mais moins dans la vraie vie…Je te félicite si tu as été honnête dans tes réponses, mais je suis sûr.e que certain.es ici devraient être dans la catégorie suivante.",
		},
		{
		range: [221, 300],
		label:"Certified Delulu",
		color:"#ff3a5c",
		tag: "Delusion level: ✨ideological✨",
		description: "WARNING !!! T’es clairement overcooked. Tu es atteint.e d’une delusion sévère, tu as oublié ce qu’était la réalité commune à tous.tes, tu vis dans un film imaginaire. Là, tu es dans le mythe personnel, sur un dispositif narratif total avec preuves, théorie et effondrement potentiel. Tu es Sharpay Evans dans La Fabuleuse Aventure de Sharpay. Wake up bitch, tu es un danger émotionnel pour toi-même !! VA TOUCHER DE L’HERBE MA FILLE !!!! Tu es le genre de comportement qui justifie presque une cellule de crise. Heureusement que ce quiz est anonyme sinon j’aurais appelé tes potes. Mais je te remercie d’avoir joué le jeu et d’avoir été honnête. Je suis sûr.e que plein d’autres se sont voilé la face. T’inquiète ce quiz n’était pas un guet-apens psychologique, mais fais attention à toi. Si jamais, je peux créer un numéro d’urgence pour les delulu bitches en danger dans ton genre, ou un cercle de parole <3",
		},
	
	];

	export function getResult(points: number): ResultData {
  		return RESULTS.find((r) => points >= r.range[0] && points <= r.range[1])!;
}

export function mapStrapi(data: StrapiItem[]): Question[] {
  return data.map((item: any) => ({
    id: item.id,
    text: item.question ?? item.attributes?.question,
    answer: (item.answer ?? item.attributes?.answer ?? []).map((a: any) => ({
      text: a.Text,
      points: a.points,
    })),
  }));
}