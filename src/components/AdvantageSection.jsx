import { useState } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";

export default function AdvantageSection({ character, setCharacter }) {
  const [newAdvantage, setNewAdvantage] = useState('');
  const [newDisadvantage, setNewDisadvantage] = useState('');

  const availableAdvantages = [
    { name: 'Repetir una tirada de característica', cost: 1 },
    { name: 'Añadir 1 punto a una característica', cost: 1 },
  ];

  const availableDisadvantages = [
    { name: 'Reducir dos puntos a una característica', gain: 1 },
    { name: 'Salud enfermiza', gain: 1 },
  ];

  const addAdvantage = (advantage, cost) => {
    if (character.points >= cost) {
      setCharacter(prev => ({
        ...prev,
        advantages: [...prev.advantages, { name: advantage, cost }],
        points: prev.points - cost,
      }));
    } else {
      alert("No tienes suficientes puntos para esta ventaja.");
    }
  };

  const addDisadvantage = (disadvantage, gain) => {
    setCharacter(prev => ({
      ...prev,
      disadvantages: [...prev.disadvantages, { name: disadvantage, gain }],
      points: prev.points + gain,
    }));
  };

  const removeAdvantage = (index) => {
    const advantageToRemove = character.advantages[index];
    setCharacter(prev => ({
      ...prev,
      advantages: prev.advantages.filter((_, i) => i !== index),
      points: prev.points + advantageToRemove.cost,
    }));
  };

  const removeDisadvantage = (index) => {
    const disadvantageToRemove = character.disadvantages[index];
    setCharacter(prev => ({
      ...prev,
      disadvantages: prev.disadvantages.filter((_, i) => i !== index),
      points: prev.points - disadvantageToRemove.gain,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventajas y Desventajas</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Puntos disponibles: {character.points}</p>
        <div className="py-5">
          {/* Botón para añadir ventaja */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Añadir Ventaja</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Seleccionar Ventaja</DialogTitle>
              </DialogHeader>
              <div className="flexbox">
                {availableAdvantages.map(({ name, cost }) => (
                  <div className='p-2' key={name}>
                    <Button variant="outline" onClick={() => addAdvantage(name, cost)}>
                      {name} (Coste: {cost} puntos)
                    </Button>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Botón para añadir desventaja */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Añadir Desventaja</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Seleccionar Desventaja</DialogTitle>
              </DialogHeader>
              <div>
                {availableDisadvantages.map(({ name, gain }) => (
                  <div className='p-2' key={name}>
                    <Button variant="outline" onClick={() => addDisadvantage(name, gain)}>
                      {name} (Gana: {gain} puntos)
                    </Button>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de ventajas seleccionadas */}
        <div>
          <h3 className='font-semibold py-5'>Ventajas Seleccionadas</h3>
          <ul>
            {character.advantages.map((adv, index) => (
              <li key={index} className="flex justify-between items-center">
                {adv.name} (Coste: {adv.cost})
                <Button variant="destructive" size="sm" className="ml-2" onClick={() => removeAdvantage(index)}>
                  Borrar
                </Button>
              </li>
            ))}
          </ul>

          {/* Lista de desventajas seleccionadas */}
          <h3 className='font-semibold py-5'>Desventajas Seleccionadas</h3>
          <ul>
            {character.disadvantages.map((dis, index) => (
              <li key={index} className="flex justify-between items-center">
                {dis.name} (Gana: {dis.gain} puntos)
                <Button variant="destructive" size="sm" className="ml-2" onClick={() => removeDisadvantage(index)}>
                  Borrar
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
