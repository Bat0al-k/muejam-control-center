// import React from "react";
// import { EditorialReviewView } from "@/components/library/EditorialReviewView";

// interface ReviewDetailsPageProps {
//   params: {
//     id: string;
//   };
// }

// export default function ReviewDetailsPage({ params }: ReviewDetailsPageProps) {
//   return <EditorialReviewView bookId={params.id} />;
// }

import React from "react";
import { getEditorialReviewById } from "@/features/library/mock-data";
import { EditorialReviewView } from "@/components/library/EditorialReviewView";

interface ReviewDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ReviewDetailsPage({ params }: ReviewDetailsPageProps) {
  const review = getEditorialReviewById(params.id);

  return <EditorialReviewView initialReview={review} />;
}

