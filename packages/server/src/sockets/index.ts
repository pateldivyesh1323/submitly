import { Namespace, Server } from "socket.io";
import setupFormNamespace from "./form";

let formNamespace: Namespace;
function setupSocketIO(io: Server) {
  formNamespace = io.of("/form");
  setupFormNamespace(formNamespace);
}

export { setupSocketIO, formNamespace };
