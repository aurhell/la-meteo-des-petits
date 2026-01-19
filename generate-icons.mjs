#!/usr/bin/env node

/**
 * Script pour générer les icônes PWA à partir d'un SVG
 * Crée pwa-192x192.png, pwa-512x512.png et apple-touch-icon.png
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

import sharp from "sharp"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function generateIcons() {
  const svgPath = path.join(__dirname, "public", "icon.svg")
  const publicDir = path.join(__dirname, "public")

  if (!fs.existsSync(svgPath)) {
    console.error(`❌ Fichier SVG introuvable: ${svgPath}`)
    process.exit(1)
  }

  console.log("🎨 Génération des icônes PWA...")

  try {
    // Générer pwa-192x192.png
    await sharp(svgPath)
      .resize(192, 192, {
        fit: "contain",
        background: "#60a5fa", 
      })
      .png()
      .toFile(path.join(publicDir, "pwa-192x192.png"))
    console.log("✅ pwa-192x192.png généré")

    // Générer pwa-512x512.png
    await sharp(svgPath)
      .resize(512, 512, {
        fit: "contain",
        background: "#60a5fa", 
      })
      .png()
      .toFile(path.join(publicDir, "pwa-512x512.png"))
    console.log("✅ pwa-512x512.png généré")

    // Générer apple-touch-icon.png (180x180 pour l'écran d'accueil)
    await sharp(svgPath)
      .resize(180, 180, {
        fit: "contain",
        background: "#60a5fa", 
      })
      .png()
      .toFile(path.join(publicDir, "apple-touch-icon.png"))
    console.log("✅ apple-touch-icon.png généré")

    console.log("\n🎉 Tous les icônes PWA ont été générés avec succès!")
  } catch (error) {
    console.error("❌ Erreur lors de la génération des icônes:")
    console.error(error)
    process.exit(1)
  }
}

generateIcons()
