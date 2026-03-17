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
		emoji: "🧘‍♀️",
		color:"#00ff9f",
		tag: "Delusion level: background noise",
		description: "You somehow managed to keep your grip on reality. You fact-check, you listen, you tolerate nuance without breaking a sweat. Either you're genuinely well-adjusted OR you're so deep in denial you've looped back to peace. Either way — unsettlingly calm.",
		},
		{
		range: [71, 150],
		label:"Mildly Unhinged",
		emoji: "👁️",
		color:"#ffe135",
		tag: "Delusion level: a vibe",
		description: "You have your moments. You spiral a little, catch yourself, spiral again. You've definitely drafted a furious reply and deleted it. You're human. Chaotic neutral energy — you'll share misinformation but feel bad about it for a few days.",
		},
		{
		range: [151, 220],
		label:"Chronically Delusional",
		emoji: "🌀",
		color:"#ff6bff",
		tag: "Delusion level: a whole personality",
		description: "The algorithm has fully consumed you. Every interaction is a sign, every coincidence is a conspiracy. You've explained 'how things really work' to someone who didn't ask. You see patterns where there are none — and you call it 'critical thinking'.",
		},
		{
		range: [221, 300],
		label:"Certified Delulu",
		emoji: "🔮",
		color:"#ff3a5c",
		tag: "Delusion level: ✨ideological✨",
		description: "You are not just in your head — you've built a bunker there. Anyone who disagrees is either a shill, a coward, or a threat. You haven't changed your mind about anything in years and you're proud of it. Unhinged. Iconic. Genuinely dangerous at dinner parties.",
		},
	
	];

	export function getResult(points: number): ResultData {
  		return RESULTS.find((r) => points >= r.range[0] && points <= r.range[1])!;
}

export function mapStrapi(data: StrapiItem[]): Question[] {
  return data.map((item) => ({
    id: item.id,
    text: item.attributes.question,
    answer: item.attributes.answer.map((a) => ({
      text: a.Text,
      points: a.points,
    })),
  }));
}