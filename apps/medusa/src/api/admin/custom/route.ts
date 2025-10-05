// eslint-disable-next-line @nx/enforce-module-boundaries
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.sendStatus(200);
}
