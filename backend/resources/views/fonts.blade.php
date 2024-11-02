:root {
    --font-body-primary: {{ $fonts['body']['font_family'] }};
    --font-body-secondary: {{ $fonts['body']['font_family'] }};
    --font-body-primary-size: {{ $fonts['body']['font_size'] }};
    --font-body-secondary-size: {{ $fonts['small']['font_size'] }};
    --font-body-primary-line-height: {{ $fonts['body']['line_height'] }};
    --font-body-secondary-line-height: {{ $fonts['small']['line_height'] }};

    --font-body-font-weight: {{ $fonts['body']['font_weight'] }};

    --font-small: {{ $fonts['small']['font_family'] }};
    --font-small-size: {{ $fonts['small']['font_size'] }};
    --font-small-font-weight: {{ $fonts['small']['font_weight'] }};
    --font-small-line-height: {{ $fonts['small']['line_height'] }};

    --font-h1: {{ $fonts['heading1']['font_family'] }};
    --font-h1-size: {{ $fonts['heading1']['font_size'] }};
    --font-h1-font-weight: {{ $fonts['heading1']['font_weight'] }};
    --font-h1-line-height: {{ $fonts['heading1']['line_height'] }};

    --font-h2: {{ $fonts['heading2']['font_family'] }};
    --font-h2-size: {{ $fonts['heading2']['font_size'] }};
    --font-h2-font-weight: {{ $fonts['heading2']['font_weight'] }};
    --font-h2-line-height: {{ $fonts['heading2']['line_height'] }};

    /*DEBUG VARIABLES*/
    --main-family: {{ $fonts['body']['font_family'] }};
    --family: {{ $fonts['heading1']['font_family'] }};
}
