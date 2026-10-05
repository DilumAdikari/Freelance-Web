'use client';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  isOnline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function UserAvatar({
  name,
  avatarUrl,
  isOnline = false,
  size = 'md',
}: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
  };

  const dotClasses = {
    sm: 'h-2.5 w-2.5 border',
    md: 'h-3 w-3 border-2',
    lg: 'h-3.5 w-3.5 border-2',
  };

  return (
    <div className="relative inline-block">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-black font-bold text-white`}
        >
          {name.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Fiverr Style Green Online Dot */}
      {isOnline && (
        <span
          className={`absolute bottom-0 right-0 rounded-full bg-emerald-500 border-white shadow-xs ${dotClasses[size]}`}
          title="Online"
        />
      )}
    </div>
  );
}