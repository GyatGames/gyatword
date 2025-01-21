import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription>
                        Create an account by filling in your details below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Your username"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a password"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="Re-enter your password"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Sign Up
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}