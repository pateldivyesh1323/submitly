import { useParams } from "react-router-dom";

export default function FormPage() {
  const params = useParams();

  return (
    <div>
      <h1>{params.id}</h1>
    </div>
  );
}
