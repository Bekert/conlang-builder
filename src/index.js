import phrasesDict from '../data/example-dictionary.json' assert { type: 'json' }
import { Translator } from './Translator.js'

const wordsDict = { word: 'pepegort' }
const alphabetDict = { a: 'b', c: 'd' }
const combinationsDict = { ch: 'ph', th: 'z' }
const endingsDict = { g: '', r: '', q: 'wtf' }

const PPLTranslator = new Translator(
	phrasesDict,
	wordsDict,
	alphabetDict,
	combinationsDict,
	endingsDict
)

console.log(await PPLTranslator.translate('Pepega lol hah'))
