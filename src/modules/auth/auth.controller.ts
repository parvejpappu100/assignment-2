import { Request, Response } from "express";
import { authServices } from "../auth/auth.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "data inserted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const authControllers = {
  createUser,
};
