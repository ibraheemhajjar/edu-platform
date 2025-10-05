/* eslint-disable @nx/enforce-module-boundaries */
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { createProductsWorkflow } from '@medusajs/medusa/core-flows';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const response = await fetch('http://localhost:3000/api/courses/sync');
    const courses = await response.json();

    let imported = 0;

    for (const course of courses) {
      await createProductsWorkflow(req.scope).run({
        input: {
          products: [
            {
              title: course.title,
              description: course.description,
              status: course.published ? 'published' : 'draft',
              options: [
                {
                  title: 'Type',
                  values: ['Digital Course'],
                },
              ],
              variants: [
                {
                  title: 'Digital Course',
                  options: {
                    Type: 'Digital Course',
                  },
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
      message: `Imported ${imported} courses`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
