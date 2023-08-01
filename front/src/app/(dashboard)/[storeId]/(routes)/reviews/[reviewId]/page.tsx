import { ReviewForm } from "./components/review-form";

const ReviewPage = async () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ReviewForm />
      </div>
    </div>
  );
};

export default ReviewPage;
