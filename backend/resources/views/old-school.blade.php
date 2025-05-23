<?php
function navClasses($currentSection, $navSection) {
    $active = 'class="--active"';
    if (in_array($currentSection, ['basics', 'font', 'palette', 'layout']) && !$navSection) {
        return $active;
    }
    if ($currentSection !== $navSection) {
        return '';
    }
    return $active;
}
?>
@if (!$preview)
<!doctype html>
<html>
    <head>
        @foreach ($visual['fonts']['links']['families'] as $fontLink)
        {!! $fontLink !!}
        @endforeach

        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        @include("meta", ["user" => $user, "content" => $content])
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
                display: none;
            }
            body.loaded {
                display: block;
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
    <link href="{{ asset('styles/old-school.css') }}" rel="stylesheet">
    <div id="website-preview" class="container animated l2">
        @if ($user->preferences->basics_enabled)
            <div data-content="basics" class="basics">
                <div class="basics-container">
                    <h1 data-attribute="basic-level1">{{ $content['basic']['level1'] }}</h1>
                    <h2 data-attribute="basic-level2">{{ $content['basic']['level2'] }}</h2>
                    <h3 data-attribute="basic-level3">{{ $content['basic']['level3'] }}</h3>

                    @include('old-school-nav', ['user' => $user, 'section' => $section])
                </div>
            </div>
        @elseif ($preview)
            @include('disabled', ['class' => 'basics', 'section' => 'Basics'])
        @else
            @include('old-school-nav', ['user' => $user, 'section' => $section])
        @endif
        @if (!$section || in_array($section, ['basics', 'font', 'palette', 'layout']))
            <section>
                <p data-attribute="basic-paragraph" class="paragraph">
                    <span data-attribute="basic-profile-image-container" class="profile-container animated animated l1 d1">
                        @if (!empty($content['basic']['profile_image']))
                            <img src="{{ asset('/storage/images/'.$content['basic']['profile_image']) }}" alt="Profile image" />
                        @endif
                    </span>
                    {{ $content['basic']['paragraph'] }}
                </p>
            </section>
        @elseif ($section === 'links' && $user->preferences->links_enabled)
            @if ($preview)
                <div style="display: none">
                    @include('link')
                    @include('social-link')
                </div>
            @endif
            <div class="links" id="links">
                <div class="center-layout">
                    <div class="links-container">
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
                </div>
            </div>
        @elseif ($section === 'links' && !$user->preferences->links_enabled)
            @include('disabled', ['class' => 'links', 'section' => 'Links'])
        @elseif ($section === 'posts' && $user->preferences->posts_enabled)
            @if ($preview)
            <div style="display: none">
                @include('post')
            </div>
            @endif
            <div class="posts">
                <div class="center-layout">
                    <div class="posts-container">
                        <div data-content="posts" class="posts-list">
                            @foreach ($content['posts'] as $post)
                                @include('post', ['post' => $post])
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>
        @elseif ($section === 'posts' && !$user->preferences->posts_enabled)
            @include('disabled', ['class' => 'posts', 'section' => 'Posts'])
        @elseif ($section === 'photos' && $user->preferences->photos_enabled)
            @if ($preview)
            <div style="display: none">
                @include('photo')
            </div>
            @endif
            <div class="photos" id="photos">
                <div data-content="photos" class="photos-content photos-{{ count($content['photos']) }}">
                    @foreach ($content['photos'] as $photo)
                    @include('photo', ['photo' => $photo])
                    @endforeach
                </div>
            </div>
        @elseif ($section === 'photos' && !$user->preferences->photos_enabled)
            @include('disabled', ['class' => 'photos', 'section' => 'Photos'])
        @else
            <div data-content="404">
                <h1>404</h1>
            </div>
        @endif
    </div>
    @include("scripts", ["visual" => $visual, "section" => $section, "scripts" => [], "effectPreview" => $effectPreview])
@if (!$preview)
    </body>
</html>
@endif
