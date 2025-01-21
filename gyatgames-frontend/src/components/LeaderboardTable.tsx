import {
    Table,
    TableBody,
    // TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type LeaderboardEntry = {
    username: string;
    time: number;
};

type LeaderboardTableProps = {
    data: LeaderboardEntry[];
};

function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0
        ? `${minutes}min ${remainingSeconds}s`
        : `${remainingSeconds}s`;
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
    const sortedLeaderboard = [...data].sort((a, b) => a.time - b.time);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedLeaderboard.map((entry, index) => (
                    <TableRow key={entry.username}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{entry.username}</TableCell>
                        <TableCell className="text-right">
                            {formatTime(entry.time)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}