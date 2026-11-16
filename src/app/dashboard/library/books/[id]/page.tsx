// import React from "react";
// import { EditorialReviewView } from "@/components/library/EditorialReviewView";

// interface BookDetailsPageProps {
//   params: {
//     id: string;
//   };
// }

// export default function BookDetailsPage({ params }: BookDetailsPageProps) {
//   return <EditorialReviewView bookId={params.id} />;
// }

import React from "react";
import { getEditorialReviewById } from "@/features/library/mock-data";
import { EditorialReviewView } from "@/components/library/EditorialReviewView";

interface BookDetailsPageProps {
  params: {
    id: string;
  };
}

export default function BookDetailsPage({ params }: BookDetailsPageProps) {
  const review = getEditorialReviewById(params.id);

  return <EditorialReviewView initialReview={review} />;
}

