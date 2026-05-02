export const PaymentStatus = {
	PENDING: 'PENDING',
	PAID: 'PAID',
	PARTIALLY_PAID: 'PARTIALLY_PAID',
	CANCELLED: 'CANCELLED',
	REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatusName = typeof PaymentStatus[keyof typeof PaymentStatus];

export const PaymentStatusLabels: Record<PaymentStatusName, { label: string; short: string }> = {
	[PaymentStatus.PENDING]: { label: 'Pendiente', short: 'PEND' },
	[PaymentStatus.PAID]: { label: 'Pagado', short: 'PAG' },
	[PaymentStatus.PARTIALLY_PAID]: { label: 'Parcialmente Pagado', short: 'PAR' },
	[PaymentStatus.CANCELLED]: { label: 'Cancelado', short: 'CANC' },
	[PaymentStatus.REFUNDED]: { label: 'Reembolsado', short: 'REEM' },
};