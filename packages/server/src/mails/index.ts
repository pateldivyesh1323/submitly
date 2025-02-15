import { SendEmailRequest } from "@aws-sdk/client-ses";
import environments from "../environments";
import { ses } from "../lib/aws";

type EmailParams = {
  to: string[];
  subject: string;
  html?: string;
  text?: string;
};

export const sendEmail = async ({ to, subject, html, text }: EmailParams) => {
  const params: SendEmailRequest = {
    Destination: {
      ToAddresses: to,
    },
    Message: {
      Body: {
        Html: {
          Data: html || "",
        },
        Text: {
          Data: text || "",
        },
      },
      Subject: {
        Data: subject,
      },
    },
    Source: environments.AWS_SES_FROM_EMAIL || "",
  };

  try {
    const result = await ses.sendEmail(params);
    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
