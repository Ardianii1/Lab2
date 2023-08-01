import { BrandForm } from "./components/brand-form";

const BrandPage = async () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BrandForm />
      </div>
    </div>
  );
};

export default BrandPage;
