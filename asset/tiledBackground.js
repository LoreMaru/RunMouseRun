export function drawTiledBackgroundContrast(scene, tileSize = 40) {
    const width = scene.scale.width;
    const height = scene.scale.height;
  
    const graphics = scene.add.graphics();
  
    // Colori originali
    //const baseColor = 0x3B2F2F; // Marrone scuro spento
    //const borderColor = 0x1E2F5C; // Blu profondo
    //const lighterColor = 0x4C3E3E; // leggermente più chiaro
  
    //nuova palette
    const baseColor = 0x6B4F3F; // marrone legno
    const borderColor = 0x3E2B1F; // marrone più scuro per contorno
    const lighterColor = 0x7C5B48; // piastrella chiara
  
    // Riempimento sfondo marrone
    graphics.fillStyle(baseColor, 1);
    graphics.fillRect(0, 0, width, height);
  
    graphics.lineStyle(2, borderColor, 1);
  
    for (let y = 0; y < height; y += tileSize) {
      for (let x = 0; x < width; x += tileSize) {
        if (((x / tileSize) + (y / tileSize)) % 2 === 0) {
          // Piastrella più chiara per effetto alternato
          graphics.fillStyle(lighterColor, 1);
          graphics.fillRect(x, y, tileSize, tileSize);
        }
        graphics.strokeRect(x, y, tileSize, tileSize);
      }
    }
  }

  export function drawTiledBackgroundLighter(scene, tileSize = 40) {
    const width = scene.scale.width;
    const height = scene.scale.height;
  
    const graphics = scene.add.graphics();
  
    const baseColor = 0x6B4F3F;
    const borderColor = 0x3E2B1F;
    const lighterColor = 0x7C5B48;
  
    graphics.fillStyle(baseColor, 1);
    graphics.fillRect(0, 0, width, height);
  
    for (let y = 0; y < height; y += tileSize) {
      for (let x = 0; x < width; x += tileSize) {
        if (((x / tileSize) + (y / tileSize)) % 2 === 0) {
          graphics.fillStyle(lighterColor, 1);
          graphics.fillRect(x, y, tileSize, tileSize);
        }
  
        // Dettaglio interno per dare profondità
        graphics.fillStyle(0x000000, 0.05);
        graphics.fillRect(x + 4, y + 4, 8, 2);
      }
    }
  
    // Bordi più delicati
    graphics.lineStyle(1, borderColor, 0.3);
    for (let y = 0; y < height; y += tileSize) {
      for (let x = 0; x < width; x += tileSize) {
        graphics.strokeRect(x, y, tileSize, tileSize);
      }
    }
  }
  