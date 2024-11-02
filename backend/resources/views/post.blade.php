<div data-content="post{{ isset($post) ? '-'.$post->id : '' }}" data-post-id="{{ isset($post) ? $post->id : '' }}" class="post-item">
    @if (isset($post) && $post->image)
        <div class="post-images" data-attribute="post-image">
            <img src="{{ asset('storage/images/' . $post->image) }}" alt="{{ $post['title'] }}">
        </div>
    @endif
    <h2 data-attribute="post-title" class="post-title">{{ isset($post) ? $post['title'] : '' }}</h2>
    <div class="post-body" data-attribute="post-body">
        <p>
            <x-markdown>{!! isset($post) ? $post['content'] : '' !!}</x-markdown>
        </p>
    </div>
</div>
