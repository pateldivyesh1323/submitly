import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <Flex
      justify="between"
      align="center"
      className="px-10 h-20 w-full bg-darkPrimaryCust"
    >
      <Box className="font-guerrilla">
        <Link to="/">
          <Text color="lime" size="6">
            Submitly
          </Text>
        </Link>
      </Box>
      <Flex className="space-x-4" align="center">
        <Link to="/signup">
          <Button className="cursor-pointer">Get started</Button>
        </Link>
        <Link to="/login">
          <Button variant="ghost" className="cursor-pointer">
            Login
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
}
