import type OpenAI from "openai"

const APPLY_DIFF_DESCRIPTION = `Apply search/replace edits to file. Provide exact content to find in SEARCH block and replacement in REPLACE block. Use :start_line:[N] to indicate search location. Multiple blocks allowed.`

const DIFF_PARAMETER_DESCRIPTION = `Search/replace blocks in format: <<<<<<< SEARCH / :start_line:[N] / ------- / [exact content] / ======= / [replacement] / >>>>>>> REPLACE. Must match exactly including whitespace.`

export const apply_diff = {
	type: "function",
	function: {
		name: "apply_diff",
		description: APPLY_DIFF_DESCRIPTION,
		parameters: {
			type: "object",
			properties: {
				path: {
					type: "string",
					description: "The path of the file to modify, relative to the current workspace directory.",
				},
				diff: {
					type: "string",
					description: DIFF_PARAMETER_DESCRIPTION,
				},
			},
			required: ["path", "diff"],
			additionalProperties: false,
		},
	},
} satisfies OpenAI.Chat.ChatCompletionTool
