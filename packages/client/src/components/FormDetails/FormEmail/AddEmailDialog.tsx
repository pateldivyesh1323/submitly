import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Flex } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface AddEmailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (email: { address: string; active: boolean }) => void;
  mode: "add" | "edit";
  emailInitialData?: {
    address: string;
    active: boolean;
  } | null;
  isLoading?: boolean;
}

export default function AddEmailDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  mode,
  emailInitialData,
  isLoading,
}: AddEmailDialogProps) {
  const [email, setEmail] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (emailInitialData) {
      setEmail(emailInitialData.address);
      setActive(emailInitialData.active);
    }
  }, [emailInitialData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ address: email, active });
    resetForm();
  };

  const resetForm = () => {
    setEmail("");
    setActive(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-200">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-neutral-200">
            {mode === "add" ? "Add Email Address" : "Edit Email Address"}
          </DialogTitle>
        </DialogHeader>

        <Form.Root onSubmit={handleSubmit}>
          <Flex direction="column" gap="20px">
            <Form.Field name="email">
              <Form.Label className="text-sm font-medium text-neutral-200">
                Email Address
              </Form.Label>
              <Form.Control asChild>
                <input
                  type="email"
                  className="mt-1.5 w-full rounded-md bg-neutral-800 p-2.5 text-sm text-neutral-200 border border-neutral-700 focus:border-neutral-600 focus:outline-none"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="active" className="flex items-center gap-2">
              <Form.Label className="text-sm font-medium text-neutral-200">
                Active
              </Form.Label>
              <Form.Control asChild>
                <Switch
                  checked={active}
                  onCheckedChange={setActive}
                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-600"
                />
              </Form.Control>
            </Form.Field>
          </Flex>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="bg-neutral-800 text-neutral-200 border-neutral-700 hover:bg-neutral-700 transition-all duration-200"
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 text-neutral-200 hover:bg-green-700 transition-all duration-200"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "add" ? "Add Email" : "Update Email"}
            </Button>
          </DialogFooter>
        </Form.Root>
      </DialogContent>
    </Dialog>
  );
}
