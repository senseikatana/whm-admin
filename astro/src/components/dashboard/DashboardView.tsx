import { useState } from 'react';
import {
	AlertTriangle,
	ArrowDownToLine,
	CheckCircle2,
	Loader2,
	Sparkles,
	Truck,
} from 'lucide-react';
import { useI18n } from '../../i18n/LocaleProvider';
import type { CollectionsState } from '../../hooks/useCollections';
import { ai } from '../../lib/ai';
import { KpiCard } from './KpiCard';
import { useToast } from './Toast';

export function DashboardView({
	collections,
	canAi,
}: {
	collections: CollectionsState;
	canAi: boolean;
}) {
	const { S } = useI18n();
	const toast = useToast();
	const [report, setReport] = useState<string | null>(null);
	const [generating, setGenerating] = useState(false);

	const incoming = collections.inOrders.docs.length;
	const outgoing = collections.outOrders.docs.length;
	const critical = collections.inventory.docs.filter((item) => item.status === 'Crítico').length;
	const completed = collections.outOrders.docs.filter((order) => order.status === 'Completada').length;
	const fulfillment = outgoing > 0 ? Math.round((completed / outgoing) * 100) : 0;

	const generateReport = async () => {
		setGenerating(true);
		try {
			const summary = await ai.generate(
				`Resumí el estado operativo del almacén: ${collections.inventory.docs.length} SKUs en inventario, ${incoming} recepciones y ${outgoing} expediciones (${completed} completadas). Respondé breve, en español y con datos puntuales.`,
			);
			setReport(summary);
		} catch {
			toast(S.aiNotConfigured, 'info');
		} finally {
			setGenerating(false);
		}
	};

	return (
		<div className="mx-auto max-w-7xl space-y-6 animate-fade-in">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-4">
				<div>
					<h2 className="text-2xl font-black text-white">{S.dashboardTitle}</h2>
					<p className="text-xs text-slate-400 mt-0.5">Control operativo en tiempo real · Almacén Riu Clar (Tarragona)</p>
				</div>
				<span className="inline-flex items-center gap-1.5 rounded-full border border-blue-800/40 bg-blue-950/60 px-3 py-1 text-xs font-semibold text-blue-300">
					<span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
					Sistema Operativo Activo
				</span>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<KpiCard title={S.kpiIncoming} value={incoming} icon={ArrowDownToLine} />
				<KpiCard title={S.kpiOutgoing} value={outgoing} icon={Truck} />
				<KpiCard title={S.kpiCritical} value={critical} icon={AlertTriangle} tone="danger" />
				<KpiCard
					title={S.kpiFulfillment}
					value={`${fulfillment}%`}
					subtitle={S.fulfillmentSubtitle(completed, outgoing)}
					icon={CheckCircle2}
					tone="success"
				/>
			</div>

			{canAi && (
				<div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-950/60 via-slate-900/70 to-slate-900/80 p-6 sm:p-8 text-white backdrop-blur-xl shadow-lg">
					<div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-500/20 blur-2xl" aria-hidden="true" />
					<h3 className="mb-2 flex items-center text-lg font-bold text-white">
						<Sparkles className="mr-2 text-cyan-400" size={18} />
						{S.aiReportTitle}
					</h3>
					<p className="text-xs text-slate-300 mb-4 max-w-xl">
						Generación automática de balance operativo con IA para almacén y taller de estanqueidad.
					</p>
					<button
						type="button"
						onClick={generateReport}
						disabled={generating || !ai.isConfigured()}
						className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-500 disabled:opacity-50 cursor-pointer"
					>
						{generating && <Loader2 size={15} className="mr-2 inline animate-spin" />}
						{generating ? S.aiGenerating : S.aiReportGenerate}
					</button>
					{!ai.isConfigured() && <p className="mt-3 text-xs text-slate-400">{S.aiReportHint}</p>}
					{report && (
						<p className="mt-4 rounded-xl border border-white/10 bg-slate-950/60 p-4 text-xs leading-relaxed text-slate-200">{report}</p>
					)}
				</div>
			)}
		</div>
	);
}
