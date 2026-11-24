# Generates what-gets-counted.html from template.html, mechanism.js (the single source of truth), game.js (flow and
# words), about.html and the embedded fonts. Refuses to build unless calibration.js passes, then verifies byte for byte
# that the mechanism embedded in the HTML is the file calibration.js ran against.
import base64, os, subprocess, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
r = subprocess.run(['node', 'calibration.js'], capture_output=True, text=True)
if r.returncode != 0:
    sys.exit('BUILD REFUSED: calibration.js failed\n' + r.stdout[-3000:] + r.stderr[-2000:])
mech = open('mechanism.js', encoding='utf-8').read()
game = open('game.js', encoding='utf-8').read()
about = open('about.html', encoding='utf-8').read()
def font(f): return base64.b64encode(open(os.path.join('fonts', f), 'rb').read()).decode()
t = open('template.html', encoding='utf-8').read()
subs = {
    '/*__F_HAND__*/': font('patrick-hand-latin-400-normal.woff2'),
    '/*__F_SKETCH__*/': font('cabin-sketch-latin-700-normal.woff2'),
    '/*__ABOUT__*/': about,
    '/*__MECHANISM__*/': mech,
    '/*__GAME__*/': game,
}
for k in subs:
    assert t.count(k) == 1, 'placeholder ' + k + ' must appear exactly once'
for k, v in subs.items():
    t = t.replace(k, v)
name = 'what-gets-counted.html'
open(name, 'w', encoding='utf-8').write(t)
built = open(name, encoding='utf-8').read()
if mech not in built:
    sys.exit('BUILD FAILED: the embedded mechanism differs from mechanism.js')
if game not in built:
    sys.exit('BUILD FAILED: the embedded game.js differs from game.js')
for bad in ('http://', 'https://'):
    for line in built.splitlines():
        if bad in line and 'doi.org' not in line and 'w3.org/2000/svg' not in line:
            sys.exit('BUILD FAILED: external reference found: ' + line.strip()[:120])
print(f'built {name}: {len(built):,} bytes; mechanism embedded verbatim ({len(mech):,} bytes); calibration passed')
