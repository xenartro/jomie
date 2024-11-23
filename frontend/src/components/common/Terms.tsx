import Button from "./button/Button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Terms = () => {
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
          <h3>{t("Terms and Conditions")}</h3>

          <p>{t("Last Updated: 23/11/2024")}</p>
          <p>
            {t(
              "Welcome to Jomie.io ('the Service,' 'we,' 'us,' or 'our'). By accessing or using our web application and services, you ('user,' 'you,' or 'your') agree to comply with and be bound by the following terms and conditions ('Terms'). Please read these Terms carefully before using the Service. If you do not agree with these Terms, you should not use the Service."
            )}
          </p>
          <h5>{t("1. Account Creation and Usage")}</h5>
          <p>
            {t(
              "1.1. To use our Service, you must create an account. You agree to provide accurate, complete, and up-to-date information during the registration process. You are responsible for maintaining the security of your account and password. You shall not share your account credentials with any third party."
            )}
          </p>
          <p>
            {t(
              "1.2. You must be at least 13 years of age to create an account and use the Service. If you are under 16, you may use the Service only with the involvement and consent of a parent or guardian."
            )}
          </p>
          <p>
            {t(
              "1.3. You are solely responsible for the content you publish on your personal website created through the Service. You agree not to upload, post, or transmit any content that is unlawful, harmful, abusive, defamatory, or otherwise objectionable. You may not use the Service to publish content that violates applicable laws, promotes hate speech, or contains malicious software."
            )}
          </p>
          <h5>{t("2. Content Ownership and Rights")}</h5>
          <p>
            {t(
              "2.1. You retain full ownership of all content (text, images, links, or other materials) you upload, post, or transmit through the Service (‘User Content’). By submitting User Content, you grant Jomie.io a worldwide, non-exclusive, royalty-free, revocable license to use, host, store, reproduce, and display your content, strictly for the purpose of operating, improving, and providing the Service. This license will end when you delete the User Content from the Service, except to the extent that such content has been shared with others who have not deleted it or where retention is required by law or for legitimate business purposes (e.g., backups)."
            )}
          </p>
          <p>
            {t(
              "2.2. You represent and warrant that you own or have obtained all necessary rights, licenses, and permissions to submit User Content through the Service. You agree not to upload, post, or share any content that:"
            )}
          </p>
          <ul>
            <li>{t("Infringes upon third-party copyrights, trademarks, patents, or other intellectual property rights.")}</li>
            <li>{t("Violates any applicable laws or regulations.")}</li>
            <li>{t("Contains unauthorized or harmful material, such as viruses or malicious code.")}</li>
          </ul>

          <h5>{t("3. Privacy and Data Collection")}</h5>
          <p>
            {t(
              "All personal data collected through the Service will be processed in compliance with the General Data Protection Regulation (GDPR) data protection law. Users have the right to access, rectify, delete, restrict, and object to the processing of their personal data."
            )}
          </p>
          <p>
            {t(
              "3.2. We may collect certain usage information and analytics data to improve the performance and features of the Service."
            )}
          </p>

          <h5>{t("4. Termination")}</h5>
          <p>
            {t(
              "4.1. We reserve the right to terminate or suspend your account and access to the Service, at our sole discretion, for any reason, including but not limited to a breach of these Terms or engaging in any activities that may harm the integrity of the Service."
            )}
          </p>

          <h5>{t("5. Disclaimer of Warranties")}</h5>
          <p>
            {t(
              "5.1. The Service is provided on an 'as-is' and 'as-available' basis. We make no warranties or representations regarding the availability, accuracy, reliability, or suitability of the Service for your specific needs."
            )}
          </p>

          <h5>{t("6. Limitation of Liability")}</h5>
          <p>
            {t(
              "6.1. In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, arising out of your use of the Service."
            )}
          </p>

          <h5>{t("7. Modifications to Terms and Service")}</h5>
          <p>
            {t(
              "7.1. We will notify users of material changes to these Terms at least 30 days in advance through email or a prominent notice within the Service. Continued use of the Service after the updated Terms become effective constitutes acceptance."
            )}
          </p>

          <h5>{t("8. Governing Law")}</h5>
          <p>
            {t(
              "8.1. These Terms are governed by and construed in accordance with the laws of Spain, without regard to its conflict of law principles."
            )}
          </p>

          <h5>{t("9. Contact Us")}</h5>
          <p>
            {t("9.1. If you have any questions about these Terms, please ")}
            <Link to="/help-and-contact">{t("contact us")}</Link>.
          </p>

          <p>
            {t(
              "By using the Service, you acknowledge that you have read and understood these Terms and agree to be bound by them."
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

export default Terms;
