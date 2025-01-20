import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { LightBulbIcon } from "./Icons";


export const HeroCards = () => {
    return (
        <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
            {/* Testimonial */}
            <Card className="absolute w-[260px] left-[50px] top-[75px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <Avatar>
                        <AvatarImage
                            alt=""
                            src="https://github.com/shadcn.png"
                        />
                        <AvatarFallback>SH</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                        <CardTitle className="text-lg">John Doe</CardTitle>
                        <CardDescription>@john_doe</CardDescription>
                    </div>
                </CardHeader>

                <CardContent>I love playing gyatword!</CardContent>
            </Card>

            {/* Service */}
            <Card className="absolute w-[350px] right-[10px] bottom-[130px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                    <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
                        <LightBulbIcon />
                    </div>
                    <div>
                        <CardTitle>Best Polygot Hack</CardTitle>
                        <CardDescription className="text-md mt-2">
                            @ NUS Hack&Roll 2025
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>
        </div>
    );
};