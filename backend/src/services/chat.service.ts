import { SendChatMessageDTO } from "../dtos/chat.dto";
import { CategoryMongoRepository } from "../repositories/category.repository";
import { DealMongoRepository } from "../repositories/deal.repository";
import { ProductMongoRepository } from "../repositories/product.repository";
import { generateChatReply, GeminiHistoryTurn } from "../uttils/gemini.util";

const categoryRepository = new CategoryMongoRepository();
const dealRepository = new DealMongoRepository();
const productRepository = new ProductMongoRepository();

// Prices are stored and charged in USD (Stripe requirement), but FreshCart
// is a Nepali storefront, so the assistant should talk about prices in NPR
// to match what customers actually see on the site.
const USD_TO_NPR_RATE = 133;
const formatNPR = (usdAmount: number) => `NPR ${Math.round(usdAmount * USD_TO_NPR_RATE)}`;

const buildSystemInstruction = async () => {
  const [categories, deals, featured] = await Promise.all([
    categoryRepository.getAll(),
    dealRepository.getAll(),
    productRepository.getPaginated({
      page: 1,
      limit: 10,
      featured: true,
      activeOnly: true,
    }),
  ]);

  const categoryList = categories.map((category) => category.title).join(", ") || "none right now";

  const dealList =
    deals
      .map((deal) => `${deal.title} (${deal.discountPercentage}% off, badge: ${deal.badge})`)
      .join("; ") || "no active deals right now";

  const featuredList =
    featured.products
      .map((product) => `${product.name} - ${formatNPR(product.price)}${product.unit || ""}`)
      .join("; ") || "no featured products right now";

  return `You are FreshCart Assistant, the official AI shopping assistant embedded in FreshCart, an online grocery delivery web app.

Your job is to help customers with things related to FreshCart ONLY:
- Finding products, categories, and deals available in the store
- Explaining how to browse the shop, add items to cart, save favorites, checkout, and track orders
- Answering questions about delivery windows, payment methods, account/profile settings, and order status
- General grocery/cooking advice that helps someone shop on FreshCart (e.g. "what should I buy for a pasta dinner")

You must NOT answer questions unrelated to FreshCart or grocery shopping — no coding help, homework, general trivia, news, other companies/products, etc. If asked something off-topic, politely decline in one short sentence and steer the conversation back to how you can help with FreshCart.

Keep replies concise (2-4 sentences unless a list is genuinely needed), friendly, and helpful. Do not invent products, prices, or policies that aren't mentioned below or aren't reasonable defaults for a grocery delivery app.

Formatting rules (the chat UI renders plain text only, no markdown):
- Never use markdown syntax like **bold**, *italics*, bullet asterisks/dashes, or headings.
- When listing two or more items, use a numbered list with each item on its own line, formatted exactly like:
1) First item
2) Second item
3) Third item
- For a single item or a short answer, just write a normal sentence — don't force a list.

Current store snapshot:
- Categories: ${categoryList}
- Active deals: ${dealList}
- Featured/trending products: ${featuredList}
- Standard delivery fee is ${formatNPR(3.5)}. Delivery windows are 9-11am, 12-2pm, and 4-6pm. Payment options are card (via Stripe) or cash on delivery.
- To buy something, a customer browses a category or the dashboard, adds items to their cart, then checks out from the cart page with an address, payment method, and delivery slot. An account (with a verified email) is required to add to cart, save favorites, or check out.`;
};

export class ChatService {
  async sendMessage(data: SendChatMessageDTO): Promise<{ reply: string }> {
    const systemInstruction = await buildSystemInstruction();

    const history: GeminiHistoryTurn[] = data.history.map((turn) => ({
      role: turn.role,
      text: turn.text,
    }));

    const reply = await generateChatReply(systemInstruction, history, data.message);

    return { reply };
  }
}
