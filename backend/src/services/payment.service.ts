import { calculateCartTotals } from "./order.service";
import { stripeClient } from "../uttils/stripe.util";

export class PaymentService {
  async createOrderPaymentIntent(userId: string) {
    const { total } = await calculateCartTotals(userId);
    const amount = Math.round(total * 100);

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
      metadata: { userId },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      amount,
      total,
    };
  }
}
