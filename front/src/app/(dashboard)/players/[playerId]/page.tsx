import { PlayerForm } from "./components/player-form";

const PlayerPage = async () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PlayerForm />
      </div>
    </div>
  );
};

export default PlayerPage;
