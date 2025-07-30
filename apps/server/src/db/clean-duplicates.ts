import { db } from './index';
import { categories, quizzes, lectures } from './schema/deenquest';
import { eq } from 'drizzle-orm';

async function cleanDuplicateCategories() {
  console.log('🧹 Cleaning duplicate categories...');

  // Get all categories
  const allCategories = await db.select().from(categories);
  console.log(`Found ${allCategories.length} total categories`);

  // Group by name to find duplicates
  const categoryGroups = allCategories.reduce((groups, category) => {
    if (!groups[category.name]) {
      groups[category.name] = [];
    }
    groups[category.name].push(category);
    return groups;
  }, {} as Record<string, typeof allCategories>);

  // Process each group
  for (const [name, categoryGroup] of Object.entries(categoryGroups)) {
    if (categoryGroup.length > 1) {
      console.log(`Found ${categoryGroup.length} duplicates for "${name}"`);

      // Keep the first one, delete the rest
      const keepCategory = categoryGroup[0];
      const duplicates = categoryGroup.slice(1);

      for (const duplicate of duplicates) {
        // First, update any quizzes that reference this duplicate category
        await db
          .update(quizzes)
          .set({ categoryId: keepCategory.id })
          .where(eq(quizzes.categoryId, duplicate.id));

        // Also update any lectures that reference this duplicate category
        await db
          .update(lectures)
          .set({ categoryId: keepCategory.id })
          .where(eq(lectures.categoryId, duplicate.id));

        // Then delete the duplicate category
        await db.delete(categories).where(eq(categories.id, duplicate.id));
        console.log(`Deleted duplicate category: ${duplicate.id}`);
      }
    }
  }

  // Get final count
  const finalCategories = await db.select().from(categories);
  console.log(`✅ Cleanup complete. Now have ${finalCategories.length} unique categories`);

  // Display final categories
  finalCategories.forEach(cat => {
    console.log(`- ${cat.icon} ${cat.name}`);
  });
}

cleanDuplicateCategories().catch(console.error);