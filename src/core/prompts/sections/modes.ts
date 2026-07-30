import * as vscode from "vscode"

import type { ModeConfig } from "@roo-code/types"

import { getAllModesWithPrompts } from "../../../shared/modes"
import { ensureSettingsDirectoryExists } from "../../../utils/globalContext"

export async function getModesSection(context: vscode.ExtensionContext): Promise<string> {
	// Make sure path gets created
	await ensureSettingsDirectoryExists(context)

	// Get all modes with their overrides from extension state
	const allModes = await getAllModesWithPrompts(context)

	const modesContent = `====

MODES

Available: ${allModes.map((mode: ModeConfig) => mode.name).join(", ")}

Use switch_mode tool to change modes.`

	return modesContent
}
