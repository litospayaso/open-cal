import ghpages from 'gh-pages';

ghpages.publish('gh-pages', function(err) {
  if (err) {
    console.log('*---------------------------------------------------------------------------*');
    console.log('|                                                                           |');
    console.log('|     ✨⭐', '\x1b[32m', 'released at: ', '\x1b[4m\x1b[36m', 'https://litospayaso.github.io/open-cal', '\x1b[0m', '⭐✨         |');
    console.log('|                                                                           |');
    console.log('*---------------------------------------------------------------------------*');
  } else {
    console.log('Successfully published to GitHub Pages!');
  }
});