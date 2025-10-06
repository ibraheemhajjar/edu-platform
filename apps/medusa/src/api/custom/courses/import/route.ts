/* eslint-disable @nx/enforce-module-boundaries */
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { createProductsWorkflow } from '@medusajs/medusa/core-flows';
import { Course, ProductWithMetadata } from '@edu-platform/shared';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const response = await fetch(`${backendUrl}/api/courses/sync`);

    const courses = (await response.json()) as Course[];

    const query = req.scope.resolve('query');

    // Get default sales channel
    const { data: salesChannels } = await query.graph({
      entity: 'sales_channel',
      fields: ['id', 'name'],
    });

    if (!salesChannels || salesChannels.length === 0) {
      throw new Error('No sales channels available');
    }

    const salesChannelId = salesChannels[0].id as string;

    // Get all existing products
    const { data: allProducts } = await query.graph({
      entity: 'product',
      fields: ['id', 'metadata'],
    });

    const existingCourseIds = new Set(
      (allProducts as ProductWithMetadata[])
        .filter((p) => p.metadata?.course_id)
        .map((p) => p.metadata?.course_id)
        .filter((id): id is string => id !== undefined),
    );

    let imported = 0;
    let skipped = 0;

    for (const course of courses) {
      if (existingCourseIds.has(course.id)) {
        skipped++;
        continue;
      }

      await createProductsWorkflow(req.scope).run({
        input: {
          products: [
            {
              title: course.title,
              description: course.description,
              status: course.published ? 'published' : 'draft',
              sales_channels: [{ id: salesChannelId }],
              options: [
                {
                  title: 'Type',
                  values: ['Digital Course'],
                },
              ],
              variants: [
                {
                  title: 'Digital Course',
                  manage_inventory: false,
                  options: { Type: 'Digital Course' },
                  prices: [
                    {
                      amount: Math.round(course.price * 100),
                      currency_code: 'usd',
                    },
                  ],
                },
              ],
              metadata: {
                course_id: course.id,
                author: course.author,
              },
            },
          ],
        },
      });
      imported++;
    }

    res.json({
      success: true,
      imported,
      skipped,
      message: `Imported ${imported} courses, skipped ${skipped} duplicates`,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, error: err.message });
  }
};
