import fs from 'fs/promises'

const filename = process.argv.splice(2)[0]
if (!filename) {
	console.error('error: No filename was provided')
	process.exit(1)
}

try {
	const data = await fs.readFile(`./data/${filename}`, { encoding: 'utf-8' })
	const transformedData = JSON.stringify(
		Object.fromEntries(
			data
				.split(/\n/)
				.filter(e => e)
				.map(e => {
					const words = e.split(' ')
					if (words.length === 1) return [words[0], '']
					if (words.length > 2) {
						const translation = e.split('; ')
						return [translation[0], translation[1]]
					}
					return words
				})
		)
	)

	await fs.writeFile(`./data/${filename}.json`, transformedData)
	console.log('wrote it!')
} catch (e) {
	console.log(e)
}
