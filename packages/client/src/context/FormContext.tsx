/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import {
  DELETE_FORM_SUBMISSIONS,
  GET_FORM_SUBMISSIONS,
} from "../lib/constants";
import { deleteFormSubmissions, getFormSubmissions } from "../queries/form";
import { toast } from "sonner";
import { FormSubmissionsType, FormSubmissionType } from "../types/Form";
import { queryClient } from "../lib/apiClient";
import { getFormSocket, disconnectFormSocket } from "@/sockets";

interface FormContextType {
  formId: string | null;
  setFormId: (id: string | null) => void;
  selectedSubmission: FormSubmissionType | null;
  setSelectedSubmission: (submission: FormSubmissionType | null) => void;
  selectedSubmissions: string[];
  setSelectedSubmissions: React.Dispatch<React.SetStateAction<string[]>>;
  formSubmissionsData:
    | {
        data?: {
          formSubmissions: FormSubmissionsType;
          totalPages: number;
        };
      }
    | undefined;
  formSubmissionsLoading: boolean;
  isError: boolean;
  refetch: () => void;
  deleteSubmissionsMutation: (selectedIds: string[]) => void;
  isPending: boolean;
  handleCheckboxChange: (submissionId: string) => void;
  handleSelectAll: (checked: boolean | "indeterminate") => void;
  handleDeleteSelectedSubmissions: () => void;
  formSubmissions: FormSubmissionsType;
  totalPages: number;
  markSubmissionAsRead: (submissionId: string) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();

  const query = new URLSearchParams(location.search);
  const sortBy = query.get("sort") || "latest";
  const currentPage = query.get("page") || "1";
  const searchTerm = query.get("search") || "";

  const [formId, setFormId] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState<FormSubmissionType | null>(null);
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const {
    data: formSubmissionsData,
    isLoading: formSubmissionsLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      GET_FORM_SUBMISSIONS,
      params.id,
      currentPage,
      sortBy,
      searchTerm,
    ],
    queryFn: () =>
      getFormSubmissions(params.id || "", currentPage, sortBy, searchTerm),
  });

  const { mutate: deleteSubmissionsMutation, isPending } = useMutation({
    mutationKey: [DELETE_FORM_SUBMISSIONS, params.id],
    mutationFn: (selectedIds: string[]) =>
      deleteFormSubmissions(params.id || "", selectedIds),
    onSuccess: () => {
      toast.success("Submissions deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [
          GET_FORM_SUBMISSIONS,
          params.id,
          currentPage,
          sortBy,
          searchTerm,
        ],
      });
      setSelectedSubmissions([]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCheckboxChange = (submissionId: string) => {
    setSelectedSubmissions((prev) => {
      if (prev.includes(submissionId)) {
        return prev.filter((id) => id !== submissionId);
      } else {
        return [...prev, submissionId];
      }
    });
  };

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    const formSubmissions = formSubmissionsData?.data?.formSubmissions || [];
    if (checked) {
      setSelectedSubmissions(
        formSubmissions.map((submission: FormSubmissionType) => submission._id),
      );
    } else {
      setSelectedSubmissions([]);
    }
  };

  const handleDeleteSelectedSubmissions = () => {
    deleteSubmissionsMutation(selectedSubmissions);
  };

  const markSubmissionAsRead = (submissionId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("mark-as-read", {
        formId: params.id,
        submissionId: submissionId,
      });
      formSubmissionsData?.data?.formSubmissions.forEach(
        (submission: FormSubmissionType) => {
          if (submission._id === submissionId) {
            submission.read = true;
          }
        },
      );
    } else {
      console.error("Socket not connected");
    }
  };

  const formSubmissions: FormSubmissionsType =
    formSubmissionsData?.data?.formSubmissions || [];
  const totalPages = formSubmissionsData?.data?.totalPages || 1;

  useEffect(() => {
    if (params.id) {
      const setupSocket = async () => {
        try {
          const socket = await getFormSocket();
          socketRef.current = socket;

          socket.emit("join-form", params.id);

          socket.on("connect", () => {
            console.log("Form socket connected");
          });

          socket.on("disconnect", () => {
            console.log("Form socket disconnected");
          });

          socket.on("new-submission", () => {
            refetch();
            toast.success("New form submission received!");
          });
        } catch (error) {
          console.error("Failed to setup socket connection:", error);
        }
      };

      setupSocket();
    }

    return () => {
      if (params.id) {
        disconnectFormSocket();
        socketRef.current = null;
      }
    };
  }, [params.id, refetch]);

  return (
    <FormContext.Provider
      value={{
        formId,
        setFormId,
        selectedSubmission,
        setSelectedSubmission,
        selectedSubmissions,
        setSelectedSubmissions,
        formSubmissionsData,
        formSubmissionsLoading,
        isError,
        refetch,
        deleteSubmissionsMutation,
        isPending,
        handleCheckboxChange,
        handleSelectAll,
        handleDeleteSelectedSubmissions,
        formSubmissions,
        totalPages,
        markSubmissionAsRead,
      }}
    >
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
