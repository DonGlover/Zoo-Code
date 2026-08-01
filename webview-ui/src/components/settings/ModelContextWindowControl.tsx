import { useAppTranslation } from "@/i18n/TranslationContext"
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import { formatLargeNumber } from "@/utils/format"

interface ModelContextWindowControlProps {
	value?: number
	onChange: (value: number | undefined) => void
	modelDefault?: number
}

export const ModelContextWindowControl = ({ value, onChange, modelDefault }: ModelContextWindowControlProps) => {
	const { t } = useAppTranslation()

	const handleInputChange = (inputValue: string) => {
		if (inputValue === "") {
			onChange(undefined)
			return
		}
		const parsed = parseInt(inputValue)
		if (!isNaN(parsed) && parsed > 0) {
			onChange(parsed)
		}
	}

	return (
		<div className="flex flex-col gap-1">
			<label className="block font-medium mb-1">{t("settings:providers.modelContextWindow.label")}</label>
			<div className="flex items-center gap-2">
				<VSCodeTextField
					value={value?.toString() || ""}
					type="text"
					onInput={(e) => handleInputChange((e.target as HTMLInputElement).value)}
					placeholder={
						modelDefault ? `Default: ${formatLargeNumber(modelDefault)}` : "Enter context window size"
					}
					style={{
						flex: 1,
						borderColor: (() => {
							if (!value) {
								return "var(--vscode-input-border)"
							}
							return value > 0 ? "var(--vscode-charts-green)" : "var(--vscode-errorForeground)"
						})(),
					}}
				/>
				{value && <span className="text-sm text-vscode-descriptionForeground">{formatLargeNumber(value)}</span>}
			</div>
			<div className="text-sm text-vscode-descriptionForeground">
				{t("settings:providers.modelContextWindow.description")}
			</div>
		</div>
	)
}
