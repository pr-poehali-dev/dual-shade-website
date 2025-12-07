import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Character {
  name: string;
  health: number;
}

interface Attack {
  name: string;
  damage: number;
  icon: string;
}

const ATTACKS: Attack[] = [
  { name: 'Удар мечом', damage: 30, icon: 'Sword' },
  { name: 'Огненный шар', damage: 25, icon: 'Flame' },
  { name: 'Ледяная стрела', damage: 20, icon: 'Snowflake' },
];

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
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTurn]);

  const handleAttackerSelect = (index: number) => {
    const currentTeam = currentTurn === 1 ? team1 : team2;
    if (currentTeam[index].health > 0) {
      setSelectedAttacker(index);
      setShowAttackSelection(true);
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
      setTimeLeft(120);
    }, 500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!team1.length || !team2.length) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background p-4">
      {/* Score and Timer */}
      <div className="flex justify-center items-center gap-8 mb-6">
        <div className="text-4xl font-bold text-accent">
          {team1Score} : {team2Score}
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <div className={`text-3xl font-bold px-8 py-4 rounded-lg border-4 ${
          timeLeft <= 30 ? 'border-destructive text-destructive animate-pulse' : 'border-accent text-accent'
        }`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Current Turn Indicator */}
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
              {team1.map((char, index) => (
                <Card
                  key={index}
                  className={`aspect-[3/4] p-4 cursor-pointer transition-all border-2 relative ${
                    char.health <= 0
                      ? 'opacity-30 cursor-not-allowed border-muted'
                      : currentTurn === 1
                      ? selectedAttacker === index
                        ? 'border-accent bg-accent/20 ring-4 ring-accent'
                        : 'border-accent hover:border-accent/80'
                      : selectedAttack
                      ? 'border-destructive hover:border-destructive/80 hover:bg-destructive/10'
                      : 'border-muted'
                  }`}
                  onClick={() => {
                    if (currentTurn === 1 && !selectedAttack) {
                      handleAttackerSelect(index);
                    } else if (currentTurn === 2 && selectedAttack) {
                      handleTargetSelect(index);
                    }
                  }}
                >
                  <div className="h-full flex flex-col items-center justify-between">
                    <h4 className="text-xl font-bold text-accent text-center">{char.name}</h4>
                    <div className="w-full">
                      <div className="text-sm text-foreground/70 text-center mb-1">HP</div>
                      <div className="w-full bg-card rounded-full h-3 overflow-hidden border border-accent">
                        <div
                          className="h-full bg-accent transition-all duration-300"
                          style={{ width: `${char.health}%` }}
                        />
                      </div>
                      <div className="text-center text-accent font-bold mt-1">{char.health}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Team 2 */}
          <div className="golden-frame p-6">
            <h3 className="text-2xl text-center text-accent mb-4 font-bold">Команда 2</h3>
            <div className="grid grid-cols-3 gap-4">
              {team2.map((char, index) => (
                <Card
                  key={index}
                  className={`aspect-[3/4] p-4 cursor-pointer transition-all border-2 relative ${
                    char.health <= 0
                      ? 'opacity-30 cursor-not-allowed border-muted'
                      : currentTurn === 2
                      ? selectedAttacker === index
                        ? 'border-accent bg-accent/20 ring-4 ring-accent'
                        : 'border-accent hover:border-accent/80'
                      : selectedAttack
                      ? 'border-destructive hover:border-destructive/80 hover:bg-destructive/10'
                      : 'border-muted'
                  }`}
                  onClick={() => {
                    if (currentTurn === 2 && !selectedAttack) {
                      handleAttackerSelect(index);
                    } else if (currentTurn === 1 && selectedAttack) {
                      handleTargetSelect(index);
                    }
                  }}
                >
                  <div className="h-full flex flex-col items-center justify-between">
                    <h4 className="text-xl font-bold text-accent text-center">{char.name}</h4>
                    <div className="w-full">
                      <div className="text-sm text-foreground/70 text-center mb-1">HP</div>
                      <div className="w-full bg-card rounded-full h-3 overflow-hidden border border-accent">
                        <div
                          className="h-full bg-accent transition-all duration-300"
                          style={{ width: `${char.health}%` }}
                        />
                      </div>
                      <div className="text-center text-accent font-bold mt-1">{char.health}</div>
                    </div>
                  </div>
                </Card>
              ))}
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
                {ATTACKS.map((attack) => (
                  <Button
                    key={attack.name}
                    onClick={() => handleAttackSelect(attack)}
                    className="h-32 flex flex-col gap-2 bg-card hover:bg-accent/20 border-2 border-accent text-accent hover:text-accent"
                    variant="outline"
                  >
                    <Icon name={attack.icon as any} size={40} />
                    <div className="text-lg font-bold">{attack.name}</div>
                    <div className="text-sm">Урон: {attack.damage}</div>
                  </Button>
                ))}
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