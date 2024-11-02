import "./PostEditor.scss";
import Button from "components/common/button/Button";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";

/*
 * This will be the layout container for the Post Editor.
 * It should render a centered editor with title, images and content
 */
const PostEditor = () => {
  return (
    <div className="PostEditor Layout --Center">
      <div className="LayoutColumn --Content ">
        <div className="PostEditorContent">
          <Outlet />
        </div>
      </div>
      <div className="BottomContent">
        <NavLink to="/app/content/posts">
          <Button type="button" size="small" variant="ghost" icon="arrow-left">
            Go back
          </Button>
        </NavLink>
      </div>
    </div>
  );
};

export default PostEditor;
