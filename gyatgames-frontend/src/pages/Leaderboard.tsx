import { useState, useEffect } from "react";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { TableCaption } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fetchFriendsLeaderboard, fetchGlobalLeaderboard, LeaderboardEntry } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { RefreshCcw } from "lucide-react";

export const Leaderboard = () => {
    const [globalLeaderboardData, setGlobalLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [friendsLeaderboardData, setFriendsLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true); // ✅ Loading state
    // const [ setRefreshing] = useState(false); // ✅ Refreshing state for button UI

    // ✅ Function to fetch leaderboard data (used on mount & refresh)
    async function refreshLeaderboard() {
        setLoading(true);
        // setRefreshing(true); // ✅ Show refreshing indicator
        try {
            const globalData = await fetchGlobalLeaderboard();
            setGlobalLeaderboardData(globalData);
            const friendsData = await fetchFriendsLeaderboard();
            setFriendsLeaderboardData(friendsData);
        } catch (error) {
            console.error("❌ Failed to fetch leaderboard:", error);
        } finally {
            setLoading(false);
            // setRefreshing(false); // ✅ Hide refreshing indicator
        }
    }

    // ✅ Fetch leaderboard data on mount
    useEffect(() => {
        refreshLeaderboard(); // Initial fetch

        // ✅ Auto-refresh every 10 minutes
        const interval = setInterval(refreshLeaderboard, 600000);
        return () => clearInterval(interval); // Cleanup interval
    }, []);

    return (
        <div className="flex flex-col max-h-screen-minus-57 md:mt-10 items-center justify-center no-scrollbar overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            <Tabs defaultValue="global" className="w-full">
                <div className="mx-auto flex flex-col items-center justify-center w-[400px]">
                    <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="global">Global Leaderboard</TabsTrigger>
                        <TabsTrigger value="friends">Friends Leaderboard</TabsTrigger>
                    </TabsList>
                </div>
                <div className="flex h-fit w-full mx-auto flex-row items-center justify-center">
                    <TableCaption className="md:text-lg">
                        Fastest completion times for {format(new Date(), "MMMM dd, yyyy")}.
                    </TableCaption>
                    {/* <Button
                        onClick={refreshLeaderboard}
                        variant="ghost"
                        className="p-2 mx-4 mt-4 bottom[-50]"
                        disabled={refreshing} // ✅ Disable while refreshing
                    >
                        <RefreshCcw className="" />
                    </Button> */}
                </div>
                <TabsContent value="global">
                    <div className="flex md:px-6 md:mx-6 h-fit border-2">
                        {loading ? <p className="text-center">Loading leaderboard...</p> : <LeaderboardTable data={globalLeaderboardData} />}
                    </div>
                </TabsContent>

                <TabsContent value="friends">
                    <div className="flex md:px-6 md:mx-6 h-fit border-2">
                        {loading ? <p className="text-center">Loading leaderboard...</p> : <LeaderboardTable data={friendsLeaderboardData} />}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};