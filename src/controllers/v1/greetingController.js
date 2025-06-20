import { fetchGreetingAsync, detectLanguage } from "../../clients/greetingClient.js";
import { fetchPersonAsync } from "../../clients/personClient.js";

export const greet = async (req, res, next) => {
  try {
    let acceptedLanguages = req.headers["accept-language"]?.split(",") || [];
    acceptedLanguages = acceptedLanguages.map((lang) => lang.split(";")[0].trim().toUpperCase().replace(/-/g, "_")); // Normalize languages

    const language = detectLanguage(acceptedLanguages);
    const uuid = req.query.personID || req.params.personID;

    const [greetingResponse, personResponse] = await Promise.all([
      fetchGreetingAsync({ language }),
      fetchPersonAsync({ uuid }),
    ]);

    let defaultAudience;

    if (/^ES/.test(language)) {
      defaultAudience = "Mundo";
    } else if (/^FR/.test(language)) {
      defaultAudience = "Monde";
    } else {
      defaultAudience = "HelloWorld";
    }

    res.status(200).json({
      data: {
        language: greetingResponse.language,
        greeting: greetingResponse.greeting,
        audience: personResponse.name || defaultAudience,
      },
    });
  } catch (error) {
    next(error);
  }
};
