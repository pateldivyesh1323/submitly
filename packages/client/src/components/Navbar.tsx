import { Box, Button, Flex } from "@radix-ui/themes";

export default function Navbar() {
  return (
    <Box className="bg-primary p-4">
      <Flex className="container mx-auto justify-between items-center">
        <Box className="text-lg font-bold">Submitly</Box>
        <Flex className="space-x-4 items-center">
          <Button asChild>
            <a
              href="/login"
              className="text-textSecondary dark:text-gray-400 hover:text-textPrimary"
            >
              Login
            </a>
          </Button>
          <Button asChild>
            <a
              href="/get-started"
              className="bg-accent text-white py-2 px-4 rounded-md shadow hover:bg-green-500"
            >
              Get Started
            </a>
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
