type FormSubmissionTemplateProps = {
  formName: string;
  formId: string;
  submissionData: Record<string, string>;
};

const formSubmissionTemplate = ({
  formName,
  formId,
  submissionData,
}: FormSubmissionTemplateProps) => {
  const submissionDataRows = Object.entries(submissionData)
    .map(
      ([key, value]) => `
      <tr>
        <td style="padding: 12px; border: 1px solid #e2e8f0; text-transform: capitalize;">${key}</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0;">${value}</td>
      </tr>
    `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Form Submission</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h1 style="color: #1a202c; margin: 0 0 16px 0; font-size: 24px;">New Form Submission</h1>
          <p style="margin: 4px 0; color: #4a5568;">
            <strong>Form Name:</strong> ${formName}
          </p>
          <p style="margin: 4px 0; color: #4a5568;">
            <strong>Form ID:</strong> ${formId}
          </p>
        </div>

        <div style="background-color: white; border-radius: 8px; padding: 24px; border: 1px solid #e2e8f0;">
          <h2 style="color: #2d3748; margin: 0 0 16px 0; font-size: 20px;">Submission Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
            <thead>
              <tr style="background-color: #f7fafc;">
                <th style="padding: 12px; border: 1px solid #e2e8f0; text-align: left;">Field</th>
                <th style="padding: 12px; border: 1px solid #e2e8f0; text-align: left;">Value</th>
              </tr>
            </thead>
            <tbody>
              ${submissionDataRows}
            </tbody>
          </table>
        </div>

        <div style="text-align: center; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
          <p style="color: #718096; font-size: 14px;">
            This is an automated email from Submitly
          </p>
        </div>
      </body>
    </html>
  `;
};

export default formSubmissionTemplate;
