import { Response } from "express";
import { z } from "zod";
import { AddCartItemDTO, UpdateCartItemDTO } from "../dtos/cart.dto";
import { AuthRequest } from "../middleware/auth.middleware";
import { CartService } from "../services/cart.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const cartService = new CartService();

const getParamValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

export class CartController {
  async getCart(req: AuthRequest, res: Response) {
    try {
      const cart = await cartService.getCart(req.user!.id);

      return ApiResponseHelper.success(res, cart, "Cart fetched successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async addItem(req: AuthRequest, res: Response) {
    try {
      const parsedItem = AddCartItemDTO.safeParse(req.body);

      if (!parsedItem.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedItem.error),
          400,
        );
      }

      const cart = await cartService.addItem(req.user!.id, parsedItem.data);

      return ApiResponseHelper.success(res, cart, "Item added to cart");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async updateItem(req: AuthRequest, res: Response) {
    try {
      const parsedItem = UpdateCartItemDTO.safeParse(req.body);

      if (!parsedItem.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedItem.error),
          400,
        );
      }

      const cart = await cartService.updateItemQuantity(
        req.user!.id,
        getParamValue(req.params.productId),
        parsedItem.data,
      );

      return ApiResponseHelper.success(res, cart, "Cart item updated");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async removeItem(req: AuthRequest, res: Response) {
    try {
      const cart = await cartService.removeItem(
        req.user!.id,
        getParamValue(req.params.productId),
      );

      return ApiResponseHelper.success(res, cart, "Item removed from cart");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async clearCart(req: AuthRequest, res: Response) {
    try {
      const cart = await cartService.clearCart(req.user!.id);

      return ApiResponseHelper.success(res, cart, "Cart cleared");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }
}
