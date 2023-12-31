import { TeamForm } from "./components/team-form";

const TeamPage = async () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TeamForm />
      </div>
    </div>
  );
};

export default TeamPage;
