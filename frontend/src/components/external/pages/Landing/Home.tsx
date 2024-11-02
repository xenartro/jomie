import "./Home.scss";
import Button from "components/common/button/Button";
import Footer from "components/common/footer/Footer";
import FlexibleGridLayout from "components/common/layout/FlexibleGridLayout";
import Header from "components/external/layout/header/Header";
import { useLoginState } from "components/internal/LoginStateContext";
import { PublicPreview } from "components/internal/app/Preview";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useLoginState();
  const { t } = useTranslation();
  return (
    <div className="Home">
      <Header />
      <FlexibleGridLayout>
        <div className="Row Home__Hero">
          <div className="Col --pos2 --size10">
            <h1>
              {t("Meet Jomie.")}
              <br /> {t("Your place in the digital world.")}
            </h1>
            <p className="p --b">
              {t("More than a link in bio. Your own personal website.")}
            </p>
            {!user ? (
              <Link to="/sign-up">
                <Button type="button">Create your Jomie Site</Button>
              </Link>
            ) : (
              <Link to="/app">
                <Button type="button">Edit your Jomie Site</Button>
              </Link>
            )}
          </div>
        </div>
      </FlexibleGridLayout>
      <div className=" Home__Content">
        <FlexibleGridLayout>
          <div className="Row">
            <div className="Col --size12">
              <h2>
                {t("Not just a “link in bio” site.")} <br />
                {t("No complex CMS.")}
              </h2>
            </div>
          </div>
          <div className="Row ">
            <div className="Col  --size2">
              <h5>{t("Basics. Who you are.")}</h5>
              <p className="p ">
                {t(
                  "Show who you are with a quick intro, photo, and a bit about yourself."
                )}
              </p>
            </div>

            <div className="Col  --size2 --pos4">
              <h5>{t("Links. All your social platforms.")}</h5>
              <p className="p ">
                {t(
                  "Keep all your social and important links in one handy place."
                )}
              </p>
            </div>

            <div className="Col  --size2 --pos7">
              <h5>{t("Photos. Capture your moments.")}</h5>
              <p className="p ">
                {t("Showcase your favorite images and memorable moments.")}
              </p>
            </div>

            <div className="Col  --size2  --pos10">
              <h5>{t("Posts. Keep your audience updated.")}</h5>
              <p className="p ">
                {t("Share your latest thoughts, projects, or updates.")}
              </p>
            </div>
          </div>
        </FlexibleGridLayout>
      </div>

      <div className="Home__Visuals">
        <FlexibleGridLayout>
          <div className="Row ">
            <div className="Col  --size8">
              <h2>
                {t("A beautiful website.")}
                <br /> {t("Your unique personality.")}
                <br />
                {t("No need to be a designer.")}
              </h2>
            </div>
          </div>

          <div className="Row ">
            <div className="Col  --size3 ">
              <h5>{t("Color palette")}</h5>
              <p className="p ">
                {t("Pick fonts that bring out your personality and style.")}
              </p>
            </div>

            <div className="Col  --size3 --pos5">
              <h5>{t("Typography")}</h5>
              <p className="p ">
                {t("Customize colors to create a unique look and feel.")}
              </p>
            </div>

            <div className="Col  --size3  --pos9">
              <h5>{t("Layouts and animations")}</h5>
              <p className="p ">
                {t(
                  "Choose between single or multi-page designs, and add a custom loading animation."
                )}
              </p>
            </div>
          </div>
        </FlexibleGridLayout>
      </div>
      <FlexibleGridLayout>
        <div className="Row Home__Jomies">
          <div className="Col  --size12">
            <h2>{t("Some Jomies")}</h2>
            <PublicPreview />
          </div>
        </div>

        <div className="Row Home__Register">
          <div className="Col --pos2 --size10">
            <h1>
              {t("Start now,")}
              <br />
              {t("it's free!")}
            </h1>
            <Link to="/sign-up">
              <Button type="button">Create your Jomie Site</Button>
            </Link>
          </div>
        </div>

        <Footer />
      </FlexibleGridLayout>
    </div>
  );
};

export default Home;
