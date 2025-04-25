import { Container } from "@/components/ui/container";
import { ProductList } from "@/components/product/product-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <Container>
      <div className="space-y-10 pb-10">
        <div className="p-4 sm:p-6 lg:p-8 rounded-lg overflow-hidden">
          <div className="rounded-lg relative aspect-square md:aspect-[2.4/1] overflow-hidden bg-cover bg-center bg-gradient-to-r from-blue-500 to-blue-700">
            <div className="h-full w-full flex flex-col justify-center items-center text-center gap-y-8">
              <div className="font-bold text-white max-w-xs md:max-w-2xl space-y-4">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl">
                  Welcome to Our Store
                </h1>
                <p className="text-base sm:text-xl">
                  Shop the latest products at the best prices
                </p>
                <div>
                  <Link href="/products">
                    <Button size="lg" className="mt-4">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList title="Featured Products" />
        </div>
      </div>
    </Container>
  );
}
