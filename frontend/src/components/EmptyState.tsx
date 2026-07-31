export function EmptyState({ icon, message }: {
    icon:string; message: string }) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <span className="text-4xl opacity-60">{icon}</span>
                <p className="text-light/60">{message}</p>
            </div>
        );
    }