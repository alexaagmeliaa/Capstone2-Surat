/**
 * Utility helper to generate a unique, colorful avatar URL for each user
 * based on their name, email, or role if no custom photo is uploaded.
 */
export const getUserAvatar = (user) => {
  // Fallback aman jika data user belum termuat
  if (!user) return '/assets/profile/default.png'; 

  // Jika backend menyediakan URL foto profil langsung
  if (user.avatar) return user.avatar;
  if (user.profile_photo_url) return user.profile_photo_url;

  const name = user.name || user.nama || user.email || 'User';

  // Curated elegant color palette for avatars
  const colors = [
    '2A60A4', // Royal Blue
    '3169B3', // Medium Blue
    '0D9488', // Teal
    '4F46E5', // Indigo
    '7C3AED', // Violet
    'DB2777', // Pink
    '059669', // Emerald
    'D97706', // Amber
    '0284C7', // Sky Blue
    'BE185D'  // Rose
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colors.length;
  const bgColor = colors[colorIndex];

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgColor}&color=fff&bold=true&size=128`;
};