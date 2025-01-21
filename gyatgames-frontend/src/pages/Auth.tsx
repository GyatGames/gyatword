import { LoginForm } from "@/components/LoginForm";
import { SignupForm } from "@/components/SignupForm"; // Create a SignupForm component similar to LoginForm
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

export default function Auth() {
    return (
        <div className="flex h-screen-minus-57 mt-10 items-start justify-center no-scrollbar overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <Tabs defaultValue="login" className="w-[400px]">
                {/* Tab Navigation */}
                <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Login Form Tab */}
                <TabsContent value="login">
                    <LoginForm />
                </TabsContent>

                {/* Signup Form Tab */}
                <TabsContent value="signup">
                    <SignupForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}