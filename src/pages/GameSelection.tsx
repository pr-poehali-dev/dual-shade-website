import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Character {
  name: string;
  strength: number;
  agility: number;
  intelligence: number;
}

const CHARACTERS: Character[] = [
  { name: 'Рай', strength: 8, agility: 6, intelligence: 7 },
  { name: 'Китсуми', strength: 5, agility: 9, intelligence: 8 },
  { name: 'Иоширо', strength: 9, agility: 5, intelligence: 6 },
  { name: 'Намае', strength: 7, agility: 7, intelligence: 9 },
  { name: 'Вхуу', strength: 6, agility: 8, intelligence: 7 },
  { name: 'Киота', strength: 8, agility: 7, intelligence: 6 },
];

const GameSelection = () => {
  const [selectedSlots, setSelectedSlots] = useState<(Character | null)[]>([null, null, null]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number | null>(null);

  const handleSlotClick = (index: number) => {
    setCurrentSlotIndex(index);
    setIsDialogOpen(true);
  };

  const handleCharacterSelect = (character: Character) => {
    if (currentSlotIndex !== null) {
      const newSlots = [...selectedSlots];
      newSlots[currentSlotIndex] = character;
      setSelectedSlots(newSlots);
      setIsDialogOpen(false);
    }
  };

  const isCharacterSelected = (character: Character) => {
    return selectedSlots.some(slot => slot?.name === character.name);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="golden-frame w-full max-w-6xl p-8 md:p-12">
        <div className="bg-card/90 backdrop-blur-sm rounded-lg p-8 border-2 border-accent">
          <h1 className="text-5xl md:text-6xl text-center text-accent mb-12 font-bold">
            Соберите команду
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {selectedSlots.map((slot, index) => (
              <Card
                key={index}
                className="aspect-[3/4] bg-card/50 border-2 border-accent hover:border-accent/80 transition-all cursor-pointer group relative overflow-hidden animate-fade-in"
                onClick={() => handleSlotClick(index)}
              >
                {slot ? (
                  <div className="h-full p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-3xl font-bold text-accent mb-6">{slot.name}</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-foreground/80 flex items-center gap-2">
                            <Icon name="Swords" size={20} className="text-destructive" />
                            Сила
                          </span>
                          <span className="text-2xl font-bold text-accent">{slot.strength}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-foreground/80 flex items-center gap-2">
                            <Icon name="Zap" size={20} className="text-accent" />
                            Ловкость
                          </span>
                          <span className="text-2xl font-bold text-accent">{slot.agility}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-foreground/80 flex items-center gap-2">
                            <Icon name="Brain" size={20} className="text-secondary" />
                            Интеллект
                          </span>
                          <span className="text-2xl font-bold text-accent">{slot.intelligence}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSlotClick(index);
                      }}
                    >
                      Изменить
                    </Button>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <Icon
                      name="Plus"
                      size={80}
                      className="text-accent/40 group-hover:text-accent/60 transition-colors"
                    />
                  </div>
                )}
              </Card>
            ))}
          </div>

          {selectedSlots.every(slot => slot !== null) && (
            <div className="text-center animate-fade-in">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-xl px-12 py-6 font-bold"
              >
                Начать игру
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl bg-card border-2 border-accent">
          <DialogHeader>
            <DialogTitle className="text-4xl text-accent font-bold text-center">
              Выберите персонажа
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {CHARACTERS.map((character) => (
              <Card
                key={character.name}
                className={`p-4 cursor-pointer transition-all hover:scale-105 border-2 ${
                  isCharacterSelected(character)
                    ? 'border-muted bg-muted/20 opacity-50 cursor-not-allowed'
                    : 'border-accent hover:border-accent/80 hover:bg-card/80'
                }`}
                onClick={() => !isCharacterSelected(character) && handleCharacterSelect(character)}
              >
                <h3 className="text-2xl font-bold text-accent mb-3">{character.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-foreground/80">
                      <Icon name="Swords" size={16} className="text-destructive" />
                      Сила
                    </span>
                    <span className="font-bold text-accent">{character.strength}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-foreground/80">
                      <Icon name="Zap" size={16} className="text-accent" />
                      Ловк.
                    </span>
                    <span className="font-bold text-accent">{character.agility}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-foreground/80">
                      <Icon name="Brain" size={16} className="text-secondary" />
                      Интел.
                    </span>
                    <span className="font-bold text-accent">{character.intelligence}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameSelection;
