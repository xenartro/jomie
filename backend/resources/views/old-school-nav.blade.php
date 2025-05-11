<nav>
    @if ($user->preferences->basics_enabled)
    <a href="?section=" {!! navClasses($section, '') !!} data-attribute="basics-name">
        {{ $user->preferences->basics_name }}
    </a>
    @endif
    @if ($user->preferences->links_enabled)
    <a href="?section=links" {!! navClasses($section, 'links') !!} data-attribute="links-name">
        {{ $user->preferences->links_name }}
    </a>
    @endif
    @if ($user->preferences->photos_enabled)
    <a href="?section=photos" {!! navClasses($section, 'photos') !!} data-attribute="photos-name">
        {{ $user->preferences->photos_name }}
    </a>
    @endif
    @if ($user->preferences->posts_enabled)
    <a href="?section=posts" {!! navClasses($section, 'posts') !!} data-attribute="posts-name">
        {{ $user->preferences->posts_name }}
    </a>
    @endif
</nav>

<hr />
