import { promisify } from 'node:util'
import { exec } from 'node:child_process'

export const pexec = async cmd => {
	const { stderr, stdout } = await promisify(exec)(cmd)
	if (stderr) throw new Error(stderr)

	return stdout
}
