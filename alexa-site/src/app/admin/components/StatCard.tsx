import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  onClick?: () => void;
  secondaryValue?: string;
}

export default function StatCard({ title, value, description, onClick, secondaryValue }: StatCardProps) {
    return (
        <Card 
            className={ `${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}` }
            onClick={ onClick }
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{ title }</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-[#C48B9F]" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-[#C48B9F]">{ value }</div>
                { secondaryValue && (
                    <div className="text-sm font-medium text-gray-500">
                        { secondaryValue }
                    </div>
                ) }
                { description && (
                    <p className="text-xs text-gray-500 mt-1">{ description }</p>
                ) }
            </CardContent>
        </Card>
    );
} 

