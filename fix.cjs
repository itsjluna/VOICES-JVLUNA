const fs = require('fs');
let css = fs.readFileSync('src/components/games/GamesView.css', 'utf8');

css = css.replace(/transform: perspective\(600px\) translate3d\(-80\.6%, -69\.2%, 0px\) rotateX\(-0\.1deg\) rotateY\(-15\.2deg\) rotateZ\(14\.3deg\) scale\(1, 1\) skew\(7\.1deg, 2deg\);\r?\n\s*width: 44\.5%;\r?\n\s*height: 48\.7%;\r?\n\s*-webkit-transform: perspective\(600px\) translate3d\(-80\.6%, -69\.2%, 0px\) rotateX\(-0\.1deg\) rotateY\(-15\.2deg\) rotateZ\(14\.3deg\) scale\(1, 1\) skew\(7\.1deg, 2deg\);\r?\n\s*transform: perspective\(600px\) translate3d\(-80\.6%, -69\.2%, 0px\) rotateX\(-0\.1deg\) rotateY\(-15\.2deg\) rotateZ\(14\.3deg\) scale\(1, 1\) skew\(7\.1deg, 2deg\);/,
\order-radius: 0% / 0%;
    width: 44.5%;
    height: 48.7%;
    -webkit-transform: perspective(600px) translate3d(-80.6%, -69.2%, 0px) rotateX(-0.1deg) rotateY(-15.2deg) rotateZ(14.3deg) scale(1, 1) skew(7.1deg, 2deg);
    transform: perspective(600px) translate3d(-80.6%, -69.2%, 0px) rotateX(-0.1deg) rotateY(-15.2deg) rotateZ(14.3deg) scale(1, 1) skew(7.1deg, 2deg);\);

css = css.replace(/transform-style: preserve-3d;\r?\n\s*-webkit-transform-style: preserve-3d;/, '');

fs.writeFileSync('src/components/games/GamesView.css', css);
