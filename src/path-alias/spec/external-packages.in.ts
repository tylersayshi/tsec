import { UserService } from "@services/user";
import express from "express";
import { Request, Response } from "express";
import { z } from "zod";
import { Logger } from "@utils/logger";

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
