export function isFunction(data: unknown) {
	return Object.prototype.toString.call(data) === "[object Function]";
}

export function isObject(data: unknown) {
	return Object.prototype.toString.call(data) === "[object Object]";
}

export function isPlainObject(data: unknown): data is Record<string, unknown> {
	if (data == undefined || !isObject(data)) {
		return false;
	}
	if (data.constructor === undefined) {
		return true;
	}
	if (!isObject(data.constructor.prototype)) {
		return false;
	}
	return true;
}

export const errMsg = {
	empty: () => "Received empty input",
	end: () => "Unexpected end of input",
	error: () => "Internal error. This is due to a bug",
	fail: () => "Received invalid input",
	invalid: (char: string, pos: number, { line, col }: { line: number; col: number }, surround: string) =>
		`Unexpected token '${char}' at position ${pos} (line ${line}:${col}) near '${surround}'`,
	mixed: () => "Encountered table mith mixed key types and options.mixedKeyTypes is not true",
	nonPosIntKeys: () =>
		"Encountered numeric key which is not a positive integer and options.nonPositiveIntegerKeys is not true",
	notString: () => "Input ist not a string",
	sparse: () => "Encountered sparse array and options.sparseArray is false",
};

export function isWhiteSpace(char: string) {
	return char === " " || char === "\t" || char === "\r" || char === "\n";
}

export function isNumber(char: string) {
	const charCode = char.charCodeAt(0);
	return charCode >= 48 && charCode <= 57;
}

export function isLetter(char: string) {
	const charCode = char.charCodeAt(0);
	return (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122);
}

export function analyzeKeys(keys: Array<string | number>) {
	const hasStringKey = keys.some((e) => typeof e === "string");

	const hasNumKeys = keys.some((e) => typeof e === "number");
	const hasNonArrayNumKeys = !hasNumKeys
		? false
		: keys.some((e) => typeof e === "number" && (!Number.isInteger(e) || e <= 0));

	return {
		hasStringKey,
		hasNumKeys,
		hasNonArrayNumKeys,
	};
}
