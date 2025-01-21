import { LeaderboardTable } from "@/components/LeaderboardTable";
import { TableCaption } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const globalLeaderboardData = [
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

const friendsLeaderboardData = [
    { username: "Zara", time: 70 },
    { username: "Liam", time: 95 },
    { username: "Emma", time: 85 },
    { username: "Noah", time: 100 },
    { username: "Olivia", time: 90 },
];

export const Leaderboard = () => {
    return (
        <div className="max-h-screen-minus-57">
            <Tabs defaultValue="global" className="w-full">
                <TableCaption>Fastest completion times for today.</TableCaption>
                <div className="mt-2 flex flex-row items-center justify-center">
                    <TabsList className="flex justify-center md:mx-6">
                        <TabsTrigger value="global">Global Leaderboard</TabsTrigger>
                        <TabsTrigger value="friends">Friends Leaderboard</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="global">
                    <div className="flex md:px-6 md:mx-6 h-fit border-2">
                        <LeaderboardTable data={globalLeaderboardData} />
                    </div>
                </TabsContent>
                <TabsContent value="friends">
                    <div className="flex md:px-6 md:mx-6 h-fit border-2">
                        <LeaderboardTable data={friendsLeaderboardData} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};