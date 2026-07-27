// Product prices and order totals are stored in USD everywhere (Stripe card
// payments always charge in USD). For display: Cash on Delivery orders show
// NPR (the local currency customers actually hand over), while Card orders
// show USD (what Stripe actually charges to the card) — everywhere else
// (general browsing, no payment method chosen yet) defaults to NPR since
// this is a Nepali storefront.
export const USD_TO_NPR_RATE = 133;

export const toNPR = (usdAmount: number) => usdAmount * USD_TO_NPR_RATE;

export const formatNPR = (usdAmount: number) => {
  const npr = Math.round(toNPR(usdAmount));
  return `NPR ${npr.toLocaleString("en-US")}`;
};

export const formatUSD = (usdAmount: number) =>
  `$${usdAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const formatByPaymentMethod = (
  usdAmount: number,
  paymentMethod: string,
) => (paymentMethod === "Card" ? formatUSD(usdAmount) : formatNPR(usdAmount));
