import { Flex, Text } from "@radix-ui/themes";

export default function Home() {
  return (
    <Flex
      align="center"
      justify="center"
      direction="column"
      className="min-h-[80vh] w-[80vw] mx-auto"
    >
      <Text color="lime" size="4" className="font-guerrilla">
        Justification
      </Text>
      <Text size="9" className="font-serif">
        Contact forms made easier
      </Text>
      <Text color="gray" align="center">
        Submitly is a seamless form submission solution that simplifies how
        users interact with your website. Without the need for a backend server,
        Submitly allows you to receive form submissions directly into your
        inbox. It offers an intuitive and user-friendly experience, helping you
        streamline communication and data collection for any online project.
        Perfect for landing pages, portfolio sites, or businesses that want fast
        and efficient form management without complicated server setups.
      </Text>
    </Flex>
  );
}
