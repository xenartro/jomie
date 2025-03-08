<title>{{ $user->preferences->meta_title }}</title>
<meta name="title" content="{{ $user->preferences->meta_title }}" />
<meta name="description" content="{{ $user->preferences->meta_description }}" />

<meta property="og:type" content="website" />
<meta property="og:url" content="{{ $user->url }}" />
<meta property="og:title" content="{{ $user->preferences->meta_title }}" />
<meta property="og:description" content="{{ $user->preferences->meta_description }}" />
@if (!empty($content['basic']['profile_image']))
<meta property="og:image" content="{{ asset('/storage/images/'.$content['basic']['profile_image']) }}" />
@endif

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="{{ $user->url }}" />
<meta property="twitter:title" content="{{ $user->preferences->meta_title }}" />
<meta property="twitter:description" content="{{ $user->preferences->meta_description }}" />
@if (!empty($content['basic']['profile_image']))
<meta property="twitter:image" content="{{ asset('/storage/images/'.$content['basic']['profile_image']) }}" />
@endif
