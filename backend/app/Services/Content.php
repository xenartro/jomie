<?php

namespace App\Services;

use App\Models\BlogPost;
use App\Models\Image;
use App\Models\Link;
use App\Models\Photo;
use App\Models\V1Content;
use App\Models\User;
use Auth;
use Bugsnag;
use DB;
use Exception;
use Illuminate\Http\Request;
use Storage;

class Content
{
    private User $user;
    public function __construct(User | null $user = null)
    {
        $this->user = $user !== null && $user->id ? $user : Auth::user();
    }

    /**
     * Basic Content
     */
    public function getBasic($published = true)
    {
        return $published ? $this->getPublishedBasic() : $this->getUnpublishedBasic();
    }
    private function getPublishedBasic()
    {
        $content = V1Content::findFromUser($this->user, true);

        if (!$content) {
            // log error
            V1Content::createDefaultContent($this->user);
        }

        return $content;
    }
    private function getUnpublishedBasic()
    {
        $content = V1Content::findFromUser($this->user, false);

        if (!$content) {
            return $this->getPublishedBasic();
        }

        return $content;
    }
    public function updateBasic(array $data)
    {
        $publishedContent = $this->getBasic(true);
        $publishedContent->fill($data);
        if (!$publishedContent->isDirty(array_keys($data))) {
            if (V1Content::discard($this->user) === false) {
                throw new MutationException('Content', 204);
            }
            return;
        }

        $content = $this->getBasic(false);
        if ($content->published) {
            if (empty($data['profile_image'])) {
                $data['profile_image'] = $publishedContent->profile_image;
            }
            V1Content::createBasic($this->user, $data, false);
            return;
        }

        $content->fill($data);
        if (!$content->isDirty(array_keys($data))) {
            throw new MutationException('Content', 204);
        }

        $content->save();
    }
    private function publishBasic()
    {
        V1Content::publish($this->user);
    }
    private function discardBasic()
    {
        V1Content::discard($this->user);
    }

    /**
     * Links
     */
    public function getLinks($published = true, array $categories)
    {
        foreach ($categories as $category) {
            $categoryLinks = $published ? $this->getPublishedLinks($category) : $this->getUnpublishedLinks($category);
            $links = isset($links) ? $links->merge($categoryLinks) : $categoryLinks;
        }

        return $links;
    }
    public function getPublishedLinks(int $category)
    {
        $links = Link::findFromUser($this->user, true, $category);

        return $links;
    }
    public function getUnpublishedLinks(int $category)
    {
        $links = Link::findFromUser($this->user, false, $category);

        if (!count($links)) {
            return $this->getPublishedLinks($category);
        }

        return $links;
    }
    public function updateLinks(array $linksData, int $category)
    {
        $user = $this->user;
        if (count($linksData) === Link::countFromUser($user, true, $category)) {
            $newLinksData = array_filter($linksData, function ($link) use ($user) {
                return !Link::linkExists($user, $link, true);
            });

            if (!count($newLinksData)) {
                if (Link::discard($this->user)) {
                    throw new MutationException('Content', 204);
                }
                return;
            }
        }

        Link::where('user_id', $this->user->id)
            ->where('published', false)
            ->where('category', $category)
            ->delete();

        if (!count($linksData)) {
            Link::createEmpty($this->user, $category);
            return;
        }

        foreach ($linksData as $data) {
            Link::createLink($this->user, $data, false, $category);
        }
    }
    private function publishLinks()
    {
        Link::publish($this->user);
    }
    private function discardLinks()
    {
        Link::discard($this->user);
    }

    /**
     * Blog Posts
     */
    public function getPublishedBlogPosts()
    {
        return BlogPost::where('user_id', $this->user->id)
            ->where('published', true)
            ->get();
    }
    public function getUnpublishedBlogPosts()
    {
        $query = BlogPost::where('user_id', $this->user->id)
            ->where(function ($q) {
                $q->orWhere('published', false);
                $q->orWhere(function ($q) {
                    $q->where('published', true);
                    $q->where('deleted', false);
                });
            })
            ->orderBy('created_at', 'desc');

        $editedPosts = BlogPost::where('user_id', $this->user->id)
            ->whereNotNull('edited_id')
            ->get();

        foreach ($editedPosts as $editedPost) {
            $query->where('id', '!=', $editedPost->edited_id);
        }

        return $query->get();
    }
    public function getAllBlogPosts()
    {
        $query = BlogPost::where('user_id', $this->user->id)
            ->orderBy('created_at', 'desc');

        $editedPosts = BlogPost::where('user_id', $this->user->id)
            ->whereNotNull('edited_id')
            ->get();

        foreach ($editedPosts as $editedPost) {
            $query->where('id', '!=', $editedPost->edited_id);
        }

        return $query->get();
    }
    public function getBlogPosts($published = null)
    {
        /**
         * If published is null, we need:
         * - unpublished posts
         * - published undeleted posts
         * - published unedited posts
         */
        if ($published === null) {
            return $this->getAllBlogPosts();
        }

        return $published ? $this->getPublishedBlogPosts() : $this->getUnpublishedBlogPosts();
    }
    public function getBlogPost(int $id)
    {
        return BlogPost::findOneFromUser($id, $this->user);
    }
    public function deleteBlogPost(int $id)
    {
        if (empty($id)) {
            throw new MutationException('Content', 400);
            return;
        }
        $blogPost = BlogPost::findOneFromUser($id, $this->user);
        if (!$blogPost) {
            throw new MutationException('Content', 404);
        }
        if (!$blogPost->published) {
            $blogPost->delete();
            return;
        }
        $blogPost->deleted = true;
        $blogPost->save();
    }
    public function restoreBlogPost(int $id)
    {
        if (empty($id)) {
            throw new MutationException('Content', 400);
            return;
        }
        $blogPost = BlogPost::findOneFromUser($id, $this->user);
        if (!$blogPost) {
            throw new MutationException('Content', 404);
        }
        $blogPost->deleted = false;
        $blogPost->save();
    }
    public function saveBlogPost(array $data)
    {
        $blogPost = BlogPost::saveBlogPost($this->user, $data);
        return $blogPost;
    }
    public function uploadPostImage($file, $postId)
    {
        if ($postId) {
            $post = BlogPost::findOneFromUser($postId, $this->user);
            if (!$post) {
                Bugsnag::notifyException(new Exception("Trying to post image {$file} to post {$postId}"));
                return '';
            }
        } else {
            $post = new BlogPost();
            $post->user_id = $this->user->id;
        }
        $path = Storage::disk('images')->putFile('post', $file);
        if ($path) {
            return Image::createFromUpload($path, $post);
        }
        return null;
    }
    private function publishBlog()
    {
        BlogPost::publish($this->user);
    }
    private function discardBlog()
    {
        BlogPost::discard($this->user);
    }

    /**
     * Photos
     */
    public function getRenderPhotos(bool $published)
    {
        $photos = Photo::findFromUser($this->user, true);
        $max = 0;
        foreach ($photos as $photo) {
            if (($photo->position - 1) > $max) {
                $max = $photo->position - 1;
            }
        }
        $renderPhotos = array_fill(0, $max, null);
        foreach ($photos as $photo) {
            $renderPhotos[$photo->position - 1] = $photo;
        }
        if ($published) {
            return $renderPhotos;
        }
        $unpublishedPhotos = Photo::findFromUser($this->user, false);
        foreach ($unpublishedPhotos as $photo) {
            if ($photo->deleted) {
                $renderPhotos[$photo->position - 1] = null;
            } else {
                $renderPhotos[$photo->position - 1] = $photo;
            }
        }
        return $renderPhotos;
    }
    public function getPhotos($published = null)
    {
        if ($published === true) {
            return Photo::findFromUser($this->user);
        }
        $dbPhotos = Photo::where('user_id', $this->user->id)
            ->orderBy('position', 'ASC')
            ->orderBy('published', 'DESC')
            ->get();
        $photos = [];
        foreach ($dbPhotos as $photo) {
            if (!empty($photos[$photo->position]) && $photo->published === false) {
                if ($photo->deleted) {
                    unset($photos[$photo->position]);
                } else {
                    $photos[$photo->position] = $photo;
                }
                continue;
            }
            $photos[$photo->position] = $photo;
        }
        return array_values($photos);
    }
    public function savePhotos(Request $request)
    {
        $images = [];
        for ($i = 1; $i < 7; $i++) {
            $image = $request->file('photo_'.$i);
            if ($image) {
                $images["$i"] = $image;
            }
        }
        $photos = [];
        foreach ($images as $position => $file) {
            if (is_uploaded_file($file)) {
                Photo::uploadPhoto($this->user, $file, intval($position), false);
            } else {
                throw new Exception('Could not process one of the images. Please double check the image size and file type (JPG or PNG).');
            }
        }
        return $this->getPhotos();
    }
    public function removePhoto(int $position)
    {
        $unpublishedPhoto = Photo::findOneFromUser(
            $this->user,
            $position,
            false
        );
        if ($unpublishedPhoto) {
            $unpublishedPhoto->delete();
        } else {
            $deletedPhoto = new Photo([
                'description' => '',
                'position'    => $position,
                'published'   => false,
                'image'       => '',
            ]);
            $deletedPhoto->deleted = true;
            $deletedPhoto->user_id = $this->user->id;
            $deletedPhoto->save();
        }
        return $this->getPhotos();
    }
    private function publishPhotos()
    {
        Photo::publish($this->user);
    }
    private function discardPhotos()
    {
        Photo::discard($this->user);
    }

    /**
     * Render preview
     */
    public function render($published = true)
    {
        return [
            'basic'     => $this->getBasic($published),
            'links'     => $this->getLinks($published, [Link::CATEGORY_LINK]),
            'socials'   => $this->getLinks($published, [Link::CATEGORY_SOCIAL, Link::CATEGORY_STREAMING]),
            'photos'    => $this->getRenderPhotos($published),
            'posts'     => $this->getBlogPosts($published),
        ];
    }

    /**
     * Metadata
     */
    public function unpublishedContents()
    {
        $unpublished = [];

        $unpublishedBasic = V1Content::hasFromUser($this->user, false);
        if ($unpublishedBasic) {
            $unpublished[] = 'basics';
        }

        $unpublishedLinks = Link::hasFromUser($this->user, false);
        if ($unpublishedLinks) {
            $unpublished[] = 'links';
        }

        $unpublishedPosts = BlogPost::hasChangedPostsFromUser($this->user);
        if ($unpublishedPosts) {
            $unpublished[] = 'posts';
        }

        $unpublishedPhotos = Photo::hasFromUser($this->user, false);
        if ($unpublishedPhotos) {
            $unpublished[] = 'photos';
        }

        return $unpublished;
    }

    /**
     * Publish changes
     */
    public function publishChanges()
    {
        $changes = $this->unpublishedContents();
        foreach ($changes as $change) {
            switch ($change) {
                case 'links':
                    $this->publishLinks();
                    // no break
                case 'basics':
                    $this->publishBasic();
                    // no break
                case 'posts':
                    $this->publishBlog();
                    // no break
                case 'photos':
                    $this->publishPhotos();
                    // no break
                default:
                    // log error
            }
        }
    }

    /**
     * Discard
     */
    public function discardChanges()
    {
        $changes = $this->unpublishedContents();
        foreach ($changes as $change) {
            switch ($change) {
                case 'links':
                    $this->discardLinks();
                    // no break
                case 'basics':
                    $this->discardBasic();
                    // no break
                case 'posts':
                    $this->discardBlog();
                    // no break
                case 'photos':
                    $this->discardPhotos();
                    // no break
                default:
                    // log error
            }
        }
    }
}
