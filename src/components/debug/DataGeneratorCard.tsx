
import React, { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

interface DataGeneratorCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export const DataGeneratorCard: React.FC<DataGeneratorCardProps> = ({ 
  title, 
  icon, 
  children, 
  footer 
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>{children}</CardContent>

      {footer && <CardFooter className="flex flex-col space-y-4">{footer}</CardFooter>}
    </Card>
  );
};
