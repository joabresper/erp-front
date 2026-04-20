export const PaymentStatus = {
	PENDING: 'PENDING',
	PAID: 'PAID',
	PARTIALY_PAID: 'PARTIALY_PAID',
	CANCELED: 'CANCELED',
	REFUNDED: 'REFUNDED',
}

export type PaymentStatusName = typeof PaymentStatus[keyof typeof PaymentStatus];

export const PaymentStatusLabels: Record<PaymentStatusName, { label: string; short: string }> = {
	[PaymentStatus.PENDING]: { label: 'Pendiente', short: 'PEND' },
	[PaymentStatus.PAID]: { label: 'Pagado', short: 'PAG' },
	[PaymentStatus.PARTIALY_PAID]: { label: 'Parcialmente Pagado', short: 'PAR' },
	[PaymentStatus.CANCELED]: { label: 'Cancelado', short: 'CANC' },
	[PaymentStatus.REFUNDED]: { label: 'Reembolsado', short: 'REEM' },
};