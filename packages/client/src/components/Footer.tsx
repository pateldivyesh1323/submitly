import { Flex } from "@radix-ui/themes";

export default function Footer() {
  return (
    <Flex justify="between" className="w-full p-8 text-sm mt-8">
      <div>&copy; 2024 Submitly. All rights reserved</div>
      <Flex gap="4">
        <button>Privacy Policy</button>
        <button>Terms of Service</button>
      </Flex>
    </Flex>
  );
}
