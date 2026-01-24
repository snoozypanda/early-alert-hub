import { z } from "zod";

const EnvShema = z.object({
  API_URL: z.url(),
});

export const apiURL = EnvShema.parse(process.env).API_URL + "/api/v1";
