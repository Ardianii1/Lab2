import React from "react";
import ReviewClient from "./components/client";
export const metadata = {
  title: "Reviews",
  description: "Reviews for the store",
};
const SizePage = () => {
  return (
    <div className="flex-col px-4">
      <div className="flex-1 space-y-4p-8 pt-6">
        <ReviewClient />
      </div>
    </div>
  );
};

export default SizePage;