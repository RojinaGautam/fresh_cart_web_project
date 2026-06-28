import { Request, Response } from "express";
import { z } from "zod";
import {
  AdminCreateUserDTO,
  AdminUpdateUserDTO,
} from "../../dtos/user.dto";
import { AdminUserService } from "../../services/admin-user.service";
import { ApiResponseHelper } from "../../uttils/apihelper.util";

const adminUserService = new AdminUserService();

const getParamValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

export class AdminUserController {
  async listUsers(req: Request, res: Response) {
    try {
      const { users, meta } = await adminUserService.listUsers({
        page: req.query.page as string | undefined,
        limit: req.query.limit as string | undefined,
        search: req.query.search as string | undefined,
      });

      return ApiResponseHelper.success(
        res,
        users,
        "Users fetched successfully",
        200,
        meta,
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const user = await adminUserService.getUser(getParamValue(req.params.id));

      return ApiResponseHelper.success(
        res,
        user,
        "User fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const parsedUser = AdminCreateUserDTO.safeParse(req.body);

      if (!parsedUser.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedUser.error),
          400,
        );
      }

      const user = await adminUserService.createUser(parsedUser.data);

      return ApiResponseHelper.success(
        res,
        user,
        "User created successfully",
        201,
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const parsedUser = AdminUpdateUserDTO.safeParse(req.body);

      if (!parsedUser.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedUser.error),
          400,
        );
      }

      const user = await adminUserService.updateUser(
        getParamValue(req.params.id),
        parsedUser.data,
      );

      return ApiResponseHelper.success(
        res,
        user,
        "User updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const result = await adminUserService.deleteUser(
        getParamValue(req.params.id),
      );

      return ApiResponseHelper.success(
        res,
        result,
        "User deleted successfully",
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
