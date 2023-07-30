import { describe, expect, test } from "@jest/globals";

import { parse } from "../../src/parse";
import { fromFile } from "../utils";

describe("parse", () => {
	describe("parse", () => {
		test("string (double quote)", () => {
			expect(parse('"testString"')).toBe("testString");
		});

		test("string (single quote)", () => {
			expect(parse("'testString'")).toBe("testString");
		});

		test("string (escaped quote)", () => {
			expect(parse('"test\\"string"')).toBe('test"string');
		});

		test("string (escaped single quote)", () => {
			expect(parse("'test\\'string'")).toBe("test'string");
		});

		test("string (escaped newline)", () => {
			expect(parse('"test\\nstring"')).toBe("test\nstring");
		});

		test("string (escaped tab)", () => {
			expect(parse('"test\\tstring"')).toBe("test\tstring");
		});

		test("integer", () => {
			expect(parse("123")).toBe(123);
		});

		test("number", () => {
			expect(parse("-13.46")).toBe(-13.46);
		});

		test("number (exponent)", () => {
			expect(parse("-2.936e4")).toBe(-29360);
		});

		test("number (positive exponent)", () => {
			expect(parse(".347e+3")).toBe(347);
		});

		test("number (negative exponent)", () => {
			expect(parse("1.12e-2")).toBe(0.0112);
		});

		test("array (implicit keys)", () => {
			expect(parse("{1, 2, 3}")).toEqual([1, 2, 3]);
		});

		test("array (explicit keys)", () => {
			expect(parse("{[1] = 1, [3] = 3, [2] = 2}")).toEqual([1, 2, 3]);
		});

		test("array (implicit & explicit keys)", () => {
			expect(parse("{[3] = 3, 1, 2}")).toEqual([1, 2, 3]);
		});

		test("array of arrays)", () => {
			expect(parse(`{{1, 2, 3}, {4, 5, 6}}`)).toEqual([
				[1, 2, 3],
				[4, 5, 6],
			]);
		});

		test("array (fromFile)", () => {
			expect(parse(fromFile("array"))).toEqual([1, 2, "str"]);
		});

		test("object (double quotes)", () => {
			expect(parse('{["a"]=1,["b"]="str"}')).toEqual({ a: 1, b: "str" });
		});

		test("object (single quotes)", () => {
			expect(parse("{['a']=1,['b']='str'}")).toEqual({ a: 1, b: "str" });
		});

		test("object (unquoted keys)", () => {
			expect(parse(`{a=1,b="str"}`)).toEqual({ a: 1, b: "str" });
		});

		test("object (mixed quotes)", () => {
			expect(parse(`{["a"]=1,['b']="str"}`)).toEqual({ a: 1, b: "str" });
		});

		test("object (fromFile)", () => {
			expect(parse(fromFile("object"))).toEqual({ a: 1, b: 2, c: "str" });
		});

		test("object (separators)", () => {
			expect(parse(`{a=1,b=2;c=3,}`)).toEqual({ a: 1, b: 2, c: 3 });
		});

		test("whitespace", () => {
			expect(parse(`  {	[ "a"   ]\n\t=  1 ,\r\n[ "b"  ] =  "str"\r  }  `)).toEqual({ a: 1, b: "str" });
		});

		test("complex (string, table)", () => {
			expect(parse(`{"lua51",{it = true,describe = true}}`)).toEqual(["lua51", { it: true, describe: true }]);
		});

		test("complex", () => {
			expect(parse(fromFile("complex"))).toEqual({
				nul: null,
				str: "string",
				num: 1,
				arr: [2, "a", { a: 3 }],
				obj: { a: "a", b: 4, c: {} },
			});
		});

		test("comments (line)", () => {
			expect(parse('{["a"]=1,--comment\n["b"]="str"}')).toEqual({ a: 1, b: "str" });
		});

		test("comments (block inline)", () => {
			expect(parse('{["a"]--[[comment]]=1,["b"]="str"}')).toEqual({ a: 1, b: "str" });
		});

		test("comments (block multiline)", () => {
			expect(parse('{["a"]=1,--[[\ncomment\n]]\n["b"]="str"}')).toEqual({ a: 1, b: "str" });
		});

		test("comments (multi)", () => {
			expect(parse(fromFile("comments"))).toEqual({ a: 1, b: 2, c: "str" });
		});
	});
});
