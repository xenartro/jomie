:root {
@foreach ($palette['colors'] as $name => $colors)
@foreach ($colors as $index => $color)
    --color-{{ $name }}-{{ $index * 100 }}: {{ $color }};
@endforeach

@endforeach
}

