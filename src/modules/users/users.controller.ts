import { Request, Response } from "express";
import { userServices } from "./users.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsers();

    const users = result.rows.map((user: Record<string, unknown>) => {
      const { password, ...rest } = user;
      return rest;
    });
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  const id = req.params.userId;
  try {
    const result = await userServices.getSingleUser(id as string);
    const user = result.rows[0];
    if (user) {
      delete user.password;
    }

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSingleUser = async (req: Request, res: Response) => {
  const id = req.params.userId;

  try {
    const result = await userServices.updateSingleUser(req.body, id as string);

    const user = result.rows[0];
    if (user) {
      delete user.password;
    }

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.userId;
  try {
    const result = await userServices.deleteUser(id as string);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found...",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userControllers = {
  getAllUsers,
  updateSingleUser,
  deleteUser,
  getSingleUser,
};
