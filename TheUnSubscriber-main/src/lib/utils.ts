import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number,
  currency: "USD" | "INR" = "USD",
  exchangeRate: number = 1
) {
  const displayAmount = currency === "INR" ? amount * exchangeRate : amount;
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "en-IN", {
    style: "currency",
    currency: currency,
  }).format(displayAmount);
}
