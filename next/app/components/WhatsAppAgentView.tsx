"use client";

import { Bot, Loader2, Send } from "lucide-react";
import { useState } from "react";
import type { WhatsAppAgentViewProps } from "../interfaces";

const callAILocal = async (prompt: string) => {
	const apiKey = typeof window !== "undefined" ? localStorage.getItem("ai_api_key") || "" : "";
	if (!apiKey) {
		await new Promise((res) => setTimeout(res, 800));
		return "Hola, sí. Su pedido ya está listo para despacho en el Muelle de Carga C. Puede ingresar con el camión ahora.";
	}
	const url = "https://api.deepseek.com/v1/chat/completions";
	const payload = {
		model: "deepseek-chat",
		messages: [
			{
				role: "system",
				content: "Eres el asistente y coordinador logístico de WhatsApp de WarehouseFlow.",
			},
			{ role: "user", content: prompt },
		],
		temperature: 0.7,
		max_tokens: 1024,
	};
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify(payload),
		});
		const data = await response.json();
		return data.choices?.[0]?.message?.content || "No se pudo redactar la respuesta.";
	} catch (_err) {
		return "Error generando respuesta automática.";
	}
};

export default function WhatsAppAgentView({ chats, setDbState }: WhatsAppAgentViewProps) {
	const [activeChat, setActiveChat] = useState<any>(chats[0] || null);
	const [replyText, setReplyText] = useState("");
	const [loadingResponse, setLoadingResponse] = useState(false);

	const handleGenerateAIResponse = async () => {
		if (!activeChat) return;
		setLoadingResponse(true);
		const res = await callAILocal(
			`Responde de manera formal y directa a este mensaje de logística de WhatsApp: "${activeChat.message}"`,
		);
		setReplyText(res);
		setLoadingResponse(false);
	};

	const handleSendReply = () => {
		if (!replyText || !activeChat) return;
		setDbState((prev: any) => {
			const updated = prev.whatsapp.map((chat: any) =>
				chat.id === activeChat.id ? { ...chat, responseByAI: replyText } : chat,
			);
			return { ...prev, whatsapp: updated };
		});
		setActiveChat((prev: any) => ({ ...prev, responseByAI: replyText }));
		setReplyText("");
	};

	return (
		<div className="bg-[#050811] border border-slate-800 p-6 rounded-2xl flex flex-col lg:flex-row gap-6">
			{/* Contact List */}
			<div className="w-full lg:w-80 space-y-3 shrink-0">
				<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chats Activos</h3>
				{chats.map((chat: any) => (
					<div
						key={chat.id}
						onClick={() => setActiveChat(chat)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") setActiveChat(chat);
						}}
						role="button"
						tabIndex={0}
						className={`p-3.5 rounded-xl border cursor-pointer transition ${
							activeChat?.id === chat.id
								? "bg-indigo-950/40 border-indigo-700/60"
								: "bg-[#0b0f19] border-slate-800/80 hover:bg-slate-800"
						}`}
					>
						<div className="flex justify-between items-center mb-1">
							<p className="font-bold text-xs text-white">{chat.sender}</p>
							<span className="text-[10px] text-slate-500 font-bold">{chat.time}</span>
						</div>
						<p className="text-[11px] text-slate-400 truncate font-medium">{chat.message}</p>
					</div>
				))}
			</div>

			{/* Chat Area */}
			<div className="flex-1 bg-[#0b0f19] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
				{activeChat ? (
					<>
						{/* Header */}
						<div className="border-b border-slate-800 pb-3 mb-4 flex justify-between items-center">
							<div>
								<p className="font-bold text-sm text-slate-200">{activeChat.sender}</p>
								<p className="text-[10px] text-emerald-550 font-bold flex items-center gap-1">
									<span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
									Chofer en Ruta
								</p>
							</div>
						</div>

						{/* Message History */}
						<div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 text-xs font-semibold">
							<div className="flex justify-start">
								<div className="bg-[#050811] border border-slate-800 rounded-xl p-3 max-w-[80%] text-slate-350">
									{activeChat.message}
								</div>
							</div>

							{activeChat.responseByAI && (
								<div className="flex justify-end">
									<div className="bg-indigo-600 rounded-xl p-3 max-w-[80%] text-white">
										{activeChat.responseByAI}
									</div>
								</div>
							)}
						</div>

						{/* Input Form */}
						<div className="space-y-3">
							<textarea
								value={replyText}
								onChange={(e) => setReplyText(e.target.value)}
								placeholder="Escribe una respuesta o genera una inteligente..."
								className="w-full bg-[#050811] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 h-20 resize-none font-semibold"
							/>
							<div className="flex justify-end space-x-2">
								<button
									onClick={handleGenerateAIResponse}
									disabled={loadingResponse}
									className="px-3.5 py-2 border border-slate-800 hover:bg-slate-800 text-slate-355 rounded-lg text-xs font-bold flex items-center gap-1 transition"
									type="button"
								>
									{loadingResponse ? <Loader2 className="animate-spin" size={12} /> : <Bot size={12} />} IA
									Redactar
								</button>
								<button
									onClick={handleSendReply}
									className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
									type="button"
								>
									<Send size={12} /> Enviar
								</button>
							</div>
						</div>
					</>
				) : (
					<div className="flex-1 flex flex-col items-center justify-center text-slate-500 italic text-xs">
						Selecciona un chat activo para iniciar las comunicaciones.
					</div>
				)}
			</div>
		</div>
	);
}
