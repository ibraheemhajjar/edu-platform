/* eslint-disable @nx/enforce-module-boundaries */
import type { SubscriberConfig, SubscriberArgs } from '@medusajs/framework';
import { ContainerRegistrationKeys } from '@medusajs/framework/utils';
import { Order, ProductWithMetadata, API_ROUTES } from '@edu-platform/shared';

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve('logger');
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  try {
    logger.info(`Processing order.placed event for order: ${data.id}`);

    const { data: orders } = await query.graph({
      entity: 'order',
      fields: ['id', 'email', 'items.*', 'items.product_id', 'items.variant_id'],
      filters: { id: data.id },
    });

    const order = orders[0] as Order;

    const productIds = order.items.map((item) => item.product_id).filter(Boolean);

    if (productIds.length === 0) {
      logger.info('No products found in order');
      return;
    }

    const { data: products } = await query.graph({
      entity: 'product',
      fields: ['id', 'metadata'],
      filters: { id: productIds },
    });

    const courseIds = (products as ProductWithMetadata[])
      .map((product) => product.metadata?.course_id)
      .filter((id): id is string => id !== undefined);

    if (courseIds.length === 0) {
      logger.info('No courses found in order products');
      return;
    }

    // Look up student by email to get studentId
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const studentsResponse = await fetch(`${backendUrl}/api${API_ROUTES.STUDENTS}`);
    const students = await studentsResponse.json();

    const student = students.find((s: { email: string }) => s.email === order.email);

    if (!student) {
      logger.error(`Student with email ${order.email} not found`);
      return;
    }

    logger.info(
      `Enrolling student ${student.id} (${order.email}) in courses: ${courseIds.join(', ')}`,
    );

    const response = await fetch(`${backendUrl}/api${API_ROUTES.ENROLL_FROM_ORDER}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: student.id,
        courseIds: courseIds,
      }),
    });

    if (response.ok) {
      logger.info(`Successfully enrolled student ${student.id} in ${courseIds.length} courses`);
    } else {
      logger.error(`Failed to enroll student: ${await response.text()}`);
    }
  } catch (error) {
    const err = error as Error;
    logger.error(`Error in order-placed handler: ${err.message}`);
  }
}

export const config: SubscriberConfig = {
  event: 'order.placed',
};
