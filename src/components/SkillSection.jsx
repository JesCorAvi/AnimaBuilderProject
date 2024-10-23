import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../components/ui/accordion";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { useState } from "react";

export const skillCategories = {
  "Atléticas": ["Acrobacias", "Atletismo", "Montar", "Nadar", "Saltar", "Trepar", "Pilotar"],
  "Sociales": ["Estilo", "Intimidar", "Liderazgo", "Persuasión", "Comercio", "Callejeo", "Etiqueta"],
  "Subterfugio": ["Cerrajería", "Disfraz", "Ocultarse", "Robo", "Sigilo", "Trampería", "Venenos"],
  "Perceptivas": ["Advertir", "Buscar", "Rastrear"],
  "Intelectuales": ["Animales", "Ciencia", "Herbolaria", "Historia", "Medicina", "Memorizar", "Navegación", "Ocultismo", "Tasación", "Valoración mágica"],
  "Vigor": ["Frialdad", "Proezas de fuerza", "Resistir el dolor"],
  "Creativas": ["Arte", "Baile", "Forja", "Música", "Trucos de manos", "Runas", "Alquimia", "Animismo", "Caligrafía Ritual", "Orfebrería", "Confección", "Conf. marionetas"],
  "Originales": [],
};

export default function SkillSection({ character, setCharacter }) {
  const [newSkillName, setNewSkillName] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const updateSkill = (skill, value, isOriginal = false) => {
    setCharacter((prev) => ({
      ...prev,
      [isOriginal ? "originalSkills" : "skills"]: {
        ...prev[isOriginal ? "originalSkills" : "skills"],
        [skill]: Math.max(0, parseInt(value) || 0),
      },
    }));
  };

  const addNewSkill = () => {
    if (newSkillName.trim()) {
      // Agregar la nueva habilidad a la categoría "Originales"
      skillCategories.Originales.push(newSkillName);

      // Actualizar el estado del personaje para incluir la nueva habilidad
      setCharacter((prev) => ({
        ...prev,
        originalSkills: {
          ...prev.originalSkills,
          [newSkillName]: 0, // Iniciar con valor 0
        },
      }));

      // Limpiar el nombre de la habilidad
      setNewSkillName("");
      setIsAddingSkill(false);
    }
  };

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
              <Input value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} />
              <Button onClick={addNewSkill}>Añadir</Button>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
  <ScrollArea className="h-1/3">
    {Object.entries(skillCategories).map(([category, skills]) => (
      <Accordion key={category} type="single" collapsible className="w-full">
        <AccordionItem value={category}>
          <AccordionTrigger>{category}</AccordionTrigger>
          <AccordionContent className="p-3">
            <div className="grid grid-cols-4  gap-4">
              {skills.map((skill) => (
                <div key={skill} className="flex flex-col items-center mb-2">
                  <Label className="text-center py-1" htmlFor={skill}>{skill}</Label>
                  <Input
                    id={skill}
                    type="number"
                    value={character.skills[skill] || 0}
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
  </ScrollArea>
</CardContent>


    </Card>
  );
}
