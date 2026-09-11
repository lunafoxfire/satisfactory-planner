import { ShareButton } from "#components/share-button";

export function AppHeader() {
    return (
        <header className="flex justify-between h-14 shrink-0 items-center border-b px-4">
            <h1 className="text-lg font-semibold">Satisfactory Planner</h1>
            <ShareButton className="" />
        </header>
    );
}
