/* global Phaser, GAME_WIDTH, GAME_HEIGHT, BootScene, PreloadScene, DungeonScene */

try {
  if (typeof Phaser === 'undefined') {
    throw new Error('Phaser non disponible');
  }

  new Phaser.Game({
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#0a0a12',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, PreloadScene, DungeonScene],
  });
} catch (error) {
  var message = error && error.message ? error.message : String(error);
  if (typeof showBootError === 'function') {
    showBootError('Impossible de lancer le jeu : ' + message);
  } else {
    document.body.innerHTML = '<pre style="color:#ff6b6b;padding:16px">' + message + '</pre>';
  }
}
