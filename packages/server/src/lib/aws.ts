import { SES } from "@aws-sdk/client-ses";
import environments from "../environments";

export const ses = new SES({
  credentials: {
    accessKeyId: environments.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: environments.AWS_SECRET_ACCESS_KEY as string,
  },

  region: environments.AWS_REGION as string,
});
