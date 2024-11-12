import * as Dialog from "@radix-ui/react-dialog";
import * as Form from "@radix-ui/react-form";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button, Flex } from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { CREATE_FORM_MUTATION_KEY } from "../lib/constants";
import { createForm } from "../queries/form";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../lib/error";

const CreateForm = () => {
  const navigate = useNavigate();

  const [formName, setFormName] = useState("");
  const [open, setOpen] = useState(false);

  const { mutate: createFormMutation, isPending: isFormLoading } = useMutation({
    mutationKey: [CREATE_FORM_MUTATION_KEY],
    mutationFn: createForm,
    onSuccess: (data) => {
      toast.success("Form created successfully");
      navigate(`/form/${data.data.formId}`);
      setOpen(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formName) {
      return toast.error("Form name is required");
    }
    createFormMutation(formName);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button className="cursor-pointer">Create new form</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-neutral-700 opacity-20 fixed inset-0" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-neutral-900 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Flex
            justify="center"
            direction="column"
            align="center"
            className="gap-4 w-[80%] mx-auto"
          >
            <Dialog.Title>Create new form</Dialog.Title>
            <Form.Root
              className="w-full flex item-center justify-center flex-col gap-8"
              onSubmit={handleSubmit}
            >
              <Form.Field name="formName">
                <Form.Control asChild>
                  <input
                    type="text"
                    className="rounded px-2 py-1 border border-gray-300 w-full text-md text-white"
                    required
                    placeholder="Enter name of the form"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </Form.Control>
              </Form.Field>
              <Form.Submit asChild>
                <Flex justify="center" className="w-full">
                  <Button
                    color="orange"
                    className="rounded w-fit px-3 py-1 text-sm font-semibold"
                    loading={isFormLoading}
                  >
                    Submit
                  </Button>
                </Flex>
              </Form.Submit>
            </Form.Root>
            <Dialog.Close asChild>
              <Button
                className="absolute top-[10px] right-[10px] hover:bg-neutral-700 rounded-full p-1 cursor-pointer"
                aria-label="Close"
              >
                <Cross2Icon />
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateForm;
