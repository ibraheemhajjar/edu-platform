/* eslint-disable @nx/enforce-module-boundaries */
import type { SubscriberConfig, SubscriberArgs } from '@medusajs/framework';

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve('logger');
  const orderModuleService = container.resolve('orderModuleService') as any;

  try {
    const order = await orderModuleService.retrieveOrder(data.id, {
      relations: ['items', 'items.variant', 'items.product'],
    });

    const courseIds = order.items
      .map((item: any) => item.product?.metadata?.course_id)
      .filter(Boolean);

    if (courseIds.length === 0) {
      logger.info('No courses found in order');
      return;
    }

    const response = await fetch('http://localhost:3000/api/students/enroll-from-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: order.email,
        courseIds: courseIds,
      }),
    });

    if (response.ok) {
      logger.info(`Enrolled student ${order.email} in ${courseIds.length} courses`);
    } else {
      logger.error(`Failed to enroll student: ${await response.text()}`);
    }
  } catch (error: any) {
    logger.error(`Error in order-placed handler: ${error.message}`);
  }
}

export const config: SubscriberConfig = {
  event: 'order.placed',
};
