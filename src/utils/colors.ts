export const getRandomColor = () => {
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#F97316', // orange
    '#14B8A6', // teal
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
