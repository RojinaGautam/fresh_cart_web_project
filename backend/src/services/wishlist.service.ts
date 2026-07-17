import mongoose from "mongoose";
import { HttpException } from "../exceptions/http-exception";
import { IWishlist } from "../models/wishlist.model";
import { IProduct } from "../models/product.model";
import { WishlistMongoRepository } from "../repositories/wishlist.repository";
import { ProductMongoRepository } from "../repositories/product.repository";

const wishlistRepository = new WishlistMongoRepository();
const productRepository = new ProductMongoRepository();

export type PublicWishlistItem = {
  product: {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    unit: string;
  };
  addedAt: Date;
};

export type PublicWishlist = {
  id: string;
  items: PublicWishlistItem[];
};

export class WishlistService {
  toPublicWishlist(wishlist: IWishlist): PublicWishlist {
    const items: PublicWishlistItem[] = wishlist.items
      .filter((item) => item.product && typeof item.product === "object")
      .map((item) => {
        const product = item.product as unknown as IProduct;

        return {
          product: {
            id: product._id.toString(),
            name: product.name,
            slug: product.slug,
            image: product.image,
            price: product.price,
            unit: product.unit || "",
          },
          addedAt: item.addedAt,
        };
      });

    return {
      id: wishlist._id.toString(),
      items,
    };
  }

  private hasItem(wishlist: IWishlist, productId: string): boolean {
    return wishlist.items.some((item) => {
      const itemProductId =
        item.product instanceof mongoose.Types.ObjectId
          ? item.product.toString()
          : (item.product as unknown as { _id: mongoose.Types.ObjectId })._id.toString();

      return itemProductId === productId;
    });
  }

  async getWishlist(userId: string): Promise<PublicWishlist> {
    await wishlistRepository.getOrCreateByUserId(userId);
    const populated = await wishlistRepository.getByUserId(userId);

    return this.toPublicWishlist(populated!);
  }

  async addItem(userId: string, productId: string): Promise<PublicWishlist> {
    if (!mongoose.isValidObjectId(productId)) {
      throw new HttpException(400, "Invalid product id");
    }

    const product = await productRepository.getProductById(productId);

    if (!product || !product.isActive) {
      throw new HttpException(404, "Product not found");
    }

    const existingWishlist =
      await wishlistRepository.getOrCreateByUserId(userId);

    if (this.hasItem(existingWishlist, productId)) {
      const populated = await wishlistRepository.getByUserId(userId);
      return this.toPublicWishlist(populated!);
    }

    const updatedWishlist = await wishlistRepository.addItem(
      userId,
      productId,
    );

    return this.toPublicWishlist(updatedWishlist);
  }

  async removeItem(userId: string, productId: string): Promise<PublicWishlist> {
    if (!mongoose.isValidObjectId(productId)) {
      throw new HttpException(400, "Invalid product id");
    }

    const updatedWishlist = await wishlistRepository.removeItem(
      userId,
      productId,
    );

    if (!updatedWishlist) {
      throw new HttpException(404, "Wishlist not found");
    }

    return this.toPublicWishlist(updatedWishlist);
  }
}
