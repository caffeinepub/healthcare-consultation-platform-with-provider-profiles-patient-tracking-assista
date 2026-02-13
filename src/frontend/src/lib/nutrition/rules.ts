import type { PatientProfile } from '@/backend';

interface NutritionInput {
  profile: PatientProfile;
  goals: string;
  dietaryPreferences: string;
  allergies: string;
  activityLevel: string;
}

export function generateNutritionRecommendations(input: NutritionInput): string[] {
  const recommendations: string[] = [];
  const { profile, goals, dietaryPreferences, allergies, activityLevel } = input;

  const goalsLower = goals.toLowerCase();
  const preferencesLower = dietaryPreferences.toLowerCase();
  const allergiesLower = allergies.toLowerCase();

  // Activity-based recommendations
  if (activityLevel === 'sedentary' || activityLevel === 'light') {
    recommendations.push(
      'Focus on portion control and nutrient-dense foods to maintain a healthy weight with lower activity levels.'
    );
  } else if (activityLevel === 'active' || activityLevel === 'very-active') {
    recommendations.push(
      'Increase protein intake to support muscle recovery and ensure adequate carbohydrates for energy during workouts.'
    );
  }

  // Goal-based recommendations
  if (goalsLower.includes('weight loss') || goalsLower.includes('lose weight')) {
    recommendations.push(
      'Create a moderate calorie deficit by focusing on whole foods, lean proteins, and plenty of vegetables.'
    );
    recommendations.push('Stay hydrated and consider eating smaller, more frequent meals to manage hunger.');
  }

  if (goalsLower.includes('muscle') || goalsLower.includes('gain')) {
    recommendations.push(
      'Prioritize protein-rich foods like lean meats, fish, eggs, legumes, and dairy to support muscle growth.'
    );
    recommendations.push('Include complex carbohydrates around your workouts for optimal performance and recovery.');
  }

  if (goalsLower.includes('energy') || goalsLower.includes('fatigue')) {
    recommendations.push(
      'Eat balanced meals with complex carbs, healthy fats, and protein to maintain steady energy throughout the day.'
    );
    recommendations.push('Consider iron-rich foods and ensure adequate B-vitamin intake for energy metabolism.');
  }

  // Dietary preference recommendations
  if (preferencesLower.includes('vegetarian') || preferencesLower.includes('vegan')) {
    recommendations.push(
      'Ensure adequate protein from plant sources like beans, lentils, tofu, tempeh, and quinoa.'
    );
    recommendations.push(
      'Consider supplementing with B12 and monitoring iron, zinc, and omega-3 fatty acid intake.'
    );
  }

  if (preferencesLower.includes('keto') || preferencesLower.includes('low carb')) {
    recommendations.push(
      'Focus on healthy fats from avocados, nuts, seeds, and olive oil while keeping carbs under 50g per day.'
    );
    recommendations.push('Ensure adequate fiber intake from low-carb vegetables to support digestive health.');
  }

  if (preferencesLower.includes('mediterranean')) {
    recommendations.push(
      'Emphasize olive oil, fish, whole grains, legumes, and plenty of fresh fruits and vegetables.'
    );
    recommendations.push('Include moderate amounts of dairy and limit red meat to occasional consumption.');
  }

  // Allergy-based recommendations
  if (allergiesLower.includes('dairy') || allergiesLower.includes('lactose')) {
    recommendations.push(
      'Choose calcium-fortified plant milks and include calcium-rich foods like leafy greens, almonds, and fortified products.'
    );
  }

  if (allergiesLower.includes('gluten') || allergiesLower.includes('celiac')) {
    recommendations.push(
      'Focus on naturally gluten-free whole grains like rice, quinoa, and oats (certified gluten-free).'
    );
  }

  if (allergiesLower.includes('nut')) {
    recommendations.push(
      'Get healthy fats from seeds, avocados, and olive oil instead of nuts. Check labels carefully for hidden nut ingredients.'
    );
  }

  // General wellness recommendations
  recommendations.push('Aim for at least 5 servings of colorful fruits and vegetables daily for optimal nutrition.');
  recommendations.push(
    'Stay well-hydrated by drinking water throughout the day, aiming for at least 8 glasses.'
  );

  // Age-based recommendations
  const age = Number(profile.age);
  if (age > 50) {
    recommendations.push(
      'Focus on calcium and vitamin D for bone health, and consider foods rich in omega-3s for heart health.'
    );
  }

  return recommendations;
}

