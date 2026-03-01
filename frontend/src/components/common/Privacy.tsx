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

          <p>{t("Last Updated: March 1, 2026")}</p>
          <h5>{t("1. Data Controller")}</h5>

          <p>{t("The data controller responsible for the processing of personal data through the Service is:")}</p>

          <p>{t("Email: support@jomie.io")}</p>

          <p>{t("If you have any questions about this Privacy Policy or how your data is handled, you may contact us at the email address above.")}</p>
          

          <h5>{t("2. Personal Data We Process")}</h5>

          <p>{t("We process the following categories of personal data:")}</p>

          <h5>2.1 {t("Account Information")}</h5>

          <p>{t("When account registration is available, we collect:")}</p>

          <ul>
            <li>{t("Email address")}</li>
            <li>{t("Username")}</li>
          </ul>

          <p>{t("This data is necessary to create and manage your account.")}</p>

          <h5>2.2 {t("User Content")}</h5>

          <p>{t("When you create a personal website using the Service, we store the content you choose to publish, which may include:")}</p>

          <ul>
            <li>{t("Text")}</li>
            <li>{t("Images")}</li>
            <li>{t("Links")}</li>
            <li>{t("Personal information you decide to make public")}</li>
          </ul>

          <p>{t("You are responsible for ensuring that any personal data you publish is shared lawfully.")}</p>

          <h5>2.3 {t("Technical Data")}</h5>

          <p>{t("When you access the Service, our servers may automatically process limited technical data such as:")}</p>

          <ul>
            <li>{t("IP address")}</li>
            <li>{t("Browser type")}</li>
            <li>{t("Device information")}</li>
            <li>{t("Date and time of access")}</li>
          </ul>

          <h5>2.4 {t("Analytics Data")}</h5>

          <p>{t("We use limited analytics tools to understand general website traffic and improve performance. This may involve processing IP addresses or basic device information. We do not create marketing profiles and do not track users across third-party websites.")}</p>

          <p>{t("The analytics solution used does not rely on tracking cookies.")}</p>

          <h5>{t("3. Legal Basis for Processing")}</h5>

          <p>{t("We process personal data on the following legal bases under Article 6 GDPR:")}</p>

          <ul>
            <li>{t("Performance of a contract (Art. 6(1)(b)) – to create and manage user accounts and provide the Service.")}</li>
            <li>{t("Legitimate interests (Art. 6(1)(f)) – to ensure security, prevent abuse, maintain system integrity, and improve the Service.")}</li>
            <li>{t("Legal obligation (Art. 6(1)(c)) – where required by applicable law.")}</li>
          </ul>

          <p>{t("Where consent is required (for example, for non-essential cookies), it will be obtained separately.")}</p>

          <h5>{t("4. Data Sharing")}</h5>

          <p>{t("We do not sell personal data.")}</p>

          <p>{t("We may share data with:")}</p>

          <ul>
            <li>{t("Hosting providers")}</li>

          <li>{t("Infrastructure and technical service providers")}</li>

            <li>{t("Analytics providers")}</li>
          </ul>

          <p>{t("These providers act as data processors and are contractually bound to process data only on our instructions and in accordance with applicable data protection laws.")}</p>

          <p>{t("We may also disclose data if required by law or by a competent public authority.")}</p>

          <h5>{t("5. International Data Transfers")}</h5>

          <p>{t("Where personal data is transferred outside the European Economic Area (EEA), we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the European Commission.")}</p>

          <h5>{t("6. Data Retention")}</h5>

          <p>{t("We retain personal data only for as long as necessary to:")}</p>

          <ul>
            <li>{t("Provide the Service")}</li>
            <li>{t("Maintain security and system integrity")}</li>
            <li>{t("Comply with legal obligations")}</li>
          </ul>

          <p>{t("When you delete your account, we will delete or anonymize your personal data within a reasonable period, unless retention is required by law.")}</p>

          <p>{t("Server logs are retained for a limited period for security purposes.")}</p>

          <h5>{t("7. Your Rights")}</h5>

          <p>{t("Under the GDPR, you have the right to:")}</p>

          <ul>
            <li>{t("Access your personal data")}</li>
            <li>{t("Rectify inaccurate data")}</li>
            <li>{t("Request erasure (“right to be forgotten”)")}</li>
            <li>{t("Restrict processing")}</li>
            <li>{t("Object to processing based on legitimate interests")}</li>
            <li>{t("Request data portability (where applicable)")}</li>
          </ul>

          <p>{t("You may exercise your rights by contacting us at support@jomie.io")}</p>

          <h5>{t("8. Data Security")}</h5>

          <p>{t("We implement reasonable technical and organizational measures to protect personal data against unauthorized access, alteration, disclosure, or destruction.")}</p>

          <p>{t("However, no system can guarantee absolute security.")}</p>

          <h5>{t("9. Children")}</h5>

          <p>{t("The Service is not intended for individuals under the age of 16. If we become aware that personal data of a child under 16 has been collected without appropriate authorization, we will delete it.")}</p>

          <h5>{t("10. Changes to This Policy")}</h5>

          <p>{t("We may update this Privacy Policy from time to time for legal, technical, or operational reasons. Where changes are material, we will provide appropriate notice within the Service.")}</p>

          <br />
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default Privacy;
