import os from "os"
import osName from "os-name"

import { getShell } from "../../../utils/shell"

function getTimezone(): string {
	try {
		// Use Intl API to get the system's timezone
		return Intl.DateTimeFormat().resolvedOptions().timeZone
	} catch {
		// Fallback if timezone detection fails
		return "Unknown"
	}
}

export function getSystemInfoSection(cwd: string): string {
	// Try to get detailed OS name, fall back to basic info if it fails
	let osInfo: string
	try {
		osInfo = osName()
	} catch (error) {
		// Fallback when os-name fails (e.g., PowerShell not available on Windows)
		const platform = os.platform()
		const release = os.release()
		osInfo = `${platform} ${release}`
	}

	const timezone = getTimezone()

	const details = `====

SYSTEM INFORMATION

OS: ${osInfo}
Shell: ${getShell()}
Workspace: ${cwd.toPosix()}
Timezone: ${timezone}

Dates assume local time (${timezone}) unless explicitly stated as UTC or another timezone.`

	return details
}
