import { createContext, useContext, useState } from "react";

const FormContext = createContext({});

const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [formId, setFormId] = useState<string | null>(null);

  return (
    <FormContext.Provider value={{ formId, setFormId }}>
      {children}
    </FormContext.Provider>
  );
};

const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};

export { useForm, FormProvider };
