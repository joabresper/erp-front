export const InvoiceType = {
	A: 'A',
	B: 'B',
	C: 'C',
	TICKET: 'TICKET',
	CREDIT_NOTE: 'CREDIT_NOTE',
}

export type InvoiceTypeName = typeof InvoiceType[keyof typeof InvoiceType];

export const InvoiceTypeLabels: Record<InvoiceTypeName, { label: string; short: string }> = {
	[InvoiceType.A]: { label: 'Factura A', short: 'A' },
	[InvoiceType.B]: { label: 'Factura B', short: 'B' },
	[InvoiceType.C]: { label: 'Factura C', short: 'C' },
	[InvoiceType.TICKET]: { label: 'Ticket', short: 'TICKET' },
	[InvoiceType.CREDIT_NOTE]: { label: 'Nota de Crédito', short: 'NC' },
};