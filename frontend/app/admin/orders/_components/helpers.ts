export const ORDER_STATUSES = [
  "pending",
  "processing",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;

export const statusLabel: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const statusTone = (status: string) => {
  if (status === "delivered") return "bg-emerald-50 text-emerald-700";
  if (status === "processing" || status === "out_for_delivery") return "bg-sky-50 text-sky-700";
  if (status === "cancelled") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
};

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallback;
};
