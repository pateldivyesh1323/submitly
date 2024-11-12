import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { featuresContent } from "../content";

export default function Home() {
  return (
    <Flex align="center" justify="center" direction="column">
      <Flex
        align="center"
        justify="center"
        className="relative min-h-[100vh] w-[80vw] mx-auto"
      >
        <DotLottieReact
          src="/assets/animations/HeroAnimation.json"
          loop
          autoplay
          className="absolute h-[70%] w-[70%] object-cover z-0 opacity-15"
        />
        <Flex
          align="center"
          justify="center"
          direction="column"
          className="relative"
        >
          <Text className="font-serif lg:text-6xl md:text-4xl text-2xl">
            Contact forms made easier
          </Text>
          <Text
            color="gray"
            align="center"
            className="text-justify text-sm lg:text-xl"
          >
            Submitly is a seamless form submission solution that simplifies how
            users interact with your website. Without the need for a backend
            server, Submitly allows you to receive form submissions directly
            into your inbox. It offers an intuitive and user-friendly
            experience, helping you streamline communication and data collection
            for any online project. Perfect for landing pages, portfolio sites,
            or businesses that want fast and efficient form management without
            complicated server setups.
          </Text>
          <Link to="/docs">
            <Flex align="center" className="gap-1 hover:gap-4 transition-all">
              <Text color="lime">Go to Documentation</Text>
              <Text color="lime" size="7">
                &rarr;
              </Text>
            </Flex>
          </Link>
        </Flex>
      </Flex>
      <Flex
        direction="column"
        justify="center"
        align="center"
        className="w-[80vw]"
        gap="4"
      >
        <Heading as="h3">Features</Heading>
        <Grid columns="2" className="p-4" gap="8">
          {featuresContent.map((feature, index) => (
            <Flex
              key={index}
              direction="column"
              className="bg-neutral-800 rounded-lg p-4 gap-4"
            >
              <div>
                <img src={feature.icon} alt="" className="w-[40px] h-[40px]" />
              </div>
              <div className="font-bold">{feature.title}</div>
              <div className="text-sm">{feature.description}</div>
            </Flex>
          ))}
        </Grid>
      </Flex>
      <Footer />
    </Flex>
  );
}
