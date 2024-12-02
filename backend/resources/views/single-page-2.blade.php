@if (!$devPreview)
<!DOCTYPE html>
<html lang="en">
<head>
    @foreach ($visual['fonts']['links']['families'] as $fontLink)
    {!! $fontLink !!}
    @endforeach
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @include("meta", ["user" => $user])
    <style>
        html {
            box-sizing: border-box;
            font-size: 16px;
            width: 100%;
            height: 100%;
        }

        *, *:before, *:after {

        }

        body, h1, h2, h3, h4, h5, h6, p, ol, ul {
            margin: 0;
            padding: 0;
            font-weight: normal;
        }
        h1 {
            font-size: 10px;
        }

        ol, ul {
        list-style: none;
        }

        img {
            max-width: 100%;
            height: auto;
        }

        body {
            opacity: 0;
        }
        body.loaded {
            opacity: 1;
        }
    </style>
</head>
<body>
@endif
    @if ($preview)
        <style id="palette-preview">
            @include("palette", ["palette" => $visual['palette']])
        </style>
        <style id="fonts-preview">
            @include("fonts", ["fonts" => $visual['fonts']])
        </style>
        <style title="styles">
            @include("styles", ["visual" => $visual, "preview" => true])
        </style>
        @foreach ($visual['fonts']['links']['all'] as $fontLink)
        {!! $fontLink !!}
    @endforeach
    @else
        <link href="{{ asset('render/'.$user->nickname.'/visual.css') }}" rel="stylesheet">
    @endif
    <link href="{{ asset('styles/default-2.css') }}" rel="stylesheet">
    <div id="website-preview" class="wrapper animated l2">
        @if ($user->preferences->basics_enabled)
            <header id="home" data-content="basics" class="home-section">
                <div class="bio-wrapper">
                    <h1 data-attribute="basic-level1" class="bio-title">{{ $content['basic']['level1'] }}</h1>
                    <p data-attribute="basic-level2" class="bio-text">{{ $content['basic']['level2'] }}</p>
                    <p data-attribute="basic-level3" class="bio-text">{{ $content['basic']['level3'] }}</p>
                    <p data-attribute="basic-paragraph" class="bio-paragraph">{{ $content['basic']['paragraph'] }}</p>
                </div>
                <div data-attribute="basic-profile-image-container" class="hero-photo l1">
                    @if (!empty($content['basic']['profile_image']))
                        <img src="{{ asset('/storage/images/'.$content['basic']['profile_image']) }}" alt="Profile image" />
                    @endif
                </div>
                <a href="#links" class="scroll-down">Scroll</a>
            </header>
        @elseif ($preview)
            @include('disabled', ['class' => 'basics', 'section' => 'Basics'])
        @endif

        @if ($user->preferences->links_enabled)
            @if ($preview)
                <div style="display: none">
                    @include('link')
                    @include('social-link')
                </div>
            @endif
            <section id="links" class="links-section">
                <h2 class="section-title" data-attribute="links-name">{{ $user->preferences->links_name }}</h2>
                <div class="links-wrapper">
                    <div data-content="links" class="links-list">
                        @foreach ($content['links'] as $link)
                            @include('link', ['link' => $link])
                        @endforeach
                    </div>
                    <div data-content="social-links" class="links-list">
                        @foreach ($content['socials'] as $socialLink)
                            @include('social-link', ['social-link' => $socialLink])
                        @endforeach
                    </div>
                </div>
            </section>
        @elseif ($preview)
            @include('disabled', ['class' => 'links', 'section' => 'Links'])
        @endif

        @if ($user->preferences->photos_enabled)
            @if ($preview)
            <div style="display: none">
                @include('photo')
            </div>
            @endif
            <section id="photos" class="photos-section">
                <h2 class="section-title" data-attribute="photos-name">{{ $user->preferences->photos_name }}</h2>
                <div data-content="photos" class="photos-content photos-{{ count($content['photos']) }}">
                    @foreach ($content['photos'] as $photo)
                    @include('photo', ['photo' => $photo])
                    @endforeach
                </div>
            </section>
        @elseif ($preview)
            @include('disabled', ['class' => 'posts', 'section' => 'Posts'])
        @endif

        @if ($user->preferences->posts_enabled)
            @if ($preview)
            <div style="display: none">
                @include('post')
            </div>
            @endif
            <section id="posts" class="posts-section">
                <h2 class="section-title" data-attribute="posts-name">{{ $user->preferences->posts_name }}</h2>
                <div data-content="posts" class="post-list">
                    @foreach ($content['posts'] as $post)
                        @include('post', ['post' => $post])
                    @endforeach
                </div>
            </section>
        @elseif ($preview)
            @include('disabled', ['class' => 'posts', 'section' => 'Posts'])
        @endif
    </div>
    @include("scripts", ["visual" => $visual, "section" => $section, "scripts" => ['active-nav'], "effectPreview" => $effectPreview])
@if (!$devPreview)
    <script async src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
    </body>
</html>
@endif
