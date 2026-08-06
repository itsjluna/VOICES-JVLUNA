const fs = require('fs');
let code = fs.readFileSync('src/components/SeasonBackgrounds.jsx', 'utf8');

// Winter
code = code.replace(
  /\{\/\* Jagged icy coastline \*\/\}([\s\S]*?)<\/motion\.g>\n    <\/motion\.g>/,
  '<g transform="translate(0, -130)">\n        {/* Jagged icy coastline */}$1</g>\n      </motion.g>\n    </motion.g>'
);

// Spring
code = code.replace(
  /\{\/\* Rolling Grassy Coastline \*\/\}([\s\S]*?)<\/motion\.g>\n    <\/motion\.g>/,
  '<g transform="translate(0, -130)">\n        {/* Rolling Grassy Coastline */}$1</g>\n      </motion.g>\n    </motion.g>'
);

// Summer
code = code.replace(
  /\{\/\* Smooth Sandy\/Grassy Coast \*\/\}([\s\S]*?)<\/motion\.g>\n    <\/motion\.g>/,
  '<g transform="translate(0, -130)">\n        {/* Smooth Sandy/Grassy Coast */}$1</g>\n      </motion.g>\n    </motion.g>'
);

// Autumn
code = code.replace(
  /\{\/\* Sloping Coastal Bank \*\/\}([\s\S]*?)<\/motion\.g>\n    <\/motion\.g>/,
  '<g transform="translate(0, -130)">\n        {/* Sloping Coastal Bank */}$1</g>\n      </motion.g>\n    </motion.g>'
);

fs.writeFileSync('src/components/SeasonBackgrounds.jsx', code);
console.log('Fixed SVG positioning!');
