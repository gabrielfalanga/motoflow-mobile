#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🔨 Gerando commit-hash.txt...");

try {
  // Obter o hash do commit atual
  const hash = execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim();

  // Escrever no arquivo
  const filePath = path.join(__dirname, "..", "commit-hash.txt");
  fs.writeFileSync(filePath, hash);

  console.log(`✅ Hash do commit gerado: ${hash.substring(0, 7)}...`);
  console.log(`📄 Arquivo criado em: ${filePath}`);
} catch (error) {
  console.error("❌ Erro ao gerar hash do commit:", error.message);
  // Criar arquivo com fallback
  const filePath = path.join(__dirname, "..", "commit-hash.txt");
  fs.writeFileSync(filePath, "build-error");
  console.log("⚠️  Usando valor de fallback: build-error");
}
