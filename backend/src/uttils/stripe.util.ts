import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "../configs/constant";

export const stripeClient = new Stripe(STRIPE_SECRET_KEY);
