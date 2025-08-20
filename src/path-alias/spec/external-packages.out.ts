import { UserService } from "../src/services/user.ts";
import express from "express";
import { Request, Response } from "express";
import { z } from "zod";
import { Logger } from "../src/utils/logger.ts";

export class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {}

  async getUser(req: Request, res: Response) {
    const schema = z.object({
      id: z.string(),
    });

    const { id } = schema.parse(req.params);
    this.logger.info(`Fetching user ${id}`);
    return this.userService.findById(id);
  }
}
