import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"


export default function AttributeSection({ character, updateAttribute }) {
  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Atributos</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(character.attributes).map(([attr, value]) => (
          <div key={attr} className="grid place-items-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Label className="flex" htmlFor={attr}>{attr}</Label>
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
    <Card>
      <CardHeader>
        <CardTitle>Resistencias</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {Object.entries(character.resistances).map(([attr, value]) => (
          <div key={attr} className="grid place-items-center grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            <Label className="flex" htmlFor={attr}>{attr}</Label>
            <Input
              id={attr}
              type="number"
              value={value}
              min="1"
              max="10"
              className="w-16 text-center pointer-events-none"
              readOnly
            />
          </div>
        ))}
      </CardContent>
    </Card>
    </>
  )
}
