import { useMemo, useRef, useState } from "react";
import type { Product } from "../../types/models";
import { calculateQuantityFromAmount, getProductSubtotal, normalizeTicketQuantity } from "./pos-logic.utils";
import { notificationService } from "../../utils/notificationService";
import { DEFAULT_BY_UNIT } from "./pos.constants";

export interface TicketItem {
  product: Product;
  quantity: number;
}

export const usePosTicket = () => {
  const [ticket, setTicket] = useState<Record<string, TicketItem>>({});
  const [itemAmountDrafts, setItemAmountDrafts] = useState<Record<string, string>>({});
  const [lastIdAdded, setLastIdAdded] = useState<string | null>(null);
  const lastAmountInputRef = useRef<HTMLInputElement>(null);

  // Datos derivados
  const ticketItems = useMemo(() => Object.values(ticket), [ticket]);
  
  const total = useMemo(() => 
    ticketItems.reduce((acc, item) => acc + getProductSubtotal(item), 0), 
  [ticketItems]);

  // Acciones
  const addToTicket = (product: Product, quantityToAdd?: number) => {
    const defaultQty = DEFAULT_BY_UNIT[product.unit] ?? 1;
    const increment = quantityToAdd ?? defaultQty;

    setTicket((prev) => {
      const existing = prev[product.id];
      const nextQty = normalizeTicketQuantity(
        product, 
        existing ? existing.quantity + increment : increment
      );

      setLastIdAdded(product.id);

      return {
        ...prev,
        [product.id]: { product, quantity: nextQty },
      };
    });
  };

  const updateItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setTicket((prev) => {
      const item = prev[productId];
      if (!item) return prev;
      return {
        ...prev,
        [productId]: { ...item, quantity: normalizeTicketQuantity(item.product, newQuantity) },
      };
    });
  };

  const removeItem = (productId: string) => {
    setTicket((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
    setItemAmountDrafts((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const clearTicket = () => {
    setTicket({});
    setItemAmountDrafts({});
  };

  // Lógica de Montos Manuales ($)
  const handleAmountDraftChange = (productId: string, value: string) => {
    setItemAmountDrafts((prev) => ({ ...prev, [productId]: value }));
  };

  const applyAmountToItem = (productId: string) => {
    const draft = itemAmountDrafts[productId];
    if (draft === undefined) return;

    const item = ticket[productId];
    if (!item) return;

    const desiredAmount = Number(draft.trim().replace(',', '.'));
    
    if (isNaN(desiredAmount) || desiredAmount <= 0) {
      notificationService.error('Monto inválido', 'El monto debe ser mayor a cero.');
      return;
    }

    const nextQuantity = calculateQuantityFromAmount(item.product, desiredAmount);

    if (nextQuantity === null) {
      notificationService.error('Monto insuficiente', 'El monto no alcanza para una cantidad mínima.');
      return;
    }

    updateItemQuantity(productId, nextQuantity);
    
    // Limpiamos el draft después de aplicar
    setItemAmountDrafts((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  return {
    ticket,
    ticketItems,
    total,
    itemAmountDrafts,
    lastAmountInputRef,
    lastIdAdded,
    addToTicket,
    updateItemQuantity,
    removeItem,
    clearTicket,
    handleAmountDraftChange,
    applyAmountToItem,
  };
};