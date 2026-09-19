import type { Customer } from "../../interfaces";

export const SEED_CUSTOMERS: Omit<Customer, "id" | "slug" | "created_at" | "updated_at">[] = [
	{
		code: "CUST001",
		name: "Mercadona S.A.",
		type: "Cliente",
		email: "pedidos@mercadona.es",
		phone: "+34 900 123 456",
		status: "Activo",
	},
	{
		code: "CUST002",
		name: "Carrefour España",
		type: "Cliente",
		email: "compras@carrefour.es",
		phone: "+34 900 234 567",
		status: "Activo",
	},
	{
		code: "CUST003",
		name: "El Corte Inglés",
		type: "Cliente",
		email: "logistica@elcorteingles.es",
		phone: "+34 900 345 678",
		status: "Activo",
	},
	{
		code: "SUPP001",
		name: "Distribuciones García SL",
		type: "Proveedor",
		email: "ventas@distgarcia.com",
		phone: "+34 963 123 456",
		status: "Activo",
	},
	{
		code: "SUPP002",
		name: "Logística Martínez",
		type: "Proveedor",
		email: "info@logmartinez.es",
		phone: "+34 932 234 567",
		status: "Activo",
	},
];
