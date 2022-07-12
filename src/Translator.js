import { pexec } from './utils.js'
/*
1. Check phrases dictionary
2. Split on words
    3. Check in words dictionary (found - exit)
    4. Get transcription from translate-shell
    5. (if transcription found) Delete diacratics from transcription
    6. (if transcription found) Transfrom letters with alphabet dictionary
    7. Transform word with combinations dictionary
    8. Transofrm word with endings dictionary
3. Return sentence

Dictionaries:
1. Phrases
2. Words
3. Transpilation
4. Alpabet
5. Combinations
6. Endings
*/

export class Translator {
	constructor(phrases, words, alphabet, combinations, endings) {
		this.dictionaries = {
			phrases,
			words,
			alphabet,
			combinations,
			endings
		}
	}

	#transformPhrases(sentence) {
		for (const [phraseToReplace, replacer] of Object.entries(this.dictionaries.phrases)) {
			if (sentence.includes(phraseToReplace))
				sentence = sentence.replace(phraseToReplace, replacer)
		}

		return sentence
	}

	#transformChar(char) {
		return this.dictionaries.alphabet[char.toLowerCase()] || '?'
	}

	#transformWordLetterCombinations(word) {
		for (const [combinationToReplace, replacer] of Object.entries(
			this.dictionaries.combinations
		)) {
			if (word.includes(combinationToReplace))
				word = word.replace(combinationToReplace, replacer)
		}

		return word
	}

	#transformWordEnding(word) {
		for (const [endingToReplace, replacer] of Object.entries(this.dictionaries.endings)) {
			const chars = word.split('')
			const lastChar = chars[chars.length - 1]

			if (lastChar === endingToReplace) {
				chars.splice(-1)
				chars.push(replacer)
				return chars.join('')
			}
		}

		return word
	}

	async #getWordTranscription(word) {
		const translatorOutput = await pexec(`trans -d ${word}`)

		let transcription = translatorOutput.split(/\n/)[1]
		if (transcription) {
			transcription = transcription
				.replaceAll('/', '')
				.normalize('NFD')
				.replace(/\p{Diacritic}/gu, '')
		}
		return transcription
	}

	#searchWordInDict(word) {
		return this.dictionaries.words[word]
	}

	async #translateWord(word) {
		const wordsDictSearchResult = this.#searchWordInDict(word)
		if (wordsDictSearchResult) return wordsDictSearchResult
		const wordTranscriptionResult = await this.#getWordTranscription(word)
		let transformedWord = word
		if (wordTranscriptionResult) {
			const chars = wordTranscriptionResult.split('')
			transformedWord = chars.map(this.#transformChar.bind(this)).join('')
		}

		transformedWord = this.#transformWordLetterCombinations(transformedWord)
		transformedWord = this.#transformWordEnding(transformedWord)

		return transformedWord
	}

	async translate(sentence) {
		// now there is no support for upper case and symbols like , .
		// add in future
		sentence = sentence.toLowerCase()
		sentence = this.#transformPhrases(sentence)

		const words = await Promise.all(sentence.split(' ').map(this.#translateWord.bind(this)))

		return words.join(' ')
	}
}
