import mongoose from 'mongoose';
import fs from 'fs';

const chapterSchema = new mongoose.Schema({
  title: String,
  titleEn: String,
  order: { type: Number, default: 0 },
  image: String,
  isIntermission: { type: Boolean, default: false },
  isVent: { type: Boolean, default: false },
  content: String,
  contentEn: String,
  theme: { type: String, default: 'winter' }
});

const poemSchema = new mongoose.Schema({
  title: String,
  titleEn: String,
  content: String,
  contentEn: String,
  chapterId: mongoose.Schema.Types.ObjectId,
  order: { type: Number, default: 0 },
  image: String,
  theme: { type: String, default: 'none' }
});

const Chapter = mongoose.model('Chapter', chapterSchema);
const Poem = mongoose.model('Poem', poemSchema);

const translatedTexts = {
  "ROSTROS": "FACES",
  "RENDICIÓN": "SURRENDER",
  "PRÓLOGO": "PROLOGUE",
  "CONFESIONES": "CONFESSIONS",
  "LA CUERDA": "THE ROPE",
  "MUNDOS": "WORLDS",
  "17121": "17121",
  "Protector of mankind": "Protector of mankind",
  "Sobre la creatividad humana.": "On Human Creativity.",
  "Soñadora errante.": "Wandering Dreamer."
};

const poem17121EN = `<p class="MsoNormal"><i><span lang="EN-US">Good afternoon passengers, this is the
pre-boarding announcement for flight 17121 to Mexico City. We are now inviting
passengers with small children and those requiring special assistance to begin
boarding. Please have your boarding pass and identification ready. Regular
boarding will begin in approximately ten minutes. Thank you.<o:p></o:p></span></i></p>

<p class="MsoNormal"><i><span>&nbsp;</span></i></p>

<p class="MsoNormal"><span>Arriving late to the flight, but always touching down,<o:p></o:p></span></p>

<p class="MsoNormal"><span>causing turbulence and I'm just getting warmed up.<o:p></o:p></span></p>

<p class="MsoNormal"><span>&nbsp;</span></p>

<p class="MsoNormal"><span lang="EN-US">Supremacy.<o:p></o:p></span></p>

<p class="MsoNormal"><span lang="EN-US">&nbsp;</span></p>

<p class="MsoNormal"><span lang="EN-US">U gonna’ wait for my delivery, it’s only heavy artillery,<o:p></o:p></span></p>

<p class="MsoNormal"><span lang="EN-US">I’m mopping up the competition, the floor will get slippery.<o:p></o:p></span></p>

<p class="MsoNormal"><span lang="EN-US">Too bad can’t carry my gun on a flight,<o:p></o:p></span></p>

<p class="MsoNormal"><span lang="EN-US">but I get off the plane and you’re giving me the green light.<o:p></o:p></span></p>

<p class="MsoNormal"><span lang="EN-US">&nbsp;</span></p>

<p class="MsoNormal"><span>I feel like Locke, but holding a Glock,<o:p></o:p></span></p>

<p class="MsoNormal"><span lang="EN-US">wiping out the Flood, I kill ’em in cold blood.<o:p></o:p></span></p>

<p class="MsoNormal"><i><span lang="EN-US">&nbsp;</span></i></p>

<p class="MsoNormal"><i><span lang="EN-US">We now invite all passengers seated in Zone 1
to begin boarding flight 17121 to Mexico City. Please proceed to the gate with
your boarding pass and identification ready.<o:p></o:p></span></i></p>

<p class="MsoNormal"><i><span lang="EN-US">&nbsp;</span></i></p>

<p class="MsoNormal">If I get heated, I burst like a bag of Ruffles,<o:p></o:p></p>

<p class="MsoNormal">it's barely Monday, and I'm drowning in troubles.<o:p></o:p></p>

<p class="MsoNormal">But it doesn't matter, I'll grab you and you take it,<o:p></o:p></p>

<p class="MsoNormal">I'll take you from the back, while collecting the rest.<o:p></o:p></p>

<p class="MsoNormal"><o:p>&nbsp;</o:p></p>

<p class="MsoNormal"><span>They act so tough, but I'm the most ferocious.<o:p></o:p></span></p>

<p class="MsoNormal"><o:p>&nbsp;</o:p></p>

<p class="MsoNormal"><span lang="EN-US">My men? I like ‘em hot and tanned.<o:p></o:p></span></p>

<p class="MsoNormal"><span lang="EN-US">My girls? I want ‘em thick and bad.<o:p></o:p></span></p>

<p class="MsoNormal"><span lang="EN-US">And the non-binaries?<o:p></o:p></span></p>

<p class="MsoNormal"><span lang="EN-US">Turnin’ me on by looking mad.<o:p></o:p></span></p>

<p class="MsoNormal"><span lang="EN-US">&nbsp;</span></p>

<p class="MsoNormal">I always put 'em in the back, they always talkin’ trash.<o:p></o:p></p>

<p class="MsoNormal"><span lang="EN-US">Make up your mind—my rhymes hit you like canonballs.<o:p></o:p></span></p>

<p class="MsoNormal"><span lang="EN-US">U say you ain’t enjoying, but you reading it fast.<o:p></o:p></span></p>

<p class="MsoNormal"><span lang="EN-US">I keep walking like a queen, you ain’t even gotta ask.<o:p></o:p></span></p>

<p class="MsoNormal"><span lang="EN-US">But one thing I recall: you’re always wanting more.<o:p></o:p></span></p>

<p class="MsoNormal"><span lang="EN-US">&nbsp;</span></p>

<p class="MsoNormal"><span lang="EN-US">Welcome to the new game, welcome to the show.<o:p></o:p></span></p>

<p class="MsoNormal"><span lang="EN-US">Serving like I want fame; I only like it when it blows.<o:p></o:p></span></p>

<p class="MsoNormal"><i><span lang="EN-US">&nbsp;</span></i></p>

<p class="MsoNormal"><i><span lang="EN-US">Please make your way to the gate with your
boarding pass and identification ready. We appreciate your cooperation in
following the boarding process. Thank you.<o:p></o:p></span></i></p>`;

const creativityEN = `<div><div>I have always had a peculiar affinity for all forms of human knowledge. From an early age, I discovered the exact sciences and found myself immersed in an inexhaustible fascination for them. Every family meal, every visit to the zoo during the summers, every science book and magazine I devoured were a testament to my insatiable curiosity. I woke up early before preschool to watch documentaries, and in my early school years, I obsessed over the nature of marine life.</div><div><br></div><div>But it was in my adolescence that I met my first love, the one you never forget. I had found what would give meaning to my passage through this small corner of the universe, a new form of human knowledge, always present but hidden in plain sight: art.</div><div><br></div><div>Throughout time, humanity has stood out for its ability to transform the surrounding environment, from the simplest knowledge to that complex enough to cause substantial changes in the grand order of things, every step taken in this endless transformative process is worthy of admiration and recognition.</div><div><br></div><div>When we think of these changes, we usually remember milestones like the discovery of the atom or the implementation of agriculture in the valleys of Jericho over ten thousand years ago. However, there is an even more complex and abstract process, probably the only one capable of shaping our reality on a higher level.</div><div><br></div><div>Art and culture do not only reflect our reality, they also portray what we want to become and how we plan to build it. The relationship between environment and art is symbiotic and ever-present. Through literature, we are able to rewrite our own future while pointing at the present.</div><div><br></div><div>Art emerges as a banner of hope in difficult times, a voice that rises when everything else falls silent. It also accompanies us in our daily lives. From the cultural revolution during the First World War to the Cave of the Hands in Santa Cruz, Argentina, art has been a witness to and a catalyst of our evolution as a species.</div><div><br></div><div>I have always thought that our creativity is the most powerful tool for transforming our environment and material conditions; it is imperative to learn how to dream.</div><div>Only through it are we able to immortalize our visions of a better world.</div><div><br></div><div>In this collection of poems you will see that, my vision of the world expressed through fiction and the human spirit of creation. Reading between the lines, you might find some of my deepest thoughts, always mixed with my most visible flaws, hoping that everything I am and everything written in these pages acts not only as a reflection, but also as an instrument for change.</div><div><br></div><div>I hope you encounter more than one text that asks you new questions, that allows you to discover the world through someone else's eyes, maybe a couple of verses that make you laugh, but, above all, that you enjoy the reading, because art also exists for the simple act of enjoyment.</div></div>

<p class="MsoNormal"><span>&nbsp;</span></p>

<b><i><span>-Jacob Bronowski <u>"Other species leave traces of what they were, humanity leaves footprints of what it created."</u></span></i></b>`;

const wanderingEN = `<p class="MsoNormal">To the north, a new beginning.</p><p class="MsoNormal"><br></p><p class="MsoNormal">To the south, the shadow of a history</p><p class="MsoNormal">that cries out to be told.</p><p class="MsoNormal"><br></p><p class="MsoNormal">I carry my sins with me,</p><p class="MsoNormal">along with my salvation.</p><p class="MsoNormal"><br></p><p class="MsoNormal">Like a burden that, with its weeping,</p><p class="MsoNormal">passes judgment upon me.</p><p class="MsoNormal"><br></p><p class="MsoNormal">The sun hides,</p><p class="MsoNormal">the last trace of light bathes my aura</p><p class="MsoNormal">while sorrow looms ahead.</p><p class="MsoNormal"><br></p><p class="MsoNormal">I do not know where I am going,</p><p class="MsoNormal">but I cannot stop.</p><p class="MsoNormal"><br></p><p class="MsoNormal">The wind sweeps away the ashes</p><p class="MsoNormal">of a battle never fought.</p><p class="MsoNormal"><br></p><p class="MsoNormal">The man abdicates,</p><p class="MsoNormal">the girl hides,</p><p class="MsoNormal">the coward attacks,</p><p class="MsoNormal">the darkness gains ground.</p><p class="MsoNormal"><br></p><p class="MsoNormal">But there is another way.</p><p class="MsoNormal">There has to be.</p><p class="MsoNormal"><br></p><p class="MsoNormal">Eternal remedy for the infinite dilemma,</p><p class="MsoNormal">for the streets bathed by the blood of a thousand stories,</p><p class="MsoNormal">for the antagonist of his own narrative.</p><p class="MsoNormal"><br></p><p class="MsoNormal">Give me,</p><p class="MsoNormal">burden,</p><p class="MsoNormal">resolve</p><p class="MsoNormal">to tear down the throne</p><p class="MsoNormal">of the one who keeps us in the dark.</p><p class="MsoNormal"><br></p><p class="MsoNormal">Judgment for the guilty.</p><p class="MsoNormal">Justice for the people.</p><p class="MsoNormal"><br></p><p class="MsoNormal">The moon says hello and I say goodbye,</p><p class="MsoNormal">with crystalized eyes</p><p class="MsoNormal">that fall heavy with the weight of a million actions.</p><p class="MsoNormal"><br></p><p class="MsoNormal">Dreaming of peace,</p><p class="MsoNormal">dreaming of love.</p><div><br></div>`;

async function upload() {
  await mongoose.connect('mongodb+srv://transwfc_db_user:gSIj9aQLZD3lKypZ@cluster0.dpmvbmn.mongodb.net/poetry_anthology?retryWrites=true&w=majority');
  console.log('Connected');
  
  const chapters = await Chapter.find();
  for (let c of chapters) {
    if (translatedTexts[c.title]) c.titleEn = translatedTexts[c.title];
    if (c.title === '17121') c.contentEn = poem17121EN;
    if (c.title === 'Protector of mankind') c.contentEn = c.content;
    await c.save();
  }

  const poems = await Poem.find();
  for (let p of poems) {
    if (translatedTexts[p.title]) p.titleEn = translatedTexts[p.title];
    if (p.title === 'Sobre la creatividad humana.') p.contentEn = creativityEN;
    if (p.title === 'Soñadora errante.') p.contentEn = wanderingEN;
    await p.save();
  }

  console.log('Successfully updated translations!');
  process.exit(0);
}

upload();
