# lua-table

Parse from and stringify to lua-tables.

Typings and ts-doc are included.

- [Installation](#installation)
- [Usage](#usage)
	- [stringify](#stringify)
	- [parse](#parse)
- [API](#api)
	- [stringify](#stringify-1)
	- [parse](#parse-1)
- [License](#license)
- [Changelog](#changelog)

## Installation
`npm install @kilcekru/lua-table`

## Usage

### stringify

```javascript
import { stringify } from "@kilcekru/lua-table";

const options = {
	pretty: true, // Configure pretty-print
}
const table = stringify({a: 1, b: "str"}, options);

console.log(table);
/*
{
	["a"] = 1,
	["b"] = "str",
}
*/
```

### parse

```javascript
import { parse } from "@kilcekru/lua-table";

const options = {
	emptyTables: "object", // Parse empty tables as object or array
	booleanKeys: false, // Allow boolean keys in tables
	mixedKeyTypes: false, // Allow tables with string and numeric keys
	nonPositiveIntegerKeys: false, // Allow numeric keys that are not positive integers
	sparseArray: true, // Allow sparse arrays
}
const data = parse('{["a"]=1,["b"]="str"}', options);

console.log(JSON.stringify(data, undefined, "\t"));
/*
{
	"a": 1,
	"b": "str"
}
*/
```

## API

### stringify

```typescript
stringify(data: unknown, options?: StringifyOptions): string;
interface StringifyOptions {
	pretty?: boolean | number | string; // Configure pretty-print
	mixedKeyTypes?: boolean; // Allow tables with string and numeric keys
	nonPositiveIntegerKeys?: boolean; // Allow numeric table keys that are not positive integers
}
```

Stringifies data to a lua-table.

Supported types of data:
- undefined
- null
- string
- number
- object (also nested)
- array (also nested)
- class instance (also nested)

Functions will be ignored and treated like undefined.\
Unsupported types (e.g. Date) will throw an Error.

Array indices start at 0 in javascript and at 1 in lua.\
Because of this, array indices will incremented when an array is stringified.

**Options**
- `pretty` (type: `string | number | boolean`; default: `true`)
	
	Configure pretty-print for result.

	- *string*: will be used as indent
	- *number*: count of spaces used as indent
	- *true*: indent with tabs
	- *false*: disables pretty-print

- `mixedKeyTypes` (type: `boolean`; default: `false`)

	Allow tables with string and numeric keys.\
	Javascript object can only be indexed with string, so this can't be converted 1:1.

	- true: Convert keys that are parseable as number to number, leave non-numbers as string
	- false: Leave all keys as string

	Options `nonPositiveIntegerKeys` can be used to define which numbers are allowed as keys

- `nonPositiveIntegerKeys` (type: `boolean`; default: `false`)

	Allow numeric table keys that are not positive integers.\
	This option only influences the output if option `mixedKeyTypes` is true.
	
	- true: Every key parseable as number will be converted to number
	- false: Only positive integers will be converted to number, other keys will be left as string

### parse

```typescript
parse(input: string, options?: ParseOptions): unknown;
interface ParseOptions {
	emptyTables?: "object" | "array"; // Parse empty tables as object or array
	booleanKeys?: boolean; // Allow boolean keys in tables
	mixedKeyTypes?: boolean; // Allow tables with string and numeric keys
	nonPositiveIntegerKeys?: boolean; // Allow numeric keys that are not positive integers
	sparseArray?: boolean; // Allow sparse arrays
}
```

Parse stringified lua-table.\
If the input can't be parsed or violates the rules set with options an error will be thrown.\
The return type depends on given input.

Array indices start at 1 in lua and at 0 in javascript.\
Because of this indices are decremented when a table is converted to an array.\
If numeric indices are converted to an object (e.g. with mixed key types) indices will not be decremented.

**Options**
- `emptyTables` (type: `"object" | "array"`; default: `"object"`)
	
	Define how empty tables are parsed.\
	Empty lua table could be an empty array or an empty object. This can't be determined by the parser.

	- "object": parse empty tables as empty objects
	- "array": parse empty tables as empty arrays

- `booleanKeys` (type: `boolean`; default: `false`)

	Allow boolean keys in tables.\
	Javascript object can only be indexed with string, so this can't be converted 1:1.

	- true: convert boolean keys to string
	- false: throw error if boolean keys are encountered

- `mixedKeyTypes` (type: `boolean`; default: `false`)

	Allow tables with string and numeric keys.\
	Javascript object can only be indexed with string, so this can't be converted 1:1.

	- true: convert numeric keys to string, if string keys are present
	- false: throw error, if table with mixed key types is encountered

- `nonPositiveIntegerKeys` (type: `boolean`; default: `false`)

	Allow numeric table keys that are not positive integers.\
	Numeric keys should be array indices, this is not possible, if numeric keys are floats or <= 0.

	- true: convert tables with non-positive-integers keys to objects, keys are converted to strings
	- false: throw error, if non-positive-integers keys are encountered

- `sparseArray` (type: `boolean`; default: `true`)

	Allow sparse arrays.\
	Sparse arrays behave different in lua and javascript.

	- true: Parse sparse arrays as sparse arrays
	- false: throw error if input contains sparse array

## License

Licensed under [MIT](https://github.com/Kilcekru/lua-table/blob/main/LICENSE).

## Changelog

- v1.1.2
  - fix: allow semicolon in tables

- v1.1.1
  - fix: parsing of literal keys in table
  - fix: parsing of numbers with exponent 

- v1.1.0
	- added option `mixedKeyTypes` and `nonPositiveIntegerKeys` for stringify

- v1.0.0
	- Initial Release