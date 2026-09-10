import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "#components/ui/card";
import type { PropsWithChildren } from "react";

interface SectionCardProps {
    title?: string;
    description?: string;
}

export function SectionCard({ title, description, children }: PropsWithChildren<SectionCardProps>) {
    return (
        <Card
            className="bg-card/70 backdrop-blur-xs"
        >
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {
                    description && <CardDescription>{description}</CardDescription>
                }
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}
