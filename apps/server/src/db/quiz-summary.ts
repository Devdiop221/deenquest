import { db } from './index';
import { categories, quizzes } from './schema/deenquest';
import { eq } from 'drizzle-orm';

async function getQuizSummary() {
  console.log('📊 Quiz Database Summary');
  console.log('========================');

  // Get all categories
  const allCategories = await db.select().from(categories);

  for (const category of allCategories) {
    const categoryQuizzes = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.categoryId, category.id));

    console.log(`\n${category.icon} ${category.name}:`);
    console.log(`  - ${categoryQuizzes.length} questions`);

    // Count by difficulty
    const easy = categoryQuizzes.filter(q => q.difficulty === 1).length;
    const medium = categoryQuizzes.filter(q => q.difficulty === 2).length;
    const hard = categoryQuizzes.filter(q => q.difficulty === 3).length;

    console.log(`  - Easy: ${easy}, Medium: ${medium}, Hard: ${hard}`);
    console.log(`  - Total XP available: ${categoryQuizzes.reduce((sum, q) => sum + (q.xpReward || 0), 0)}`);
  }

  const totalQuizzes = await db.select().from(quizzes);
  console.log(`\n🎯 Total Questions: ${totalQuizzes.length}`);
  console.log(`💎 Total XP Available: ${totalQuizzes.reduce((sum, q) => sum + (q.xpReward || 0), 0)}`);
}

getQuizSummary().catch(console.error);