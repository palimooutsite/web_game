"use client";

import { useMemo, useState } from "react";

type Enemy = {
  name: string;
  hp: number;
  attack: number;
  exp: number;
};

const enemies: Enemy[] = [
  { name: "Slime Rawa", hp: 20, attack: 4, exp: 8 },
  { name: "Serigala Senja", hp: 30, attack: 6, exp: 12 },
  { name: "Golem Batu", hp: 40, attack: 8, exp: 18 },
];

const maxPlayerHp = 60;

export default function HomePage() {
  const [playerHp, setPlayerHp] = useState(maxPlayerHp);
  const [playerAttack, setPlayerAttack] = useState(10);
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [gold, setGold] = useState(0);
  const [enemy, setEnemy] = useState<Enemy | null>(null);
  const [enemyHp, setEnemyHp] = useState(0);
  const [log, setLog] = useState<string[]>(["Selamat datang, petualang!"]);
  const [potions, setPotions] = useState(3);

  const expToLevel = useMemo(() => level * 20, [level]);

  const addLog = (message: string) => {
    setLog((prev) => [message, ...prev].slice(0, 8));
  };

  const explore = () => {
    if (playerHp <= 0) {
      addLog("Kamu pingsan. Gunakan ramuan atau reset permainan.");
      return;
    }

    if (enemy) {
      addLog("Kamu masih dalam pertempuran!");
      return;
    }

    const foundEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    setEnemy(foundEnemy);
    setEnemyHp(foundEnemy.hp);
    addLog(`Kamu bertemu ${foundEnemy.name}!`);
  };

  const attack = () => {
    if (!enemy || playerHp <= 0) {
      addLog("Tidak ada target untuk diserang.");
      return;
    }

    const damage = Math.floor(Math.random() * 6) + playerAttack - 2;
    const newEnemyHp = Math.max(enemyHp - damage, 0);
    setEnemyHp(newEnemyHp);
    addLog(`Seranganmu menghasilkan ${damage} damage.`);

    if (newEnemyHp <= 0) {
      const gainedGold = Math.floor(Math.random() * 10) + 5;
      const newExp = exp + enemy.exp;
      setGold((g) => g + gainedGold);
      setExp(newExp);
      setEnemy(null);
      addLog(`Kamu mengalahkan ${enemy.name} dan mendapatkan ${gainedGold} emas!`);

      if (newExp >= expToLevel) {
        setLevel((l) => l + 1);
        setExp(newExp - expToLevel);
        setPlayerAttack((atk) => atk + 2);
        setPlayerHp(maxPlayerHp);
        addLog("Level up! Serangan meningkat dan HP dipulihkan.");
      }
      return;
    }

    const enemyDamage = Math.max(Math.floor(Math.random() * 5) + enemy.attack - 2, 1);
    const newPlayerHp = Math.max(playerHp - enemyDamage, 0);
    setPlayerHp(newPlayerHp);
    addLog(`${enemy.name} menyerang balik sebesar ${enemyDamage} damage.`);

    if (newPlayerHp <= 0) {
      addLog("Kamu kalah! Gunakan ramuan atau reset permainan.");
    }
  };

  const usePotion = () => {
    if (potions <= 0) {
      addLog("Ramuan habis. Beli di toko.");
      return;
    }

    if (playerHp >= maxPlayerHp) {
      addLog("HP kamu sudah penuh.");
      return;
    }

    setPotions((p) => p - 1);
    setPlayerHp((hp) => Math.min(hp + 20, maxPlayerHp));
    addLog("Kamu meminum ramuan dan memulihkan 20 HP.");
  };

  const buyPotion = () => {
    if (gold < 12) {
      addLog("Emas tidak cukup untuk membeli ramuan (12 emas).");
      return;
    }

    setGold((g) => g - 12);
    setPotions((p) => p + 1);
    addLog("Kamu membeli 1 ramuan.");
  };

  const resetGame = () => {
    setPlayerHp(maxPlayerHp);
    setPlayerAttack(10);
    setLevel(1);
    setExp(0);
    setGold(0);
    setEnemy(null);
    setEnemyHp(0);
    setPotions(3);
    setLog(["Permainan direset. Semangat bertualang!"]);
  };

  return (
    <main className="container">
      <h1>⚔️ RPG Nusantara Interaktif</h1>
      <p className="subtitle">Jelajahi hutan, lawan monster, dan naik level!</p>

      <section className="stats">
        <div>HP: {playerHp}/{maxPlayerHp}</div>
        <div>ATK: {playerAttack}</div>
        <div>Level: {level}</div>
        <div>EXP: {exp}/{expToLevel}</div>
        <div>Emas: {gold}</div>
        <div>Ramuan: {potions}</div>
      </section>

      <section className="arena">
        {enemy ? (
          <>
            <h2>Musuh: {enemy.name}</h2>
            <p>HP Musuh: {enemyHp}/{enemy.hp}</p>
          </>
        ) : (
          <h2>Tidak ada musuh. Yuk eksplorasi!</h2>
        )}
      </section>

      <section className="actions">
        <button onClick={explore}>Eksplorasi</button>
        <button onClick={attack}>Serang</button>
        <button onClick={usePotion}>Minum Ramuan</button>
        <button onClick={buyPotion}>Beli Ramuan (12 emas)</button>
        <button className="danger" onClick={resetGame}>Reset</button>
      </section>

      <section className="log">
        <h3>Log Pertarungan</h3>
        <ul>
          {log.map((entry, idx) => (
            <li key={`${entry}-${idx}`}>{entry}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
