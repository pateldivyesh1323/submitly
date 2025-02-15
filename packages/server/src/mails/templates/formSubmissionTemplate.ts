const formSubmissionTemplate = (
  formName: string,
  formUrl: string,
  submissionData: any,
) => {
  return `
    <div>
      <h1>Form Submission</h1>
      <p>Form Name: ${formName}</p>
      <p>Form URL: ${formUrl}</p>
      <p>Submission Data: ${submissionData}</p>
    </div>
  `;
};

export default formSubmissionTemplate;
