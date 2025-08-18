interface HeadingSmallProps {
    title: string;
    description?: string;
    className?: string;
}

export default function HeadingSmall({ title, description, className = '' }: HeadingSmallProps) {
    return (
        <div className={`space-y-1 ${className}`}>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                {title}
            </h2>
            {description && (
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    {description}
                </p>
            )}
        </div>
    );
}