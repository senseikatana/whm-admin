import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	icon: LucideIcon;
	tone?: 'default' | 'danger' | 'success';
}

const TONE_STYLES = {
	default: {
		card: 'bg-slate-900/70 border border-slate-800/80 backdrop-blur-md hover:border-slate-700/80 hover:shadow-md',
		icon: 'bg-blue-950/80 border border-blue-800/40 text-blue-400',
		value: 'text-white',
	},
	danger: {
		card: 'bg-rose-950/25 border border-rose-900/40 backdrop-blur-md hover:border-rose-800/60 hover:shadow-md',
		icon: 'bg-rose-950/80 border border-rose-800/50 text-rose-400',
		value: 'text-rose-200',
	},
	success: {
		card: 'bg-emerald-950/25 border border-emerald-900/40 backdrop-blur-md hover:border-emerald-800/60 hover:shadow-md',
		icon: 'bg-emerald-950/80 border border-emerald-800/50 text-emerald-400',
		value: 'text-emerald-200',
	},
} as const;

export function KpiCard({ title, value, subtitle, icon: Icon, tone = 'default' }: KpiCardProps) {
	const styles = TONE_STYLES[tone];
	return (
		<div className={`rounded-2xl p-5 transition-all shadow-sm ${styles.card}`}>
			<div className={`mb-4 inline-flex rounded-xl p-2.5 ${styles.icon}`}>
				<Icon size={20} />
			</div>
			<h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
				{title}
			</h3>
			<div className={`text-3xl font-black tracking-tight ${styles.value}`}>{value}</div>
			{subtitle && (
				<p className="mt-1 text-xs font-medium text-slate-400">{subtitle}</p>
			)}
		</div>
	);
}
