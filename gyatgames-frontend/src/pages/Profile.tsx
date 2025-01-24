import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CgProfile } from "react-icons/cg";
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye'
import { useAuth } from "@/context/AuthContext";




export const Profile = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { isAuthenticated, user, logout } = useAuth();
    const [revealPw, setRevealPw] = useState(false);

    const userData = {
        user: user?.username || "Guest",
        email: user?.email || "Unknown",
        date: new Date().toLocaleDateString(),
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>

            <SheetTrigger className="flex items-center">
                <Button variant="ghost">
                    <CgProfile className="w-5 h-5" />
                </Button>
            </SheetTrigger>


            <SheetContent>
                {isAuthenticated ? (
                    <SheetHeader>
                        <SheetTitle className="md:text-2xl pb-4">Welcome, {userData.user}</SheetTitle>
                        <SheetDescription>
                            <hr className="h-2" />
                            <div className="text-sm py-1 flex flex-col gap-2">
                                {Object.entries(userData).map(([key, value]) => (
                                    <React.Fragment key={key}>
                                        <div className="flex text-base justify-between">
                                            <span className="flex text-sm font-bold">{key}</span>
                                            <span className="flex text-sm text-right">
                                                {key === "password" ? (
                                                    <>
                                                        {!revealPw ? "•".repeat(value.length) : value}
                                                        <button
                                                            onClick={() => setRevealPw(!revealPw)}
                                                            className="ml-2 text-sm"
                                                        >
                                                            {revealPw ? (
                                                                <Icon icon={eyeOff} />
                                                            ) : (
                                                                <Icon icon={eye} />
                                                            )}
                                                        </button>
                                                    </>
                                                ) : (
                                                    value
                                                )}
                                            </span>
                                        </div>
                                        <hr className="my-2 w-1/4" />
                                    </React.Fragment>
                                ))}
                            </div>
                            <hr className="my-2" />
                            <div className="flex flex-col gap-2">
                                <Link to="/">
                                    <Button variant="outline" className="w-full">
                                        Friends
                                    </Button>
                                </Link>
                                <Link to="/" onClick={logout}>
                                    <Button variant="outline" className="w-full">
                                        Logout
                                    </Button>
                                </Link>
                            </div>
                        </SheetDescription>
                    </SheetHeader>
                ) : (
                    <SheetHeader>
                        <SheetTitle className="md:text-2xl pb-2">You aren't logged in</SheetTitle>
                        <SheetDescription>
                            <hr className="my-2" />
                            <Link
                                to="/auth"
                                onClick={() => setIsOpen(false)}
                            >
                                <Button variant="outline" className="w-full">
                                    Login
                                </Button>
                            </Link>
                        </SheetDescription>
                    </SheetHeader>
                )}
            </SheetContent>
        </Sheet>
    );
};