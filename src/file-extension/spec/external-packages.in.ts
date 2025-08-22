// External packages should remain unchanged
import express from "express";
import { Request, Response } from "express";
import axios from "axios";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

// Local imports should be processed
import { User } from "./models/user.js";
import { Database } from "../database/connection";

export class ExternalPackageTest {
  constructor(
    private userService: User,
    private db: Database,
  ) {}

  async testExternalPackages() {
    const client = new PrismaClient();
    const supabase = createClient("url", "key");
    const schema = z.object({ name: z.string() });

    return { client, supabase, schema };
  }
}
