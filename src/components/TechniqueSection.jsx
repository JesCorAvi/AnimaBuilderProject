import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ScrollArea } from "../components/ui/scroll-area"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { useState } from 'react'


export default function TechniqueSection({ character, setCharacter }) {
  const [newTechnique, setNewTechnique] = useState('');

  const addTechnique = () => {
    if (newTechnique && !character.techniques.includes(newTechnique)) {
      setCharacter(prev => ({
        ...prev,
        techniques: [...prev.techniques, newTechnique]
      }));
      setNewTechnique('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Técnicas
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Añadir Técnica</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Nueva Técnica</DialogTitle>
              </DialogHeader>
              <Input value={newTechnique} onChange={(e) => setNewTechnique(e.target.value)} />
              <Button onClick={addTechnique}>Añadir Técnica</Button>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <ul>
            {character.techniques.map((technique, idx) => <li key={idx}>{technique}</li>)}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
