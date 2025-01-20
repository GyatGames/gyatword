import { LoginForm } from "@/components/login-form"

export default function Auth() {
    return (
        <div className="flex h-screen-minus-57 items-center justify-center no-scrollbar overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <LoginForm />
        </div>
    )
}
