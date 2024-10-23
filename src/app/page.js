'use client'

import { useState, useRef } from 'react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ScrollArea } from "../components/ui/scroll-area"
import { Accordion, AccordionItem, AccordionTrigger } from "../components/ui/accordion"
import AttributeSection from '../components/AttributeSection'
import SkillSection from '../components/SkillSection'
import { skillCategories } from '../components/SkillSection';
import AdvantageSection from '../components/AdvantageSection'
import TechniqueSection from '../components/TechniqueSection'
import { Dialog, DialogTrigger } from "../components/ui/dialog"

export default function CharacterSheet() {
  const initialSkills = Object.values(skillCategories).flat().reduce((acc, skill) => {
    acc[skill] = 0;
    return acc;
  }, {});

  const [character, setCharacter] = useState({
    name: 'Nuevo Personaje',
    attributes: {
      AGI: 5, CON: 5, DES: 5, FUE: 5, INT: 5, PER: 5, POD: 5, VOL: 5
    },
    resistances: {RF: 0, RE: 0, RV: 0, RM: 0, RP: 0},
    advantages: [],
    disadvantages: [],
    skills: initialSkills,
    originalSkills: {},
    techniques: [],
    points: 3
  });

  const [activeSection, setActiveSection] = useState('attributes');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const fileInputRef = useRef(null);

  const updateAttribute = (attr, value) => {
    setCharacter(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attr]: Math.max(1, Math.min(10, parseInt(value) || 0))
      }
    }));
  }

  const downloadCharacter = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(character, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", character.name + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  const uploadCharacter = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          setCharacter(json);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
          alert("Error al cargar el archivo. Asegúrate de que es un JSON válido.");
        }
      };
      reader.readAsText(file);
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'attributes':
        return <AttributeSection character={character} updateAttribute={updateAttribute} />;
      case 'skills':
        return <SkillSection character={character} setCharacter={setCharacter} />;
      case 'advantages':
        return <AdvantageSection character={character} setCharacter={setCharacter} />;
      case 'techniques':
        return <TechniqueSection character={character} setCharacter={setCharacter} />;
      default:
        return null;
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
              <AccordionTrigger onClick={() => setActiveSection('attributes')}>Principal</AccordionTrigger>
            </AccordionItem>
            <AccordionItem value="skills">
              <AccordionTrigger onClick={() => setActiveSection('skills')}>Habilidades</AccordionTrigger>
            </AccordionItem>
            <AccordionItem value="advantages">
              <AccordionTrigger onClick={() => setActiveSection('advantages')}>Ventajas/Desventajas</AccordionTrigger>
            </AccordionItem>
            <AccordionItem value="techniques">
              <AccordionTrigger onClick={() => setActiveSection('techniques')}>Técnicas</AccordionTrigger>
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
        <Button onClick={downloadCharacter}>Descargar Personaje</Button>
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
  );
}
