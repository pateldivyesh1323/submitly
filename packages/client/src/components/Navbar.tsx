import { Button, Flex, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <Flex
      justify="between"
      align="center"
      className="px-10 h-20 w-full bg-darkSecondaryCust sticky top-0 z-10 border-b border-neutral-700"
    >
      <Flex align="center" className="gap-4">
        <Link to="/" className="font-guerrilla">
          <Text color="orange" size="6">
            Submitly
          </Text>
        </Link>
        <Link to="/docs" className="hover:underline text-sm text-neutral-200">
          Documentation
        </Link>
      </Flex>

      <Flex className="space-x-4" align="center">
        {!isAuthenticated ? (
          <>
            <Link to="/signup">
              <Button className="cursor-pointer">Get started</Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" className="cursor-pointer">
                Login
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">
              <Button className="cursor-pointer">Dashboard</Button>
            </Link>
            <Button onClick={logout} variant="ghost" className="cursor-pointer">
              Logout
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  );
}
