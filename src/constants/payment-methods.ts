export const PaymentMethods = {
	CASH: 'CASH',
	CREDIT_CARD: 'CREDIT_CARD',
	DEBIT_CARD: 'DEBIT_CARD',
	TRANSFER: 'TRANSFER',
	ACCOUNT_CREDIT: 'ACCOUNT_CREDIT',
}

export type PaymentMethodName = typeof PaymentMethods[keyof typeof PaymentMethods];

export const PaymentMethodLabels: Record<PaymentMethodName, { label: string; short: string }> = {
	[PaymentMethods.CASH]: { label: 'Efectivo', short: 'EFE' },
	[PaymentMethods.CREDIT_CARD]: { label: 'Tarjeta de Crédito', short: 'CRE' },
	[PaymentMethods.DEBIT_CARD]: { label: 'Tarjeta de Débito', short: 'DEB' },
	[PaymentMethods.TRANSFER]: { label: 'Transferencia', short: 'TRA' },
	[PaymentMethods.ACCOUNT_CREDIT]: { label: 'Cuenta Corriente', short: 'CC' },
};