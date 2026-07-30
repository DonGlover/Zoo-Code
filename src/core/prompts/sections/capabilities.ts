import { McpHub } from "../../../services/mcp/McpHub"

/**
 * Builds the CAPABILITIES section of the system prompt.
 *
 * The MCP availability line is only emitted when at least one MCP server is actually
 * exposed to the current mode. When `allowedMcpServers` is provided, the hub's server
 * list is filtered by that allowlist BEFORE deciding whether to advertise MCP, so the
 * capability text matches the per-mode tool exposure:
 *   - `undefined` allowlist  → all connected servers count (backward compatible)
 *   - empty `[]` allowlist   → no servers count ⇒ MCP line omitted
 *   - populated allowlist    → only listed servers count
 *
 * @param cwd Current working directory used in the prompt text.
 * @param mcpHub Optional MCP hub. When omitted, the MCP line is never emitted.
 * @param allowedMcpServers Optional per-mode allowlist of MCP server names. When provided,
 *   the hub's servers are filtered to this set before determining MCP availability.
 */
export function getCapabilitiesSection(cwd: string, mcpHub?: McpHub, allowedMcpServers?: string[]): string {
	// Determine whether any MCP server is actually available to the current mode.
	// Filtering the hub's servers by the allowlist (when provided) keeps the capability
	// text consistent with the tools that are exposed for the mode.
	let hasMcpServers = false
	if (mcpHub) {
		let servers = mcpHub.getServers()
		if (allowedMcpServers) {
			const allowSet = new Set(allowedMcpServers)
			servers = servers.filter((server) => allowSet.has(server.name))
		}
		hasMcpServers = servers.length > 0
	}

	return `====

CAPABILITIES

- Available tools: execute commands, list/read/write files, search, follow-up questions.
- File structure overview in environment_details. Use list_files for directories outside workspace.
- Execute commands with clear explanations. Prefer CLI over scripts.${
		hasMcpServers
			? `
- MCP servers available for additional tools and resources.`
			: ""
	}`
}
