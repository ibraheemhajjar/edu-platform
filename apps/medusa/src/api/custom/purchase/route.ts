/* eslint-disable @nx/enforce-module-boundaries */
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { Modules, ContainerRegistrationKeys } from '@medusajs/framework/utils';
import { MedusaCart } from '@edu-platform/shared';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-publishable-api-key');

  try {
    const body = req.body as { cart_id: string };
    const { cart_id } = body;
    console.log('Attempting to complete cart:', cart_id);

    // Get cart with Query to access totals
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const { data: carts } = await query.graph({
      entity: 'cart',
      fields: ['id', 'total', 'currency_code'],
      filters: { id: cart_id },
    });

    const cart = carts[0] as unknown as MedusaCart;
    console.log('Cart total:', cart.total);

    // Step 1: Create payment collection
    const { createPaymentCollectionForCartWorkflow } = await import('@medusajs/medusa/core-flows');

    const paymentCollectionResult = await createPaymentCollectionForCartWorkflow(req.scope).run({
      input: { cart_id },
    });
    console.log('Payment collection created');

    // Step 2: Initialize payment sessions
    const paymentModule = req.scope.resolve(Modules.PAYMENT);

    await paymentModule.createPaymentSession(paymentCollectionResult.result.id, {
      provider_id: 'pp_system_default',
      currency_code: cart.currency_code,
      amount: cart.total.numeric_,
      data: {},
    });

    console.log('Payment session created');

    // Step 3: Complete the cart
    const { completeCartWorkflow } = await import('@medusajs/medusa/core-flows');

    const result = await completeCartWorkflow(req.scope).run({
      input: { id: cart_id },
    });

    console.log('Cart completed successfully');
    res.json(result);
  } catch (error) {
    const err = error as Error;
    console.error('Purchase route error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-publishable-api-key');
  res.status(204).send('');
};
