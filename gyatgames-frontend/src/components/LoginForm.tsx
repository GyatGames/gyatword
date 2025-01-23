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
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const { login, oAuthLogin } = useAuth(); // No need for `any` type now
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log('calling handlesubmit');
        e.preventDefault();
        console.log('prevented event default');
        setLoading(true);


        try {
            await login(email, password); // Attempt login
            console.log("Login successful! Redirecting to home page...");
            navigate("/");

        } catch (err: any) {
            console.error("Login failed:", err);
            const errorMessage =
                err.response?.message ||
                err.response?.data?.message || // Backend-specific error message
                "An unexpected error occurred. Please try again.";

            // Show SweetAlert2 popup for errors
            Swal.fire({
                title: "Login Failed",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "OK",
                customClass: {
                    container: 'swal-container',
                    popup: 'swal-popup',
                    title: 'swal-title',
                    htmlContainer: 'swal-html-container',
                    confirmButton: 'swal-confirm',
                },
            });
        } finally {
            setLoading(false);
            console.log("Loading state reset.");

        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                            <Button
                                onClick={() => oAuthLogin()}
                                variant="outline"
                                className="w-full">
                                Login with Google
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}