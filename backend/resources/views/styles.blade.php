
@if (empty($preview))
    @include('palette', ['palette' => $visual['palette']])
    @include('fonts', ['fonts' => $visual['fonts']])
@endif
:root {
    /* SIZING */
    --sizing-block: 4px;
    --sizing-x-half: calc(var(--sizing-block) / 2);
    --sizing-x: var(--sizing-block);
    --sizing-x2: calc(var(--sizing-block) * 2);
    --sizing-x3: calc(var(--sizing-block) * 3);
    --sizing-x4: calc(var(--sizing-block) * 4);
    --sizing-x5: calc(var(--sizing-block) * 5);
    --sizing-x6: calc(var(--sizing-block) * 6);
    --sizing-x8: calc(var(--sizing-block) * 8);
    --sizing-x10: calc(var(--sizing-block) * 10);
    --sizing-x12: calc(var(--sizing-block) * 12);
    --sizing-x15: calc(var(--sizing-block) * 15);
    --sizing-x20: calc(var(--sizing-block) * 20);
    /*BASIC COLOR VARIABLES*/
    --color-background: var(--color-{{ $visual['palette']['backgrounds'] }}-{{ \tuneColorfulness($visual['palette']['colorfulness'], 0) }});
    --color-text: var(--color-{{ $visual['palette']['text'] }}-{{ \tuneColorfulness($visual['palette']['darkColorfulness'], 0) }});
    --color-text-light: var(--color-{{ $visual['palette']['text'] }}-{{ \tuneColorfulness($visual['palette']['darkColorfulness'], -100) }});
    --color-primary: var(--color-primary-500);
    --color-text-primary: var(--color-primary-{{ \tuneColorfulness($visual['palette']['darkColorfulness'], -100) }});
    --color-border: var(--color-{{ $visual['palette']['backgrounds'] }}-{{ $visual['palette']['border'] }});
    /*DEBUG VARIABLES*/
    --colorfullness: var(--{{ $visual['palette']['colorfulness'] }});
    --balance: var(--{{ $visual['palette']['balance'] }});
    --backgrounds: var(--{{ $visual['palette']['backgrounds'] }});
    --colorsCount: var(--{{ $visual['palette']['colorsCount'] }});
    /*ANIMATION*/
    --speed: 1.25s;
    --delay: .5s;
    --delay-long: 1s;
    --easing-out: cubic-bezier(0, 0.55, 0.45, 1);
    --easing-in-out: cubic-bezier(0.85, 0, 0.15, 1);
     /* GLOBAL TOKENS */
     --space-s:  var(--sizing-x2);
     --space-m:  var(--sizing-x4);
     --space-b:  var(--sizing-x8);
     --space-xb:  var(--sizing-x10);
     --space-xxb:  var(--sizing-x20);
     --corner-s: var( --space-s);
     --corner-m: var( --space-m);
     --corner-b: var( --space-xb);
    /*COMPONENT TOKENS */
    /*Nav*/
    --nav-surface: var(--color-{{ $visual['palette']['navigation'] }}-800);
    --nav-link-text: var(--color-{{ $visual['palette']['navigation'] }}-200);
    --nav-link-text-hover: var(--color-{{ $visual['palette']['navigation'] }}-0);
    --nav-link-text-active: var(--color-{{ $visual['palette']['navigation'] }}-0);
    /*Header*/
    /*Links*/
    --links-list-gap: var(--space-b);
    --mobile-links-list-gap: var(--space-s);
    --links-link-surface: var(--color-neutral-0);
    --links-link-border: var(--color-border);
    --links-link-padding: var( --space-b);
    --links-link-corner: var( --corner-s);
    --links-link-color: var( --color-primary-700);
    --links-link-color-hover: var( --color-primary-800);
    --links-link-text-font-size: var(--font-size-h-4);
    --links-link-text-line-height: var(--line-height-h-4);
    /*Posts*/
}

.d1 {
    transition-delay: var(--delay) !important;
}

@if ($visual['loading_effect'] === 'fade-in')
.fade-in .animated.l1 {
    opacity: 0;
    filter: grayscale(100%);
}
.fade-in-done .animated.l1 {
    transition: all var(--speed) var(--easing-out);
    opacity: 1;
    filter: grayscale(0%);
}

.fade-in .animated.l1 img {
    transform: scale(0.8);
    filter: grayscale(100%);
}
.fade-in-done .animated.l1 img {
    transition: all var(--speed) var(--easing-in-out) var(--delay-long);
    transform: scale(1);
    filter: grayscale(0%);
}

.fade-in .animated.l2 {
    filter: brightness(4) contrast(0);
    opacity: 0;
    background-color: var(--color-primary-500);
}
.fade-in-done .animated.l2 {
    transition: all var(--speed) var(--easing-out) var(--delay);

    filter: brightness(1) contrast(1);
    opacity: 1;
}
@elseif ($visual['loading_effect'] === 'flip')
.flip .animated.l1 {
    transform: rotateY(120deg);
    opacity: 0;
    filter: grayscale(100%);
}
.flip-done .animated.l1 {
    transition: all var(--speed) var(--easing-out);
    transform: rotateY(0deg);
    opacity: 1;
    filter: grayscale(0%);
}
.flip .animated.l1 img {
    transform: scale(0.8);
    filter: grayscale(100%);
}
.flip-done .animated.l1 img {
    transition: all var(--speed) var(--easing-out) var(--delay-long);
    transform: scale(1) !important;
    filter: grayscale(0%);
}
.flip .animated.l2 {
    filter: brightness(4) contrast(0);
    opacity: 0;
    background-color: var(--color-primary-500);
}
.flip-done .animated.l2 {
    transition: all var(--speed) var(--easing-out) var(--delay);
    filter: brightness(1) contrast(1);
    opacity: 1;
}
@endif
