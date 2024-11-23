import Button from "./button/Button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Privacy = () => {
  const { t } = useTranslation();
  return (
    <div className="Layout --FlexibleGrid ">
      <div className="Row ">
        <div className="Col --size6 --pos4">
          <Link to="/">
            <Button
              type="button"
              size="small"
              variant="ghost"
              icon="arrow-left"
            >
              {t("Go Back to Jomie")}
            </Button>
          </Link>
          <br />
          <br />
          <h3>{t("Privacy Policy")}</h3>

          <p>{t("Last Updated: 23/11/2024")}</p>
          <p>
            {t(
              "Welcome to Jomie.io ('the Service,' 'we,' 'us,' or 'our'). This Privacy Policy outlines how we collect, use, disclose, and protect your personal information when you access or use our web application and services. By using the Service, you consent to the practices described in this Privacy Policy."
            )}
          </p>
          <h5>{t("1. Information We Collect")}</h5>
          <p>
            {t(
              "1.1. Account Information: To create an account on our Service, we collect your email address and a user name. This information is necessary for account authentication, communication, and providing personalized features."
            )}
          </p>
          <p>
            {t(
              "1.2. Content Information: When you use the Service to create a personal website, you may upload and share personal information, images, links, and text. This content is stored securely on our servers and is used to provide the Service according to your preferences."
            )}
          </p>
          <p>
            {t(
              "1.3. Usage Data: We don't collect information about how you use the Service, including your interactions with the platform, the pages you visit, and the features you use. This data helps us improve the performance and features of the Service."
            )}
          </p>

          <h5>{t("2. How We Use Your Information")}</h5>
          <p>
            {t(
              "2.1. Providing the Service: We use the information you provide to create and manage your account, personalize your experience, and enable you to create and publish personal websites."
            )}
          </p>
          <p>
            {t(
              "2.2. Communication: We may use your email address to send you account-related notifications, updates, and important announcements."
            )}
          </p>
          <p>
            {t(
              "2.3. Improvement and Analysis: We may analyze usage patterns and user feedback to improve the Service, develop new features, and enhance user experience."
            )}
          </p>
          <p>
            {t(
              "2.4. Legal and Security: We may use your information to comply with legal obligations, enforce our Terms and Conditions, and protect the security and integrity of the Service."
            )}
          </p>

          <h5>{t("3. Data Sharing and Disclosure")}</h5>
          <p>
            {t(
              "3.1. Content Sharing: Your personal information, images, links, and text uploaded to your personal website are intended to be shared publicly according to your settings. Please be cautious about the content you upload, as it will be accessible to others."
            )}
          </p>
          <p>
            {t(
              "3.2. Service Providers: We may engage third-party service providers to assist us in delivering the Service. These providers are bound by confidentiality agreements and are not allowed to use your information for any purpose other than providing services to us."
            )}
          </p>
          <p>
            {t(
              "3.3. Legal Compliance: We may disclose your information if required by law, court order, or governmental authority."
            )}
          </p>

          <h5>{t("4. Data Security")}</h5>
          <p>
            {t(
              "4.1. We take reasonable precautions to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no data transmission over the internet can be guaranteed to be entirely secure. You use our Service at your own risk."
            )}
          </p>

          <h5>{t("5. Your Choices")}</h5>
          <p>
            {t(
              "5.1. You can manage your account information, privacy settings, and content preferences within the Service."
            )}
          </p>
          <p>
            {t(
              "5.2. You have the right to access, correct, or delete the personal information we hold about you. Contact us at [contact email] for assistance."
            )}
          </p>

          <h5>{t("6. Children's Privacy")}</h5>
          <p>
            {t(
              "6.1. Our Service is not intended for users under the age of 13. If we become aware that we have collected personal information from a child under 13 without parental consent, we will take steps to remove that information."
            )}
          </p>

          <h5>{t("7. Changes to Privacy Policy")}</h5>
          <p>
            {t(
              "7.1. We may update this Privacy Policy from time to time. We will provide notice of any material changes on our platform or by email."
            )}
          </p>

          <h5>{t("8. Contact Us")}</h5>
          <p>
            {t(
              "8.1. If you have questions or concerns about this Privacy Policy, please "
            )}
            <Link to="/help-and-contact">{t("contact us")}</Link>.
          </p>

          <p>
            {t(
              "By using the Service, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and disclosure of your personal information as described herein."
            )}
          </p>
          <br />
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default Privacy;
