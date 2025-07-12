import { useQuery } from "@tanstack/react-query";
import { GET_FORMS } from "../lib/constants";
import { getForms } from "../queries/form";
import { FormType } from "../types/Form";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import CreateForm from "./CreateForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function FormsListing() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: [GET_FORMS],
    queryFn: getForms,
  });

  const formsData = data?.data;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle>Your forms</CardTitle>
          <CreateForm />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Form name</TableHead>
              <TableHead>Form ID</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-5" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5" />
                  </TableCell>
                </TableRow>
              ))
            ) : formsData && formsData.length !== 0 ? (
              formsData.map((data: FormType) => (
                <TableRow key={data.formId}>
                  <TableCell>{data.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <p>{data.formId}</p>
                      <Copy
                        className="cursor-pointer w-4 h-4"
                        onClick={() => {
                          navigator.clipboard.writeText(data.formId);
                          toast.success("Copied to clipboard");
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="default"
                      className="cursor-pointer"
                      onClick={() => {
                        navigate(`/form/${data.formId}`);
                      }}
                    >
                      Visit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No forms to show
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
