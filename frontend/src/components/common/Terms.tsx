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

          <p>{t("Last Updated: March 1, 2026")}</p>
          <p>
            {t(
              "Welcome to Jomie.io ('the Service,' 'we,' 'us,' or 'our'). By accessing or using our web application and services, you ('user,' 'you,' or 'your') agree to comply with and be bound by the following terms and conditions ('Terms'). Please read these Terms carefully before using the Service. If you do not agree with these Terms, you should not use the Service."
            )}
          </p>
          <h5>{t("1. Account Creation and Usage")}</h5>
          <p>
            {t(
              "1.1. To use our Service, when account creation is available, you must create an account. You agree to provide accurate, complete, and up-to-date information during the registration process. You are responsible for maintaining the security of your account and password. You shall not share your account credentials with any third party."
            )}
          </p>
          <p>
            {t(
              "1.2. You must be at least 16 years of age to create an account and use the Service, and the Service is not intended for children under 16. By creating an account, you represent and warrant that you are at least 16 years old. If we become aware that a child under 16 is using the Service, we may suspend or terminate the account."
            )}
          </p>
          <p>
            {t(
              "1.3. You are solely responsible for the content you publish on your personal website created through the Service. You agree not to upload, post, or transmit any content that is unlawful, harmful, abusive, defamatory, or otherwise objectionable. You may not use the Service to publish content that violates applicable laws, promotes hate speech, or contains malicious software."
            )}
          </p>
          <p>
            {t(
              "1.4. You may use the Service for both personal and small-scale commercial purposes (for example, to promote your freelance work, creative projects, or business), provided that you comply with these Terms and all applicable laws. We do not become a party to any contract between you and your visitors or customers, and you are solely responsible for meeting any obligations arising from your commercial activities (including consumer, tax, and information duties)."
            )}
          </p>
          <p>{t("1.5. Prohibited Uses")}</p>
          <p>{t("You may not use the Service to:")}</p>
          <ul>
            <li>
              {t(
                "(a) Publish or distribute illegal content under Spanish, EU, or applicable law;"
              )}
            </li>
            <li>
              {t("(b) Publish pornographic or sexually explicit content;")}
            </li>
            <li>
              {t(
                "(c) Promote terrorism, violence, or criminal activity;"
              )}
            </li>
            <li>
              {t(
                "(d) Impersonate any person or entity or misrepresent your identity;"
              )}
            </li>
            <li>
              {t(
                "(e) Distribute spam, phishing pages, scams, or fraudulent content;"
              )}
            </li>
            <li>
              {t(
                "(f) Upload or distribute malware or malicious code;"
              )}
            </li>
            <li>
              {t(
                "(g) Attempt to gain unauthorized access to the Service, its servers, or related systems;"
              )}
            </li>
            <li>
              {t(
                "(h) Interfere with or disrupt the integrity, security, or performance of the Service."
              )}
            </li>
          </ul>
          <p>
            {t(
              "We reserve the right to suspend or terminate accounts involved in such activities."
            )}
          </p>
          <h5>{t("2. Content Ownership and Rights")}</h5>
          <p>
            {t(
              "2.1. You retain full ownership of all content (text, images, links, or other materials) you upload, post, or transmit through the Service ('User Content'). By submitting User Content, you grant Jomie.io a worldwide, non-exclusive, royalty-free, revocable license to use, host, store, reproduce, and display your content, strictly for the purpose of operating, improving, and providing the Service. This license will end when you delete the User Content from the Service, except to the extent that such content has been shared with others who have not deleted it or where retention is required by law or for legitimate business purposes (e.g., backups)."
            )}
          </p>
          <p>
            2.2.{" "}
            {t(
              "You represent and warrant that you own or have obtained all necessary rights, licenses, and permissions to submit User Content through the Service. You agree not to upload, post, or share any content that:"
            )}
          </p>
          <ul>
            <li>
              {t(
                "Infringes upon third-party copyrights, trademarks, patents, or other intellectual property rights."
              )}
            </li>
            <li>{t("Violates any applicable laws or regulations.")}</li>
            <li>
              {t(
                "Contains unauthorized or harmful material, such as viruses or malicious code."
              )}
            </li>
          </ul>
          <p>
            {t(
              "2.3. You are responsible for ensuring that any personal data you include in your User Content (for example, about yourself or other individuals) is shared lawfully and with any necessary permissions or consents. We do not actively monitor all User Content and are not responsible for what you choose to publish. However, we reserve the right (but are not obliged) to remove or disable access to any User Content that we reasonably believe violates these Terms, applicable law, or the rights of others, including when such content is reported to us."
            )}
          </p>

          <h5>{t("3. Privacy and Data Collection")}</h5>
          <p>
            {t(
              "3.1. We process personal data in accordance with applicable data protection laws, including, where applicable, the General Data Protection Regulation (GDPR). Users have the right to access, rectify, delete, restrict, and object to the processing of their personal data, as described in our Privacy Policy."
            )}
          </p>
          <p>
            {t(
              "3.2. We may collect limited technical and usage information (such as IP address, browser type, and basic log data) that is necessary to operate, secure, and improve the Service. We do not use this information to create marketing profiles or track you across third-party websites."
            )}
          </p>

          <h5>{t("4. Termination")}</h5>
          <p>
            {t(
              "4.1. We reserve the right to terminate or suspend your account and access to the Service, for objective and reasonable reasons, including but not limited to a breach of these Terms or engaging in any activities that may harm the integrity of the Service."
            )}
          </p>

          <h5>{t("5. Disclaimer of Warranties")}</h5>
          <p>
            {t(
              "5.1. The Service is provided on an 'as-is' and 'as-available' basis. We make no warranties or representations regarding the availability, accuracy, reliability, or suitability of the Service for your specific needs."
            )}
          </p>
          <p>
            {t(
              "5.2. We do not guarantee uninterrupted availability of the Service or indefinite storage of User Content. Users are responsible for maintaining their own backups of any content they consider important."
            )}
          </p>

          <h5>{t("6. Limitation of Liability")}</h5>
          <p>
            {t(
              "6.1. To the maximum extent permitted by applicable law and subject to clause 6.2, in no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, arising out of your use of the Service."
            )}
          </p>
          <p>
            {t(
              "6.2. Nothing in these Terms excludes or limits any liability that cannot be excluded or limited under applicable law, including liability for gross negligence or willful misconduct."
            )}
          </p>
          <p>
            {t(
              "6.3. Subject to clause 6.2 and to the maximum extent permitted by law, our total aggregate liability arising out of or in connection with the Service or these Terms, whether in contract, tort (including negligence) or otherwise, shall be limited to the greater of (a) the total fees you have paid us for access to the Service during the twelve (12) months immediately preceding the event giving rise to the claim, and (b) fifty (50) euros (€50)."
            )}
          </p>

          <h5>{t("7. Indemnity")}</h5>
          <p>
            {t(
              "7.1. You agree to indemnify and hold harmless Jomie.io and its owners, employees, and contractors from and against any claims, damages, liabilities, costs, and expenses (including reasonable legal fees) arising out of or in connection with (a) your use of the Service, (b) your User Content, or (c) your breach of these Terms or applicable law. This indemnity does not require you to compensate us for any loss to the extent caused by our own gross negligence or willful misconduct."
            )}
          </p>

          <h5>{t("8. Force Majeure")}</h5>
          <p>
            {t(
              "8.1. We will not be liable for any failure or delay in the performance of our obligations under these Terms to the extent caused by circumstances beyond our reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, riots, strikes or labour disputes, internet or telecommunications failures, or actions of public authorities."
            )}
          </p>

          <h5>{t("9. Copyright and Intellectual Property Notices")}</h5>
          <p>
          9.1. 
            {t(
              "If you believe that content hosted on the Service infringes your copyright or other intellectual property rights, you may submit a notice to us via the contact form at /help-and-contact (or by any other contact method indicated there), providing at least: (a) a description of the protected work you claim has been infringed, (b) the URL or other precise location of the allegedly infringing content, (c) your contact details, and (d) a statement that you have a good-faith belief that the use is not authorized and that the information in your notice is accurate."
            )}
          </p>
          <p>
            {t(
              "9.2. We will review such notices and, where appropriate, remove or restrict access to the reported content and, if possible, inform the user who posted it. We may also request additional information from you to process your request."
            )}
          </p>

          <h5>{t("10. Illegal Content and Reporting Mechanism")}</h5>
          <p>
            {t(
              "10.1. You and third parties may report content that you consider to be illegal or in breach of these Terms by using the contact options available at /help-and-contact or any in-product reporting tools we may provide. Please include enough information for us to identify the content and understand the nature of your concern."
            )}
          </p>
          <p>
            {t(
              "10.2. We will assess reports in a timely and diligent manner, taking into account our legal obligations under the EU Digital Services Act (where applicable), and will take appropriate action, which may include removing or restricting access to content or suspending user accounts."
            )}
          </p>
          <p>
            {t(
              "10.3. Where required by law, we will inform you of the reasons for any such decisions and provide information on available redress or complaint mechanisms."
            )}
          </p>

          <h5>{t("11. Modifications to Terms and Service")}</h5>
          <p>
            {t(
              "11.1. We may update these Terms from time to time for legal, technical, security, or operational reasons."
            )}
          </p>
          <p>
            {t(
              "11.2. Where changes are material, we will notify users at least thirty (30) days before the changes take effect, by email and/or through a prominent notice within the Service."
            )}
          </p>
          <p>
            {t(
              "11.3. If you do not agree with the updated Terms, you may stop using the Service and delete your account before the effective date. Continued use of the Service after the effective date constitutes acceptance of the revised Terms."
            )}
          </p>
          <p>
            {t(
              "11.4. We may modify, suspend, or discontinue all or part of the Service (including specific features or content) at any time for legal, technical, security, or business reasons. Where reasonably practicable and where the change materially affects users, we will provide prior notice."
            )}
          </p>
          <p>
            {t(
              "11.5. We will retain prior versions of these Terms for reference upon request."
            )}
          </p>

          <h5>{t("12. Governing Law and Jurisdiction")}</h5>
          <p>
            {t(
              "12.1. These Terms are governed by and construed in accordance with the laws of Spain, without regard to its conflict of law principles."
            )}
          </p>
          <p>
            {t(
              "12.2. Subject to any mandatory consumer protection rules that provide you with a different place of jurisdiction, any dispute arising out of or in connection with these Terms or the Service shall be submitted to the exclusive jurisdiction of the courts of Málaga, Spain."
            )}
          </p>

          <h5>{t("13. Contact Us")}</h5>
          <p>
            {t("13.1. If you have any questions about these Terms, please ")}
            <Link to="/help-and-contact">{t("contact us")}</Link>.
          </p>

          <h5>{t("14. No Editorial Control")}</h5>
          <p>
            {t(
              "14.1. Jomie.io provides a neutral technical platform that enables users to create and publish personal websites."
            )}
          </p>
          <p>
            {t(
              "14.2. We do not pre-screen or actively monitor all User Content and do not endorse, verify, or guarantee the accuracy, legality, or reliability of any content published by users."
            )}
          </p>
          <p>
            {t(
              "14.3. To the maximum extent permitted by law, we are not responsible for User Content or for any damages resulting from reliance on such content."
            )}
          </p>
          <p>
            {t(
              "14.4. We reserve the right (but are not obliged) to remove or restrict access to content that violates these Terms or applicable law."
            )}
          </p>

          <h5>{t("15. Discontinuation of Service")}</h5>
          <p>
            {t(
              "15.1. We may discontinue the Service entirely at any time for legal, technical, security, or business reasons."
            )}
          </p>
          <p>
            {t(
              "15.2. Where reasonably practicable, we will provide prior notice and allow users a reasonable period to retrieve their User Content before permanent deletion."
            )}
          </p>
          <p>
            {t(
              "15.3. After discontinuation, we may delete User Content in accordance with applicable data protection laws."
            )}
          </p>

          <h5>{t("16. Severability")}</h5>
          <p>
            {t(
              "If any provision of these Terms is found to be invalid or unenforceable under applicable law, the remaining provisions shall remain in full force and effect."
            )}
          </p>

          <h5>{t("17. Consumer Rights")}</h5>
          <p>
            {t(
              "Nothing in these Terms limits or excludes any mandatory rights that users may have under applicable consumer protection laws."
            )}
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
