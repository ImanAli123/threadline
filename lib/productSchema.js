import { z } from "zod";

const imageOk = (v) => v.startsWith("/") || v.startsWith("https://images.unsplash.com/");

export const productSchema = z
  .object({
    title: z.string().trim().min(2, "Title is too short").max(120),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only use lowercase letters, numbers and dashes")
      .max(120),
    category: z.enum(["men", "women", "accessories"], { message: "Choose a category" }),
    price: z.number({ message: "Enter a price" }).min(1, "Enter a price"),
    discountPrice: z.number().min(1).nullable().optional(),
    colors: z
      .array(
        z.object({
          name: z.string().trim().min(1).max(40),
          hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Colours need a hex code like #1f1f1f"),
        })
      )
      .min(1, "Add at least one colour"),
    sizes: z.array(z.string().trim().min(1).max(20)).min(1, "Add at least one size"),
    description: z.string().trim().max(2000).default(""),
    details: z.array(z.string().trim().min(1).max(200)).max(10).default([]),
    images: z
      .array(z.string().trim().max(500).refine(imageOk, "Image paths must start with / or https://images.unsplash.com/"))
      .max(8)
      .default([]),
    stock: z.number({ message: "Enter the stock" }).int().min(0).max(100000),
    isNewArrival: z.boolean(),
    bestSeller: z.boolean(),
    active: z.boolean(),
  })
  .refine((d) => d.discountPrice == null || d.discountPrice < d.price, {
    message: "Sale price must be lower than the regular price",
    path: ["discountPrice"],
  });
