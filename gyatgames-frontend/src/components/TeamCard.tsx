import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Linkedin } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";

export interface TeamCardProps {
    name: string;
    role: string;
    image: string;
    github: string;
    linkedin: string;
    description: string;
}

export const TeamCard: React.FC<TeamCardProps> = ({
    name,
    role,
    image,
    github,
    linkedin,
    description,
}) => {
    return (
        <Card className="w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10">
            <CardHeader className="mt-8 flex justify-center items-center pb-2">
                <img
                    src={image}
                    alt={`${name}'s avatar`}
                    className="absolute grayscale-[0%] -top-12 rounded-full w-24 h-24 aspect-square object-cover"
                />
                <CardTitle className="text-center">{name}</CardTitle>
                <CardDescription className="font-normal text-primary">{role}</CardDescription>
            </CardHeader>

            <CardContent className="text-center pb-2">
                <p>{description}</p>
            </CardContent>

            <CardFooter>
                <div className="flex gap-2">
                    <a
                        rel="noreferrer noopener"
                        href={github}
                        target="_blank"
                        className={buttonVariants({
                            variant: "ghost",
                            size: "sm",
                        })}
                    >
                        <span className="sr-only">Github icon</span>
                        <GitHubLogoIcon className="w-5 h-5" />
                    </a>
                    <a
                        rel="noreferrer noopener"
                        href={linkedin}
                        target="_blank"
                        className={buttonVariants({
                            variant: "ghost",
                            size: "sm",
                        })}
                    >
                        <span className="sr-only">LinkedIn icon</span>
                        <Linkedin size="20" />
                    </a>
                </div>
            </CardFooter>
        </Card>
    );
};