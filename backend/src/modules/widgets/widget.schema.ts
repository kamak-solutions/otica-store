import { z } from "zod";


export const createWidgetSchema = z.object({

  name: z.string().min(3),

  type: z.enum([
    "IMAGE",
    "VIDEO",
    "EMBED",
    "HTML",
  ]),

  position: z.string(),

  title: z.string().optional(),

  description: z.string().optional(),

  mediaUrl: z.string().optional(),

  embedCode: z.string().optional(),

  redirectUrl: z.string().min(1),
  
  buttonLabel: z.string().optional(),

  aspectRatio: z.string().optional(),

  active: z.boolean().optional(),

  order: z.number().optional(),

});