import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    glass?: boolean;
    padding?: "none" | "sm" | "md" | "lg";
    hover?: boolean;
}

const paddingMap = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
};

export function Card({
    children,
    className = "",
    glass = false,
    padding = "md",
    hover = false,
}: CardProps): React.JSX.Element {
    return (
        <div
            className={[
                "rounded-[var(--radius-xl)]",
                "border border-[var(--card-border)]",
                "transition-all duration-300",
                glass
                    ? "bg-[var(--bg-glass)] backdrop-blur-xl"
                    : "bg-[var(--card-bg)]",
                hover
                    ? "hover:shadow-2xl hover:-translate-y-1"
                    : "shadow-[var(--card-shadow)]",
                paddingMap[padding],
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {children}
        </div>
    );
}