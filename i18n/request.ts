import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

// Supported locales
const supportedLocales = ['en', 'hin', 'odi'] as const;
const defaultLocale = 'en';

export default getRequestConfig(async () => {
  // Try to get locale from cookie first
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("MYNEXTAPP_LOCALE")?.value;
  
  let locale = cookieLocale || defaultLocale;
  
  // Validate if the locale is supported
  if (!supportedLocales.includes(locale as any)) {
    locale = defaultLocale;
  }
  
  // For initial visit without cookie, use Accept-Language header
  if (!cookieLocale) {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language');
    if (acceptLanguage) {
      const browserLocale = acceptLanguage.split(',')[0]?.split('-')[0];
      if (browserLocale && supportedLocales.includes(browserLocale as any)) {
        locale = browserLocale;
      }
    }
  }

  // Load messages with error handling
  let messages;
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    console.warn(`Messages for locale ${locale} not found, falling back to ${defaultLocale}`);
    messages = (await import(`../messages/${defaultLocale}.json`)).default;
    locale = defaultLocale;
  }

  return {
    locale,
    messages,
  };
});