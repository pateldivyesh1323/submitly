import FormApiKey from "../../models/FormApiKey";

const getApiKeyController = async ({ userId }: { userId: string }) => {
  let apiKey = await FormApiKey.findOne({ user: userId });
  if (!apiKey) {
    apiKey = await FormApiKey.create({ user: userId });
  }
  return { status: 200, message: "Success", data: apiKey };
};

const generateApiKeyController = async ({ userId }: { userId: string }) => {
  await FormApiKey.findOneAndDelete({
    user: userId,
  });

  const newApiKey = await FormApiKey.create({ user: userId });
  console.log(newApiKey);
  return { status: 200, message: "Success", data: newApiKey };
};

export { getApiKeyController, generateApiKeyController };
