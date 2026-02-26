import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface Character {
  name: string;
  health: number;
  normalAttack: number;
  powerAttack: number;
  superAttack: number;
}

const CHARACTERS: Character[] = [
  { name: 'Иоширо', health: 10, normalAttack: 2, powerAttack: 3, superAttack: 4 },
  { name: 'Намае',  health: 10, normalAttack: 2, powerAttack: 3, superAttack: 4 },
  { name: 'Китсуми', health: 10, normalAttack: 1, powerAttack: 3, superAttack: 5 },
  { name: 'Ида',   health: 10, normalAttack: 1, powerAttack: 3, superAttack: 4 },
  { name: 'Киота', health: 10, normalAttack: 1, powerAttack: 2, superAttack: 5 },
  { name: 'Рай',   health: 10, normalAttack: 2, powerAttack: 3, superAttack: 5 },
];

const GameSelection = () => {
  const navigate = useNavigate();
  const [team1, setTeam1] = useState<(Character | null)[]>([null, null, null]);
  const [team2, setTeam2] = useState<(Character | null)[]>([null, null, null]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<1 | 2>(1);
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number | null>(null);

  const handleSlotClick = (team: 1 | 2, index: number) => {
    setCurrentTeam(team);
    setCurrentSlotIndex(index);
    setIsDialogOpen(true);
  };

  const handleCharacterSelect = (character: Character) => {
    if (currentSlotIndex !== null) {
      if (currentTeam === 1) {
        const newTeam = [...team1];
        newTeam[currentSlotIndex] = character;
        setTeam1(newTeam);
      } else {
        const newTeam = [...team2];
        newTeam[currentSlotIndex] = character;
        setTeam2(newTeam);
      }
      setIsDialogOpen(false);
    }
  };

  const isCharacterSelected = (character: Character) => {
    return [...team1, ...team2].some(slot => slot?.name === character.name);
  };

  const allTeamsReady = team1.every(slot => slot !== null) && team2.every(slot => slot !== null);

  const handleStartGame = () => {
    navigate('/battle', { state: { team1, team2 } });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        <h1 className="text-5xl md:text-6xl text-center text-accent mb-8 font-bold">
          Выбор команд
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team 1 */}
          <div className="golden-frame p-6">
            <h2 className="text-3xl text-center text-accent mb-6 font-bold">Команда 1</h2>
            <div className="grid grid-cols-3 gap-4">
              {team1.map((slot, index) => (
                <Card
                  key={index}
                  className="aspect-[3/4] bg-card/50 border-2 border-accent hover:border-accent/80 transition-all cursor-pointer group relative overflow-hidden"
                  onClick={() => handleSlotClick(1, index)}
                >
                  {slot ? (
                    <div className="h-full p-4 flex flex-col items-center justify-center">
                      <h3 className="text-2xl font-bold text-accent text-center">{slot.name}</h3>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <Icon
                        name="Plus"
                        size={60}
                        className="text-accent/40 group-hover:text-accent/60 transition-colors"
                      />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Team 2 */}
          <div className="golden-frame p-6">
            <h2 className="text-3xl text-center text-accent mb-6 font-bold">Команда 2</h2>
            <div className="grid grid-cols-3 gap-4">
              {team2.map((slot, index) => (
                <Card
                  key={index}
                  className="aspect-[3/4] bg-card/50 border-2 border-accent hover:border-accent/80 transition-all cursor-pointer group relative overflow-hidden"
                  onClick={() => handleSlotClick(2, index)}
                >
                  {slot ? (
                    <div className="h-full p-4 flex flex-col items-center justify-center">
                      <h3 className="text-2xl font-bold text-accent text-center">{slot.name}</h3>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <Icon
                        name="Plus"
                        size={60}
                        className="text-accent/40 group-hover:text-accent/60 transition-colors"
                      />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>

        {allTeamsReady && (
          <div className="text-center mt-8 animate-fade-in">
            <Button
              size="lg"
              onClick={handleStartGame}
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-2xl px-16 py-8 font-bold hover-scale"
            >
              Начать игру
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl bg-card border-2 border-accent">
          <DialogHeader>
            <DialogTitle className="text-4xl text-accent font-bold text-center">
              Выберите персонажа для команды {currentTeam}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {CHARACTERS.map((character) => (
              <Card
                key={character.name}
                className={`p-6 cursor-pointer transition-all hover:scale-105 border-2 ${
                  isCharacterSelected(character)
                    ? 'border-muted bg-muted/20 opacity-50 cursor-not-allowed'
                    : 'border-accent hover:border-accent/80 hover:bg-card/80'
                }`}
                onClick={() => !isCharacterSelected(character) && handleCharacterSelect(character)}
              >
                <h3 className="text-3xl font-bold text-accent text-center">{character.name}</h3>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameSelection;