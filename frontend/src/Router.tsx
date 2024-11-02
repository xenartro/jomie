import Feedback from "components/common/Feedback";
import FourZeroFour from "components/common/FourZeroFour";
import HelpAndContact from "components/common/HelpAndContact";
import Privacy from "components/common/Privacy";
import RedirectToHomePage from "components/common/RedirectToHomePage";
import Terms from "components/common/Terms";
import Home from "components/external/pages/Landing/Home";
import Login from "components/external/pages/Login";
import SignUp from "components/external/pages/SignUp";
import { useLoginState } from "components/internal/LoginStateContext";
import App from "components/internal/app/App";
import DevPreview from "components/internal/app/DevPreview";
import Logout from "components/internal/app/Logout";
import ContentBasics from "components/internal/app/content/basics/Basics";
import ContentBlog from "components/internal/app/content/blog/Blog";
import ContentEditor from "components/internal/app/content/editor/Editor";
import ContentLinks from "components/internal/app/content/links/Links";
import ContentPhotos from "components/internal/app/content/photos/Photos";
import CreateColorFlow from "components/internal/app/create/create-flow/CreateColorFlow";
import CreateTypeFlow from "components/internal/app/create/create-flow/CreateTypeFlow";
import CreatePaletteAccent from "components/internal/app/create/palette/CreatePaletteAccent";
import CreatePaletteConfirm from "components/internal/app/create/palette/CreatePaletteConfirm";
import CreatePaletteStart from "components/internal/app/create/palette/CreatePaletteStart";
import PostEditor from "components/internal/app/create/post-editor/PostEditor";
import CreatePost from "components/internal/app/create/posts/Post";
import CreateTypeContrast from "components/internal/app/create/type/CreateTypeContrast";
import CreateTypeFamilies from "components/internal/app/create/type/CreateTypeFamilies";
import CreateTypeShape from "components/internal/app/create/type/CreateTypeShape";
import AppIndex from "components/internal/app/index/Index";
import VisualsLayouts from "components/internal/app/visuals/layouts/Layouts";
import VisualsPalette from "components/internal/app/visuals/palette/Palette";
import VisualsType from "components/internal/app/visuals/type/Type";
import IdentityType from "components/internal/first-time/IdentityType";
import InitialSetup from "components/internal/first-time/InitialSetup";
import UpdateFrequency from "components/internal/first-time/UpdateFrequency";
import UsageType from "components/internal/first-time/UsageType";
import AccountSettings from "components/internal/settings/Account/Account";
import Settings from "components/internal/settings/Settings";
import SiteSettings from "components/internal/settings/Site/Site";
import { Routes, Route } from "react-router-dom";

const Router = () => {
  const { user } = useLoginState();
  return (
    <Routes>
      {/* External */}
      <Route path="/" element={<Home />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/help-and-contact" element={<HelpAndContact />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      {!user && <Route path="/logout" element={<RedirectToHomePage />} />}

      {/* Internal */}
      {/* App */}
      {import.meta.env.DEV && <Route path="/render" element={<DevPreview />} />}
      {user && <Route path="/logout" element={<Logout />} />}
      {/* Routes inside /app will have navigation */}
      {user && (
        <Route path="/app" element={<App />}>
          <Route index element={<AppIndex />} />
          <Route path="/app/content" element={<ContentEditor />}>
            <Route index element={<ContentBasics />} />
            <Route path="basics" element={<ContentBasics />} />
            <Route path="posts" element={<ContentBlog />} />
            <Route path="photos" element={<ContentPhotos />} />
            <Route path="links" element={<ContentLinks />} />
          </Route>
          <Route path="/app/visuals" element={<ContentEditor />}>
            <Route index element={<VisualsPalette />} />
            <Route path="palette" element={<VisualsPalette />} />
            <Route path="layout" element={<VisualsLayouts />} />
            <Route path="font" element={<VisualsType />} />
          </Route>
          <Route path="/app/settings" element={<Settings />}>
            <Route index element={<SiteSettings />} />
            <Route path="account" element={<AccountSettings />} />
          </Route>
          <Route path="*" element={<FourZeroFour />} />
        </Route>
      )}
      {/* Prefix all internal routes with /app to help deal with unuthenticated redirects */}
      {user && (
        <Route path="/app/create/palette" element={<CreateColorFlow />}>
          <Route index element={<CreatePaletteStart />} />
          <Route path="accent" element={<CreatePaletteAccent />} />
          <Route path="confirm" element={<CreatePaletteConfirm />} />
        </Route>
      )}
      {user && (
        <Route path="/app/edit/palette/:id" element={<CreateColorFlow />}>
          <Route index element={<CreatePaletteStart />} />
          <Route path="accent" element={<CreatePaletteAccent />} />
          <Route path="confirm" element={<CreatePaletteConfirm />} />
        </Route>
      )}
      {user && (
        <Route path="/app/create/type" element={<CreateTypeFlow />}>
          <Route index element={<CreateTypeShape />} />
          <Route path="contrast" element={<CreateTypeContrast />} />
          <Route path="families" element={<CreateTypeFamilies />} />
        </Route>
      )}
      {user && (
        <Route path="/app/edit/type/:id" element={<CreateTypeFlow />}>
          <Route index element={<CreateTypeShape />} />
          <Route path="contrast" element={<CreateTypeContrast />} />
          <Route path="families" element={<CreateTypeFamilies />} />
        </Route>
      )}
      {user && (
        <Route path="/app/create/post" element={<PostEditor />}>
          <Route index element={<CreatePost />} />
        </Route>
      )}
      {user && (
        <Route path="/app/edit/post/:id" element={<PostEditor />}>
          <Route index element={<CreatePost />} />
        </Route>
      )}
      {user && (
        <Route path="/app/initial-setup" element={<InitialSetup />}>
          <Route index element={<UsageType />} />
          <Route path="identity" element={<IdentityType />} />
          <Route path="frequency" element={<UpdateFrequency />} />
        </Route>
      )}

      {!user && <Route path="/app/*" element={<RedirectToHomePage />}></Route>}

      <Route path="*" element={<FourZeroFour />} />
    </Routes>
  );
};

export default Router;
