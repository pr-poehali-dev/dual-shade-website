import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="golden-frame w-full max-w-4xl p-8 md:p-16">
        <div className="bg-card/90 backdrop-blur-sm rounded-lg p-12 border-2 border-accent text-center space-y-10 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-7xl md:text-8xl font-bold text-accent leading-tight">
              Карточная
              <br />
              Дуэль
            </h1>
            <div className="h-1 w-32 bg-accent mx-auto"></div>
          </div>
          
          <p className="text-xl md:text-2xl text-foreground/90 max-w-xl mx-auto leading-relaxed">
            Соберите команду легендарных героев и вступите в эпическую битву за славу и честь
          </p>

          <Button
            size="lg"
            onClick={() => navigate('/game')}
            className="bg-accent text-accent-foreground hover:bg-accent/90 text-2xl px-12 py-8 font-bold hover-scale"
          >
            Начать новую игру
          </Button>

          <div className="grid grid-cols-3 gap-6 mt-12 text-center">
            <div className="space-y-2">
              <div className="text-4xl">⚔️</div>
              <p className="text-foreground/70">Сила</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl">⚡</div>
              <p className="text-foreground/70">Ловкость</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl">🧠</div>
              <p className="text-foreground/70">Интеллект</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;