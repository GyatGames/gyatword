import { Button, buttonVariants } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { HeroCards } from "@/components/HeroCards";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Hero = () => {
  const { isAuthenticated, user } = useAuth(); // Access the authentication state
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    if (isAuthenticated && user?.username) {
      setShowAlert(true); // Show alert if user is logged in and username exists
      const timer = setTimeout(() => setShowAlert(false), 5000); // Hide alert after 5 seconds
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [isAuthenticated, user?.username]);

  return (
    <div className="container relative">
      {/* Overlay Alert */}
      {showAlert && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <Alert variant="default">
            <AlertTitle>Welcome back, {user?.username}!</AlertTitle>
            <AlertDescription>
              You are logged in. Enjoy exploring the crossword brainrot!
            </AlertDescription>
          </Alert>
        </div>
      )}
      <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-24 gap-10">
        <div className="text-center lg:text-start space-y-6">
          <main className="text-5xl md:text-6xl font-bold">
            <h1 className="inline">
              <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
                Crossword
              </span>{" "}

            </h1>{" "}
            but{" "}
            <h2 className="inline">
              <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
                Brainrot
              </span>{" "}

            </h2>
          </main>

          <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
            Refreshes daily
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Link
              to="/gyatword"
            >
              <Button variant="default" className="w-full md:w-1/3">
                Play Gyatword
              </Button>
            </Link>
            <a
              rel="noreferrer noopener"
              href="https://github.com/GyatGames/gyatword"
              target="_blank"
              className={`w-full md:w-1/3 ${buttonVariants({
                variant: "outline",
              })}`}
            >
              Github Repository
              <GitHubLogoIcon className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Hero cards sections */}
        <div className="z-10">
          <HeroCards />
        </div>

        {/* Shadow effect */}
        <div className="shadow"></div>
      </section>
    </div>

  );
};