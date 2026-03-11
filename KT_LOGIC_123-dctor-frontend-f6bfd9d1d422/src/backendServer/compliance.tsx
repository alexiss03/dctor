import { get } from ".";

type ComplianceData = {
  title: string;
  body: string;
};

export async function getTermsOfService() {
  try {
    const response = await get<ComplianceData>(
      `resources/resource/dctor/terms-of-service.json`
    );

    if ("error" in response) {
      return null;
    }

    return {
      title: response.data.title as string,
      body: response.data.body as string,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getPrivacyPolicy() {
  try {
    const response = await get<ComplianceData>(
      `resources/resource/dctor/privacy-policy.json`
    );

    if ("error" in response) {
      return null;
    }

    return {
      title: response.data.title as string,
      body: response.data.body as string,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}
