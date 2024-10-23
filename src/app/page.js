'use client'

import { useState, useRef } from 'react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ScrollArea } from "../components/ui/scroll-area"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"

const skillCategories = {
  "Atléticas": ["Acrobacias", "Atletismo", "Montar", "Nadar", "Saltar", "Trepar"],
  "Sociales": ["Estilo", "Intimidar", "Liderazgo", "Persuasión"],
  "Subterfugio": ["Cerrajería", "Disfraz", "Ocultarse", "Robo", "Sigilo", "Trampería", "Venenos"],
  "Perceptivas": ["Advertir", "Buscar", "Rastrear"],
  "Intelectuales": ["Animales", "Ciencia", "Herbolaria", "Historia", "Medicina", "Memorizar", "Navegación", "Ocultismo", "Tasación", "Valoración mágica"],
  "Vigor": ["Frialdad", "Proezas de fuerza", "Resistir el dolor"],
  "Creativas": ["Arte", "Baile", "Forja", "Música", "Trucos de manos", "Runas", "Alquimia", "Animismo", "Caligrafía Ritual", "Orfebreria", "Confección", "Conf. marionetas"]
}

export default function AnimaCharacterSheet() {
  const initialSkills = Object.values(skillCategories).flat().reduce((acc, skill) => {
    acc[skill] = 0;
    return acc;
  }, {});

  const [character, setCharacter] = useState({
    name: 'Nuevo Personaje',
    attributes: {
      AGI: 5, CON: 5, DES: 5, FUE: 5, INT: 5, PER: 5, POD: 5, VOL: 5
    },
    advantages: [],
    disadvantages: [],
    skills: initialSkills,
    originalSkills: {},
    techniques: [],
    points: 3 

  })

  const [activeSection, setActiveSection] = useState('attributes')
  const [newSkillName, setNewSkillName] = useState('')
  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const fileInputRef = useRef(null)
  const availableAdvantages = [
    { name: 'Repetir una tirada de característica', cost: 1 },
    { name: 'Añadir 1 punto a una característica', cost: 1 },
    // Añade más ventajas según el PDF...
  ];
  
  const availableDisadvantages = [
    { name: 'Reducir dos puntos a una característica', gain: 1 },
    { name: 'Salud enfermiza', gain: 1 },
    // Añade más desventajas según el PDF...
  ];
  const updateAttribute = (attr, value) => {
    setCharacter(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attr]: Math.max(1, Math.min(10, parseInt(value) || 0))
      }
    }))
  }
  const addAdvantage = (advantage, cost) => {
    if (character.points >= cost) {
      setCharacter(prev => ({
        ...prev,
        advantages: [...prev.advantages, { name: advantage, cost }],
        points: prev.points - cost
      }));
    } else {
      alert("No tienes suficientes puntos para esta ventaja.");
    }
  };
  
  const addDisadvantage = (disadvantage, gain) => {
    setCharacter(prev => ({
      ...prev,
      disadvantages: [...prev.disadvantages, { name: disadvantage, gain }],
      points: prev.points + gain
    }));
  };

  const removeAdvantage = (index) => {
    const advantageToRemove = character.advantages[index];
    setCharacter(prev => ({
      ...prev,
      advantages: prev.advantages.filter((_, i) => i !== index),
      points: prev.points + advantageToRemove.cost
    }));
  };
  
  const removeDisadvantage = (index) => {
    const disadvantageToRemove = character.disadvantages[index];
    setCharacter(prev => ({
      ...prev,
      disadvantages: prev.disadvantages.filter((_, i) => i !== index),
      points: prev.points - disadvantageToRemove.gain
    }));
  };

  const updateSkill = (skill, value, isOriginal = false) => {
    setCharacter(prev => ({
      ...prev,
      [isOriginal ? 'originalSkills' : 'skills']: {
        ...prev[isOriginal ? 'originalSkills' : 'skills'],
        [skill]: Math.max(0, parseInt(value) || 0)
      }
    }))
  }

  const addNewSkill = () => {
    if (newSkillName && !character.skills.hasOwnProperty(newSkillName) && !character.originalSkills.hasOwnProperty(newSkillName)) {
      setCharacter(prev => ({
        ...prev,
        originalSkills: {
          ...prev.originalSkills,
          [newSkillName]: 0
        }
      }))
      setNewSkillName('')
      setIsAddingSkill(false)
    }
  }

  const downloadCharacter = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(character, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", character.name + ".json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const uploadCharacter = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result)
          setCharacter(json)
        } catch (error) {
          console.error("Error parsing JSON file:", error)
          alert("Error al cargar el archivo. Asegúrate de que es un JSON válido.")
        }
      }
      reader.readAsText(file)
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'attributes':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Atributos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {Object.entries(character.attributes).map(([attr, value]) => (
    <div key={attr} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <Label htmlFor={attr}>{attr}</Label>
      <Input
        id={attr}
        type="number"
        value={value}
        onChange={(e) => updateAttribute(attr, e.target.value)}
        min="1"
        max="10"
        className="w-16 text-center"
      />
    </div>
  ))}
</CardContent>
          </Card>
        )
      case 'skills':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Habilidades
                <Dialog open={isAddingSkill} onOpenChange={setIsAddingSkill}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Añadir Habilidad</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Añadir Nueva Habilidad</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        placeholder="Nombre de la habilidad"
                      />
                      <Button onClick={addNewSkill}>Añadir</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {Object.entries(skillCategories).map(([category, skills]) => (
                  <Accordion type="single" collapsible key={category}>
                    <AccordionItem value={category}>
                      <AccordionTrigger>{category}</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {skills.map(skill => (
                            <div key={skill} className="flex flex-col items-center">
                              <Label htmlFor={skill}>{skill}</Label>
                              <Input
                                id={skill}
                                type="number"
                                value={character.skills[skill]}
                                onChange={(e) => updateSkill(skill, e.target.value)}
                                min="0"
                                className="w-16 text-center"
                              />
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
                {Object.keys(character.originalSkills).length > 0 && (
                  <Accordion type="single" collapsible>
                    <AccordionItem value="originales">
                      <AccordionTrigger>Originales</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {Object.entries(character.originalSkills).map(([skill, value]) => (
                            <div key={skill} className="flex flex-col items-center">
                              <Label htmlFor={skill}>{skill}</Label>
                              <Input
                                id={skill}
                                type="number"
                                value={value}
                                onChange={(e) => updateSkill(skill, e.target.value, true)}
                                min="0"
                                className="w-16 text-center"
                              />
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        )
      case 'advantages':
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
          <Button variant="outline" size="sm" className="ml-2" onClick={() => removeAdvantage(index)}>
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
          <Button variant="outline" size="sm" className="ml-2" onClick={() => removeDisadvantage(index)}>
            Borrar
          </Button>
        </li>
      ))}
    </ul>
  </div>
</CardContent>

</Card>
        )
      case 'techniques':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Técnicas</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Aquí puedes añadir la lógica para gestionar técnicas</p>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">ANIMA: Beyond Fantasy - Hoja de Personaje</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <Input
            value={character.name}
            onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
            className="mb-4 text-2xl font-bold"
          />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="attributes">
              <AccordionTrigger onClick={() => setActiveSection('attributes')}>Atributos</AccordionTrigger>
              <AccordionContent>
                <ul>
                  {Object.keys(character.attributes).map(attr => (
                    <li key={attr} className="cursor-pointer hover:bg-gray-100 p-1" onClick={() => setActiveSection('attributes')}>
                      {attr}: {character.attributes[attr]}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="skills">
              <AccordionTrigger onClick={() => setActiveSection('skills')}>Habilidades</AccordionTrigger>
              <AccordionContent>
                <Accordion type="multiple" className="w-full">
                  {Object.entries(skillCategories).map(([category, skills]) => (
                    <AccordionItem value={category} key={category}>
                      <AccordionTrigger className="text-sm">{category}</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-3 gap-1">
                          {skills.map(skill => (
                            <div key={skill} className="text-xs p-1 hover:bg-gray-100">
                              {skill}: {character.skills[skill]}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                  {Object.keys(character.originalSkills).length > 0 && (
                    <AccordionItem value="originales">
                      <AccordionTrigger className="text-sm">Originales</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-3 gap-1">
                          {Object.entries(character.originalSkills).map(([skill, value]) => (
                            <div key={skill} className="text-xs p-1 hover:bg-gray-100">
                              {skill}: {value}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="advantages">
              <AccordionTrigger onClick={() => setActiveSection('advantages')}>Ventajas/Desventajas</AccordionTrigger>
              <AccordionContent>
                <p className="cursor-pointer hover:bg-gray-100 p-1" onClick={() => setActiveSection('advantages')}>
                  Gestionar ventajas y desventajas
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="techniques">
              <AccordionTrigger onClick={() => setActiveSection('techniques')}>Técnicas</AccordionTrigger>
              <AccordionContent>
                <p className="cursor-pointer hover:bg-gray-100 p-1" onClick={() => setActiveSection('techniques')}>
                  Gestionar técnicas
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="w-full md:w-2/3">
          {renderContent()}
        </div>
      </div>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Resumen del Personaje</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <pre>{JSON.stringify(character, null, 2)}</pre>
          </ScrollArea>
        </CardContent>
      </Card>
      
      <div className="mt-4 flex gap-4">
        <Button  onClick={downloadCharacter}>Descargar Personaje</Button>
        <Button onClick={() => fileInputRef.current.click()}>Cargar Personaje</Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={uploadCharacter}
          accept=".json"
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}