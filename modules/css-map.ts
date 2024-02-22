import { Glob } from "bun";
import fs from "node:fs/promises";

import cssMap from "./css-map.json";

export async function applyCssMapPerFile(file: string) {
	console.log(file);
	let content = (await fs.readFile(file)).toString();
	for (const [v, k] of Object.entries(cssMap)) {
		content = content.replaceAll(k, v);
	}
	await fs.writeFile(file, content);
}

async function applyCssMapPerFiles(files: AsyncIterableIterator<string>) {
	for await (const file of files) {
		await applyCssMapPerFile(file);
	}
}

async function applyCssMapPerDir(dir: string) {
	const allJS = new Glob("**/*.js").scan(".");
	const allCSS = new Glob("**/*.css").scan(".");

	applyCssMapPerFiles(allJS);
	applyCssMapPerFiles(allCSS);
}

await applyCssMapPerDir(".");
