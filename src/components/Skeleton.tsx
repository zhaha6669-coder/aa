"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse bg-white/5 rounded-lg",
                className
            )}
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="relative p-6 rounded-2xl border border-white/[0.08] bg-lumina-panel/80 overflow-hidden">
            <div className="space-y-4">
                <Skeleton className="h-16 w-16 rounded-xl mx-auto" />
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-full" />
            </div>
        </div>
    );
}

export function SkeletonSection() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <Skeleton className="h-12 w-64 mx-auto mb-4" />
                    <Skeleton className="h-6 w-96 mx-auto" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
