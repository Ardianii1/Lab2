import React from "react";
import PlayerClient from "./components/client";

const SizePage = () => {
  return (
    <div className="flex-col px-4">
      <div className="flex-1 space-y-4p-8 pt-6">
        <PlayerClient />
      </div>
    </div>
  );
};

export default SizePage;
