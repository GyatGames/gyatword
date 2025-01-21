import { LeaderboardTable } from "@/components/LeaderboardTable";

export const Leaderboard = () => {
    return (
        <div className="max-h-screen-minus-57">
                <h2 className="text-2xl md:text-4xl py-2 px-2 md:px-8 font-bold bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    Top 10 Fastest Completion Times
                </h2>
            <div className="flex md:px-6 md:mx-6 h-fit border-2">
                <LeaderboardTable />
            </div>
        </ div>

        // <section id="about" className="container py-24">
        //     <div className="bg-muted/50 border rounded-lg py-12">
        //         <div className="px-6 flex flex-col-reverse md:flex-row gap-8">
        //             <div className="flex flex-col justify-between">
        //                 <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
        //                     Leaderboard
        //                 </h2>
        //                 {/* <p className="text-xl text-muted-foreground mt-4 mb-4">
        //                     Coming soon...
        //                 </p> */}
        //             </div>
        //         </div>
        //     </div>
        // </section>
    );
};