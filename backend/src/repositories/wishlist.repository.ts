import { IWishlist, WishlistModel } from "../models/wishlist.model";

const populateOptions = {
  path: "items.product",
  select: "name slug image price oldPrice unit isActive",
};

export interface IWishlistRepository {
  getByUserId(userId: string): Promise<IWishlist | null>;
  getOrCreateByUserId(userId: string): Promise<IWishlist>;
  addItem(userId: string, productId: string): Promise<IWishlist>;
  removeItem(userId: string, productId: string): Promise<IWishlist | null>;
}

export class WishlistMongoRepository implements IWishlistRepository {
  async getByUserId(userId: string): Promise<IWishlist | null> {
    const found = await WishlistModel.findOne({ userId }).populate(
      populateOptions,
    );
    return found;
  }

  async getOrCreateByUserId(userId: string): Promise<IWishlist> {
    const existing = await WishlistModel.findOne({ userId });

    if (existing) {
      return existing;
    }

    return WishlistModel.create({ userId, items: [] });
  }

  async addItem(userId: string, productId: string): Promise<IWishlist> {
    // Caller must ensure a wishlist doc already exists (getOrCreateByUserId)
    // and that productId isn't already present, so this is a plain push.
    const updated = await WishlistModel.findOneAndUpdate(
      { userId },
      { $push: { items: { product: productId, addedAt: new Date() } } },
      { new: true },
    ).populate(populateOptions);

    return updated as IWishlist;
  }

  async removeItem(
    userId: string,
    productId: string,
  ): Promise<IWishlist | null> {
    const updated = await WishlistModel.findOneAndUpdate(
      { userId },
      { $pull: { items: { product: productId } } },
      { new: true },
    ).populate(populateOptions);

    return updated;
  }
}
