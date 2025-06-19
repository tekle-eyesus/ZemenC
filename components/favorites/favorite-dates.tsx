import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

// Type for a favorite date
interface FavoriteDate {
    id: string;
    ethiopianDay: number;
    ethiopianMonth: number;
    ethiopianYear: number;
    gregorianDay: number;
    gregorianMonth: number;
    gregorianYear: number;
    note?: string;
    createdAt: string;
}

export function FavoriteDatesTable() {
    const { toast } = useToast();
    const [favoriteDates, setFavoriteDates] = React.useState<FavoriteDate[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [editNote, setEditNote] = React.useState("");
    const [editLoading, setEditLoading] = React.useState(false);
    const [deleteLoadingId, setDeleteLoadingId] = React.useState<string | null>(null);

    // Fetch favorite dates
    const fetchFavorites = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/favorite-date", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error("Failed to fetch favorite dates");
            const data = await res.json();
            setFavoriteDates(data);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to fetch favorite dates",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    // Delete logic
    const handleDelete = async (id: string) => {
        setDeleteLoadingId(id);
        try {
            const res = await fetch("/api/favorite-date", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) throw new Error("Failed to delete favorite date");
            toast({ title: "Deleted", description: "Favorite date deleted." });
            setFavoriteDates((prev) => prev.filter((fav) => fav.id !== id));
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete favorite date",
                variant: "destructive",
            });
        } finally {
            setDeleteLoadingId(null);
        }
    };

    // Edit logic
    const handleEdit = (fav: FavoriteDate) => {
        setEditingId(fav.id);
        setEditNote(fav.note || "");
    };
    const handleEditSave = async (id: string) => {
        setEditLoading(true);
        try {
            const res = await fetch("/api/favorite-date", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, note: editNote }),
            });
            if (!res.ok) throw new Error("Failed to update favorite date");
            toast({ title: "Updated", description: "Favorite date updated." });
            setFavoriteDates((prev) => prev.map((fav) => fav.id === id ? { ...fav, note: editNote } : fav));
            setEditingId(null);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update favorite date",
                variant: "destructive",
            });
        } finally {
            setEditLoading(false);
        }
    };
    const handleEditCancel = () => {
        setEditingId(null);
        setEditNote("");
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Favorite Dates</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <div className="w-full">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left border-b">
                                <th className="py-2 px-2">Ethiopian Date</th>
                                <th className="py-2 px-2">Gregorian Date</th>
                                <th className="py-2 px-2">Note</th>
                                <th className="py-2 px-2">Added</th>
                                <th className="py-2 px-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-muted-foreground">
                                        Loading...
                                    </td>
                                </tr>
                            ) : favoriteDates.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-muted-foreground">
                                        No favorite dates found.
                                    </td>
                                </tr>
                            ) : (
                                favoriteDates.map((fav) => (
                                    <tr key={fav.id} className="border-b hover:bg-muted/50">
                                        <td className="py-2 px-2 font-semibold whitespace-nowrap">
                                            {fav.ethiopianYear}/{fav.ethiopianMonth}/{fav.ethiopianDay}
                                        </td>
                                        <td className="py-2 px-2 whitespace-nowrap">
                                            {fav.gregorianYear}/{fav.gregorianMonth}/{fav.gregorianDay}
                                        </td>
                                        <td className="py-2 px-2">
                                            {editingId === fav.id ? (
                                                <input
                                                    className="border rounded px-2 py-1 w-full"
                                                    value={editNote}
                                                    onChange={e => setEditNote(e.target.value)}
                                                    autoFocus
                                                    disabled={editLoading}
                                                />
                                            ) : fav.note ? <Badge>{fav.note}</Badge> : <span className="text-muted-foreground">-</span>}
                                        </td>
                                        <td className="py-2 px-2 whitespace-nowrap">
                                            {new Date(fav.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 px-2 flex gap-2">
                                            {editingId === fav.id ? (
                                                <>
                                                    <Button size="sm" variant="outline" onClick={() => handleEditSave(fav.id)} disabled={editLoading}>
                                                        Save
                                                    </Button>
                                                    <Button size="sm" variant="ghost" onClick={handleEditCancel} disabled={editLoading}>
                                                        Cancel
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button size="icon" variant="ghost" onClick={() => handleEdit(fav)} aria-label="Edit">
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={() => handleDelete(fav.id)} aria-label="Delete" disabled={deleteLoadingId === fav.id}>
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

export default FavoriteDatesTable;

