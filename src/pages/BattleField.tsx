import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Character {
  name: string;
  health: number;
  normalAttack: number;
  powerAttack: number;
  superAttack: number;
}

interface Attack {
  name: string;
  damage: number;
  icon: string;
}

const BattleField = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { team1: initialTeam1, team2: initialTeam2 } = location.state || {};

  const [team1, setTeam1] = useState<Character[]>(initialTeam1 || []);
  const [team2, setTeam2] = useState<Character[]>(initialTeam2 || []);
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(1);
  const [selectedAttacker, setSelectedAttacker] = useState<number | null>(null);
  const [selectedAttack, setSelectedAttack] = useState<Attack | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [showAttackSelection, setShowAttackSelection] = useState(false);
  const [selectedCard, setSelectedCard] = useState<{ team: 1 | 2; index: number } | null>(null);

  useEffect(() => {
    if (!initialTeam1 || !initialTeam2) {
      navigate('/game');
      return;
    }
  }, [initialTeam1, initialTeam2, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCurrentTurn(currentTurn === 1 ? 2 : 1);
          setSelectedAttacker(null);
          setSelectedAttack(null);
          setShowAttackSelection(false);
          setSelectedCard(null);
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTurn]);

  const getAttacksForChar = (char: Character): Attack[] => [
    { name: 'Обычная атака', damage: char.normalAttack, icon: 'Sword' },
    { name: 'Атака силами', damage: char.powerAttack, icon: 'Zap' },
    { name: 'Супер атака', damage: char.superAttack, icon: 'Flame' },
  ];

  const handleAttackerSelect = (index: number) => {
    const currentTeam = currentTurn === 1 ? team1 : team2;
    if (currentTeam[index].health > 0) {
      setSelectedAttacker(index);
      setShowAttackSelection(true);
      setSelectedCard(null);
    }
  };

  const handleAttackSelect = (attack: Attack) => {
    setSelectedAttack(attack);
    setShowAttackSelection(false);
  };

  const handleTargetSelect = (targetIndex: number) => {
    if (!selectedAttack || selectedAttacker === null) return;

    const targetTeam = currentTurn === 1 ? team2 : team1;
    const setTargetTeam = currentTurn === 1 ? setTeam2 : setTeam1;

    if (targetTeam[targetIndex].health <= 0) return;

    const newTeam = [...targetTeam];
    newTeam[targetIndex] = {
      ...newTeam[targetIndex],
      health: Math.max(0, newTeam[targetIndex].health - selectedAttack.damage),
    };

    setTargetTeam(newTeam);

    if (newTeam[targetIndex].health <= 0) {
      if (currentTurn === 1) {
        setTeam1Score(prev => prev + 1);
      } else {
        setTeam2Score(prev => prev + 1);
      }
    }

    setTimeout(() => {
      setCurrentTurn(currentTurn === 1 ? 2 : 1);
      setSelectedAttacker(null);
      setSelectedAttack(null);
      setShowAttackSelection(false);
      setSelectedCard(null);
      setTimeLeft(120);
    }, 500);
  };

  const handleCardClick = (team: 1 | 2, index: number) => {
    const char = team === 1 ? team1[index] : team2[index];
    if (char.health <= 0) return;

    if (currentTurn === team && !selectedAttack) {
      if (selectedCard?.team === team && selectedCard?.index === index) {
        setSelectedCard(null);
      } else {
        setSelectedCard({ team, index });
      }
    } else if (currentTurn !== team && selectedAttack) {
      handleTargetSelect(index);
    }
  };

  const handleHealFromCard = (team: 1 | 2, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const setTeam = team === 1 ? setTeam1 : setTeam2;
    const currentTeam = team === 1 ? team1 : team2;
    const newTeam = [...currentTeam];
    newTeam[index] = { ...newTeam[index], health: newTeam[index].health + 1 };
    setTeam(newTeam);
    setSelectedCard(null);
  };

  const handleAttackFromCard = (team: 1 | 2, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCard(null);
    handleAttackerSelect(index);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!team1.length || !team2.length) return null;

  const renderCard = (char: Character, index: number, team: 1 | 2) => {
    const isCurrentTeam = currentTurn === team;
    const isSelected = selectedCard?.team === team && selectedCard?.index === index;
    const isTargetable = !isCurrentTeam && selectedAttack && char.health > 0;
    const isOwnTurn = isCurrentTeam && !selectedAttack;

    return (
      <div key={index} className="relative">
        <Card
          className={`aspect-[3/4] p-3 cursor-pointer transition-all border-2 relative ${
            char.health <= 0
              ? 'opacity-30 cursor-not-allowed border-muted'
              : isSelected
              ? 'border-accent bg-accent/20 ring-4 ring-accent'
              : isTargetable
              ? 'border-destructive hover:border-destructive/80 hover:bg-destructive/10'
              : isOwnTurn
              ? 'border-accent hover:border-accent/80'
              : 'border-muted'
          }`}
          onClick={() => handleCardClick(team, index)}
        >
          <div className="h-full flex flex-col items-center justify-between">
            <h4 className="text-lg font-bold text-accent text-center leading-tight">{char.name}</h4>
            <div className="w-full">
              <div className="text-xs text-foreground/70 text-center mb-1">HP</div>
              <div className="w-full bg-card rounded-full h-2 overflow-hidden border border-accent">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${(char.health / (char.health + 10)) * 100 + (char.health > 0 ? 10 : 0)}%` }}
                />
              </div>
              <div className="text-center text-accent font-bold mt-1 text-lg">{char.health}</div>
            </div>
          </div>
        </Card>

        {/* Popup menu on card click */}
        {isSelected && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-40 flex flex-col gap-1 min-w-[140px]">
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/80 text-xs font-bold"
              onClick={(e) => handleAttackFromCard(team, index, e)}
            >
              <Icon name="Sword" size={14} className="mr-1" />
              Атаковать
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-500/10 text-xs font-bold"
              onClick={(e) => handleHealFromCard(team, index, e)}
            >
              <Icon name="Heart" size={14} className="mr-1" />
              Восстановить 1 хп
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background p-4">
      {/* Score */}
      <div className="flex justify-center items-center gap-8 mb-4">
        <div className="text-4xl font-bold text-accent">
          {team1Score} : {team2Score}
        </div>
      </div>

      {/* Timer */}
      <div className="flex justify-center mb-4">
        <div className={`text-3xl font-bold px-8 py-4 rounded-lg border-4 ${
          timeLeft <= 30 ? 'border-destructive text-destructive animate-pulse' : 'border-accent text-accent'
        }`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Current Turn */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-accent">
          Ход команды {currentTurn}
        </h2>
      </div>

      {/* Battle Field */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team 1 */}
          <div className="golden-frame p-6">
            <h3 className="text-2xl text-center text-accent mb-4 font-bold">Команда 1</h3>
            <div className="grid grid-cols-3 gap-4">
              {team1.map((char, index) => renderCard(char, index, 1))}
            </div>
          </div>

          {/* Team 2 */}
          <div className="golden-frame p-6">
            <h3 className="text-2xl text-center text-accent mb-4 font-bold">Команда 2</h3>
            <div className="grid grid-cols-3 gap-4">
              {team2.map((char, index) => renderCard(char, index, 2))}
            </div>
          </div>
        </div>

        {/* Attack Selection */}
        {showAttackSelection && selectedAttacker !== null && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="golden-frame max-w-2xl w-full mx-4">
              <h3 className="text-3xl text-center text-accent mb-6 font-bold">
                Выберите атаку
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {getAttacksForChar(
                  currentTurn === 1 ? team1[selectedAttacker] : team2[selectedAttacker]
                ).map((attack) => (
                  <Button
                    key={attack.name}
                    onClick={() => handleAttackSelect(attack)}
                    className="h-32 flex flex-col gap-2 bg-card hover:bg-accent/20 border-2 border-accent text-accent hover:text-accent"
                    variant="outline"
                  >
                    <Icon name={attack.icon} size={40} />
                    <div className="text-lg font-bold">{attack.name}</div>
                    <div className="text-sm">Урон: {attack.damage}</div>
                  </Button>
                ))}
              </div>
              <div className="text-center mt-4">
                <Button
                  variant="ghost"
                  className="text-foreground/60"
                  onClick={() => {
                    setShowAttackSelection(false);
                    setSelectedAttacker(null);
                  }}
                >
                  Отмена
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {selectedAttack && (
          <div className="text-center mt-6 animate-fade-in">
            <p className="text-2xl text-accent font-bold">
              Выберите цель в команде противника
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleField;