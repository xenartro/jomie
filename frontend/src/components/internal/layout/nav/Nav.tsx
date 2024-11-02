import ContentToggler from "./ContentToggler";
import GoToMySite from "./GoToMySite";
import "./Nav.scss";
import Avatar from "./avatar/Avatar";
import Logo from "components/common/logo/Logo";
import { useLoginState } from "components/internal/LoginStateContext";
import NavButton from "components/internal/layout/nav/nav-button/NavButton";
import useMainNavType from "hooks/useMainNavType";
import { memo } from "react";
import { NavLink } from "react-router-dom";

interface PublishButtonProps {
  hasUnpublishedContents: boolean;
  unpublishedQuantity: number;
  onClick(): void;
}

const PublishButton = memo(
  ({
    hasUnpublishedContents,
    unpublishedQuantity,
    onClick,
  }: PublishButtonProps) => {
    return (
      <NavButton
        icon="publish"
        variant="publish"
        disabled={!hasUnpublishedContents}
        indicator={`${hasUnpublishedContents ? unpublishedQuantity : ""}`}
        onClick={onClick}
      >
        {!hasUnpublishedContents ? "Up to date" : "Publish"}
      </NavButton>
    );
  }
);

interface Props {
  unpublishedChanges: string[];
  togglePublish(): void;
  content: string;
  reloadPreview(): void;
}

const Nav = ({
  content,
  unpublishedChanges,
  togglePublish,
  reloadPreview,
}: Props) => {
  const navType = useMainNavType();
  const { user } = useLoginState();

  if (!user) {
    return null;
  }

  const typeClassName = `Nav--${navType}`;

  const secondaryTypeClassName = `--${navType}`;

  const unpublishedQuantity = unpublishedChanges.length;
  const hasUnpublishedContents = unpublishedQuantity > 0;

  return (
    <nav className={`Nav ${typeClassName}`}>
      <div className="Nav__Container">
        <NavLink to="/app">
          <Logo />
        </NavLink>
        <div className="Nav__Main">
          {navType === "main" && (
            <>
              <NavLink to="/app/content/basics">
                <NavButton title="Content" icon={"content"} variant="content">
                  Content
                </NavButton>
              </NavLink>
              <NavLink to="/app/visuals/palette">
                <NavButton title="Visuals" icon={"visuals"} variant="visuals">
                  Visuals
                </NavButton>
              </NavLink>
              <PublishButton
                hasUnpublishedContents={hasUnpublishedContents}
                unpublishedQuantity={unpublishedQuantity}
                onClick={togglePublish}
              />
            </>
          )}
          {navType === "content" && (
            <>
              <NavLink to="/app" end>
                <NavButton icon={"arrow-left"} variant="content">
                  Back
                </NavButton>
              </NavLink>
              <div className="Nav__Main__Section">
                <NavButton icon={"content"} variant="content" disabled>
                  Content
                </NavButton>
              </div>

              <NavLink to="/app/content/basics">
                <NavButton
                  title="Basics"
                  icon={"content-basics"}
                  variant="content"
                  level="sub-nav"
                >
                  Basics
                </NavButton>
              </NavLink>
              <NavLink to="/app/content/links">
                <NavButton
                  icon={"content-links"}
                  variant="content"
                  level="sub-nav"
                >
                  Links
                </NavButton>
              </NavLink>
              <NavLink to="/app/content/photos">
                <NavButton
                  icon={"visuals-palette"}
                  variant="content"
                  level="sub-nav"
                >
                  Photos
                </NavButton>
              </NavLink>
              <NavLink to="/app/content/posts">
                <NavButton
                  title="Posts"
                  icon={"content-blog"}
                  variant="content"
                  level="sub-nav"
                >
                  Posts
                </NavButton>
              </NavLink>

              <PublishButton
                hasUnpublishedContents={hasUnpublishedContents}
                unpublishedQuantity={unpublishedQuantity}
                onClick={togglePublish}
              />
            </>
          )}

          {navType === "visuals" && (
            <>
              <NavLink to="/app" end>
                <NavButton icon={"arrow-left"} variant="visuals">
                  Back
                </NavButton>
              </NavLink>
              <div className="Nav__Main__Section">
                <NavButton icon={"visuals"} variant="visuals" disabled>
                  Visuals
                </NavButton>
              </div>
              <NavLink to="/app/visuals/palette">
                <NavButton
                  title="Color Palette"
                  icon={"visuals-palette"}
                  variant="visuals"
                  level="sub-nav"
                >
                  Color Palette
                </NavButton>
              </NavLink>

              <NavLink to="/app/visuals/font">
                <NavButton
                  title="Typography"
                  icon={"visuals-type"}
                  variant="visuals"
                  level="sub-nav"
                >
                  Typography
                </NavButton>
              </NavLink>

              <NavLink to="/app/visuals/layout">
                <NavButton
                  title="Layouts"
                  icon={"visuals-layouts"}
                  variant="visuals"
                  level="sub-nav"
                >
                  Layouts
                </NavButton>
              </NavLink>

              <PublishButton
                hasUnpublishedContents={hasUnpublishedContents}
                unpublishedQuantity={unpublishedQuantity}
                onClick={togglePublish}
              />
            </>
          )}
        </div>

        <div className="Nav__Secondary">
          <div className={"Nav__Global " + secondaryTypeClassName}>
            <GoToMySite user={user} />

            <NavLink to="/app/settings" title="Account and Settings">
              <Avatar user={user} />
            </NavLink>
          </div>

          <ContentToggler
            section={navType}
            content={content}
            reloadPreview={reloadPreview}
          />
        </div>
      </div>
    </nav>
  );
};

export default Nav;
