import {
    Table,
    TableBody,
    // TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const leaderboardData = [
    { username: "Alice", time: 85 },
    { username: "Bob", time: 120 },
    { username: "Charlie", time: 95 },
    { username: "David", time: 75 },
    { username: "Eve", time: 110 },
    { username: "Frank", time: 100 },
    { username: "Grace", time: 130 },
    { username: "Hannah", time: 90 },
    { username: "Ivy", time: 125 },
    { username: "Jack", time: 105 },
];

function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0
        ? `${minutes}min ${remainingSeconds}s`
        : `${remainingSeconds}s`;
}

export function LeaderboardTable() {
    const sortedLeaderboard = [...leaderboardData].sort((a, b) => a.time - b.time);

    return (
        <Table>
            {/* <TableCaption>Leaderboard for the fastest crossword completion times.</TableCaption> */}
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
                        <TableCell className="text-right">{formatTime(entry.time)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}