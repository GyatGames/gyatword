import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
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
import Swal from "sweetalert2";

export function SignupForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const { signup } = useAuth(); // Access the signup function from AuthContext
    const [formValues, setFormValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);

    // Handle form value changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormValues((prev) => ({ ...prev, [id]: value }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Synchronous - ensures default behavior is prevented
        handleSignup(); // Asynchronous logic in a separate function
    };

    // Asynchronous signup logic
    const handleSignup = async () => {
        const { username, email, password, confirmPassword } = formValues;

        // Validate passwords match
        if (password !== confirmPassword) {
            Swal.fire({
                title: "Signup Failed",
                text: "Passwords do not match.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        try {
            setLoading(true);
            await signup(username, email, password); // Call the signup function
            Swal.fire({
                title: "Signup Successful",
                text: "Your account has been created successfully!",
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "Signup failed. Please try again.";
            Swal.fire({
                title: "Signup Failed",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            setLoading(false);
        }
    };

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
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Your username"
                                        value={formValues.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={formValues.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Create a password"
                                        value={formValues.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirm-password">
                                        Confirm Password
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Re-enter your password"
                                        value={formValues.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? "Signing Up..." : "Sign Up"}
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Sign Up with Google
                                </Button>
                            </div>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}