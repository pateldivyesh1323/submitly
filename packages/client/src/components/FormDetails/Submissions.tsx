import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  DELETE_FORM_SUBMISSIONS,
  GET_FORM_SUBMISSIONS,
} from "../../lib/constants";
import {
  deleteFormSubmissions,
  getFormSubmissions,
  downloadFormSubmissionsCSV,
} from "../../queries/form";
import { toast } from "sonner";
import { FormSubmissionsType, FormSubmissionType } from "../../types/Form";
import { queryClient } from "../../lib/apiClient";
import { Search, RefreshCcw, Trash2, Loader2, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";

export default function Submissions() {
  const navigate = useNavigate();
  const params = useParams();
  const query = new URLSearchParams(location.search);
  const sortBy = query.get("sort") || "latest";
  const currentPage = query.get("page") || "1";

  const [keyword, setKeyword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<FormSubmissionType | null>(null);

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
    mutationFn: () =>
      deleteFormSubmissions(params.id || "", selectedSubmissions),
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

  const handleChangeSort = (value: string) => {
    const params = new URLSearchParams(location.search);
    params.set("sort", value);
    params.set("page", "1"); // Reset to first page on sort change
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchTerm(keyword);
    const params = new URLSearchParams(location.search);
    params.set("page", "1"); // Reset to first page on new search
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleVisitNextPage = () => {
    const params = new URLSearchParams(location.search);
    params.set(
      "page",
      (parseInt(params.get("page") || "1", 10) + 1).toString(),
    );
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleVisitPreviousPage = () => {
    const params = new URLSearchParams(location.search);
    params.set(
      "page",
      (parseInt(params.get("page") || "1", 10) - 1).toString(),
    );
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleReload = () => {
    refetch();
    toast.success("Submissions reloaded");
  };

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
    if (checked) {
      setSelectedSubmissions(
        formSubmissions.map((submission) => submission._id),
      );
    } else {
      setSelectedSubmissions([]);
    }
  };

  const handleDeleteSelectedSubmissions = () => {
    deleteSubmissionsMutation();
  };

  const handleViewSubmission = (submission: FormSubmissionType) => {
    setSelectedSubmission(submission);
    setDialogOpen(true);
  };

  const getPreviewFields = (response: Record<string, string | number>) => {
    const entries = Object.entries(response);
    return entries.slice(0, 2);
  };

  const formSubmissions: FormSubmissionsType =
    formSubmissionsData?.data?.formSubmissions || [];
  const totalPages = formSubmissionsData?.data?.totalPages || 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-5 justify-between items-center">
          <Checkbox
            checked={
              selectedSubmissions.length === formSubmissions.length &&
              formSubmissions.length > 0
            }
            onCheckedChange={handleSelectAll}
            aria-label="Select all"
          />
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 border border-neutral-500 rounded-md py-1 px-2"
          >
            <input
              type="text"
              className="text-sm w-[200px] focus:w-[400px] transition-all bg-transparent outline-none pl-1"
              placeholder="Search in submissions"
              onChange={handleSearchChange}
              value={keyword}
            />
            <button
              type="submit"
              className="bg-transparent border-none p-0"
              title="Search"
            >
              <Search size={17} />
            </button>
          </form>
          <Button
            type="button"
            variant="ghost"
            className="cursor-pointer"
            title="Refresh"
            onClick={handleReload}
          >
            <RefreshCcw size={17} />
          </Button>
          {selectedSubmissions.length !== 0 && (
            <Button
              type="button"
              variant="ghost"
              className="cursor-pointer"
              title="Delete Selected Submissions"
              onClick={handleDeleteSelectedSubmissions}
              disabled={isPending}
            >
              <Trash2 color="red" size={17} />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm">Sort by:</p>
          <Select defaultValue={sortBy} onValueChange={handleChangeSort}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {formSubmissionsLoading || isPending ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : isError ? (
        <p>Error loading submissions.</p>
      ) : formSubmissions.length === 0 ? (
        <div className="flex justify-center items-center gap-3">
          <Search height="20px" width="20px" className="stroke-neutral-400" />
          <p className="font-extralight text-neutral-400">No Results found!</p>
        </div>
      ) : (
        <>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => downloadFormSubmissionsCSV(params.id || "")}
              className="flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              Download CSV
            </Button>
          </div>
          <div className="border rounded-md">
            {formSubmissions.map((data: FormSubmissionType, index: number) => (
              <div
                key={data._id}
                className={`flex items-center p-4 ${index < formSubmissions.length - 1 ? "border-b" : ""} hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer`}
                onClick={() => {
                  handleViewSubmission(data);
                }}
              >
                <div className="mr-4">
                  <Checkbox
                    checked={selectedSubmissions.includes(data._id)}
                    onCheckedChange={() => {
                      handleCheckboxChange(data._id);
                    }}
                    aria-label="Select submission"
                  />
                </div>
                <div className="flex-col gap-2 flex-1">
                  {getPreviewFields(data.response).map(([key, value]) => (
                    <div key={key} className="flex text-sm">
                      <p className="w-24 capitalize font-medium">{key}</p>
                      <p>{value as string}</p>
                    </div>
                  ))}
                  {Object.keys(data.response).length > 2 && (
                    <p className="text-xs text-neutral-500">
                      +{Object.keys(data.response).length - 2} more fields
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={data.read ? "default" : "secondary"}>
                    {data.read ? "Read" : "Unread"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center w-full">
            <Button
              variant="outline"
              disabled={currentPage === "1"}
              onClick={handleVisitPreviousPage}
            >
              Previous
            </Button>
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
            <Button
              variant="outline"
              disabled={currentPage === totalPages.toString()}
              onClick={handleVisitNextPage}
            >
              Next
            </Button>
          </div>
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              Complete submission information
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid gap-3">
                {Object.entries(selectedSubmission.response).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="grid grid-cols-1 md:grid-cols-3 gap-2"
                    >
                      <div className="font-medium text-sm text-neutral-600 dark:text-neutral-400 capitalize">
                        {key}:
                      </div>
                      <div className="md:col-span-2 text-sm break-words">
                        {value as string}
                      </div>
                    </div>
                  ),
                )}
              </div>
              <div className="pt-4 border-t">
                <div className="text-xs text-neutral-500">
                  Submission ID: {selectedSubmission._id}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
