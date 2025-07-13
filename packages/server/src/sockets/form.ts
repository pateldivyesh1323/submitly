import { Namespace, Socket } from "socket.io";
import { socketAuthMiddleware } from "../middlewares/authMiddleware";
import Form from "../models/Form";
import { NotFoundError } from "../middlewares/error-handler";
import { markAsReadController } from "../controller/formSubmission";

export default function setupFormNamespace(namespace: Namespace) {
  namespace.use(socketAuthMiddleware);

  namespace.on("connection", (socket: Socket) => {
    socket.on("join-form", async (formId: string) => {
      const user = socket.data.user;
      const form = await Form.findOne({ formId, userId: user._id });
      if (!form) {
        throw new NotFoundError("Form not found");
      }
      socket.join(formId);
    });

    socket.on("leave-form", (formId: string) => {
      socket.leave(formId);
    });

    socket.on("mark-as-read", async ({ formId, submissionId }) => {
      const user = socket.data.user;

      const form = await Form.findOne({ formId, userId: user._id });

      if (!form) {
        throw new NotFoundError("Form not found");
      }

      await markAsReadController({
        formId,
        userId: user._id,
        submissionId,
      });
    });
  });
}
