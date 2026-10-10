"use client";

import { usePathname, useRouter } from "next/navigation";

export type Product = "studio" | "library";

export function useProduct() {
  const pathname = usePathname();
  const router = useRouter();

  const isLibrary = pathname?.startsWith("/dashboard/library");
  const currentProduct: Product = isLibrary ? "library" : "studio";

  const setProduct = (product: Product) => {
    if (product === "library") {
      router.push("/dashboard/library");
    } else {
      router.push("/dashboard/studio");
    }
  };

  return {
    currentProduct,
    setProduct,
    isStudio: !isLibrary,
    isLibrary,
  };
}
