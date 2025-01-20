import { TeamCard } from "@/components/TeamCard";

export const About = () => {
  return (

    <section id="about" className="container py-10 md:py-24">
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8">
          <div className="flex flex-col justify-between">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              About GyatGames
            </h2>
            <p className="text-md text-justify sm:text-xl text-muted-foreground mt-4 mb-4">
              Gyatword is an engaging daily crossword puzzle game that challenges your knowledge of "brainrot", or gen Alpha, urban slang. Developed collaboratively by a team of four passionate developers in a short span of 24 hours (NUS Hacknroll), Gyatword aims to provide users with an exciting and challenging word game experience.
            </p>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              The Team
            </h2>

            <div className="flex flex-col items-center gap-16 lg:items-stretch lg:flex-row justify-center lg:gap-2 mt-16">
              <TeamCard
                name="David Chan"
                role="Frontend Developer"
                image="https://media.licdn.com/dms/image/v2/D5603AQFiFsS7PnCBgw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1722863876474?e=1743033600&v=beta&t=jU-LXE-ou-4mH4nfri5HWNiSxflKxKbgEA3JwUAf2sA"
                github="https://github.com/davidchanwz"
                twitter="https://twitter.com/leo_mirand4"
                linkedin="https://www.linkedin.com/in/davidchanwz/"
                description="I love gyat."
              />
              <TeamCard
                name="Aayush Sharma"
                role="Frontend Developer"
                image="https://media.licdn.com/dms/image/v2/D5603AQGcFfqNcCWF_g/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1680314103058?e=1743033600&v=beta&t=XYjlhBakeqmUBzhSEzBwUKxyDgSbAAe3aYlo7JwCnoU"
                github="https://github.com/ahhyush"
                twitter="https://twitter.com/janedoe"
                linkedin="https://www.linkedin.com/in/aayush-sharma-329321208/"
                description="I really love gyat."
              />
              <TeamCard
                name="Jensen Huang"
                role="Backend Developer"
                image="https://media.licdn.com/dms/image/v2/D5603AQGtnQFGiiXcyg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1698040588935?e=1743033600&v=beta&t=Tvr_Sb7Rw_dFAO20aD-fYXGQrMiNt12mewydpmSWTLU"
                github="https://github.com/jensenhuangyankai"
                twitter="https://twitter.com/johnsmith"
                linkedin="https://www.linkedin.com/in/jensenhyk/"
                description="I really really love gyat."
              />
              <TeamCard
                name="Benjamin Koh"
                role="Backend Developer"
                image="https://media.licdn.com/dms/image/v2/D5603AQFrg5KJI0fDgw/profile-displayphoto-shrink_400_400/B56ZOl4J3oGoAg-/0/1733654784708?e=1743033600&v=beta&t=ngREuivWICXZ5P7fJvHiQenRu7SwCLNx6lfCuLv1Nzw"
                github="https://github.com/Ben926"
                twitter="https://twitter.com/emilydavis"
                linkedin="https://www.linkedin.com/in/benjaminkoh926/"
                description="I really really really love gyat."
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};