@if ($visual['loading_effect'] && (!$section || $section === 'layout'))
<script>
    const isReload = window.performance && performance.navigation.type === performance.navigation.TYPE_RELOAD;
    if (!sessionStorage.getItem('animated') || isReload{{ !empty($effectPreview) ? ' || true' : ''}}) {
        if (!window.location.hash) {
            window.scrollTo(0, 0);
        }
        window.addEventListener('load', function() {
            const body = document.querySelector('body');
            body.classList.add('loaded');
            if (sessionStorage) {
                sessionStorage.setItem('animated', '1');
            }
            body.classList.add('{{ $visual['loading_effect'] }}');
            setTimeout(function () {
                body.classList.remove('{{ $visual['loading_effect'] }}');
                body.classList.add('{{ $visual['loading_effect'] }}-done');
            }, 1300);
        });
    } else {
        window.addEventListener('load', function() {
            const body = document.querySelector('body');
            body.classList.add('loaded');
        });
    }
</script>
@else
<script>
    window.addEventListener('load', function() {
        const body = document.querySelector('body');
@if ($visual['loading_effect'])
        body.classList.add('{{ $visual['loading_effect'] }}-done');
@endif
        body.classList.add('loaded');
    });
</script>
@endif
<script>
    window.addEventListener('load', function() {
        const params = new URLSearchParams(`/${window.location.search}`);
        if (!window.location.hash && params.has('section')) {
            const section = document.getElementById(params.get('section'));
            if (section) {
                section.scrollIntoView();
            }
        }
    });
</script>
@foreach ($scripts as $script)
@if ($script === 'active-nav')
<script>
    window.addEventListener('scroll', markActiveSection);
    function markActiveSection() {
        const currentPos = window.scrollY;
        const sections = ['home', 'links', 'photos', 'posts'];
        let activeSection;
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (!element) {
                return;
            }
            const pos = element.offsetTop - (window.innerHeight / 4);
            if (currentPos >= pos) {
                activeSection = section;
            }
        });
        document.querySelectorAll('nav a').forEach(nav => {
            if (nav.getAttribute('href').includes(activeSection)) {
                nav.classList.add('--active');
            } else {
                nav.classList.remove('--active');
            }
        });
    }
    markActiveSection();
</script>
@endif
@endforeach
