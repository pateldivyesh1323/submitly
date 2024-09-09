import ApiKey from "../../models/FormApiKey";

const getApiKeyController = async ({ userId }: { userId: string }) => {
  let apiKey = await ApiKey.findOne({ user: userId });
  if (!apiKey) {
    apiKey = await ApiKey.create({ user: userId });
  }
  return { status: 200, message: "Success", data: apiKey };
};

const generateApiKeyController = async ({ userId }: { userId: string }) => {
  await ApiKey.findOneAndDelete({
    user: userId,
  });

  const newApiKey = await ApiKey.create({ user: userId });

  return { status: 200, message: "Success", data: newApiKey };
};

export { getApiKeyController, generateApiKeyController };
