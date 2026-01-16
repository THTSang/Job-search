import Avatar from '@mui/material/Avatar';

// Color palette for avatars based on name
const colors = [
  '#1976d2', // blue
  '#388e3c', // green
  '#d32f2f', // red
  '#7b1fa2', // purple
  '#c2185b', // pink
  '#0097a7', // cyan
  '#f57c00', // orange
  '#5d4037', // brown
  '#455a64', // blue-grey
  '#00796b', // teal
];

// Generate consistent color based on name string
const getColorFromName = (name: string): string => {
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Get initials from name (1-2 characters)
const getInitials = (name: string): string => {
  if (!name || !name.trim()) return '?';
  
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  // Return first letter of first and last word
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

interface LetterAvatarProps {
  name: string;
  src?: string | null;
  size?: 'small' | 'medium' | 'large' | number;
  variant?: 'circular' | 'rounded' | 'square';
}

export default function LetterAvatar({
  name,
  src,
  size = 'medium',
  variant = 'circular'
}: LetterAvatarProps) {
  // Calculate size in pixels
  const getSize = (): number => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'small': return 32;
      case 'large': return 56;
      case 'medium':
      default: return 40;
    }
  };

  const pixelSize = getSize();
  const fontSize = pixelSize * 0.4; // Font size relative to avatar size

  // If there's an image URL, show the image
  if (src) {
    return (
      <Avatar
        src={src}
        alt={name}
        variant={variant}
        sx={{
          width: pixelSize,
          height: pixelSize,
        }}
      />
    );
  }

  // Otherwise show initials with colored background
  return (
    <Avatar
      variant={variant}
      sx={{
        width: pixelSize,
        height: pixelSize,
        bgcolor: getColorFromName(name),
        fontSize: fontSize,
        fontWeight: 600,
      }}
    >
      {getInitials(name)}
    </Avatar>
  );
}
