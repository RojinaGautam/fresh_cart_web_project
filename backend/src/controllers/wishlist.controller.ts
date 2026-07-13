import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { WishlistService } from "../services/wishlist.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const wishlistService = new WishlistService();

const getParamValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

export class WishlistController {
  async getWishlist(req: AuthRequest, res: Response) {
    try {
      const wishlist = await wishlistService.getWishlist(req.user!.id);

      return ApiResponseHelper.success(
        res,
        wishlist,
        "Wishlist fetched successfully",
      );
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
      const wishlist = await wishlistService.addItem(
        req.user!.id,
        getParamValue(req.params.productId),
      );

      return ApiResponseHelper.success(
        res,
        wishlist,
        "Item added to wishlist",
      );
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
      const wishlist = await wishlistService.removeItem(
        req.user!.id,
        getParamValue(req.params.productId),
      );

      return ApiResponseHelper.success(
        res,
        wishlist,
        "Item removed from wishlist",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }
}
