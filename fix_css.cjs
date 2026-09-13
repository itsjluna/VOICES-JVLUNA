const fs = require('fs');
let css = fs.readFileSync('src/components/games/GamesView.css', 'utf8');
css = css.replace("@import url('https://fonts.googleapis.com/css2?family=Russo+One&display=swap');\n\n", "");
css = "@import url('https://fonts.googleapis.com/css2?family=Russo+One&display=swap');\n\n" + css;
fs.writeFileSync('src/components/games/GamesView.css', css);
