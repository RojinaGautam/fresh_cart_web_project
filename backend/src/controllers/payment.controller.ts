import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { PaymentService } from "../services/payment.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const paymentService = new PaymentService();

export class PaymentController {
  async createIntent(req: AuthRequest, res: Response) {
    try {
      const result = await paymentService.createOrderPaymentIntent(
        req.user!.id,
      );

      return ApiResponseHelper.success(
        res,
        result,
        "Payment intent created successfully",
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
