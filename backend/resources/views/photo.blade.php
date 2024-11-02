<div class="photo" data-content="photo{{ isset($photo) ? '-'.$photo->position : '' }}">
    <a href="{{ isset($photo) ? $photo->image : '' }}" target="_blank" rel="noopener noreferrer"><img src="{{ isset($photo) ? $photo->image : '' }}" /></a>
</div>