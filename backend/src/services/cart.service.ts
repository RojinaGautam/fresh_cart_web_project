import mongoose from "mongoose";
import { AddCartItemDTO, UpdateCartItemDTO } from "../dtos/cart.dto";
import { HttpException } from "../exceptions/http-exception";
import { ICart, ICartItem } from "../models/cart.model";
import { IProduct } from "../models/product.model";
import { CartMongoRepository } from "../repositories/cart.repository";
import { ProductMongoRepository } from "../repositories/product.repository";

const cartRepository = new CartMongoRepository();
const productRepository = new ProductMongoRepository();

export type PublicCartItem = {
  product: {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    unit: string;
  };
  quantity: number;
  lineTotal: number;
};

export type PublicCart = {
  id: string;
  items: PublicCartItem[];
  subtotal: number;
};

export class CartService {
  toPublicCart(cart: ICart): PublicCart {
    const items: PublicCartItem[] = cart.items
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
          quantity: item.quantity,
          lineTotal: Number((product.price * item.quantity).toFixed(2)),
        };
      });

    const subtotal = Number(
      items.reduce((total, item) => total + item.lineTotal, 0).toFixed(2),
    );

    return {
      id: cart._id.toString(),
      items,
      subtotal,
    };
  }

  private hasItem(cart: ICart, productId: string): boolean {
    return cart.items.some((item: ICartItem) => {
      const itemProductId =
        item.product instanceof mongoose.Types.ObjectId
          ? item.product.toString()
          : (item.product as unknown as { _id: mongoose.Types.ObjectId })._id.toString();

      return itemProductId === productId;
    });
  }

  async getCart(userId: string): Promise<PublicCart> {
    const cart = await cartRepository.getOrCreateByUserId(userId);
    const populated = await cartRepository.getByUserId(userId);

    return this.toPublicCart(populated || cart);
  }

  async addItem(userId: string, data: AddCartItemDTO): Promise<PublicCart> {
    if (!mongoose.isValidObjectId(data.productId)) {
      throw new HttpException(400, "Invalid product id");
    }

    const product = await productRepository.getProductById(data.productId);

    if (!product || !product.isActive) {
      throw new HttpException(404, "Product not found");
    }

    const existingCart = await cartRepository.getOrCreateByUserId(userId);
    let updatedCart: ICart | null;

    if (this.hasItem(existingCart, data.productId)) {
      updatedCart = await cartRepository.incrementItem(
        userId,
        data.productId,
        data.quantity,
      );
    } else {
      updatedCart = await cartRepository.addNewItem(
        userId,
        data.productId,
        data.quantity,
      );
    }

    if (!updatedCart) {
      throw new HttpException(500, "Failed to update cart");
    }

    return this.toPublicCart(updatedCart);
  }

  async updateItemQuantity(
    userId: string,
    productId: string,
    data: UpdateCartItemDTO,
  ): Promise<PublicCart> {
    if (!mongoose.isValidObjectId(productId)) {
      throw new HttpException(400, "Invalid product id");
    }

    const updatedCart = await cartRepository.updateItemQuantity(
      userId,
      productId,
      data.quantity,
    );

    if (!updatedCart) {
      throw new HttpException(404, "Item not found in cart");
    }

    return this.toPublicCart(updatedCart);
  }

  async removeItem(userId: string, productId: string): Promise<PublicCart> {
    if (!mongoose.isValidObjectId(productId)) {
      throw new HttpException(400, "Invalid product id");
    }

    const updatedCart = await cartRepository.removeItem(userId, productId);

    if (!updatedCart) {
      throw new HttpException(404, "Cart not found");
    }

    return this.toPublicCart(updatedCart);
  }

  async clearCart(userId: string): Promise<PublicCart> {
    const updatedCart = await cartRepository.clear(userId);

    if (!updatedCart) {
      throw new HttpException(404, "Cart not found");
    }

    return this.toPublicCart(updatedCart);
  }
}
