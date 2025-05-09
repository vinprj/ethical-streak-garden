
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

interface AnimatedProfilePictureProps {
  src?: string;
  alt?: string;
  className?: string;
  fallbackDelay?: number;
}

export const AnimatedProfilePicture: React.FC<AnimatedProfilePictureProps> = ({
  src,
  alt = "Profile picture",
  className = "",
  fallbackDelay = 500,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    // Reset states when src changes
    setLoaded(false);
    setError(false);
    
    // Add slight delay for animation effect
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [src]);
  
  // Generate fallback initials from the alt text
  const getInitials = (): string => {
    if (!alt || alt === "Profile picture") return "U";
    
    return alt
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className={`relative ${className}`}>
      <Avatar className={`transition-all duration-500 ease-in-out ${loaded ? 'scale-100' : 'scale-95'} ${error ? 'opacity-80' : 'opacity-100'}`}>
        {src && !error ? (
          <AvatarImage
            src={src}
            alt={alt}
            className="object-cover"
            onError={() => setError(true)}
          />
        ) : null}
        <AvatarFallback 
          className="bg-primary/10 text-primary animate-in fade-in"
          delayMs={fallbackDelay}
        >
          {error || !src ? (
            <UserRound className="h-5 w-5 text-muted-foreground" />
          ) : (
            getInitials()
          )}
        </AvatarFallback>
      </Avatar>
      
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-md opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none -z-10"></div>
    </div>
  );
};
