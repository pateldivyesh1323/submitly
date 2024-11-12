import { Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { featuresContent } from "../content";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";
import { toast } from "sonner";
import { FormEvent } from "react";

export default function Home() {
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Form submitted successfully!");
  };

  return (
    <Flex align="center" justify="center" direction="column">
      <Flex
        align="center"
        justify="center"
        className="relative min-h-[100vh] mx-auto w-full bg-gradient-to-t from-neutral-800 to-transparent"
      >
        <img
          src="/assets/images/hero-bg.jpg"
          alt=""
          className="absolute brightness-50 opacity-40 object-cover h-full w-full"
        />
        <Flex
          align="center"
          justify="center"
          direction="column"
          className="relative w-[80vw]"
        >
          <Text className="font-doto lg:text-7xl md:text-4xl text-2xl font-extrabold">
            FORM <Text color="orange">SUBMISSIONS</Text> MADE EASIER
          </Text>
          <Text color="gray" align="center" className="text-justify">
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
              <Text color="cyan">Go to Documentation</Text>
              <Text color="cyan" size="7">
                &rarr;
              </Text>
            </Flex>
          </Link>
        </Flex>
      </Flex>
      <Flex>
        <DeviceFrameset device="iPhone X" zoom={0.7}>
          <Flex
            className="h-full w-full bg-gradient-to-r from-orange-400 to-orange-700"
            align="center"
            justify="center"
          >
            <form
              className="mx-auto p-4 rounded w-full"
              onSubmit={handleFormSubmit}
            >
              <Heading className="text-center mb-8">Contact us</Heading>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-white text-neutral-900"
                  type="text"
                  id="name"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-white text-neutral-900"
                  type="email"
                  id="email"
                  placeholder="Your email"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="message"
                >
                  Message
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-white text-neutral-900"
                  id="message"
                  rows={4}
                  placeholder="Your message"
                  required
                ></textarea>
              </div>
              <button
                className="w-full bg-neutral-800 text-white py-2 rounded-md hover:bg-neutral-600 focus:outline-none transition-all"
                type="submit"
              >
                Submit
              </button>
            </form>
          </Flex>
        </DeviceFrameset>
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
