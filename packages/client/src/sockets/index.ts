import environments from "@/environments";
import { io, type Socket } from "socket.io-client";
import { getStoredAccessToken } from "@/context/AuthContext";

let formSocket: Socket | null = null;
let isConnecting = false;

const getFormSocket = async (): Promise<Socket> => {
  if (formSocket && formSocket.connected) {
    return formSocket;
  }

  if (isConnecting) {
    while (isConnecting) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (formSocket && formSocket.connected) {
      return formSocket;
    }
  }

  if (formSocket) {
    formSocket.removeAllListeners();
    formSocket.disconnect();
    formSocket = null;
  }

  try {
    isConnecting = true;

    const token = getStoredAccessToken();

    if (!token) {
      throw new Error(
        "No authentication token found. User must be authenticated to connect to form.",
      );
    }

    formSocket = io(environments.VITE_SERVER_URL + "/form", {
      withCredentials: true,
      auth: {
        token,
      },
    });

    return formSocket;
  } finally {
    isConnecting = false;
  }
};

const disconnectFormSocket = (): void => {
  if (formSocket) {
    formSocket.removeAllListeners();
    formSocket.disconnect();
    formSocket = null;
  }
  isConnecting = false;
};

const reconnectFormSocket = async (): Promise<Socket> => {
  disconnectFormSocket();
  return await getFormSocket();
};

export { getFormSocket, disconnectFormSocket, reconnectFormSocket };
