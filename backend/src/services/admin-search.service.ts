import { CategoryMongoRepository } from "../repositories/category.repository";
import { DealMongoRepository } from "../repositories/deal.repository";
import { OrderMongoRepository } from "../repositories/order.repository";
import { ProductMongoRepository } from "../repositories/product.repository";
import { SupportMongoRepository } from "../repositories/support.repository";
import { UserMongoRepository } from "../repositories/user.repository";

const categoryRepository = new CategoryMongoRepository();
const dealRepository = new DealMongoRepository();
const orderRepository = new OrderMongoRepository();
const productRepository = new ProductMongoRepository();
const supportRepository = new SupportMongoRepository();
const userRepository = new UserMongoRepository();

// Each group is capped so the header dropdown stays readable; the "view all"
// link on the frontend deep-links into the full admin table for that entity.
const RESULTS_PER_GROUP = 5;

export type AdminSearchHit = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
};

export type AdminSearchGroup = {
  key: string;
  label: string;
  total: number;
  hits: AdminSearchHit[];
};

export type AdminSearchResult = {
  query: string;
  totalResults: number;
  groups: AdminSearchGroup[];
};

export class AdminSearchService {
  async search(rawQuery: string): Promise<AdminSearchResult> {
    const query = rawQuery.trim();

    if (!query) {
      return { query: "", totalResults: 0, groups: [] };
    }

    const paging = { page: 1, limit: RESULTS_PER_GROUP, search: query };

    // Every entity is queried in parallel so the dropdown stays responsive.
    const [users, products, categories, deals, orders, tickets] =
      await Promise.all([
        userRepository.getPaginated(paging),
        productRepository.getPaginated(paging),
        categoryRepository.getPaginated(paging),
        dealRepository.getPaginated(paging),
        orderRepository.getPaginated(paging),
        supportRepository.getPaginated(paging),
      ]);

    const groups: AdminSearchGroup[] = [
      {
        key: "users",
        label: "Users",
        total: users.total,
        hits: users.users.map((user) => ({
          id: user._id.toString(),
          title: user.fullName,
          subtitle: user.email,
          href: `/admin/users?search=${encodeURIComponent(query)}`,
        })),
      },
      {
        key: "products",
        label: "Products",
        total: products.total,
        hits: products.products.map((product) => ({
          id: product._id.toString(),
          title: product.name,
          subtitle: product.slug,
          href: `/admin/products?search=${encodeURIComponent(query)}`,
        })),
      },
      {
        key: "categories",
        label: "Categories",
        total: categories.total,
        hits: categories.categories.map((category) => ({
          id: category._id.toString(),
          title: category.title,
          subtitle: category.slug,
          href: `/admin/categories?search=${encodeURIComponent(query)}`,
        })),
      },
      {
        key: "deals",
        label: "Deals",
        total: deals.total,
        hits: deals.deals.map((deal) => ({
          id: deal._id.toString(),
          title: deal.title,
          subtitle: `${deal.discountPercentage}% off`,
          href: `/admin/deals?search=${encodeURIComponent(query)}`,
        })),
      },
      {
        key: "orders",
        label: "Orders",
        total: orders.total,
        hits: orders.orders.map((order) => ({
          id: order._id.toString(),
          title: order.orderNumber,
          subtitle: `${order.status} · ${order.items.length} item${
            order.items.length === 1 ? "" : "s"
          }`,
          href: `/admin/orders?search=${encodeURIComponent(query)}`,
        })),
      },
      {
        key: "tickets",
        label: "Support Tickets",
        total: tickets.total,
        hits: tickets.tickets.map((ticket) => ({
          id: ticket._id.toString(),
          title: ticket.subject,
          subtitle: `${ticket.name} · ${ticket.status}`,
          href: `/admin/support?search=${encodeURIComponent(query)}`,
        })),
      },
    ];

    const populated = groups.filter((group) => group.hits.length > 0);

    return {
      query,
      totalResults: populated.reduce((sum, group) => sum + group.total, 0),
      groups: populated,
    };
  }
}
