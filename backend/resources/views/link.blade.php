<div data-content="link{{ isset($link) ? '-'.$link->id : ''}}" class="link-item">
    @if (!isset($link) || $link->meta_image)
    <img src="{{ isset($link) ? $link->meta_image : '' }}" data-attribute="link-image" width="auto" height="60" data-attribute="link-image" />
    @endif
    <a href="{{ isset($link) ? $link->url : '' }}" target="_blank" rel="noopener noreferrer" data-attribute="link-title">
     {{ isset($link) ? $link->title : '' }}
    </a>
    <p data-attribute="link-description">{{ isset($link) ? $link->meta_description : '' }}</p>
</div>