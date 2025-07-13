import { Server } from "socket.io";
import setupFormNamespace from "./form";

export default function setupSocketIO(io: Server) {
  const formNamespace = io.of("/form");
  setupFormNamespace(formNamespace);
}
