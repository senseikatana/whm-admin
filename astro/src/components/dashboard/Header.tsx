import { LogOut, PanelLeftClose, PanelLeftOpen, Radio } from 'lucide-react';
import { useI18n } from '../../i18n/LocaleProvider';
import type { Session } from '../../types';
import { LanguageSelect } from './LanguageSelect';

interface HeaderProps {
	session: Session;
	roleLabel: string;
	onToggleSidebar: () => void;
	sidebarCollapsed: boolean;
	onSignOut: () => void;
}

export function Header({ session, roleLabel, onToggleSidebar, sidebarCollapsed, onSignOut }: HeaderProps) {
	const { S } = useI18n();

	return (
		<header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-[#0F172A]/90 px-4 md:px-6 backdrop-blur">
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={onToggleSidebar}
					aria-label={sidebarCollapsed ? S.sidebarExpand : S.sidebarCollapse}
					title={sidebarCollapsed ? S.sidebarExpand : S.sidebarCollapse}
					className="hidden rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white md:inline-flex"
				>
					{sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
				</button>
				<span className="inline-flex items-center gap-1.5 rounded-full border border-blue-800/40 bg-blue-950/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-300">
					<Radio size={12} className="text-blue-400" />
					ESINSA Riu Clar
				</span>
			</div>

			<div className="flex items-center gap-3">
				<LanguageSelect />
				<div className="hidden text-right leading-tight sm:block">
					<p className="text-sm font-bold text-white">{session.name}</p>
					<p className="text-xs text-blue-400 font-medium">{roleLabel}</p>
				</div>
				<button
					type="button"
					onClick={onSignOut}
					aria-label={S.signOut}
					title={S.signOut}
					className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-950/40 hover:text-rose-400"
				>
					<LogOut size={18} />
				</button>
			</div>
		</header>
	);
}
