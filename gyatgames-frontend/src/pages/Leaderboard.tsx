import { LeaderboardTable } from "@/components/LeaderboardTable";
import { TableCaption } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

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

export const Leaderboard = () => {
    return (
        <div className="max-h-screen-minus-57">
            <Tabs defaultValue="global" className="w-full">
                <div className="mt-2 mx-auto flex flex-col items-center justify-center w-[400px]">
                    <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="global">Global Leaderboard</TabsTrigger>
                        <TabsTrigger value="friends">Friends Leaderboard</TabsTrigger>
                    </TabsList>
                    <TableCaption>
                        Fastest completion times for {format(new Date(), "MMMM dd, yyyy")}.
                    </TableCaption>
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