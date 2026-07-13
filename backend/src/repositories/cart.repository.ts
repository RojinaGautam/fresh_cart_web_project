import { CartModel, ICart } from "../models/cart.model";

const populateOptions = {
  path: "items.product",
  select: "name slug image price oldPrice unit isActive",
};

export interface ICartRepository {
  getByUserId(userId: string): Promise<ICart | null>;
  getOrCreateByUserId(userId: string): Promise<ICart>;
  incrementItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<ICart | null>;
  addNewItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<ICart>;
  updateItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<ICart | null>;
  removeItem(userId: string, productId: string): Promise<ICart | null>;
  clear(userId: string): Promise<ICart | null>;
}

export class CartMongoRepository implements ICartRepository {
  async getByUserId(userId: string): Promise<ICart | null> {
    const found = await CartModel.findOne({ userId }).populate(
      populateOptions,
    );
    return found;
  }

  async getOrCreateByUserId(userId: string): Promise<ICart> {
    const existing = await CartModel.findOne({ userId });

    if (existing) {
      return existing;
    }

    return CartModel.create({ userId, items: [] });
  }

  async incrementItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<ICart | null> {
    const updated = await CartModel.findOneAndUpdate(
      { userId, "items.product": productId },
      { $inc: { "items.$.quantity": quantity } },
      { new: true },
    ).populate(populateOptions);

    return updated;
  }

  async addNewItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<ICart> {
    const updated = await CartModel.findOneAndUpdate(
      { userId },
      { $push: { items: { product: productId, quantity } } },
      { new: true, upsert: true },
    ).populate(populateOptions);

    return updated as ICart;
  }

  async updateItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<ICart | null> {
    const updated = await CartModel.findOneAndUpdate(
      { userId, "items.product": productId },
      { $set: { "items.$.quantity": quantity } },
      { new: true },
    ).populate(populateOptions);

    return updated;
  }

  async removeItem(userId: string, productId: string): Promise<ICart | null> {
    const updated = await CartModel.findOneAndUpdate(
      { userId },
      { $pull: { items: { product: productId } } },
      { new: true },
    ).populate(populateOptions);

    return updated;
  }

  async clear(userId: string): Promise<ICart | null> {
    const updated = await CartModel.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true, upsert: true },
    ).populate(populateOptions);

    return updated;
  }
}
