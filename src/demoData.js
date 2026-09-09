const titles = ['A clearer overview', 'Space for every project', 'See the bigger picture', 'Progress, in perspective', 'Everything in its place', 'Make it your own'];
export const studies = Array.from({ length: 36 }, (_, index) => ({
  id: `study-${index + 1}`, src: `/demo/study-${index % 6 + 1}.svg`, width: 1280, height: 800,
  alt: `Neutral workspace UI study ${index + 1}`, title: titles[index % 6],
  description: 'A quiet workspace exploration. Structure, rhythm, and room to focus.',
}));
export const workflow = { id: 'workflow', src: '/demo/workflow.svg', width: 4200, height: 780, alt: 'Six connected workflow screens, from discovery to publication', title: 'One flow. The whole story.', description: 'Follow the experience from the first idea to the final handoff.' };

export const posterStudies = Array.from({ length: 36 }, (_, index) => ({
  id: `poster-${index + 1}`, src: `/demo/poster-${index % 3 + 1}.svg`, width: 600, height: 840,
  alt: `Typography and geometric poster ${index + 1}`, title: ['Quiet forms', 'Common space', 'Soft structure'][index % 3],
  description: 'A portrait-format study in type, proportion, and negative space.',
}));
